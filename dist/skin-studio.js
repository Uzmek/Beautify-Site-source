'use strict';

// One skincare surface for the report and the daily routine. Existing routines,
// product choices, schedules and dated completion snapshots stay authoritative.
const SKIN_STUDIO_PREVIOUS={report:canonicalReport,panel:canonicalSkinPanel,skin:V['PEA-01'],art:skinProductArt,state:viewStateFor};
const SKIN_STUDIO_TABS=['Matin','Soir','Bilan'];
const SKIN_STUDIO_ART={cleanse:[0,0],remove:[0,0],serum:[50,0],moisturize:[100,0],mask:[100,0],care:[100,0],protect:[0,100],toner:[50,100],exfoliate:[50,100],eye:[100,100]};
skinProductArt=function(type,extra=''){
  const cell=SKIN_STUDIO_ART[type];if(!cell)return SKIN_STUDIO_PREVIOUS.art(type,extra);
  return `<span class="sc-product-art sc-product-art-${esc(type)} ${esc(extra)}" aria-hidden="true"><span class="ss-product-atlas" style="--product-x:${cell[0]}%;--product-y:${cell[1]}%"></span></span>`;
};
function skinStudioState(){
  skinState();M.skinStudioFilters||={};
}
function skinStudioButton(text,action,data={},kind='glass',glyph=''){
  return A((glyph?icon(glyph):'')+'<span>'+esc(text)+'</span>',action,data,'ss-button ss-'+kind);
}
function skinStudioIcon(name){
  const positions={Matin:0,Soir:50,Bilan:100};
  return `<span class="ss-ritual-icon" aria-hidden="true" style="--ritual-x:${positions[name]??100}%"></span>`;
}
function skinStudioTabs(tab,result){
  const date=result?.date,parsed=date?new Date(date+'T12:00:00'):null;
  const dateLabel=parsed&&!Number.isNaN(parsed.getTime())?parsed.toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'}):'Mon bilan';
  const button=(name,i)=>`<button type="button" id="ss-tab-${i}" role="tab" aria-controls="ss-panel" aria-selected="${name===tab}" aria-describedby="${i===2?'ss-bilan-date':'ss-routine-label'}" tabindex="${name===tab?0:-1}" data-act="ss-tab" data-value="${name}">${icon(['sun','moon','drop'][i])}<span>${name}</span></button>`;
  return `<div class="ss-tabs ss-grouped-tabs" role="tablist" aria-label="Mon espace peau"><div class="ss-tab-group ss-current-group" role="presentation"><span id="ss-routine-label" class="ss-tab-caption">Routine actuelle</span><div class="ss-tab-choices" role="presentation">${button('Matin',0)}${button('Soir',1)}</div></div><div class="ss-tab-group ss-bilan-group" role="presentation">${parsed&&!Number.isNaN(parsed.getTime())?`<time id="ss-bilan-date" class="ss-tab-caption" datetime="${esc(date)}">${esc(dateLabel)}</time>`:'<span id="ss-bilan-date" class="ss-tab-caption">Mon bilan</span>'}<div class="ss-tab-choices" role="presentation">${button('Bilan',2)}</div></div></div>`;
}
function skinStudioShell(tab,body,result){
  return `<div class="lg-page beauty-page ss-shell sb-shell" data-moment="${esc(tab)}"><header class="ss-header">${A(icon('back'),'back',{label:'Retour'},'ss-icon-button')}<div><span>BEAUTIFY</span><h1 tabindex="-1">Ma peau</h1></div>${A(icon('history'),'lg-history-domain',{domain:'Peau',label:'Historique de mes analyses de peau'},'ss-icon-button')}</header>`+
    skinStudioTabs(tab,result)+`<section id="ss-panel" class="ss-panel canonical-report-panel" role="tabpanel" aria-labelledby="ss-tab-${SKIN_STUDIO_TABS.indexOf(tab)}">${body}</section>`+
    (tab==='Bilan'?'':`<footer class="ss-footer">${A(icon('bars')+'<span>Mon suivi</span>','skin-view-progress',{moment:tab==='Soir'?'Soir':'Matin'},'ss-footer-link')}${A(icon('plus')+'<span>Nouvelle analyse</span>','studio-analysis',{domain:'Peau'},'ss-footer-link')}</footer>`)+`</div>`;
}
// Native scrolling keeps the routine in one continuous list. Remember each
// routine/filter independently so checking a product never jumps to the top.
const SKIN_STUDIO_SCROLL=new Map();
function skinStudioRememberList(list){
  if(list?.dataset?.ssScrollKey)SKIN_STUDIO_SCROLL.set(list.dataset.ssScrollKey,list.scrollTop||0);
}
function skinStudioRestoreList(list){
  if(list?.dataset?.ssScrollKey)list.scrollTop=SKIN_STUDIO_SCROLL.get(list.dataset.ssScrollKey)||0;
}
const SKIN_STUDIO_RENDER=render;
render=function(options={}){
  skinStudioRememberList(document.querySelector('.ss-product-list[data-ss-scroll-key]'));
  const result=SKIN_STUDIO_RENDER(options);
  skinStudioRestoreList(document.querySelector('.ss-product-list[data-ss-scroll-key]'));
  return result;
};
document.addEventListener('scroll',event=>skinStudioRememberList(event.target),true);
function skinStudioListAttrs(key,count){
  return `class="ss-product-list${count>5?' is-long':' is-short'}" data-ss-scroll-key="${esc(key)}" tabindex="0" role="region"`;
}
function skinStudioSummary(moment,r,readOnly=false){
  const counted=r?skinCounted(r):[],done=r?counted.filter(step=>skinDone(r,step)).length:0;
  const complete=counted.length>0&&done===counted.length;
  const title=readOnly?'Routine de cette analyse':M.skinRoutineEditing?'À votre façon':complete?'Un moment pour vous.':moment==='Matin'?'Le bon départ.':'Place au calme.';
  return `<header class="ss-routine-summary"><div class="ss-moment-orb" aria-hidden="true">${skinStudioIcon(moment)}</div><div class="ss-summary-copy"><span class="ss-eyebrow">${readOnly?'Routine conseillée':M.skinRoutineEditing?'Organisation de mes soins':'Routine actuelle — '+moment}</span><h2>${title}</h2>${r&&!readOnly?`<p>${complete?'Les soins prévus sont faits':counted.length?`<span class="ss-summary-done" data-motion-key="skin-summary-${moment}" data-motion-value="${done}">${done}</span> soin${done>1?'s':''} fait${done>1?'s':''} sur ${counted.length}`:'À votre rythme, selon vos besoins'}</p>`:''}</div>${r&&!readOnly?`<div class="ss-mini-progress" data-motion-key="skin-progress-${moment}" role="progressbar" aria-label="Soins prévus réalisés" aria-valuemin="0" aria-valuemax="${counted.length||1}" aria-valuenow="${done}" style="--progress:${counted.length?done/counted.length*100:0}%"><span>${complete?icon('check'):`<strong class="ss-progress-value" data-motion-key="skin-count-${moment}" data-motion-value="${done}">${done}</strong><small>/${counted.length}</small>`}</span></div>`:''}</header>`;
}
function skinStudioStep(r,step,index){
  const product=skinRecordedProduct(r,step)||skinProduct(step),done=skinDone(r,step),data={routine:r.id,step:step.id};
  const assigned=!!step.product,scheduled=skinDue(step);
  const label=step.frequency==='needed'?'Au besoin':!scheduled?'Autre jour':step.frequency==='days'?skinFrequencyLabel(step):assigned?(product.example?'Exemple de produit':product.brand||step.title):'Produit à choisir';
  return `<article class="ss-product-row${done?' is-done':''}${M.skinRoutineEditing?' is-editing':''}" data-step-id="${esc(step.id)}"><span class="ss-step-index" aria-hidden="true">${String(index+1).padStart(2,'0')}</span>`+
    A(skinProductArt(step.type)+`<span class="ss-product-copy"><strong>${esc(product.name)}</strong><small>${esc(step.title)}${label!==step.title?`<span>${esc(label)}</span>`:''}</small></span>`,'skin-step-detail',{...data,label:product.name+', '+step.title+', ouvrir les détails'},'ss-product-main')+
    (M.skinRoutineEditing?A(icon('settings'),'ss-organize-step',{...data,label:'Organiser '+product.name},'ss-icon-button'):A(done?icon('check'):'','skin-check-step',{...data,pressed:done,label:(done?'Décocher ':'Marquer fait : ')+product.name},'ss-check'))+'</article>';
}
function skinStudioRoutine(moment,result){
  skinStudioState();
  const latest=!result||result.id===lgLatest('Peau')?.id;
  if(result&&latest&&skinPrepareRoutine(result))persist();
  const r=skinRoutine(moment);
  if(!r)return skinStudioEmptyRoutine(moment,result);
  // Existing handlers use this moment for product creation and guided navigation.
  M.skinRoutineMoment=moment;
  const all=skinSteps(r),today=skinTodaySteps(r),filter=M.skinRoutineEditing?'all':M.skinStudioFilters[r.id]||'today';
  const steps=filter==='all'?all:today,key=r.id+':'+DATE()+':'+filter;
  const counted=skinCounted(r),done=counted.filter(step=>skinDone(r,step)).length,complete=counted.length>0&&done===counted.length;
  const pending=today.filter(step=>!skinDone(r,step));
  const review=result?.skinRoutineStatus==='review'&&skinMissingSuggestions(result).length;
  const linkedBilan=result&&!latest?A(`${icon('drop')}<span>Bilan du ${esc(shortDate(result.date))}</span>${icon('chev')}`,'ss-tab',{value:'Bilan',label:'Revenir au bilan du '+dateText(result.date)},'ss-linked-bilan'):'';
  return `<div class="ss-routine sc-live-report${M.skinRoutineEditing?' is-editing':''}">${linkedBilan}${skinStudioSummary(moment,r)}`+
    (review&&latest?A('<span>Suggestions du dernier bilan</span>'+icon('chev'),'skin-review-plan',{id:result.id},'ss-review'):'')+
    `<div class="ss-list-heading"><div class="ss-filters" role="group" aria-label="Soins à afficher">${[['today',"Aujourd’hui",today.length],['all','Tous',all.length]].map(([value,title,count])=>A(`${title}<span>${count}</span>`,'ss-filter',{routine:r.id,value,pressed:filter===value},'ss-filter')).join('')}</div>${A(M.skinRoutineEditing?'Terminer':'Organiser','skin-edit-mode',{},'ss-organize')}</div>`+
    `<div ${skinStudioListAttrs(key,steps.length)} aria-label="Produits de la routine du ${moment.toLowerCase()}">${steps.length?steps.map(step=>skinStudioStep(r,step,all.indexOf(step))).join(''):`<div class="ss-list-empty">${icon('leaf')}<strong>${all.length?'Rien de prévu aujourd’hui':'Votre routine commence ici'}</strong><p>${all.length?'Vos autres soins sont dans « Tous ».':'Ajoutez les produits que vous utilisez.'}</p></div>`}</div>`+
    `<div class="ss-routine-actions">${skinStudioButton('Ajouter un soin','skin-add-open',{routine:r.id},'glass','plus')}${!M.skinRoutineEditing&&pending.length?skinStudioButton(done?'Reprendre':'Me guider','ss-guide-start',{routine:r.id},'copper','arrow'):skinStudioButton('Options','skin-routine-options',{routine:r.id},'glass','settings')}</div>`+
    `<div class="ss-routine-note">${!M.skinRoutineEditing&&counted.length&&!complete?A('Tout cocher','skin-check-all',{routine:r.id},'ss-quiet'):''}<span>${all.length} soin${all.length>1?'s':''} dans votre routine</span></div></div>`;
}
function skinStudioEmptyRoutine(moment,result){
  M.skinRoutineMoment=moment;
  return `<div class="ss-empty">${skinStudioSummary(moment,null)}<div class="ss-empty-main">${skinProductArt('moisturize')}<h2>Vos produits.<br>Votre rituel.</h2><p>Ajoutez vos soins et retrouvez-les ici, dans votre ordre.</p></div><div class="ss-empty-actions">${skinStudioButton('Ajouter mes produits','ss-create',{moment},'copper','plus')}${result?.skinPlan?skinStudioButton('Revoir la proposition','skin-review-plan',{id:result.id},'glass','sparkles'):''}</div></div>`;
}
function skinStudioHistorical(moment,result){
  const instructions=skinPlanInstructions(result,moment).filter(label=>!skinIsAdvice(label));
  const key='archive:'+result.id+':'+moment;
  return `<div class="ss-routine ss-historical">${skinStudioSummary(moment,null,true)}<div class="ss-list-heading"><strong>Routine de cette analyse</strong><span>${esc(dateText(result.date))}</span></div><div ${skinStudioListAttrs(key,instructions.length)} aria-label="Soins conseillés dans cette analyse">${instructions.map((instruction,i)=>{const type=skinType(instruction);return `<article class="ss-product-row"><span class="ss-step-index">${i+1}</span>${skinProductArt(type)}<span class="ss-product-copy"><strong>${esc(SKIN_TYPES[type].title)}</strong><small>${esc(SKIN_TYPES[type].hint)}</small></span></article>`;}).join('')||'<p class="ss-list-empty">Aucun soin enregistré dans ce bilan.</p>'}</div><p class="ss-archive-note">Proposition enregistrée à cette date. Vos produits actuels sont conservés.</p>${skinStudioButton('Ma routine actuelle','skin-open-routine',{moment},'copper','arrow')}</div>`;
}
function skinStudioBilan(result){
  if(!result)return `<div class="ss-empty"><div class="ss-empty-main">${skinProductArt('moisturize')}<h2>Faisons le point.</h2><p>Votre bilan de peau et vos priorités seront réunis ici.</p></div>${skinStudioButton('Analyser ma peau','studio-analysis',{domain:'Peau'},'copper','scan')}</div>`;
  if(!canonicalOwned())return `<div class="ss-empty"><div class="ss-empty-main">${icon('lock')}<h2>Votre bilan vous attend.</h2><p>Retrouvez le détail de votre analyse.</p></div>${B('Voir mon bilan','PRE-01','ss-button ss-copper')}</div>`;
  const measured=result.skinScoreSource==='vision/skin-v1';
  if(measured&&!skinScoreValid(result.skin))return `<div class="ss-empty"><h2>Bilan incomplet</h2><p>Les scores de cette analyse ne sont pas disponibles.</p>${skinStudioButton('Nouvelle analyse','studio-analysis',{domain:'Peau'},'copper','scan')}</div>`;
  const data=measured?result.skin:beautySkinData(result);
  const metrics=measured?SKIN_SCORE_KEYS.map(key=>({...data.metrics.find(m=>m.key===key),label:SKIN_SCORE_COPY[key].label})):data.metrics;
  const observations=measured?metrics.filter(m=>m.summary).map(m=>m.summary):data.observations;
  const priorities=measured?(result.skinProfile?.traits||[]):data.priorities;
  const userPhoto=memoryPhotos[result.photo];
  const label=measured?'Aspect de la peau':'Exemple de bilan';
  const observationsUI=observations.map((text,i)=>{
    const kind=/rouge/i.test(text)?0:/cerne|yeux/i.test(text)?2:1;
    const title=measured?metrics.filter(m=>m.summary)[i]?.label||text:['Rougeurs','Imperfections','Cernes'][kind];
    const value=measured?metrics.filter(m=>m.summary)[i]?.score:[70,65,69][kind];
    return A(`<span class="sb-observation-photo sb-photo-${kind}" aria-hidden="true"></span><span class="sb-observation-copy"><strong>${esc(title)}</strong><span class="sb-track" aria-hidden="true"><i style="width:${value??0}%"></i></span></span>`,'ss-observations',{id:result.id,label:text+', voir le détail'},'sb-observation');
  }).join('');
  return `<div class="ss-bilan sb-reference"><section class="sb-hero" aria-label="${label}, ${data.score} sur 100"><img class="sb-portrait${userPhoto?' is-personal':''}" src="${esc(userPhoto||'/assets/bilan-reference-portrait-v1.png')}" alt="${userPhoto?'Photo de cette analyse':'Portrait d’illustration'}"><div class="sb-hero-copy"><div class="sb-score" role="img" aria-label="${label} : ${data.score} sur 100"><svg viewBox="0 0 140 140" aria-hidden="true"><defs><linearGradient id="sb-score-copper" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#e0b69b"/><stop offset="38%" stop-color="#c18c6c"/><stop offset="75%" stop-color="#9e684c"/><stop offset="100%" stop-color="#c69573"/></linearGradient></defs><circle class="sb-ring-track" cx="70" cy="70" r="61"/><circle class="sb-ring-value" cx="70" cy="70" r="61" pathLength="100" stroke-dasharray="${data.score} 100"/></svg><span><strong>${data.score}</strong><small>/100</small></span></div><h2>${measured?'Aspect de la peau':'Peau en bon état'}</h2></div>${!measured?'<span class="sb-example">Exemple de bilan</span>':''}</section>`+
    `<div class="sb-metrics${measured?' is-four':''}">${metrics.map((m,i)=>A(`<span class="sb-metric-icon">${['tone','texture','radiance'].includes(m.key)?`<span class="sb-metric-art sb-art-${m.key}" aria-hidden="true"></span>`:icon(({redness:'waves',evenness:'pores',shine:'sun',underEye:'eye'})[m.key]||'sparkles')}</span><span class="sb-metric-label">${esc(m.label.replace(' du teint',''))}</span><strong>${m.score}</strong><span class="sb-track" aria-hidden="true"><i style="width:${m.score}%"></i></span>`,measured?'skin-score-detail':'beauty-skin-detail',{id:result.id,key:m.key,label:m.label+', '+m.score+' sur 100, voir le détail'},'ss-metric')).join('')}</div>`+
    `<section class="sb-observations"><header><h3>À retenir</h3>${A('Voir plus'+icon('chev'),'ss-observations',{id:result.id},'sb-more')}</header><div class="sb-observation-grid${observations.length>3?' is-four':''}">${observationsUI}</div></section>`+
    A(`<span><small>Ma routine</small><strong>${esc(priorities.slice(0,2).join(' et ')||'Mes gestes quotidiens')}</strong></span><span class="sb-routine-arrow">${icon('chev')}</span>`,'ss-tab',{value:'Matin',label:'Voir ma routine actuelle du matin'},'sb-routine')+'</div>';
}
function skinStudioHub(){
  skinStudioState();const tab=M.skinStudioTab==='Bilan'?'Bilan':M.skinRoutineMoment;
  const result=lgLatest('Peau');return skinStudioShell(tab,tab==='Bilan'?skinStudioBilan(result):skinStudioRoutine(tab,null),result);
}
canonicalReport=function(){
  const result=report();if(result?.domain!=='Peau'||!canonicalOwned())return SKIN_STUDIO_PREVIOUS.report();
  skinStudioState();const tab=SKIN_STUDIO_TABS[Math.max(0,Math.min(2,Number(M.canonicalReportStep)||0))];
  return skinStudioShell(tab,tab==='Bilan'?skinStudioBilan(result):skinStudioRoutine(tab,result),result);
};
canonicalSkinPanel=function(tab,result){return ['Matin','Soir'].includes(tab)?skinStudioRoutine(tab,result):tab==='Bilan'?skinStudioBilan(result):SKIN_STUDIO_PREVIOUS.panel(tab,result);};
beautySkinPanel=skinStudioBilan;skinScorePanel=skinStudioBilan;
skinHub=skinStudioHub;V['ROU-01']=skinStudioHub;
V['PEA-01']=()=>{skinStudioState();if(['Matin','Soir'].includes(M.skinTab)){M.skinRoutineMoment=M.skinTab;M.skinStudioTab=M.skinTab;}else M.skinStudioTab='Bilan';return skinStudioHub();};
ACTIONS['ss-tab']=data=>{
  if(!SKIN_STUDIO_TABS.includes(data.value))return;
  M.skinStudioTab=data.value;M.skinRoutineEditing=false;M.canonicalReportStep=SKIN_STUDIO_TABS.indexOf(data.value);
  if(data.value!=='Bilan')M.skinRoutineMoment=data.value;
  if(route==='PEA-01')M.skinTab=data.value==='Bilan'?'Rapport':data.value;
  render({scroll:0});document.getElementById('ss-tab-'+M.canonicalReportStep)?.focus({preventScroll:true});
};
ACTIONS['ss-filter']=data=>{skinStudioState();if(!['today','all'].includes(data.value)||!skinFind(data).r)return;M.skinStudioFilters[data.routine]=data.value;if(data.value==='today')M.skinRoutineEditing=false;render();};
ACTIONS['ss-create']=data=>{M.skinRoutineMoment=data.moment==='Soir'?'Soir':'Matin';M.skinStudioTab=M.skinRoutineMoment;ACTIONS['skin-own-routine']();const r=skinRoutine(),step=r&&skinSteps(r).find(step=>!step.product);if(step)ACTIONS['skin-replace-open']({routine:r.id,step:step.id});else if(r)ACTIONS['skin-add-open']({routine:r.id});};
// Open existing routines at the requested moment even after viewing Bilan.
const SKIN_STUDIO_OPEN=skinOpen;
skinOpen=function(moment,id){M.skinStudioTab=moment==='Soir'?'Soir':'Matin';SKIN_STUDIO_OPEN(moment,id);};
ACTIONS['ss-organize-step']=data=>{
  const {r,step}=skinFind(data);if(!step)return;
  const index=skinSteps(r).indexOf(step);
  skinSheet('Organiser ce soin',`<div class="ss-organize-product">${skinProductArt(step.type)}<strong>${esc(skinProduct(step).name)}</strong></div>`+
    (index>0?skinStudioButton('Monter dans la routine','ss-move',{...data,direction:'up'},'glass','back'):'')+
    (index<r.skinSteps.length-1?skinStudioButton('Descendre dans la routine','ss-move',{...data,direction:'down'},'glass','arrow'):'')+
    skinStudioButton('Produit et fréquence','skin-step-detail',data,'glass','calendar')+
    skinStudioButton('Retirer ce soin','skin-remove-step',data,'glass','x'));
};
ACTIONS['ss-move']=data=>{ACTIONS['skin-move-step'](data);ACTIONS['ss-organize-step'](data);};
ACTIONS['ss-observations']=data=>{
  if(!canonicalOwned())return;const r=M.analyses.find(r=>r.id===data.id&&r.domain==='Peau');if(!r)return;
  const measured=r.skinScoreSource==='vision/skin-v1';
  if(measured&&!skinScoreValid(r.skin))return;
  const lines=measured?r.skin.metrics.map(m=>m.summary).filter(Boolean):beautySkinData(r).observations;
  skinSheet('Les repères de votre bilan',`<div class="ss-observation-details">${lines.map(text=>`<p>${icon('scan')}<span>${esc(text)}</span></p>`).join('')}</div><p class="ss-disclaimer">${measured?'Observation de cette photo.':'Exemple illustratif, photo non analysée.'}</p>`+skinStudioButton('Revenir au bilan','close',{},'glass','back'));
};
// Guided care marks only an explicit "Fait" as completed. Skipping never ticks
// a product and the saved product snapshot is kept by skinWriteChecks.
ACTIONS['ss-guide-start']=data=>{
  const {r}=skinFind(data);if(!r)return;
  const ids=skinTodaySteps(r).filter(step=>!skinDone(r,step)).map(step=>step.id);
  M.skinStudioGuide={routine:r.id,ids,index:0,date:DATE()};skinStudioGuide();
};
function skinStudioGuide(){
  const guide=M.skinStudioGuide;if(!guide)return;
  const r=M.routines.find(r=>r.id===guide.routine&&r.domain==='Peau');if(!r)return;
  if(guide.date!==DATE()){M.skinStudioGuide=null;closeModal(false);render();return;}
  const all=skinSteps(r);
  while(guide.index<guide.ids.length&&!all.some(step=>step.id===guide.ids[guide.index]))guide.index++;
  const step=all.find(step=>step.id===guide.ids[guide.index]);
  if(!step){
    const counted=skinCounted(r),done=counted.filter(step=>skinDone(r,step)).length;
    skinSheet('Votre rituel',`<div class="ss-guide-complete">${icon(done===counted.length&&done?'check':'leaf')}<h3>${done===counted.length&&done?'Un moment pour vous.':'À votre rythme.'}</h3><p>${done} soin${done>1?'s':''} fait${done>1?'s':''} sur ${counted.length} prévu${counted.length>1?'s':''}.</p></div>`+skinStudioButton('Revenir à ma routine','close',{},'copper','check'));return;
  }
  const product=skinProduct(step),data={routine:r.id,step:step.id,index:guide.index};
  skinSheet('Mon rituel du '+r.moment.toLowerCase(),`<div class="ss-guide"><div class="ss-guide-position"><span>${guide.index+1} / ${guide.ids.length}</span><strong>${esc(step.title)}</strong>${step.frequency==='needed'?'<small>Au besoin</small>':''}</div><div class="ss-guide-art">${skinProductArt(step.type)}</div><h3>${esc(product.name)}</h3><p class="ss-guide-product-note">${esc(!step.product?'Produit à choisir':product.example?'Exemple de produit':product.brand||'Mon produit')}</p><p class="ss-guide-instruction">${esc(step.instruction||SKIN_TYPES[step.type].instruction)}</p>${skinStudioButton('Fait, suivant','ss-guide-next',{...data,done:'yes'},'copper','check')}${skinStudioButton('Passer ce soin','ss-guide-next',{...data,done:'no'},'glass','arrow')}</div>`);
}
ACTIONS['ss-guide-next']=data=>{
  const guide=M.skinStudioGuide;if(!guide||guide.date!==DATE()||guide.routine!==data.routine||guide.index!==Number(data.index)||guide.ids[guide.index]!==data.step)return;
  const {r,step}=skinFind(data);if(!r||!step)return;
  if(data.done==='yes')skinWriteChecks(r,new Set([...skinSteps(r).filter(item=>skinDone(r,item)).map(item=>item.id),step.id]));
  guide.index++;persist();render();skinStudioGuide();
};
viewStateFor=id=>{const state=SKIN_STUDIO_PREVIOUS.state(id);if(['ROU-01','ROU-02','ROU-04','PEA-01','ANA-09','ANA-10','ANA-11'].includes(id)){state.skinStudioTab=M.skinStudioTab;state.skinStudioFilters=clone(M.skinStudioFilters||{});}return state;};
document.addEventListener('keydown',event=>{
  const target=event.target?.closest?.('.ss-tabs [role="tab"]');if(!target||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  const index=SKIN_STUDIO_TABS.indexOf(target.dataset.value);
  const next=event.key==='Home'?0:event.key==='End'?2:(index+(event.key==='ArrowRight'?1:2))%3;
  event.preventDefault();ACTIONS['ss-tab']({value:SKIN_STUDIO_TABS[next]});
});
