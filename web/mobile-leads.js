// Relocate the original canvas, not a copy, so there is still one playback clock.
export function initMobileLeadLayout(onLayout){
 const media=matchMedia('(max-width: 850px)');
 const strip=document.getElementById('selected-strip');
 const scene=document.getElementById('scene');
 const grid=document.getElementById('leads');
 const button=document.getElementById('changeLeadStrip');
 const anchor=document.createComment('Desktop selected-strip location');
 strip.before(anchor);
 const lesson=document.getElementById('blockLesson');
 const impulse=document.querySelector('.conduction-status');
 const lessonAnchor=document.createComment('Desktop pathology lesson location');
 lesson.before(lessonAnchor);
 function layout(){
   if(media.matches){scene.after(strip);impulse.after(lesson);}
   else {anchor.after(strip);lessonAnchor.after(lesson);}
   onLayout();
 }
 const behavior=()=>matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth';
 button.addEventListener('click',()=>{
   if(!media.matches)return;
   const selected=grid.querySelector('[aria-pressed="true"]')||grid.querySelector('button');
   selected?.focus({preventScroll:true});
   document.getElementById('leadChoicesHeading').scrollIntoView({behavior:behavior(),block:'start'});
 });
 grid.addEventListener('click',event=>{
   if(!media.matches||!event.target.closest('.lead-button'))return;
   // Lead selection runs on the button first. Wait for its cross-section redraw.
   requestAnimationFrame(()=>{
     button.focus({preventScroll:true});
     scene.scrollIntoView({behavior:behavior(),block:'start'});
   });
 });
 media.addEventListener('change',layout);
 layout();
}
