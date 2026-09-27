import {state,patterns,beats,atria,currentBeat} from './model.js';
// One connected event tree. Times are schematic, referenced to the ECG QRS onset.
export const junctions={
sa:[292,190],aj:[315,238],av:[380,300],his:[399,330],fork:[417,352],lp:[431,365],rp:[408,370],sept:[399,380],lm:[455,410],rm:[414,417],la:[481,490],ra:[424,475],lu:[552,348],ll:[548,444],ru:[294,340],rl:[330,435],latrium:[488,214],ratrium:[276,284],lv1:[565,310],lv2:[580,375],lv3:[572,439],lv4:[510,520],rv1:[267,323],rv2:[285,382],rv3:[313,459],rv4:[385,491]
};
export const transverse={sa:[235,85],aj:[295,85],av:[355,85],his:[420,85],fork:[424,286],lp:[440,300],rp:[411,305],sept:[390,320],lm:[462,349],rm:[360,350],la:[483,412],ra:[336,405],lu:[518,286],ll:[543,382],ru:[297,297],rl:[280,365],latrium:[297,117],ratrium:[267,116],lv1:[513,257],lv2:[561,289],lv3:[581,394],lv4:[476,449],rv1:[267,270],rv2:[245,323],rv3:[249,385],rv4:[315,440]};
const edge=(id,from,to,parent,start,end,kind='conduction',side=0)=>({id,from,to,parent,start,end,kind,side});
export const network=[
edge('atrial-trunk','sa','aj',null,0,.024,'atrial'),edge('av-approach','aj','av','atrial-trunk',.024,.075,'atrial'),edge('left-atrium','aj','latrium','atrial-trunk',.024,.09,'atrial'),edge('right-atrium','aj','ratrium','atrial-trunk',.024,.09,'atrial'),
edge('his','av','his','av-approach',-.025,-.012),edge('his-fork','his','fork','his',-.012,-.004),edge('left-proximal','fork','lp','his-fork',-.004,0,'conduction',1),edge('right-proximal','fork','rp','his-fork',-.004,.004,'conduction',-1),
edge('septal','lp','sept','left-proximal',0,.014,'tissue',1),edge('left-bundle','lp','lm','left-proximal',0,.018,'conduction',1),edge('right-bundle','rp','rm','right-proximal',.004,.019,'conduction',-1),
edge('left-apex','lm','la','left-bundle',.018,.032,'conduction',1),edge('right-apex','rm','ra','right-bundle',.019,.036,'conduction',-1),
edge('left-upper','lm','lu','left-bundle',.018,.053,'purkinje',1),edge('left-lower','la','ll','left-apex',.032,.063,'purkinje',1),edge('right-upper','rm','ru','right-bundle',.019,.052,'purkinje',-1),edge('right-lower','ra','rl','right-apex',.036,.065,'purkinje',-1),
...['lv1','lv2'].map((n,i)=>edge(n,'lu',n,'left-upper',.053,.080+i*.010,'tissue',1)),...['lv3','lv4'].map((n,i)=>edge(n,'ll',n,'left-lower',.063,.085+i*.005,'tissue',1)),...['rv1','rv2'].map((n,i)=>edge(n,'ru',n,'right-upper',.052,.078+i*.010,'tissue',-1)),...['rv3','rv4'].map((n,i)=>edge(n,'rl',n,'right-lower',.065,.085+i*.005,'tissue',-1))
];
export function conductionFrame(t){const key=state.key,p=patterns[key],prior=currentBeat(t);let at=-10;for(const a of atria)if(a<=t)at=a;
// Include the pre-QRS His transit of the imminent conducted beat.
let beat=prior;for(const candidate of beats){if(candidate.q-(p.pr||.16)<=t)beat=candidate;else break;}
const q=beat?.q??0,d=beat?.d??.09,ectopic=!!beat?.pvc||key==='vt',vf=key==='vf',af=key==='af',flutter=key==='flutter';
const atrialStart=at;
const blocked=key==='rbbb'?-1:key==='lbbb'?1:0;
const recoveryCenter=q+d+(['tachy','flutter','vt'].includes(key)?.12:.20),rw=key==='hyperk'?.055:.09;
let samples=network.map((edge,index)=>{
let start=edge.kind==='atrial'?atrialStart+edge.start:q+edge.start*(p.qrs&&p.qrs<.09?p.qrs/.09:1),end=edge.kind==='atrial'?atrialStart+edge.end:q+edge.end*(p.qrs&&p.qrs<.09?p.qrs/.09:1);
let enabled=!vf&&!(edge.kind==='atrial'&&(af||flutter));
if(edge.kind!=='atrial'&&ectopic)enabled=false;
if(blocked&&edge.side===blocked&&!edge.id.endsWith('-proximal'))enabled=false;
const progress=(t-start)/(end-start),moving=enabled&&progress>=0&&progress<=1;
const isMuscle=edge.kind==='tissue';const recover=isMuscle&&!vf&&Math.abs(t-recoveryCenter)<=rw? .45+.55*Math.exp(-Math.pow((t-recoveryCenter+(index%4-1.5)*rw*.25)/(rw*.45),2)):0;
let chaos=0;if((vf&&edge.kind!=='atrial')||(af&&edge.kind==='atrial'))chaos=Math.pow(.5+.5*Math.sin(t*48+index*2.7),6);
return{...edge,start,end,progress,moving,enabled,recover,chaos,activated:enabled&&t>end&&t<recoveryCenter-rw};
});
let avHold=!ectopic&&!af&&!flutter&&!vf&&t>=atrialStart+.075&&t<q-.025;
let saActive=!af&&!flutter&&!vf&&t>=at&&t<at+.024;
let stage=vf?'Disorganized ventricular activity':af&&t<q-.025?'Disorganized atrial activity':flutter&&t<q-.025?'Atrial flutter circuit':avHold?'AV node · conduction delay':samples.find(s=>s.moving)?.id|| (Math.abs(t-recoveryCenter)<=rw?'Ventricular recovery':'Resting interval');
return{samples,beat,q,d,ectopic,blocked,vf,af,flutter,atrialStart,saActive,avHold,stage,recoveryCenter,rw};
}
