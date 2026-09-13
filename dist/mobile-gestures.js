'use strict';

// Touch enhancements supplement the visible buttons. Vertical scrolling wins
// until a deliberate hold or a clearly horizontal gesture has been recognised.
let MG=null,MG_SUPPRESS_UNTIL=0,MG_UNDO=null,MG_FRAME=null;
function mgHaptic(){try{globalThis.navigator?.vibrate?.(12);}catch{}}
function mgMoveProduct(routine,stepId,beforeId,afterId){
  const {r,step}=skinFind({routine,step:stepId});if(!r||!step)return false;
  const steps=skinSteps(r),old=steps.map(s=>s.id);
  if(beforeId===stepId||afterId===stepId)return false;
  if(beforeId&&!steps.some(s=>s.id===beforeId)||afterId&&!steps.some(s=>s.id===afterId))return false;
  const rest=steps.filter(s=>s.id!==stepId);
  const index=beforeId?rest.findIndex(s=>s.id===beforeId):afterId?rest.findIndex(s=>s.id===afterId)+1:rest.length;
  rest.splice(index,0,step);if(old.join('|')===rest.map(s=>s.id).join('|'))return false;
  r.skinSteps=rest;r.steps=rest.map(s=>s.instruction);r.version++;skinSyncToday(r);
  MG_UNDO={routine:r.id,old,after:rest.map(s=>s.id)};persist();render();
  toast('Soin déplacé.',{label:'Annuler',action:'mg-undo-order'});return true;
}
ACTIONS['mg-undo-order']=()=>{
  const saved=MG_UNDO;if(!saved)return;const r=M.routines.find(r=>r.id===saved.routine);if(!r)return;
  const steps=skinSteps(r);if(steps.map(s=>s.id).join('|')!==saved.after.join('|')){toast('La routine a changé depuis ce déplacement.');return;}
  r.skinSteps=saved.old.map(id=>steps.find(s=>s.id===id));r.steps=r.skinSteps.map(s=>s.instruction);r.version++;skinSyncToday(r);MG_UNDO=null;persist();render();toast('Ordre rétabli.');
};
function mgTab(current,dx){const i=SKIN_STUDIO_TABS.indexOf(current);if(i<0||Math.abs(dx)<55)return current;return SKIN_STUDIO_TABS[Math.max(0,Math.min(2,i+(dx<0?1:-1)))];}
const MG_STEP=skinStudioStep;
skinStudioStep=function(r,step,index){
  const html=MG_STEP(r,step,index),cut=html.indexOf('>'),body=html.slice(cut+1,-10);
  return html.slice(0,cut).replace('data-step-id=',`data-routine-id="${esc(r.id)}" data-step-id=`)+`><div class="mg-swipe-actions" aria-hidden="true" inert>${A(icon('settings')+'<span>Modifier</span>','sp-edit',{routine:r.id,step:step.id},'mg-edit')}${A(icon('trash')+'<span>Retirer</span>','skin-remove-step',{routine:r.id,step:step.id},'mg-remove')}</div><div class="mg-row-content">${body}</div></article>`;
};
const MG_ROUTINE=skinStudioRoutine;
skinStudioRoutine=function(...args){const html=MG_ROUTINE(...args);return M.skinRoutineEditing?html.replace('<div class="ss-product-list','<p class="mg-hint">Maintenez un soin, puis déplacez-le.</p><div class="ss-product-list'):html;};
function mgReveal(row,open){
  row?.classList.toggle('mg-revealed',open);const actions=row?.querySelector('.mg-swipe-actions');
  if(actions){actions.inert=!open;actions.setAttribute('aria-hidden',String(!open));}
  const content=row?.querySelector('.mg-row-content');if(content)content.style.transform='';
}
function mgCloseReveals(except){document.querySelectorAll('.mg-revealed').forEach(row=>{if(row!==except)mgReveal(row,false);});}
function mgCancel(){
  if(!MG)return;clearTimeout(MG.timer);if(MG_FRAME!==null){window.cancelAnimationFrame?.(MG_FRAME);MG_FRAME=null;}
  MG.row?.classList.remove('mg-dragging','mg-swiping');if(MG.row)MG.row.style.transform='';
  MG.list?.querySelectorAll('.mg-drop-before,.mg-drop-after').forEach(row=>row.classList.remove('mg-drop-before','mg-drop-after'));
  if(MG.sheet)MG.sheet.style.transform='';
  if(MG.mode==='swipe')mgReveal(MG.row,MG.wasOpen);
  MG=null;
}
function mgStart(target,x,y){
  mgCancel();
  const row=target.closest?.('.ss-product-row[data-routine-id]'),main=target.closest?.('.ss-product-main');
  mgCloseReveals(row);
  if(row&&main){
    const rect=row.getBoundingClientRect(),list=row.closest('.ss-product-list');
    MG={kind:'row',mode:'pending',row,list,startX:x,startY:y,x,y,scale:rect.width/(row.offsetWidth||rect.width),startScroll:list.scrollTop,wasOpen:row.classList.contains('mg-revealed'),moved:false};
    const gesture=MG;MG.timer=setTimeout(()=>{
      if(MG!==gesture||MG.mode!=='pending')return;
      mgReveal(row,false);MG.mode='drag';MG.row.classList.add('mg-dragging');MG_SUPPRESS_UNTIL=Date.now()+1000;mgHaptic();mgDrag(y);mgAutoScroll();
    },420);return;
  }
  const sheet=target.closest?.('.modal');
  if(sheet&&!target.closest('button,input,select,textarea,a,summary')){
    const rect=sheet.getBoundingClientRect();if(target.closest('#dialog-title')||y-rect.top<24){MG={kind:'sheet',sheet,mode:'pending',startX:x,startY:y,x,y,scale:rect.width/(sheet.offsetWidth||rect.width)};return;}
  }
  const tabs=target.closest?.('.ss-tabs,.ss-routine-summary');
  if(tabs){MG={kind:'tabs',mode:'pending',startX:x,startY:y,x,y,current:document.querySelector('.ss-tabs [aria-selected="true"]')?.dataset.value};}
}
function mgDrag(y){
  if(!MG||MG.mode!=='drag')return;const {row,list,scale}=MG;
  row.style.transform=`translateY(${(y-MG.startY)/scale+list.scrollTop-MG.startScroll}px)`;
  const others=[...list.querySelectorAll('.ss-product-row')].filter(el=>el!==row);
  others.forEach(el=>el.classList.remove('mg-drop-before','mg-drop-after'));
  const before=others.find(el=>{const rect=el.getBoundingClientRect();return y<rect.top+rect.height/2;});
  const after=before?null:others.at(-1);MG.before=before?.dataset.stepId;MG.after=after?.dataset.stepId;
  before?.classList.add('mg-drop-before');after?.classList.add('mg-drop-after');
  MG.moved=Math.abs(y-MG.startY)>8||list.scrollTop!==MG.startScroll;
}
function mgAutoScroll(){
  if(!MG||MG.mode!=='drag'||!window.requestAnimationFrame)return;
  const rect=MG.list.getBoundingClientRect(),zone=38*MG.scale;
  const delta=MG.y<rect.top+zone?-6:MG.y>rect.bottom-zone?6:0;
  if(delta){MG.list.scrollTop+=delta;mgDrag(MG.y);}
  MG_FRAME=window.requestAnimationFrame(mgAutoScroll);
}
function mgMove(x,y,event){
  if(!MG)return;MG.x=x;MG.y=y;const dx=(x-MG.startX)/(MG.scale||1),dy=(y-MG.startY)/(MG.scale||1);
  if(MG.mode==='drag'){if(event.cancelable)event.preventDefault();mgDrag(y);return;}
  if(MG.kind==='row'){
    if(MG.mode==='pending'&&Math.hypot(dx,dy)>10){clearTimeout(MG.timer);if(Math.abs(dx)>Math.abs(dy)*1.6)MG.mode='swipe';else{mgCancel();return;}}
    if(MG.mode==='swipe'){if(event.cancelable)event.preventDefault();MG.row.classList.add('mg-swiping');const distance=Math.max(-124,Math.min(0,(MG.wasOpen?-124:0)+dx));MG.row.style.setProperty('--mg-swipe',distance+'px');MG.row.querySelector('.mg-row-content').style.transform=`translateX(${distance}px)`;}
  }else if(MG.kind==='sheet'){
    if(MG.mode==='pending'&&Math.hypot(dx,dy)>10){if(dy>0&&dy>Math.abs(dx)*1.4)MG.mode='dismiss';else{mgCancel();return;}}
    if(MG.mode==='dismiss'){if(event.cancelable)event.preventDefault();MG.sheet.style.transform=`translateY(${Math.max(0,dy)}px)`;}
  }else if(MG.kind==='tabs'){
    if(Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)){mgCancel();return;}
    if(Math.abs(dx)>14&&Math.abs(dx)>Math.abs(dy)*1.6){MG.mode='tabs';if(event.cancelable)event.preventDefault();}
  }
}
function mgEnd(){
  if(!MG)return;const g=MG,dx=(g.x-g.startX)/(g.scale||1),dy=(g.y-g.startY)/(g.scale||1);
  const consumed=['drag','swipe','dismiss','tabs'].includes(g.mode);if(consumed)MG_SUPPRESS_UNTIL=Date.now()+450;
  g.row?.classList.remove('mg-swiping');mgCancel();
  if(g.mode==='drag'&&g.moved){mgMoveProduct(g.row.dataset.routineId,g.row.dataset.stepId,g.before,g.after);mgHaptic();}
  if(g.mode==='swipe'){mgReveal(g.row,g.wasOpen?dx<40:dx<-40);}
  if(g.mode==='dismiss'&&dy>90){captureDrafts();closeModal();}
  if(g.mode==='tabs'){const next=mgTab(g.current,dx);if(next!==g.current){mgHaptic();ACTIONS['ss-tab']({value:next});}}
}
document.addEventListener('touchstart',event=>{if(event.touches.length!==1){mgCancel();return;}const p=event.touches[0];mgStart(event.target,p.clientX,p.clientY);},{passive:true});
document.addEventListener('touchmove',event=>{if(event.touches.length!==1){mgCancel();return;}const p=event.touches[0];mgMove(p.clientX,p.clientY,event);},{passive:false});
document.addEventListener('touchend',mgEnd,{passive:true});
document.addEventListener('touchcancel',()=>{if(MG?.mode==='drag')MG_SUPPRESS_UNTIL=Date.now()+450;mgCancel();},{passive:true});
document.addEventListener('pointerdown',event=>{if(event.pointerType==='touch'||event.button!==0)return;mgStart(event.target,event.clientX,event.clientY);});
document.addEventListener('pointermove',event=>{if(event.pointerType!=='touch')mgMove(event.clientX,event.clientY,event);});
document.addEventListener('pointerup',event=>{if(event.pointerType!=='touch')mgEnd();});
document.addEventListener('pointercancel',event=>{if(event.pointerType!=='touch')mgCancel();});
document.addEventListener('contextmenu',event=>{if(event.target.closest?.('.ss-product-main'))event.preventDefault();});
document.addEventListener('click',event=>{if(Date.now()<MG_SUPPRESS_UNTIL&&event.detail!==0){event.preventDefault();event.stopImmediatePropagation();}},true);
document.addEventListener('keydown',event=>{if(event.key==='Escape'){mgCancel();mgCloseReveals();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)mgCancel();});
window.addEventListener('blur',mgCancel);
const MG_RENDER=render;render=function(...args){mgCancel();return MG_RENDER(...args);};
