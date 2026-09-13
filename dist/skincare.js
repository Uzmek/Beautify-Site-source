'use strict';

// Daily skincare uses the existing routines and dated session store.
// Example products are categories, not a connected recommendation catalogue.
const SKIN_TYPES={
  remove:{title:'Démaquiller',category:'Démaquillant',art:'bottle',rank:0,hint:'Démaquillant doux',instruction:'Retirez le maquillage en douceur avec un produit que vous tolérez déjà.'},
  cleanse:{title:'Nettoyer',category:'Nettoyant',art:'bottle',rank:1,hint:'Nettoyant doux',instruction:'Nettoyez délicatement, puis séchez sans frotter.'},
  toner:{title:'Tonique',category:'Tonique / essence',art:'bottle',rank:2,hint:'Mon tonique',instruction:'Suivez la notice de votre tonique ou de votre essence.'},
  serum:{title:'Sérum',category:'Sérum',art:'bottle',rank:3,hint:'Mon sérum',instruction:'Suivez la notice de votre sérum, notamment la quantité et la fréquence d’utilisation.'},
  eye:{title:'Contour des yeux',category:'Contour des yeux',art:'skin',rank:4,hint:'Mon contour des yeux',instruction:'Utilisez votre produit selon sa notice en évitant tout contact avec les yeux.'},
  moisturize:{title:'Hydrater',category:'Hydratant',art:'skin',rank:5,hint:'Crème hydratante',instruction:'Appliquez votre hydratant sur une peau légèrement humide, selon votre confort.'},
  protect:{title:'Protéger',category:'Protection solaire',art:'bottle',rank:10,hint:'Écran large spectre SPF 30+',instruction:'Utilisez un écran large spectre SPF 30 ou plus. À l’extérieur, renouvelez toutes les deux heures et après baignade ou transpiration. Pensez aussi à l’ombre et aux vêtements.'},
  mask:{title:'Masque',category:'Masque',art:'skin',rank:4,occasional:true,hint:'Mon masque',instruction:'Respectez le temps de pose, le rinçage éventuel et la fréquence indiqués sur votre produit.'},
  patch:{title:'Patchs',category:'Patchs',art:'patch',rank:4,occasional:true,hint:'Mes patchs',instruction:'Suivez les indications de vos patchs pour la zone, le temps de pose et l’ordre d’application.'},
  exfoliate:{title:'Exfoliant',category:'Exfoliant',art:'bottle',rank:2,occasional:true,hint:'Mon exfoliant',instruction:'Respectez la fréquence et les précautions de la notice. N’ajoutez pas plusieurs nouveaux actifs en même temps.'},
  care:{title:'Mon soin',category:'Autre soin',art:'skin',rank:4,occasional:true,hint:'Mon soin',instruction:'Suivez les indications de votre produit et sa fréquence d’utilisation.'}
};
const SKIN_EXAMPLES=[
  ['gel-doux','cleanse','Gel nettoyant doux'],['lait-nettoyant','cleanse','Lait nettoyant'],['creme-nettoyante','cleanse','Crème nettoyante'],
  ['eau-micellaire','remove','Eau micellaire'],['baume-demaquillant','remove','Baume démaquillant'],
  ['creme-confort','moisturize','Crème hydratante'],['fluide-leger','moisturize','Fluide hydratant léger'],['baume-confort','moisturize','Baume hydratant'],
  ['fluide-spf','protect','Fluide large spectre SPF 50'],['creme-spf','protect','Crème large spectre SPF 30'],
  ['lotion-tonique','toner','Lotion tonique'],['essence','toner','Essence visage'],
  ['serum-hydratant','serum','Sérum hydratant'],['contour-yeux','eye','Crème contour des yeux'],
  ['masque-hydratant','mask','Masque hydratant'],['patchs-yeux','patch','Patchs contour des yeux'],['patchs-cibles','patch','Patchs ciblés'],
  ['exfoliant','exfoliate','Exfoliant visage']
].map(([id,type,name])=>({id:'skin-example-'+id,type,name,brand:'',example:true}));
const SKIN_PREVIOUS={hub:V['ROU-01'],detail:V['ROU-02'],session:V['ROU-04'],skin:V['PEA-01'],panel:canonicalSkinPanel,task:ACTIONS['task-open']};

function skinState(){M.skinCareProducts||=[];M.skinRoutineMoment=['Matin','Soir'].includes(M.skinRoutineMoment)?M.skinRoutineMoment:'Matin';}
function skinType(label){const text=fold(label);return /patch/.test(text)?'patch':/tonique|essence/.test(text)?'toner':/serum/.test(text)?'serum':/contour.*yeux/.test(text)?'eye':/exfoli/.test(text)?'exfoliate':/masque/.test(text)?'mask':/retirer le maquillage|demaquill/.test(text)?'remove':/nettoy|rincer/.test(text)?'cleanse':/spf|ecran|soleil|peau exposee|proteger/.test(text)?'protect':/hydrat/.test(text)?'moisturize':'care';}
function skinIsAdvice(label){return /^Introduire un seul changement à la fois/.test(label);}
function skinSteps(r){
  if(r.generatedSkinPlan&&r.steps.some(skinIsAdvice)){r.skinAdvice=[...new Set([...(r.skinAdvice||[]),...r.steps.filter(skinIsAdvice)])];r.steps=r.steps.filter(label=>!skinIsAdvice(label));}
  const previous=r.skinSteps||[],used=new Set();
  r.skinSteps=r.steps.map(label=>{
    const match=previous.find(step=>step.instruction===label&&!used.has(step.id));
    if(match){used.add(match.id);return match;}
    const type=skinType(label);
    return {id:uid('skin-step'),type,title:SKIN_TYPES[type].title,instruction:label,product:null,frequency:type==='remove'||SKIN_TYPES[type].occasional?'needed':'daily'};
  });
  return r.skinSteps;
}
function skinRoutines(){return M.routines.filter(r=>r.domain==='Peau'&&(r.generatedSkinPlan||r.skinManaged||M.active.includes(r.id)||Object.values(M.skinRoutineIds||{}).includes(r.id)||!['morning','evening'].includes(r.id)));}
function skinRoutine(moment=M.skinRoutineMoment){const list=skinRoutines().filter(r=>r.moment===moment);return list.find(r=>r.id===M.skinRoutineIds?.[moment])||list.find(r=>r.generatedSkinPlan)||list[0];}
const SKIN_DAYS=['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.'];
function skinDue(step,date=DATE()){return step.frequency!=='days'||(step.days||[]).includes(new Date(date+'T12:00:00').getDay());}
function skinTodaySteps(r){return skinSteps(r).filter(step=>skinDue(step)||skinDone(r,step));}
function skinCounted(r){return skinTodaySteps(r).filter(step=>step.frequency!=='needed'||skinDone(r,step));}
function skinFrequencyLabel(step){return step.frequency==='needed'?'Au besoin':step.frequency==='days'?(step.days||[]).slice().sort((a,b)=>(a+6)%7-(b+6)%7).map(day=>SKIN_DAYS[day]).join(', '):'Chaque jour';}
function skinRecordedProduct(r,step){const s=skinSession(r),index=s?.skinIds?.indexOf(step.id);return skinDone(r,step)&&index>=0?s.skinEntries?.[index]?.product:null;}
function skinPlanInstructions(record,moment){return (moment==='Matin'?record.skinPlan?.morning:record.skinPlan?.evening)||[];}
function skinCreatePlanRoutine(record,moment){
  const current=skinRoutine(moment);if(current)return current;
  const steps=skinPlanInstructions(record,moment).filter(label=>!skinIsAdvice(label));if(!steps.length)return null;
  const r={id:uid('skin-plan'),name:'Ma routine du '+moment.toLowerCase(),domain:'Peau',moment,frequency:'Chaque jour',steps:steps.slice(),image:moment==='Matin'?'morning':'evening',type:'Routine',version:1,generatedSkinPlan:true,skinSourceAnalysis:record.id,skinAdvice:skinPlanInstructions(record,moment).filter(skinIsAdvice)};
  skinSteps(r);M.routines.push(r);M.active.push(r.id);M.schedules[r.id]={start:DATE(),days:[0,1,2,3,4,5,6]};M.skinRoutineIds||={};M.skinRoutineIds[moment]=r.id;return r;
}
// Only the first unlocked plan is activated automatically. Later analyses are proposals.
function skinPrepareRoutine(record){
  if(!canonicalOwned()||record?.domain!=='Peau'||!record.skinPlan||record.skinRoutineStatus)return false;
  const existing=['Matin','Soir'].some(moment=>!!skinRoutine(moment));
  if(!existing)for(const moment of ['Matin','Soir'])skinCreatePlanRoutine(record,moment);
  record.skinRoutineStatus=existing?'review':'ready';return true;
}
function skinMissingSuggestions(record){
  return ['Matin','Soir'].flatMap(moment=>{
    const r=skinRoutine(moment),types=new Set(r?skinSteps(r).map(step=>step.type):[]);
    return skinPlanInstructions(record,moment).filter(label=>!skinIsAdvice(label)).flatMap(instruction=>{
      const type=skinType(instruction);if(types.has(type))return [];types.add(type);
      return [{key:moment+':'+type,moment,type,instruction}];
    });
  });
}
function skinProduct(step){return step.product||{type:step.type,name:SKIN_TYPES[step.type].hint,example:true};}
function skinProductArt(type,extra=''){const art=SKIN_TYPES[type]?.art||'bottle';return `<span class="sc-product-art sc-product-art-${type} ${extra}" aria-hidden="true">${art==='patch'?'<span class="sc-patch-pair"><i></i><i></i></span>':`<img src="/assets/icons/${art}.webp" width="64" height="64" alt="">`}</span>`;}
function skinFind(data){const r=M.routines.find(item=>item.id===data.routine&&item.domain==='Peau');return r?{r,step:skinSteps(r).find(step=>step.id===data.step)}:{};}
function skinSession(r,date=DATE()){return M.sessions.find(s=>s.kind==='routine'&&s.ref===r.id&&s.date===date);}
function skinDone(r,step,date=DATE()){
  const session=skinSession(r,date);if(!session)return false;
  const index=session.skinIds?session.skinIds.indexOf(step.id):session.labels?.indexOf(step.instruction);
  return index>=0&&session.steps[index]==='done';
}
function skinWriteChecks(r,ids){
  const definitions=skinSteps(r).filter(step=>(skinDue(step)&&step.frequency!=='needed')||ids.has(step.id)),session=routineSession(r,DATE());
  const previousIds=session.skinIds||session.labels.map(label=>definitions.find(step=>step.instruction===label)?.id);
  const previous=previousIds.map((id,index)=>({id,status:session.steps[index],entry:session.skinEntries?.[index]}));
  session.skinIds=definitions.map(step=>step.id);
  session.labels=definitions.map(step=>step.instruction);
  session.steps=definitions.map(step=>ids.has(step.id)?'done':'todo');
  session.skinEntries=definitions.map(step=>{
    const old=previous.find(entry=>entry.id===step.id&&entry.status==='done');
    return ids.has(step.id)&&old?.entry?old.entry:{...clone(step),product:clone(skinProduct(step))};
  });
  session.skinMoment=r.moment;session.version=r.version;session.confirmed=!!session.steps.length&&session.steps.every(status=>status==='done');
  M.actions.filter(action=>action.ref===r.id&&action.date===DATE()).forEach(action=>action.done=sessionComplete(session));
}
function skinSyncToday(r){if(skinSession(r))skinWriteChecks(r,new Set(skinSteps(r).filter(step=>skinDone(r,step)).map(step=>step.id)));}
function skinOpen(moment='Matin',id){
  skinState();M.skinRoutineMoment=['Matin','Soir'].includes(moment)?moment:'Matin';
  if(id&&!skinRoutine(M.skinRoutineMoment)){M.skinRoutineIds||={};M.skinRoutineIds[M.skinRoutineMoment]=id;}
  M.skinRoutineEditing=false;go('ROU-01');
}
function skinStepCard(r,step,index){
  const product=skinRecordedProduct(r,step)||skinProduct(step),done=skinDone(r,step),data={routine:r.id,step:step.id};
  const label=!step.product?'Produit à choisir':product.example?'Exemple':product.brand||'Mon produit';
  return `<article class="sc-step sc-step-compact ${!step.product?'sc-step-placeholder ':''}${done?'is-done':''}">`+
    A(`${skinProductArt(step.type)}<span class="sc-step-copy"><span class="sc-step-role">${esc(step.title)}${step.frequency!=='daily'?', '+esc(skinFrequencyLabel(step)):''}</span><strong>${esc(product.name)}</strong><small>${esc(label)}</small></span>${icon('chev')}`,'skin-step-detail',{...data,label:step.title+' : '+product.name+', détails et produit'},'sc-step-main')+
    (M.skinRoutineEditing?A(icon('x'),'skin-remove-step',{...data,label:'Retirer '+step.title},'sc-step-check sc-remove'):A(done?icon('check'):'','skin-check-step',{...data,pressed:done,label:(done?'Décocher ':'Marquer fait : ')+step.title},'sc-step-check'))+
    (M.skinRoutineEditing?`<div class="sc-reorder">${index?A('Monter','skin-move-step',{...data,direction:'up'},'text-button'):''}${index<r.skinSteps.length-1?A('Descendre','skin-move-step',{...data,direction:'down'},'text-button'):''}</div>`:'')+'</article>';
}
function skinDailyBody(r){
  const all=skinSteps(r),steps=M.skinRoutineEditing?all:skinTodaySteps(r),counted=skinCounted(r),done=counted.filter(step=>skinDone(r,step)).length;
  const complete=counted.length&&done===counted.length;
  return `<div class="sc-daily-progress"><span>${complete?'Votre routine est terminée':"Aujourd’hui"}</span><strong><span class="sc-progress-value" data-motion-key="daily-count-${r.id}" data-motion-value="${done}">${done}</span><span> / ${counted.length}</span></strong><div class="sc-progress-track" data-motion-key="daily-progress-${r.id}" role="progressbar" aria-label="Soins réalisés" aria-valuemin="0" aria-valuemax="${counted.length||1}" aria-valuenow="${done}"><span style="width:${counted.length?done/counted.length*100:0}%"></span></div></div>`+
    `<div class="sc-steps">${steps.map(step=>skinStepCard(r,step,all.indexOf(step))).join('')}</div>`+
    (!steps.length?'<p class="sc-empty-copy">'+(all.length?'Aucun soin prévu aujourd’hui.':'Ajoutez votre premier soin.')+'</p>':'')+
    `<div class="sc-daily-actions">${A(icon('plus')+' Ajouter un soin','skin-add-open',{routine:r.id},'sc-add-step')}${counted.length&&!complete&&!M.skinRoutineEditing?A(icon('check')+' Tout cocher','skin-check-all',{routine:r.id},'sc-complete-all'):''}</div>`;
}
function skinHub(){
  skinState();const moment=M.skinRoutineMoment,r=skinRoutine(moment);
  const tabs=`<div class="sc-moments" role="group" aria-label="Moment de la routine">${['Matin','Soir'].map(value=>A(icon(value==='Matin'?'sun':'moon')+value,'skin-moment',{value,pressed:value===moment},'sc-moment '+(value===moment?'selected':''))).join('')}</div>`;
  const top=`<div class="sc-title-row"><div><span class="eyebrow">${esc(dateText(DATE()))}</span><h1 tabindex="-1">Ma routine</h1></div>${r?A(M.skinRoutineEditing?'Terminer':'Modifier','skin-edit-mode',{},'text-button'):''}</div>`;
  if(!r)return lgPage(top+tabs+lgCard(`${skinProductArt('moisturize')}<h2>${skinRoutines().length?'Votre routine du '+moment.toLowerCase():'Vos soins, au quotidien'}</h2><p>${skinRoutines().length?'Ajoutez les produits que vous utilisez.':'À partir de votre bilan ou des produits que vous avez déjà.'}</p>`+
    (M.skinPlan?lgAct('Utiliser ma routine conseillée','skin-apply-plan',{moment},'sparkles'):lgAct('Analyser ma peau','studio-analysis',{domain:'Peau'},'camera'))+
    lgAct('Avec mes produits','skin-own-routine',{},'plus','lg-action-secondary'),'sc-empty')+'<p class="sc-demo">Prototype, les conseils d’analyse sont illustratifs.</p>','sc-hub');
  return lgPage(top+tabs+skinDailyBody(r)+
    `<div class="sc-bottom-links">${M.skinProfile?A('Mon bilan','skin-view-report',{},'text-button'):''}${A('Mon suivi','skin-view-progress',{},'text-button')}${A('Options','skin-routine-options',{routine:r.id},'text-button')}</div>`,'sc-hub');
}
function skinSheet(title,html){modal(title,`<div class="sc-sheet">${html}</div>`);}
function skinReviewPlan(data){
  if(!canonicalOwned()){go('PRE-01');return;}
  const record=M.analyses.find(item=>item.id===data.id&&item.domain==='Peau');if(!record?.skinPlan)return;
  const suggestions=skinMissingSuggestions(record);
  if(M.skinPlanReview?.id!==record.id)M.skinPlanReview={id:record.id,selected:suggestions.map(item=>item.key)};
  skinSheet('Suggestions du bilan',`<p class="sc-instruction">${suggestions.length?'Votre routine actuelle reste en place. Ajoutez seulement ce qui vous convient.':'Vos gestes essentiels sont déjà en place. Vous pouvez garder votre routine.'}</p>`+
    suggestions.map(item=>A(`${skinProductArt(item.type)}<span><strong>${esc(SKIN_TYPES[item.type].title)}</strong><small>${item.moment}, Produit à choisir</small></span>${icon(M.skinPlanReview.selected.includes(item.key)?'check':'plus')}`,'skin-proposal-toggle',{id:record.id,key:item.key,pressed:M.skinPlanReview.selected.includes(item.key)},'sc-product-option')).join('')+
    (suggestions.length?lgAct('Ajouter à ma routine actuelle','skin-proposal-apply',{id:record.id},'plus'):'')+
    A('Garder ma routine actuelle','skin-proposal-keep',{id:record.id},'text-button'));
}
ACTIONS['skin-review-plan']=skinReviewPlan;
ACTIONS['skin-proposal-toggle']=data=>{if(M.skinPlanReview?.id!==data.id)return;const list=M.skinPlanReview.selected;M.skinPlanReview.selected=list.includes(data.key)?list.filter(key=>key!==data.key):[...list,data.key];skinReviewPlan(data);};
ACTIONS['skin-proposal-keep']=data=>{const record=M.analyses.find(item=>item.id===data.id);if(record)record.skinRoutineStatus='kept';M.skinPlanReview=null;closeModal(false);render();};
ACTIONS['skin-proposal-apply']=data=>{
  if(!canonicalOwned()||M.skinPlanReview?.id!==data.id)return;
  const record=M.analyses.find(item=>item.id===data.id&&item.domain==='Peau');if(!record?.skinPlan)return;
  const suggestions=skinMissingSuggestions(record).filter(item=>M.skinPlanReview.selected.includes(item.key));
  if(!suggestions.length){toast('Choisissez un soin ou gardez votre routine.');return;}
  for(const item of suggestions){
    let r=skinRoutine(item.moment);
    if(!r){const partial={...record,skinPlan:{morning:[],evening:[],[item.moment==='Matin'?'morning':'evening']:[item.instruction]}};r=skinCreatePlanRoutine(partial,item.moment);continue;}
    const steps=skinSteps(r),type=item.type;
    const entry={id:uid('skin-step'),type,title:SKIN_TYPES[type].title,instruction:item.instruction,product:null,frequency:type==='remove'||SKIN_TYPES[type].occasional?'needed':'daily'};
    const index=steps.findIndex(step=>SKIN_TYPES[step.type].rank>SKIN_TYPES[type].rank);
    steps.splice(index<0?steps.length:index,0,entry);r.steps=steps.map(step=>step.instruction);r.version++;skinSyncToday(r);
  }
  record.skinRoutineStatus='applied';M.skinPlanReview=null;closeModal(false);render();toast('Routine ajustée. Vos produits sont conservés.');
};
ACTIONS['skin-step-day']=data=>{
  const {r,step}=skinFind(data),day=Number(data.day);if(!step||step.frequency!=='days'||!Number.isInteger(day)||day<0||day>6)return;
  const days=step.days||[];if(days.includes(day)&&days.length===1){toast('Gardez au moins un jour, ou choisissez « Au besoin ».');return;}
  step.days=days.includes(day)?days.filter(value=>value!==day):[...days,day];r.version++;skinSyncToday(r);render();skinStepDetail(data);
};
ACTIONS['skin-routine-options']=data=>{
  const {r}=skinFind(data);if(!r)return;
  skinSheet('Ma routine',A('Modifier mes soins','skin-edit-from-options',{},'sc-own-product')+
    (r.skinAdvice?.length?`<details class="ux-details"><summary>Précautions</summary><p class="sc-instruction">${r.skinAdvice.map(esc).join(' ')}</p></details>`:'')+
    (M.routines.some(item=>item.domain!=='Peau')?`<details class="ux-details"><summary>Autres routines</summary>${M.routines.filter(item=>item.domain!=='Peau').map(item=>B(esc(item.name),'ROU-02','text-button',{key:'routine',value:item.id})).join('')}</details>`:'')+
    '<p class="sc-picker-note">Démo : les suggestions sont des exemples, pas un catalogue de marques.</p>');
};
ACTIONS['skin-edit-from-options']=()=>{closeModal(false);M.skinRoutineEditing=true;render();};
function skinStepDetail(data){
  const {r,step}=skinFind(data);if(!step)return;
  const product=skinProduct(step);
  skinSheet(step.title,`<div class="sc-sheet-product">${skinProductArt(step.type)}<div><strong>${esc(product.name)}</strong><small>${esc(!step.product?'Produit à choisir':product.example?'Exemple':product.brand||'Mon produit')}</small></div></div><p class="sc-instruction">${esc(step.instruction||SKIN_TYPES[step.type].instruction)}</p><h3>Dans ma routine</h3><div class="sc-frequency">${[['daily','Chaque jour'],['days','Certains jours'],['needed','Au besoin']].map(([value,label])=>A(label,'skin-step-frequency',{routine:r.id,step:step.id,value,pressed:(step.frequency||'daily')===value},'sc-frequency-choice '+((step.frequency||'daily')===value?'selected':''))).join('')}</div>${step.frequency==='days'?`<div class="sc-days" role="group" aria-label="Jours du soin">${[1,2,3,4,5,6,0].map(day=>A(SKIN_DAYS[day],'skin-step-day',{routine:r.id,step:step.id,day,pressed:(step.days||[]).includes(day)},'sc-day')).join('')}</div>`:''}`+
    (skinDone(r,step)?'<p class="sc-picker-note">Le produit déjà utilisé reste enregistré. Un remplacement vaut pour le prochain soin.</p>':'')+
    lgAct('Remplacer le produit','skin-replace-open',{routine:r.id,step:step.id},'refresh')+
    A('Retirer cette étape','skin-remove-step',{routine:r.id,step:step.id},'sc-remove-link'));
}
function skinPickerContext(){
  const pending=M.skinProductPicker;if(!pending)return {};
  const r=M.routines.find(r=>r.id===pending.routine&&r.domain==='Peau');if(!r)return {};
  const step=pending.step?skinSteps(r).find(step=>step.id===pending.step):null;
  if(pending.step&&!step)return {};
  const type=step?.type||pending.type;
  return SKIN_TYPES[type]?{r,step,type}:{};
}
function skinProductPicker(){
  skinState();const {r,step,type}=skinPickerContext();if(!r)return;
  const own=M.skinCareProducts.filter(product=>product.type===type),examples=SKIN_EXAMPLES.filter(product=>product.type===type);
  const option=product=>A(`${skinProductArt(type)}<span><strong>${esc(product.name)}</strong><small>${esc(product.example?'Exemple':product.brand||'Mon produit')}</small></span>${icon(step?.product?.id===product.id?'check':'chev')}`,'skin-product-select',{id:product.id},'sc-product-option');
  skinSheet(step?'Remplacer mon produit':'Choisir mon produit',`<p class="sc-picker-kind">${esc(SKIN_TYPES[type].category)}</p>`+
    A(icon('plus')+' J’ai un autre produit','skin-custom-open',{},'sc-own-product')+
    (own.length?`<h3>Mes produits</h3><div class="sc-product-options">${own.map(option).join('')}</div>`:'')+
    (examples.length?`<h3>Exemples de produits</h3><div class="sc-product-options">${examples.map(option).join('')}</div>`:'<p class="sc-instruction">Ajoutez le soin que vous utilisez déjà.</p>')+
    '<p class="sc-picker-note">Vérifiez la notice et la tolérance de votre produit.</p>'+
    A('Retour',step?'skin-picker-back':'skin-add-open',step?{}:{routine:r.id},'text-button'));
}
function skinChooseProduct(product){
  const {r,step,type}=skinPickerContext();if(!r||product.type!==type)return false;
  if(step?.product?.id===product.id){M.skinProductPicker=null;clearDrafts('skin-product');closeModal(false);render();return true;}
  const alreadyDone=step&&skinDone(r,step);
  if(step){step.product=clone(product);r.version++;}
  else{
    const entry={id:uid('skin-step'),type,title:SKIN_TYPES[type].title,instruction:SKIN_TYPES[type].instruction,product:clone(product),frequency:SKIN_TYPES[type].occasional||type==='remove'?'needed':'daily'};
    const steps=skinSteps(r),index=steps.findIndex(item=>SKIN_TYPES[item.type].rank>SKIN_TYPES[type].rank);
    steps.splice(index<0?steps.length:index,0,entry);r.steps=steps.map(item=>item.instruction);r.version++;
  }
  r.skinManaged=true;
  skinSyncToday(r);
  M.skinProductPicker=null;clearDrafts('skin-product');closeModal(false);render();toast(step?(alreadyDone?'Produit prévu pour le prochain soin.':'Produit remplacé.'):'Produit ajouté à votre routine.');return true;
}

V['ROU-01']=skinHub;
for(const id of ['ROU-02','ROU-04']){const fallback=id==='ROU-02'?SKIN_PREVIOUS.detail:SKIN_PREVIOUS.session;V[id]=()=>{const r=currentRoutine();if(r?.domain!=='Peau'||!['Matin','Soir'].includes(r.moment)||(id==='ROU-04'&&M.context.sessionDate&&M.context.sessionDate!==DATE()))return fallback();skinState();M.skinRoutineMoment=r.moment==='Soir'?'Soir':'Matin';M.skinRoutineIds||={};if(!skinRoutine(M.skinRoutineMoment))M.skinRoutineIds[M.skinRoutineMoment]=r.id;return skinHub();};}
ACTIONS['skin-open-routine']=data=>skinOpen(data.moment||'Matin',data.id);
ACTIONS['skin-moment']=data=>{if(!['Matin','Soir'].includes(data.value))return;M.skinRoutineMoment=data.value;M.skinRoutineEditing=false;if(route==='PEA-01')M.skinTab=data.value;if(['ROU-02','ROU-04'].includes(route))go('ROU-01',{replace:true});else render({scroll:0});};
ACTIONS['skin-routine-select']=data=>{const moment=data.moment==='Soir'?'Soir':'Matin';closeModal(false);skinOpen(moment);};
ACTIONS['skin-edit-mode']=()=>{M.skinRoutineEditing=!M.skinRoutineEditing;render();};
ACTIONS['skin-check-step']=data=>{const {r,step}=skinFind(data);if(!step)return;const ids=new Set(skinSteps(r).filter(item=>skinDone(r,item)).map(item=>item.id));if(ids.has(step.id))ids.delete(step.id);else ids.add(step.id);skinWriteChecks(r,ids);render();};
ACTIONS['skin-check-all']=data=>{const {r}=skinFind(data);if(!r)return;skinWriteChecks(r,new Set(skinCounted(r).map(step=>step.id)));render();toast('Votre routine est terminée.');};
ACTIONS['skin-step-frequency']=data=>{const {r,step}=skinFind(data);if(!step||!['daily','days','needed'].includes(data.value))return;step.frequency=data.value;if(data.value==='days'&&!step.days?.length)step.days=[new Date(DATE()+'T12:00:00').getDay()];r.version++;skinSyncToday(r);render();skinStepDetail(data);};
ACTIONS['skin-move-step']=data=>{const {r,step}=skinFind(data);if(!step||!['up','down'].includes(data.direction))return;const index=r.skinSteps.indexOf(step),target=index+(data.direction==='up'?-1:1);if(target<0||target>=r.skinSteps.length)return;[r.skinSteps[index],r.skinSteps[target]]=[r.skinSteps[target],r.skinSteps[index]];r.steps=r.skinSteps.map(step=>step.instruction);r.version++;skinSyncToday(r);render();};
ACTIONS['skin-step-detail']=skinStepDetail;
ACTIONS['skin-replace-open']=data=>{const {r,step}=skinFind(data);if(!step)return;M.skinProductPicker={routine:r.id,step:step.id};clearDrafts('skin-product');skinProductPicker();};
ACTIONS['skin-picker-back']=()=>{const {r,step}=skinPickerContext();if(step)skinStepDetail({routine:r.id,step:step.id});else closeModal();};
ACTIONS['skin-picker-show']=skinProductPicker;
ACTIONS['skin-product-select']=data=>{skinState();const product=[...M.skinCareProducts,...SKIN_EXAMPLES].find(product=>product.id===data.id);if(product)skinChooseProduct(product);};
ACTIONS['skin-custom-open']=()=>{const {r,type}=skinPickerContext();if(!r)return;skinSheet('Mon produit',`<p class="sc-picker-kind">${esc(SKIN_TYPES[type].category)}</p>`+form('skin-product',field('productName','Nom du produit','','text',true)+field('brand','Marque — facultatif'),'Utiliser ce produit')+A('Retour aux produits','skin-picker-show',{},'text-button'));};
F['skin-product']=data=>{
  skinState();const {r,type}=skinPickerContext();if(!r)return false;
  const name=String(data.productName||'').trim().slice(0,100),brand=String(data.brand||'').trim().slice(0,80);
  if(!name)return formError('Indiquez le nom du produit.');
  let product=M.skinCareProducts.find(product=>product.type===type&&fold(product.name)===fold(name)&&fold(product.brand)===fold(brand));
  if(!product){product={id:uid('skin-product'),type,name,brand,example:false};M.skinCareProducts.push(product);}
  return skinChooseProduct(product);
};
ACTIONS['skin-add-open']=data=>{const {r}=skinFind(data);if(!r)return;skinSheet('Ajouter un soin',`<div class="sc-add-types">${Object.entries(SKIN_TYPES).filter(([type])=>r.moment==='Matin'||type!=='protect').map(([type,meta])=>A(`${skinProductArt(type)}<strong>${meta.category}</strong>${icon('chev')}`,'skin-add-type',{routine:r.id,type},'sc-type-option')).join('')}</div>`);};
ACTIONS['skin-add-type']=data=>{const {r}=skinFind(data);if(!r||!SKIN_TYPES[data.type]||(r.moment==='Soir'&&data.type==='protect'))return;M.skinProductPicker={routine:r.id,type:data.type};clearDrafts('skin-product');skinProductPicker();};
ACTIONS['skin-remove-step']=data=>{const {r,step}=skinFind(data);if(!step)return;const index=r.skinSteps.indexOf(step);M.skinRemoved={routine:r.id,step:clone(step),index,done:skinDone(r,step),date:DATE()};r.skinSteps.splice(index,1);r.steps=r.skinSteps.map(step=>step.instruction);r.version++;skinSyncToday(r);closeModal(false);render();toast('Étape retirée.',{label:'Annuler',action:'skin-undo-remove'});};
ACTIONS['skin-undo-remove']=()=>{const removed=M.skinRemoved;if(!removed)return;const r=M.routines.find(r=>r.id===removed.routine);if(!r)return;const steps=skinSteps(r);if(!steps.some(step=>step.id===removed.step.id))steps.splice(Math.min(removed.index,steps.length),0,clone(removed.step));r.steps=steps.map(step=>step.instruction);r.version++;if(skinSession(r)){const ids=new Set(steps.filter(step=>skinDone(r,step)).map(step=>step.id));if(removed.done&&removed.date===DATE())ids.add(removed.step.id);skinWriteChecks(r,ids);}M.skinRemoved=null;render();toast('Étape rétablie.');};
ACTIONS['skin-own-routine']=()=>{
  skinState();const moment=M.skinRoutineMoment;if(skinRoutine(moment))return;
  const types=moment==='Matin'?['cleanse','moisturize','protect']:['cleanse','moisturize'];
  const r={id:uid('skin-routine'),name:'Ma routine du '+moment.toLowerCase(),domain:'Peau',moment,frequency:'Chaque jour',steps:types.map(type=>SKIN_TYPES[type].instruction),version:1,image:moment==='Matin'?'morning':'evening',type:'Routine',skinManaged:true};
  M.routines.push(r);M.active.push(r.id);M.schedules[r.id]={start:DATE(),days:[0,1,2,3,4,5,6]};M.skinRoutineIds||={};M.skinRoutineIds[moment]=r.id;render();
};
ACTIONS['skin-apply-plan']=data=>{
  if(!canonicalOwned()){go('PRE-01');return;}
  const record=data?.id?M.analyses.find(record=>record.id===data.id&&record.domain==='Peau'):lgLatest('Peau');
  if(data?.id&&!record?.skinPlan){toast('Cette routine n’est plus disponible.');return;}
  if(record){
    if(record.id===lgLatest('Peau')?.id)skinPrepareRoutine(record);
    if(record.id!==lgLatest('Peau')?.id||skinMissingSuggestions(record).length){skinReviewPlan({id:record.id});return;}
    skinOpen(data?.moment||'Matin');return;
  }
  if(skinRoutines().length){const moment=data?.moment||'Matin';if(!skinRoutine(moment)&&M.skinPlan)skinCreatePlanRoutine({skinPlan:M.skinPlan},moment);skinOpen(moment);return;}
  const plan=M.skinPlan;
  if(!uxApplySkinPlan(plan)){ACTIONS['studio-analysis']({domain:'Peau'});return;}
  skinRoutines().forEach(skinSteps);M.skinRoutineIds||={};
  for(const moment of ['Matin','Soir']){const r=M.routines.find(r=>r.id==='skin-plan-'+moment.toLowerCase());if(r)M.skinRoutineIds[moment]=r.id;}
  M.skinTab='Matin';skinOpen(data?.moment||'Matin');
};
ACTIONS['skin-view-report']=()=>{M.skinTab='Rapport';go('PEA-01');};
ACTIONS['skin-view-progress']=data=>{M.progressMoment=data?.moment||M.skinRoutineMoment;go('PRO-01');};
ACTIONS['skin-plan-enter']=data=>{const moment=data.moment||'Matin',r=skinRoutine(moment);if(r)skinOpen(moment,r.id);else ACTIONS['skin-apply-plan'](data);};

// The skin report points straight into the editable daily routine.
V['PEA-01']=()=>{
  if(['Matin','Soir'].includes(M.skinTab)){skinState();M.skinRoutineMoment=M.skinTab;return skinHub();}
  if(!M.skinProfile)return SKIN_PREVIOUS.skin();
  return lgPage(lgTitle('Votre peau')+lgCard(`<div class="sc-report-summary">${skinProductArt('moisturize')}<div><span class="eyebrow">Votre bilan</span><h2>${esc(M.skinProfile.goal||'Routine essentielle')}</h2></div></div>`,'sc-report-card')+
    `<div class="sc-report-moments">${['Matin','Soir'].map(moment=>A(`${lgBubble(moment==='Matin'?'sun':'moon')}<strong>${moment}</strong><small>${skinRoutine(moment)?'Mes produits et mes gestes':moment==='Matin'?'Nettoyer, hydrater et protéger':'Nettoyer et hydrater'}</small>${icon('chev')}`,'skin-plan-enter',{moment},'sc-report-moment')).join('')}</div>`+
    lgAct(skinRoutines().length?'Ouvrir ma routine':'Adopter ma routine','skin-plan-enter',{moment:skinRoutine('Matin')?'Matin':skinRoutine('Soir')?'Soir':'Matin'},'sun')+
    (lgLatest('Peau')?A('Voir mon bilan détaillé','lg-history-report-open',{domain:'Peau',id:lgLatest('Peau').id},'text-button lg-center-link'):'')+
    `<p class="sc-demo">Observation cosmétique, résultat illustratif.</p>`,'sc-report');
};
canonicalSkinPanel=function(tab,result){
  if(tab==='Bilan'&&result?.skinProfile&&result?.skinPlan){
    return skinScorePanel(result);
  }
  if(!['Matin','Soir'].includes(tab)||!result?.skinPlan)return SKIN_PREVIOUS.panel(tab,result);
  const latest=result.id===lgLatest('Peau')?.id;
  if(latest&&skinPrepareRoutine(result))persist();
  const r=skinRoutine(tab);
  if(latest&&r){
    const review=result.skinRoutineStatus==='review'&&skinMissingSuggestions(result).length;
    return `<div class="sc-live-report${M.skinRoutineEditing?' is-editing':''}"><div class="sc-title-row"><div><h1 tabindex="-1">Routine du ${tab.toLowerCase()}</h1></div>${A(M.skinRoutineEditing?'Terminer':'Modifier','skin-edit-mode',{},'text-button')}</div>`+
      (review?A('Revoir la proposition '+icon('chev'),'skin-review-plan',{id:result.id},'sc-review-banner'):'')+
      skinDailyBody(r)+`<div class="sc-bottom-links">${A('Mon suivi','skin-view-progress',{moment:tab},'text-button')}${A('Options','skin-routine-options',{routine:r.id},'text-button')}</div></div>`;
  }
  const instructions=skinPlanInstructions(result,tab).filter(instruction=>!skinIsAdvice(instruction));
  return `<div class="canonical-report-heading"><span class="eyebrow">${latest?'Routine conseillée':'Routine de cette analyse'}</span><h1 tabindex="-1">${tab==='Matin'?'Le matin':'Le soir'}</h1></div><div class="sc-report-preview">${instructions.map(instruction=>{const type=skinType(instruction);return `<div>${skinProductArt(type)}<span><strong>${SKIN_TYPES[type].title}</strong><small>${esc(SKIN_TYPES[type].hint)}</small></span></div>`;}).join('')}</div>`+
    (latest?lgAct('Revoir la proposition','skin-review-plan',{id:result.id},'plus'):lgAct('Ma routine actuelle','skin-open-routine',{moment:tab},tab==='Matin'?'sun':'moon'));
};

const SKIN_ACTIVATE_PREMIUM=uxActivatePremium;
uxActivatePremium=function(){SKIN_ACTIVATE_PREMIUM();skinPrepareRoutine(lgLatest('Peau'));};
const SKIN_BOOT=boot;
boot=function(){SKIN_BOOT();if(skinPrepareRoutine(lgLatest('Peau'))){persist();render();}};

// Home and the daily agenda open the selected routine directly.
function skinHomeCard(){
  skinState();const moment=['Matin','Soir'].includes(M.homeSkinMoment)?M.homeSkinMoment:new Date().getHours()>=17?'Soir':'Matin';
  const r=skinRoutine(moment),steps=r?skinTodaySteps(r):[];
  const daily=r?skinCounted(r):[];
  const done=daily.filter(step=>skinDone(r,step)).length;
  const tabs=`<div class="sc-moments" role="group" aria-label="Soins du jour">${['Matin','Soir'].map(value=>A(icon(value==='Matin'?'sun':'moon')+value,'skin-home-moment',{value,pressed:value===moment},'sc-moment '+(value===moment?'selected':''))).join('')}</div>`;
  const latest=lgLatest('Peau');
  const bilan=latest?A(`Bilan — ${esc(shortDate(latest.date))}`,'lg-history-report-open',{domain:'Peau',id:latest.id,label:'Ouvrir mon dernier bilan de peau'},'ux-home-bilan-link'):A('Faire mon bilan','studio-analysis',{domain:'Peau'},'ux-home-bilan-link');
  return lgCard(`<div class="ux-home-care-title"><div><h2>Ma peau</h2><small>Routine actuelle</small></div>${r?A('Gérer','skin-open-routine',{moment,id:r.id,label:'Gérer ma routine du '+moment.toLowerCase()},'text-button'):''}</div>`+tabs+
    (r?`<div class="ux-home-care-list">${steps.slice(0,3).map(step=>{const checked=skinDone(r,step);return `<div class="ux-home-care-row ${checked?'is-done':''}">${skinProductArt(step.type)}<span><strong>${esc((skinRecordedProduct(r,step)||skinProduct(step)).name)}</strong><small>${esc(step.title)}${!step.product?', Produit à choisir':step.product.example?', Exemple':''}${step.frequency==='needed'?', Au besoin':''}</small></span>${A(checked?icon('check'):'','skin-check-step',{routine:r.id,step:step.id,pressed:checked,label:(checked?'Décocher ':'Marquer fait : ')+skinProduct(step).name},'sc-step-check')}</div>`;}).join('')}</div>`+
      (daily.length?`<p class="ux-home-care-count" role="status"><span data-motion-key="home-care-${moment}" data-motion-value="${done}">${done}</span> / ${daily.length} soins faits</p>`:'')+
      (steps.length>3||!steps.length?A(steps.length?'Tous mes soins':'Ajouter un soin','skin-open-routine',{moment,id:r.id},'secondary'):''):
      `<p class="ux-home-care-empty">Votre routine du ${moment.toLowerCase()}, avec les produits que vous avez.</p>`+A(icon('plus')+' Ajouter mes produits','skin-home-create',{moment},'secondary'))+
    `<div class="ux-home-skin-footer"><span>${icon('refresh')} Synchronisée</span>${bilan}</div>`,'ux-home-care');
}
ACTIONS['skin-home-moment']=data=>{if(!['Matin','Soir'].includes(data.value))return;M.homeSkinMoment=data.value;render();};
ACTIONS['skin-home-create']=data=>{M.skinRoutineMoment=data.moment==='Soir'?'Soir':'Matin';ACTIONS['skin-own-routine']();const r=skinRoutine(M.skinRoutineMoment),step=r&&skinSteps(r)[0];if(step)ACTIONS['skin-replace-open']({routine:r.id,step:step.id});};
ACTIONS['task-open']=data=>{const action=findAction(data.id),r=action?.kind==='routine'?M.routines.find(r=>r.id===action.ref):null;if(r?.domain==='Peau'&&action.date===DATE())skinOpen(r.moment,r.id);else SKIN_PREVIOUS.task(data);};

const SKIN_VIEW_STATE=viewStateFor;
viewStateFor=id=>{const state=SKIN_VIEW_STATE(id);if(['ROU-01','ROU-02','ROU-04'].includes(id)){state.skinRoutineMoment=M.skinRoutineMoment;state.skinRoutineEditing=!!M.skinRoutineEditing;state.skinRoutineIds=clone(M.skinRoutineIds||{});}return state;};
const skinRoutineTitle=FLOW_INDEX.find(item=>item.id==='ROU-01');if(skinRoutineTitle)skinRoutineTitle.title='Ma routine';
