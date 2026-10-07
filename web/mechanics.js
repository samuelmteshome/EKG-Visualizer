// Illustrative normal mechanics, not pressures or patient-specific echo measurements.
export const mechanicalPatterns=new Set(['sinus','brady','tachy','av1']);
export function mechanicalFrame(t,beats,atria,key){
 if(!mechanicalPatterns.has(key)||!beats.length)return {supported:false,avOpen:false,outOpen:false,volume:1,stage:'Mechanical pattern not modeled',atrial:false};
 let index=0;for(let i=0;i<beats.length;i++)if(beats[i].q<=t)index=i;
 const beat=beats[index],next=beats[index+1],rr=next?next.q-beat.q:.8,dt=t-beat.q;
 const end=Math.min(rr*.7,Math.max(.24,Math.min(.46,.39*Math.sqrt(rr/.8))));
 const ejectStart=.065,ejectEnd=end-.055;
 let stage,avOpen=false,outOpen=false,volume=1;
 if(dt>=.025&&dt<ejectStart)stage='Isovolumetric contraction';
 else if(dt>=ejectStart&&dt<ejectEnd){stage='Ventricular ejection';outOpen=true;volume=1-.4*(dt-ejectStart)/(ejectEnd-ejectStart);}
 else if(dt>=ejectEnd&&dt<end){stage='Isovolumetric relaxation';volume=.6;}
 else {stage='Ventricular filling';avOpen=true;volume=.6+.4*Math.max(0,Math.min(1,(dt-end)/(rr-end+.025)));if(dt<.025)volume=1;}
 const atrial=avOpen&&atria.some(a=>t>=a+.04&&t<a+.14);
 if(atrial)stage='Atrial contraction · final filling';
 return {supported:true,avOpen,outOpen,volume,stage,atrial};
}
