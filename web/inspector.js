import {appearance} from './settings.js';
import {state,patterns,leads,beats,phase,voltage,currentBeat} from './model.js';
export const signalColor=t=>phase(t).id==='T'?'#c38aff':'#ffe363';
export function explainSignal(t,index){
const lead=leads[index],p=phase(t),b=currentBeat(t),u=b?(t-b.q)/b.d:0,v=voltage(t,index),key=state.key;
let source=p.title,detail='';
if(p.id==='QRS'){
if(b?.pvc||key==='vt'){source='Ventricular source → broad QRS';detail='An ectopic ventricular source spreads activation slowly through myocardium.';}
else if(key==='rbbb'&&u>.55){source='Late right ventricular activation';detail='The right ventricle activates late. V1–V2 accentuate the terminal positive force; lateral leads can show a terminal S trough.';}
else if(key==='lbbb'){source='Delayed left ventricular activation';detail='Slow activation toward the left ventricle broadens the complex; the lateral and right chest leads view this from different directions.';}
else if(u<.26){source='Early QRS · septal activation';detail='Early septal activation is left-to-right. It can create a small positive r in V1 and a small negative q in lateral leads.';}
else if(u<.73){source='Main QRS · ventricular muscle';detail='The larger left ventricular muscle mass usually dominates the net field. Leads looking along that field show a peak; opposite views show a trough.';}
else{source='Late QRS · terminal activation';detail='The last ventricular regions activate. The net field changes direction as the remaining unactivated tissue becomes smaller.';}
}else if(p.id==='T'){source='T wave · ventricular recovery';detail='Purple myocardial branches show tissue repolarization; no new impulse runs backward through the conducting paths. Repolarization reverses electrical polarity: a recovering wave moving away from a positive electrode can create an upward T wave.';}
else if(p.id==='P'){source='P wave · atrial muscle';detail='The yellow signal spreads through the atria from the SA node. The combined atrial field is viewed differently by each lead.';}
else if(p.id==='ST'){source='ST segment · activated ventricles';detail=['inferior','anterior'].includes(key)?'Regional voltage gradients shift the ST segment. This is an injury-current illustration, not a new conduction wave.':'Most ventricular tissue is activated. With little net voltage difference, a flat segment can coexist with electrically active cells.';}
else if(p.id==='PR'){source='PR segment · AV delay';detail='The impulse is delayed at the AV node. The node’s small signal is not a separate visible surface ECG wave.';}
else detail=p.text;
let sign=Math.abs(v)<.025?'near baseline':v>0?'above baseline (an upward deflection)':'below baseline (a downward deflection)';
return {source,detail:detail+' Lead '+lead.name+' is '+sign+' at this instant.',color:signalColor(t),v};
}
export function initInspector(pauseAt){
const canvas=document.getElementById('beatZoom'),ctx=canvas.getContext('2d');let cache=null,cacheKey='',lastText=0;
function windowFor(t){const pr=patterns[state.key].pr||.16;let b=beats.find(x=>x.q>=t+pr)||beats.at(-1);for(const candidate of beats){if(candidate.q-pr-.05<=t)b=candidate;else break;}if(b?.q<0)b=beats.find(x=>x.q>=0)||b;if(!b)return{start:Math.max(0,Math.min(5,t-.35)),end:Math.max(1,Math.min(6,t+.65)),b:null};const index=beats.indexOf(b),next=beats[index+1];const start=Math.max(0,b.q-pr-.05),end=Math.min(6,Math.max(start+.55,next?next.q-pr-.05:start+60/(patterns[state.key].rate||75)));return{start,end,b};}
function render(t){const win=windowFor(t),rect=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio,2),key=[appearance.width,appearance.gain,state.key,state.lead,win.start,win.end,rect.width,rect.height,d].join('|');
if(cacheKey!==key){const w=rect.width,h=rect.height;canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);ctx.setTransform(d,0,0,d,0,0);const left=34,right=w-14,top=22,baseline=h*.57,scale=(h-48)/3.5*appearance.gain;
ctx.fillStyle='#0a1920';ctx.fillRect(0,0,w,h);ctx.font='11px sans-serif';ctx.fillStyle='#8ba5af';for(let m=-1;m<=1;m++){const y=baseline-m*scale;ctx.strokeStyle=m===0?'#4a626b':'#21373f';ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(right,y);ctx.stroke();ctx.fillText(m+'',8,y+4);}ctx.fillText('mV',7,14);
for(let s=Math.ceil(win.start*10)/10;s<=win.end;s+=.1){const x=left+(s-win.start)/(win.end-win.start)*(right-left);ctx.strokeStyle='#1c343e';ctx.beginPath();ctx.moveTo(x,top);ctx.lineTo(x,h-21);ctx.stroke();if(Math.round(s*10)%2===0){ctx.fillStyle='#7c97a3';ctx.fillText(s.toFixed(1)+'s',x-9,h-5);}}
let previous=null;for(let x=left;x<=right;x+=.4){const time=win.start+(x-left)/(right-left)*(win.end-win.start),value=voltage(time,state.lead),y=baseline-value*scale,color=signalColor(time);if(previous){ctx.beginPath();ctx.moveTo(previous.x,previous.y);ctx.lineTo(x,y);ctx.strokeStyle=color;ctx.lineWidth=appearance.width;ctx.lineCap='round';ctx.shadowColor=color;ctx.shadowBlur=5;ctx.stroke();}previous={x,y};}ctx.shadowBlur=0;
if(win.b){const b=win.b,p=patterns[state.key],rec=['tachy','flutter','vt'].includes(state.key)?.12:.20;for(const [label,time,color] of [['P',b.q-(p.pr||.16)+.045,'#ffe363'],['QRS',b.q+b.d*.48,'#ffe363'],['T',b.q+b.d+rec,'#c38aff']]){if(label==='P'&&['af','flutter','vt'].includes(state.key))continue;const x=left+(time-win.start)/(win.end-win.start)*(right-left);if(x>left&&x<right){ctx.fillStyle=color;ctx.font='bold 12px sans-serif';ctx.fillText(label,x-6,15);}}}
cache={image:ctx.getImageData(0,0,canvas.width,canvas.height),...win,left,right,baseline,scale,w,h,d};cacheKey=key;}
ctx.putImageData(cache.image,0,0);ctx.setTransform(d,0,0,d,0,0);const x=cache.left+(t-cache.start)/(cache.end-cache.start)*(cache.right-cache.left),y=cache.baseline-voltage(t,state.lead)*cache.scale;
ctx.strokeStyle='#f3f8fa';ctx.lineWidth=1;ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(x,21);ctx.lineTo(x,cache.h-21);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=signalColor(t);ctx.shadowColor=signalColor(t);ctx.shadowBlur=14;ctx.beginPath();ctx.arc(x,y,6,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#ffffff';ctx.lineWidth=1.5;ctx.stroke();
canvas.setAttribute('aria-valuenow',t.toFixed(3));canvas.setAttribute('aria-valuetext',t.toFixed(3)+' seconds, lead '+leads[state.lead].name);
if(performance.now()-lastText>55){const s=explainSignal(t,state.lead);document.getElementById('signalStage').textContent=s.source;document.getElementById('signalStage').style.color=s.color;document.getElementById('signalExplanation').textContent=s.detail;const fill=document.getElementById('signFill'),extent=Math.min(.5,Math.abs(s.v)/3);fill.style.background=s.color;fill.style.left=(s.v<0?.5-extent:.5)*100+'%';fill.style.width=extent*100+'%';document.querySelectorAll('[data-moment]').forEach(el=>el.disabled=state.key==='vf');lastText=performance.now();}
}
function seek(event){if(!cache)return;const rect=canvas.getBoundingClientRect(),fraction=Math.max(0,Math.min(1,(event.clientX-rect.left-cache.left)/(cache.right-cache.left)));pauseAt(cache.start+fraction*(cache.end-cache.start));}
let dragging=false;canvas.addEventListener('pointerdown',e=>{dragging=true;canvas.setPointerCapture(e.pointerId);seek(e);});canvas.addEventListener('pointermove',e=>{if(dragging)seek(e);});canvas.addEventListener('pointerup',()=>dragging=false);canvas.addEventListener('pointercancel',()=>dragging=false);
canvas.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?cache.start:e.key==='End'?cache.end:state.time+(e.key==='ArrowLeft'?-1:1)*(e.shiftKey?.02:.005);pauseAt(Math.max(0,Math.min(6,next)));}});
document.querySelectorAll('[data-moment]').forEach(button=>button.onclick=()=>{const b=cache?.b;if(!b)return;const rec=['tachy','flutter','vt'].includes(state.key)?.12:.20;pauseAt(b.q+({early:b.d*.14,main:b.d*.46,late:b.d*.83,recovery:b.d+rec}[button.dataset.moment]));});
return{render};
}
