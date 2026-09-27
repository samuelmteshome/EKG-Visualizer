export const patterns={
sinus:{name:'Normal sinus rhythm',rate:75,pr:.16,qrs:.09,title:'The normal sequence',text:'An impulse begins in the SA node, spreads across both atria, pauses at the AV node, and travels through the His–Purkinje network. Coordinated ventricular activation creates a narrow QRS; recovery creates the T wave.'},
brady:{name:'Sinus bradycardia',rate:45,pr:.16,qrs:.09,title:'Same pathway, more time between beats',text:'The sinus node fires slowly. Each P wave is followed by a normal narrow QRS. This example can be physiologic, such as during sleep or in trained athletes; context determines its significance.'},
tachy:{name:'Sinus tachycardia',rate:120,pr:.14,qrs:.08,title:'The sinus node speeds up',text:'The normal sequence is preserved, but the interval between beats shortens. P waves precede each QRS. Sinus tachycardia can be a physiologic response to exercise or a response to illness.'},
af:{name:'Atrial fibrillation',rate:110,pr:null,qrs:.09,title:'Disorganized atria, irregular ventricular response',text:'Rapid, disorganized atrial activity replaces discrete P waves. Variable conduction through the AV node creates an irregularly irregular ventricular rhythm. Watch the atria remain electrically active between QRS complexes.'},
flutter:{name:'Atrial flutter · 2:1 conduction',rate:150,pr:null,qrs:.09,title:'A repeating atrial circuit',text:'A schematic right-atrial circuit repeats at 300 per minute. Every second atrial cycle conducts to the ventricles, producing a regular rate of 150 bpm. Flutter waves are most apparent in the inferior leads; some overlap the QRS and T wave.'},
pvc:{name:'Premature ventricular complexes',rate:75,pr:.16,qrs:.09,title:'An early beat starts in a ventricle',text:'Every fourth ventricular beat arises early from a schematic ventricular focus, bypassing the normal rapid activation sequence. Its QRS is wide with an oppositely directed T wave, followed by a compensatory pause. Sinus P waves continue independently and may be hidden.'},
vt:{name:'Monomorphic ventricular tachycardia',rate:165,pr:null,qrs:.17,title:'The ventricles drive a rapid rhythm',text:'A repeating ventricular source produces rapid, broad QRS complexes. The modeled atria continue at an independent sinus rate (AV dissociation). This is one VT example; a wide-complex tachycardia is not diagnosed from shape alone.'},
vf:{name:'Ventricular fibrillation',rate:null,pr:null,qrs:null,title:'No coordinated ventricular activation',text:'Disorganized ventricular activity produces a continuously changing waveform with no discrete QRS complexes or coordinated ventricular beats. The scattered electrical activity shown is schematic.'},
av1:{name:'First-degree AV block',rate:65,pr:.28,qrs:.09,title:'Conduction is delayed, not dropped',text:'Every atrial impulse reaches the ventricles, but the PR interval is prolonged to 280 ms in this example. Pause in the PR segment to see the longer delay before the ventricular conduction network activates.'},
rbbb:{name:'Right bundle-branch block',rate:70,pr:.16,qrs:.15,title:'The right ventricle activates late',text:'Left ventricular activation proceeds first. The right ventricle activates later through slower myocardial conduction. Look for a terminal R′ in V1–V2 and a broad terminal S in I and V6. QRS duration is 150 ms in this example.'},
lbbb:{name:'Left bundle-branch block',rate:70,pr:.16,qrs:.16,title:'The left ventricle activates late',text:'Activation reaches the right ventricle first and then spreads slowly toward the left ventricle. This example has a broad negative complex in V1 and a broad, notched positive complex in I, V5 and V6, with discordant ST–T changes.'},
inferior:{name:'Inferior ST-elevation pattern',rate:75,pr:.16,qrs:.09,title:'Inferior leads see a regional ST shift',text:'An illustrative inferior injury-current source shifts the ST segment. II, III and aVF show ST elevation with reciprocal depression in I and aVL. ST shifts reflect abnormal voltage gradients, not an extra wave of normal depolarization; diagnosis requires clinical context.'},
anterior:{name:'Anterior ST-elevation pattern',rate:80,pr:.16,qrs:.09,title:'Anterior chest leads see a regional ST shift',text:'An illustrative anterior injury-current source produces ST elevation in V2–V4. Chest leads view the heart from different positions across the thorax. This example illustrates localization, not every feature or stage of myocardial infarction.'},
hyperk:{name:'Hyperkalemia · peaked T waves',rate:70,pr:.16,qrs:.09,title:'Repolarization changes the T wave',text:'This example isolates tall, narrow, peaked T waves associated with hyperkalemia. More severe disturbances can alter P waves, PR and QRS intervals; those later stages are not simulated here. T-wave shape alone does not establish a potassium level.'}
};
export const leads=[
{name:'I',angle:0,region:'Lateral',desc:'LA − RA. Positive axis points toward the left arm (0°). Often useful for the lateral left ventricular wall.'},
{name:'II',angle:60,region:'Inferior',desc:'LL − RA. Positive axis points toward the left leg (+60°). Usually aligns well with normal atrial and ventricular activation.'},
{name:'III',angle:120,region:'Inferior',desc:'LL − LA. Positive axis is +120°. Views inferior electrical forces.'},
{name:'aVR',angle:-150,region:'Rightward',desc:'RA − (LA + LL)/2. Positive axis is −150°. Normal dominant forces travel away, usually giving negative P, QRS and T deflections.'},
{name:'aVL',angle:-30,region:'High lateral',desc:'LA − (RA + LL)/2. Positive axis is −30°. Views high lateral electrical forces.'},
{name:'aVF',angle:90,region:'Inferior',desc:'LL − (RA + LA)/2. Positive axis is +90°. Views the inferior surface.'},
{name:'V1',chest:0,region:'Right / septal',pos:[-1.12,.10,1.85],desc:'4th intercostal space, right sternal border. Compared with Wilson central terminal. Normally shows a small r and a deeper S; prominent terminal R′ is illustrated in RBBB.'},
{name:'V2',chest:1,region:'Septal / anterior',pos:[-.55,.10,2.02],desc:'4th intercostal space, left sternal border. Compared with Wilson central terminal. Views anterior and septal electrical forces.'},
{name:'V3',chest:2,region:'Anterior',pos:[.10,-.25,2.08],desc:'Midway between V2 and V4. Compared with Wilson central terminal. Often near the transition from predominantly negative to positive QRS complexes.'},
{name:'V4',chest:3,region:'Anterior / apical',pos:[.78,-.70,1.85],desc:'5th intercostal space, left midclavicular line. Compared with Wilson central terminal. Views anterior and apical electrical forces.'},
{name:'V5',chest:4,region:'Lateral',pos:[1.52,-.70,1.15],desc:'Left anterior axillary line, horizontally level with V4. Compared with Wilson central terminal. Views lateral electrical forces.'},
{name:'V6',chest:5,region:'Lateral',pos:[1.94,-.70,.28],desc:'Left midaxillary line, horizontally level with V4. Compared with Wilson central terminal. Views lateral electrical forces.'}
];
export let state={key:'sinus',lead:1,time:0,playing:!matchMedia('(prefers-reduced-motion: reduce)').matches,speed:.25};
export let beats=[],atria=[];
export function configure(key){if(!patterns[key])throw Error('Unknown rhythm');state.key=key;state.time=0;const p=patterns[key],rr=60/(p.rate||75);beats=[];atria=[];if(key==='vf')return;
if(key==='af'){let t=-2;for(let n=0;t<9;n++){t+=rr*(.62+(.5+.5*Math.sin(n*4.37))*.78);beats.push({q:t,d:p.qrs,pvc:false});}}
else if(key==='pvc'){for(let i=-4;i<14;i++){let q=i*rr+.24;if(((i%4)+4)%4===3)q-=.32;beats.push({q,d:((i%4)+4)%4===3?.17:p.qrs,pvc:((i%4)+4)%4===3});}}
else for(let t=-2*rr+.08+p.pr||0;t<9;t+=rr){if(!Number.isFinite(t))break;beats.push({q:t,d:p.qrs,pvc:false});}
// Rhythms without a measurable PR use their own ventricular clock.
if(['flutter','vt'].includes(key)){beats=[];for(let t=-2*rr+.24;t<9;t+=rr)beats.push({q:t,d:p.qrs,pvc:false});}
if(!['af','flutter'].includes(key)){const ar=key==='vt'?.8:rr;for(let t=-2*ar+.08;t<9;t+=ar)atria.push(t);}
}
const bump=(t,c,w)=>Math.abs((t-c)/w)<1?(1+Math.cos(Math.PI*(t-c)/w))/2:0;
export function currentBeat(t){let b=beats[0];for(const x of beats)if(x.q<=t)b=x;return b;}
export function components(t){const key=state.key,p=patterns[key];let a=0,q=0,r=0,s=0,T=0,st=0,late=0;for(const start of atria)a+=.16*bump(t,start+.045,.045);if(key==='af')a=.018*(Math.sin(t*94)+.7*Math.sin(t*137)+.4*Math.sin(t*61));if(key==='flutter'){let u=((t% .2)+.2)% .2;a=.15*(u/.2-.5);}
if(key==='vf')return {a:0,x:.45*Math.sin(t*37)+.19*Math.sin(t*71),y:.38*Math.sin(t*31)+.21*Math.sin(t*57),z:.35*Math.sin(t*43)+.2*Math.sin(t*83),r:0,q:0,s:0,T:0,st:0,late:0};
for(const b of beats){if(t<b.q-.02||t>b.q+.65)continue;const u=(t-b.q)/b.d;let vq=bump(u,.14,.14),vr=bump(u,.46,.30),vs=bump(u,.83,.17),recovery=key==='tachy'||key==='flutter'||key==='vt'?.12:.20;
if(b.pvc||key==='vt'){q+=-.12*vq;r+=-1.1*vr;s+=.35*vs;T+=.30*bump(t,b.q+b.d+recovery,.085);}
else {q+=-.1*vq;r+=1.05*vr;s+=-.28*vs;T+=(key==='hyperk'?.8:.28)*bump(t,b.q+b.d+recovery,key==='hyperk'?.055:.09);}
if(key==='rbbb')late+=.8*bump(u,.81,.19);if(key==='lbbb'){r-=.15*bump(u,.53,.055);}
const stStart=b.q+b.d,stEnd=b.q+b.d+recovery;st+=t>=stStart&&t<=stEnd?Math.min(1,(t-stStart)/.012,(stEnd-t)/.06):0;
}
let x=.45*a+.7*r+q+.3*s,y=.8*a+.9*r+.3*q+s,z=.3*a-.50*r-.9*q+.6*s;
x+=.55*T;y+=.8*T;z+=.3*T;
if(key==='rbbb'){x-=late*.8;y+=late*.15;z+=late;}
if(key==='lbbb'){x+=.22*r-1.1*T;y-=.15*r+.8*T;z-=.45*r+.5*T;}
if(key==='inferior'){x-=.12*st;y+=.42*st;}
return {a,x,y,z,r,q,s,T,st,late};}
export function voltage(t,index){const c=components(t),l=leads[index];if(l.chest===undefined){const k=index>=3?Math.sqrt(3)/2:1,angle=l.angle*Math.PI/180;return k*(c.x*Math.cos(angle)+c.y*Math.sin(angle));}
const j=l.chest,key=state.key;
if(key==='vf')return c.x*Math.sin(j*.3)+c.z*Math.cos(j*.3);
let out=c.a*(j===0?.25:.65)+c.r*[-.65,-.4,.1,.72,1,.88][j]+c.q*[-1,-.8,-.5,.2,.65,.7][j]+c.s*[1.1,1.4,1.5,1,.4,.2][j]+c.T*[.1,.7,1.2,1.3,1.05,.85][j];
if(key==='rbbb')out+=c.late*[1.45,1.25,.4,0,-.5,-.7][j]-c.T*[.9,.8,.2,0,0,0][j];
if(key==='lbbb')out=c.a*.6+c.r*[-1.1,-1,-.5,.8,1.1,1][j]+c.T*[1.4,1.5,1,-1.2,-1.1,-1][j]+c.s*.2;
if(key==='anterior')out+=c.st*[.1,.35,.45,.35,.08,0][j];
return out;}
export function phase(t){const key=state.key;if(key==='vf')return {id:'VF',title:'Disorganized ventricular activity',text:'Multiple changing wavefronts; no organized P–QRS–T sequence.'};let b=currentBeat(t),dt=b?t-b.q:10;let a=atria.find(s=>t>=s&&t<s+.09);
if(dt>=0&&dt<b.d)return {id:'QRS',title:b.pvc?'Premature ventricular activation':key==='rbbb'?'Delayed right ventricular activation':key==='lbbb'?'Delayed left ventricular activation':'Ventricular depolarization',text:b.pvc||key==='vt'?'Activation spreads from a ventricular source through myocardium, producing a broad complex.':'The ventricular activation wave creates the QRS. Different leads record different projections of the same event.'};
const recovery=['tachy','flutter','vt'].includes(key)?.12:.20;
if(b&&dt>=b.d&&dt<b.d+recovery-.09)return{id:'ST',title:'Ventricles are largely depolarized',text:['inferior','anterior'].includes(key)?'Abnormal regional voltage gradients displace the ST segment in the corresponding leads.':'Little net voltage difference normally remains while much of the ventricle is activated: the ST segment is near baseline.'};
if(b&&dt>=b.d+recovery-.09&&dt<b.d+recovery+.09)return{id:'T',title:'Ventricular repolarization',text:'Recovery across ventricular tissue creates the T wave. Repolarization has opposite electrical polarity to depolarization.'};
if(key==='af')return{id:'f',title:'Continuous disorganized atrial activity',text:'There is no single organized atrial wavefront or discrete P wave. The next ventricular activation arrives irregularly.'};if(key==='flutter')return{id:'F',title:'Atrial flutter circuit',text:'A right-atrial circuit repeats every 200 ms. Two atrial cycles occur for each ventricular cycle.'};
if(a!==undefined)return{id:'P',title:'Atrial depolarization',text:'Activation spreads from the SA node in the right atrium to both atria. The summed atrial signal creates the P wave.'};
let next=beats.find(x=>x.q>t);if(next&&t>next.q-(patterns[key].pr||0)+.09&&key!=='vt')return{id:'PR',title:'AV conduction delay',text:'Atrial activation has ended. Conduction is delayed at the AV node before rapidly entering the His–Purkinje system.'};return{id:'TP',title:'Electrical resting interval',text:key==='vt'?'Atrial activity is independent of the ventricular rhythm in this example.':'Most tissue has recovered. The next sinus impulse will begin a new cycle.'};}
configure('sinus');
