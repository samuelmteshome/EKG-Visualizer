import {state,beats,atria,phase} from './model.js';
import {mechanicalFrame} from './mechanics.js';
const NS='http://www.w3.org/2000/svg';
const circulation=`<g class="circuit-anatomy">
<rect x="35" y="55" width="200" height="80" rx="20" class="organ"/><text x="135" y="103">BODY</text>
<rect x="585" y="55" width="200" height="80" rx="20" class="organ"/><text x="685" y="103">LUNGS</text>
<ellipse cx="270" cy="265" rx="75" ry="60" class="blood-right"/><ellipse cx="540" cy="265" rx="75" ry="60" class="blood-left"/>
<g data-ventricle="rv"><path d="M230 355Q340 330 375 445Q385 540 315 560Q235 535 230 355Z" class="blood-right"/></g>
<g data-ventricle="lv"><path d="M470 355Q575 335 590 445Q585 540 515 560Q455 515 470 355Z" class="blood-left"/></g>
<g class="flow-route"><path data-flow="venous" d="M135 135C125 210 165 250 235 265"/><path data-flow="pulmonaryReturn" d="M685 135C695 210 640 250 570 265"/><path data-flow="rightFill" d="M270 285Q265 345 295 415"/><path data-flow="leftFill" d="M540 285Q545 345 520 415"/><path data-flow="pulmonaryOut" d="M315 445Q415 360 375 190Q400 100 585 100"/><path data-flow="aorticOut" d="M515 445Q415 355 450 190Q425 95 235 95"/></g>
<text x="270" y="255">RA</text><text x="270" y="283" class="small">Right atrium</text><text x="540" y="255">LA</text><text x="540" y="283" class="small">Left atrium</text>
<text x="295" y="474">RV</text><text x="295" y="501" class="small">Right ventricle</text><text x="520" y="474">LV</text><text x="520" y="501" class="small">Left ventricle</text>
<text x="100" y="220" class="small">Venae cavae</text><text x="710" y="220" class="small">Pulmonary veins</text>
<text x="590" y="155" class="small">Pulmonary artery → lungs</text><text x="215" y="155" class="small">Aorta → body</text>
<g data-valve="av" transform="translate(275 340)"><path/></g><g data-valve="av" transform="translate(535 340)"><path/></g>
<g data-valve="out" transform="translate(375 190)"><path/></g><g data-valve="out" transform="translate(450 190)"><path/></g>
<text x="110" y="352" class="small">Tricuspid valve</text><path class="callout" d="M185 348L260 340"/>
<text x="700" y="352" class="small">Mitral valve</text><path class="callout" d="M630 348L550 340"/>
<text x="270" y="188" class="small">Pulmonic</text><text x="550" y="188" class="small">Aortic</text>
<text x="410" y="610" class="small">PATIENT RIGHT ←                 → PATIENT LEFT</text></g>`;
const echo=`<defs><pattern id="echo-grain" width="18" height="19" patternUnits="userSpaceOnUse"><circle cx="3" cy="4" r="1" fill="#73858d"/><circle cx="13" cy="14" r=".7" fill="#a3b0b8"/></pattern></defs>
<path d="M410 30L85 570Q410 665 735 570Z" fill="#10191f" stroke="#4a5d68" stroke-width="2"/><path d="M410 30L85 570Q410 665 735 570Z" fill="url(#echo-grain)" opacity=".25"/>
<g class="echo-walls" data-ventricle="rv"><path d="M392 108Q287 190 260 352Q312 397 391 354Q415 240 392 108Z"/></g>
<g class="echo-walls" data-ventricle="lv"><path d="M433 108Q541 196 554 353Q495 397 429 353Q408 245 433 108Z"/></g>
<path class="echo-atria" d="M263 393Q238 473 309 534Q390 526 385 396Z"/><path class="echo-atria" d="M434 396Q424 512 501 534Q575 483 552 393Z"/>
<g data-valve="av" transform="translate(329 379)"><path/></g><g data-valve="av" transform="translate(492 379)"><path/></g>
<g class="flow-route echo-flow"><path data-flow="rightFill" d="M318 492Q329 390 337 266"/><path data-flow="leftFill" d="M505 492Q492 390 482 266"/></g>
<g class="echo-labels"><text x="340" y="240">RV</text><text x="480" y="240">LV</text><text x="310" y="483">RA</text><text x="505" y="483">LA</text><text x="410" y="82">APEX / PROBE</text><text x="180" y="383">Tricuspid</text><text x="638" y="383">Mitral</text><text x="410" y="614">APICAL FOUR-CHAMBER · SCHEMATIC</text></g>`;
export function initPlumbing(container){
 let mode='flow';const root=document.createElement('div');root.className='plumbing-view';root.innerHTML='<div class="plumbing-tools"><button data-plumbing="flow" class="active">Blood flow</button><button data-plumbing="echo">Ultrasound-style</button></div><svg class="plumbing-svg" viewBox="0 0 820 635" role="img"></svg><div class="mechanical-caption"><strong id="mechanical-stage"></strong><p id="mechanical-ecg"></p><div class="valve-readouts"><span id="av-readout"></span><span id="out-readout"></span></div><p id="mechanical-note"></p><button id="normal-mechanics" hidden>Explore normal sinus pumping</button></div>';
 container.replaceChildren(root);const svg=root.querySelector('svg');let flows=[];
 function draw(){svg.innerHTML=mode==='flow'?circulation:echo;svg.setAttribute('aria-label',mode==='flow'?'Blood circuit with four chambers and valve-gated flow':'Schematic apical four-chamber ultrasound-style view; not a real echocardiogram');flows=[];svg.querySelectorAll('[data-flow]').forEach(path=>{const name=path.dataset.flow,color=mode==='echo'?'#b6f4e6':['venous','rightFill','pulmonaryOut'].includes(name)?'#66beff':'#ff8b99';path.style.stroke=color;const dots=[];for(let i=0;i<4;i++){const dot=document.createElementNS(NS,'circle');dot.setAttribute('r',mode==='echo'?5:6);dot.setAttribute('fill',color);svg.append(dot);dots.push(dot);}flows.push({name,path,dots,length:path.getTotalLength()});});}
 root.querySelectorAll('[data-plumbing]').forEach(button=>button.onclick=()=>{mode=button.dataset.plumbing;root.querySelectorAll('[data-plumbing]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',b===button);});draw();});
 root.querySelector('#normal-mechanics').onclick=()=>{const select=document.getElementById('rhythm');select.value='sinus';select.dispatchEvent(new Event('change'));};
 function render(t){const f=mechanicalFrame(t,beats,atria,state.key);root.dataset.mechanicalPhase=f.stage;root.dataset.supported=String(f.supported);root.querySelector('#mechanical-stage').textContent=f.stage;root.querySelector('#mechanical-ecg').textContent=`ECG now: ${phase(t).id} · ${f.supported?'Electrical activation precedes mechanical contraction.':'No pumping motion is inferred for this pattern.'}`;
 root.querySelector('#av-readout').textContent='Mitral / tricuspid: '+(f.supported?(f.avOpen?'OPEN':'CLOSED'):'not modeled');root.querySelector('#out-readout').textContent='Aortic / pulmonic: '+(f.supported?(f.outOpen?'OPEN':'CLOSED'):'not modeled');root.querySelector('#normal-mechanics').hidden=f.supported;
 root.querySelector('#mechanical-note').textContent=!f.supported?'This teaching pump currently supports sinus rhythm, sinus bradycardia/tachycardia and first-degree AV block. Other patterns need distinct mechanical models.':mode==='echo'?'Illustration, not recorded ultrasound. This four-chamber slice shows AV valves; the aortic and pulmonary outflow valves are outside the slice. Flow arrows are a teaching overlay, not Doppler.':'Blue = relatively deoxygenated blood; red = oxygenated blood (not Doppler colors). Both sides pump together. Valve timing, shape and flow speed are schematic, not measured pressures or cardiac output.';
 const scale=.82+.18*f.volume;svg.querySelectorAll('[data-ventricle]').forEach(g=>{const cx=g.dataset.ventricle==='rv'?(mode==='echo'?335:300):(mode==='echo'?490:525),cy=mode==='echo'?370:350;g.setAttribute('transform',`translate(${cx} ${cy}) scale(${scale} ${scale}) translate(${-cx} ${-cy})`);});
 svg.querySelectorAll('[data-valve]').forEach(g=>{const open=g.dataset.valve==='av'?f.avOpen:f.outOpen;const direction=(mode==='echo'||g.dataset.valve==='out')?-22:22;g.querySelector('path').setAttribute('d',open?`M-20 0L-9 ${direction}M20 0L9 ${direction}`:'M-20 0L0 7L20 0');g.style.stroke=f.supported?(open?'#a2f6cd':'#ffe39a'):'#6f8794';g.dataset.open=String(open);});
 flows.forEach(({name,path,dots,length})=>{const enabled=f.supported&&(name.endsWith('Fill')?f.avOpen:name.endsWith('Out')?f.outOpen:true);path.style.opacity=enabled?'.6':'.13';dots.forEach((dot,i)=>{dot.style.display=enabled?'':'none';if(enabled){const p=path.getPointAtLength(((t*(f.atrial?3:2)+i/4)%1)*length);dot.setAttribute('cx',p.x);dot.setAttribute('cy',p.y);}});});
 }
 draw();return {render};
}
