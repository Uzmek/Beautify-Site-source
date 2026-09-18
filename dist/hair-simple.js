'use strict';

// Hair-only presentation layer. The existing analysis, subscription, history,
// quota and simulation records remain the source of truth; this file only
// simplifies the routes and actions exposed to the customer.
const HAIR_SIMPLE_ANALYSIS_VIEW=V['ANA-09'];
const HAIR_SIMPLE_REPORT_VIEW=V['ANA-10'];
const HAIR_SIMPLE_GENERATION_VIEW=V['ESS-02'];
const HAIR_SIMPLE_LOOK_VIEW=V['ESS-03'];
const HAIR_SIMPLE_FINISH_ANALYSIS=ACTIONS['finish-analysis'];
const HAIR_SIMPLE_HISTORY_OPEN=ACTIONS['lg-history-report-open'];
const HAIR_SIMPLE_RESULT_OPEN=ACTIONS['result-open'];
const HAIR_SIMPLE_START_ANALYSIS=ACTIONS['studio-analysis'];
const HAIR_SIMPLE_GENERATE=ACTIONS['haircut-generate-confirm'];
const HAIR_SIMPLE_FINISH=ACTIONS['finish-haircut'];
const HAIR_SIMPLE_MODEL=ACTIONS['hair-model'];
const HAIR_SIMPLE_MODEL_AUTO=ACTIONS['hair-model-auto'];
let hairSimpleGenerationTimer=null;

function hairSimpleQueryVariant(){
  if(typeof location==='undefined'||typeof location.search!=='string'||typeof URLSearchParams!=='function')return '';
  const value=new URLSearchParams(location.search).get('hairVariant');
  return value&&value.toUpperCase()==='B'?'B':value&&value.toUpperCase()==='A'?'A':'';
}
M.hairPrepayVariant=['A','B'].includes(M.hairPrepayVariant)?M.hairPrepayVariant:(hairSimpleQueryVariant()||'A');

function hairSimpleLatestReport(){
  const current=report();
  return current?.domain==='Cheveux'?current:M.analyses.filter(x=>x.domain==='Cheveux'&&x.status==='complete').at(-1)||null;
}
function hairSimpleProfile(result=hairSimpleLatestReport()){
  return result?.hairProfile||result?.answers||M.hairProfile||{};
}
function hairSimpleFeature(profile){
  if(profile.volume)return String(profile.volume);
  if(profile.density)return String(profile.density);
  const texture=String(profile.texture||'').toLocaleLowerCase('fr');
  if(texture.includes('crép'))return 'Volume généreux';
  if(texture.includes('boucl'))return 'Boucles définies';
  if(texture.includes('ondul'))return 'Mouvement souple';
  if(texture.includes('raid'))return 'Ligne naturelle';
  return 'Mouvement naturel';
}
function hairSimpleCuts(result=hairSimpleLatestReport()){
  const profile=hairSimpleProfile(result);
  return STUDIO_HAIRCUTS.slice().sort((a,b)=>studioHairScore(b,profile)-studioHairScore(a,profile));
}
function hairSimpleTokens(result){
  const profile=hairSimpleProfile(result);
  const shape=String(result?.faceShape||profile.shape||'À préciser').replace(' — déclaré','');
  return `<div class="hair-simple-tokens" aria-label="Résumé de votre analyse">
    <div><small>Visage</small><strong>${esc(shape)}</strong></div>
    <div><small>Texture</small><strong>${esc(profile.texture||'À préciser')}</strong></div>
    <div><small>Caractéristique</small><strong>${esc(hairSimpleFeature(profile))}</strong></div>
  </div>`;
}
function hairSimpleReason(cut,result){
  const profile=hairSimpleProfile(result),shape=String(result?.faceShape||profile.shape||'').replace(' — déclaré','');
  if(cut.shapes?.includes(shape)&&cut.textures?.includes(profile.texture))return 'Équilibre votre visage et respecte votre texture.';
  if(cut.shapes?.includes(shape))return 'Accompagne naturellement les lignes de votre visage.';
  if(cut.textures?.includes(profile.texture))return 'Met en valeur le mouvement naturel de vos cheveux.';
  return cut.reason;
}
function hairSimpleCutImage(cut,record=null,large=false){
  if(record&&typeof hairTrialRecordTile==='function')return hairTrialRecordTile(cut,record);
  return studioHairTile(cut,large);
}
function hairSimpleRecommendation(cut,result,index){
  return A(`<span class="hair-simple-cut-art">${hairSimpleCutImage(cut)}</span><span class="hair-simple-cut-copy"><small>${index===0?'Notre sélection':'Recommandation '+(index+1)}</small><strong>${esc(cut.name)}</strong><p>${esc(hairSimpleReason(cut,result))}</p></span>`,'hair-simple-cut',{id:cut.id,analysis:result?.id||'',label:'Voir '+cut.name},'hair-simple-recommendation'+(index===0?' is-best':''));
}
function hairSimpleSecondaryActions(result){
  return `<div class="hair-simple-secondary-actions">
    ${A('Voir les autres coupes','hair-simple-catalog',{analysis:result?.id||''},'text-button')}
    ${A('Comprendre mon analyse','hair-simple-understand',{analysis:result?.id||''},'text-button')}
  </div>`;
}
function hairSimpleAnalysisResult(result){
  const cuts=hairSimpleCuts(result).slice(0,3);
  return beautyPage(`<main class="hair-simple-result canonical-report-panel">
    <header class="hair-simple-heading"><span>Analyse cheveux</span><h1 tabindex="-1">Les coupes faites pour vous.</h1><p>Trois directions simples, classées à partir de votre photo.</p></header>
    ${hairSimpleTokens(result)}
    <section class="hair-simple-recommendations" aria-label="Vos recommandations">${cuts.map((cut,index)=>hairSimpleRecommendation(cut,result,index)).join('')}</section>
    ${hairSimpleSecondaryActions(result)}
    <div class="hair-simple-report-actions">${A('Historique','lg-history-domain',{domain:'Cheveux'},'beauty-button is-secondary')}${A('Nouvelle analyse','hair-start-analysis',{},'beauty-button is-secondary')}</div>
  </main>`,'hair-simple-shell hair-simple-analysis');
}

function hairSimpleDevSwitch(){
  if(typeof paywallDevMode==='function'&&!paywallDevMode())return '';
  const selected=M.hairPrepayVariant==='B'?'B':'A';
  return `<aside class="hair-simple-dev" aria-label="Variante Hair avant le paywall"><span>DEV · avant paywall</span>${['A','B'].map(value=>A(value,'hair-prepay-variant',{value,pressed:value===selected,label:'Afficher la variante '+value},value===selected?'is-active':'')).join('')}</aside>`;
}
function hairSimpleLockedCut(cut){
  return `<div class="hair-prepay-locked-cut"><span>${hairSimpleCutImage(cut)}</span><strong>${esc(cut.name)}</strong>${icon('lock')}</div>`;
}
function hairSimplePrepayA(result){
  const cuts=hairSimpleCuts(result).slice(0,6),best=cuts[0];
  return beautyPage(`<main class="hair-prepay hair-prepay-a">
    <header class="hair-simple-heading"><span>Votre analyse est prête</span><h1 tabindex="-1">Une première coupe se révèle.</h1></header>
    ${hairSimpleTokens(result)}
    <section class="hair-prepay-proof" aria-label="Première recommandation">
      <span class="hair-simple-cut-art">${hairSimpleCutImage(best)}</span>
      <div><small>Votre meilleure correspondance</small><h2>${esc(best.name)}</h2><p>${esc(hairSimpleReason(best,result))}</p></div>
    </section>
    <section class="hair-prepay-locked" aria-label="Cinq autres coupes verrouillées">${cuts.slice(1).map(hairSimpleLockedCut).join('')}</section>
    ${A('Voir les 6 coupes et essayer sur ma photo','hair-prepay-unlock',{id:result.id},'beauty-button is-copper hair-prepay-cta')}
    ${B('Plus tard','SAV-01','text-button hair-prepay-later')}
    ${hairSimpleDevSwitch()}
  </main>`,'hair-simple-shell hair-prepay-shell');
}
function hairSimpleUserPhoto(result){
  return canonicalHasPhoto(result?.photo)?imageFor(result.photo,'hair-prepay-user-photo','Votre photo utilisée pour cette analyse'):beautyPortrait(result,'hair-prepay-user-photo');
}
function hairSimplePrepayB(result){
  const cuts=hairSimpleCuts(result).slice(0,6),best=cuts[0];
  return beautyPage(`<main class="hair-prepay hair-prepay-b">
    <header class="hair-simple-heading"><span>Votre analyse est prête</span><h1 tabindex="-1">6 coupes adaptées à ton visage</h1></header>
    ${A(`<span class="hair-prepay-photo-base">${hairSimpleUserPhoto(result)}</span><span class="hair-prepay-hair-overlay">${hairSimpleCutImage(best)}</span><span class="hair-prepay-own-photo">Votre photo</span><span class="hair-prepay-reveal">${icon('lock')} Afficher le look</span>`,'hair-prepay-unlock',{id:result.id,label:'Afficher mon résultat'},'hair-prepay-look')}
    <section class="hair-prepay-miniatures" aria-label="Autres looks verrouillés">${cuts.slice(1).map(cut=>A(`<span>${hairSimpleCutImage(cut)}</span>${icon('lock')}`,'hair-prepay-unlock',{id:result.id,label:'Débloquer '+cut.name},'hair-prepay-mini')).join('')}</section>
    ${A('Afficher mon résultat et débloquer 10 essais','hair-prepay-unlock',{id:result.id},'beauty-button is-copper hair-prepay-cta')}
    ${B('Plus tard','SAV-01','text-button hair-prepay-later')}
    ${hairSimpleDevSwitch()}
  </main>`,'hair-simple-shell hair-prepay-shell');
}
function hairSimpleFreeReveal(result){return M.hairPrepayVariant==='B'?hairSimplePrepayB(result):hairSimplePrepayA(result);}

function hairSimpleLatestLooks(){return M.simulations.filter(x=>x.domain==='Cheveux'&&x.haircut).slice().reverse();}
function hairSimpleHome(){
  const result=hairSimpleLatestReport(),looks=hairSimpleLatestLooks(),draft=M.haircutDraft;
  if(draft){
    const cut=STUDIO_HAIRCUTS.find(x=>x.id===draft.haircut);
    return beautyPage(`<main class="hair-simple-home"><header class="hair-simple-heading"><span>Hair</span><h1 tabindex="-1">Continuez là où vous vous êtes arrêtée.</h1></header><section class="hair-home-resume"><span>${cut?hairSimpleCutImage(cut):icon('hair')}</span><div><small>Essai en cours</small><h2>${esc(cut?.name||'Votre prochaine coupe')}</h2><p>Votre coupe est conservée. Nous redemanderons votre photo si nécessaire.</p></div></section>${A('Continuer mon essai','hair-simple-resume',{},'beauty-button is-copper')}${A('Nouvelle analyse','hair-start-analysis',{},'text-button hair-home-secondary')}</main>`,'hair-simple-shell');
  }
  if(!result){
    return beautyPage(`<main class="hair-simple-home hair-home-empty"><div class="hair-home-hero">${imageFor('hair-butterfly-v2','','Portrait Hair Beautify')}</div><header class="hair-simple-heading"><span>Hair</span><h1 tabindex="-1">Votre prochaine coupe commence ici.</h1><p>Une photo pour découvrir les coupes qui vous mettent en valeur.</p></header>${A('Analyser mes cheveux','hair-start-analysis',{},'beauty-button is-copper')}</main>`,'hair-simple-shell');
  }
  if(looks.length){
    const latest=looks[0],cut=STUDIO_HAIRCUTS.find(x=>x.id===latest.haircut);
    return beautyPage(`<main class="hair-simple-home hair-home-looks"><header class="hair-simple-heading"><span>Hair</span><h1 tabindex="-1">Votre dernier look.</h1></header><section class="hair-home-last-look"><span>${cut?hairSimpleCutImage(cut,latest):icon('hair')}</span><div><small>Dernier essai</small><h2>${esc(cut?.name||latest.name||'Votre look')}</h2><p>${cut?esc(hairSimpleReason(cut,result)):'Retrouvez votre résultat.'}</p></div></section>${A('Essayer une autre coupe','hair-simple-catalog',{analysis:result.id},'beauty-button is-copper')}<section class="hair-home-previous"><header><h2>Mes looks</h2></header><div>${looks.map(item=>{const itemCut=STUDIO_HAIRCUTS.find(x=>x.id===item.haircut);return A(`<span>${itemCut?hairSimpleCutImage(itemCut,item):icon('hair')}</span><strong>${esc(itemCut?.name||item.name||'Look')}</strong>`,'hair-simple-look',{id:item.id},'hair-home-look');}).join('')}</div></section>${A('Nouvelle analyse','hair-start-analysis',{},'text-button hair-home-secondary')}</main>`,'hair-simple-shell');
  }
  const cuts=hairSimpleCuts(result).slice(0,3);
  return beautyPage(`<main class="hair-simple-home hair-home-ready"><header class="hair-simple-heading"><span>Votre dernière analyse</span><h1 tabindex="-1">Vos meilleures coupes.</h1></header>${hairSimpleTokens(result)}<section class="hair-home-suggestions">${cuts.map((cut,index)=>hairSimpleRecommendation(cut,result,index)).join('')}</section>${A('Essayer une coupe','hair-simple-cut',{id:cuts[0]?.id||'',analysis:result.id},'beauty-button is-copper')}${hairSimpleSecondaryActions(result)}${A('Nouvelle analyse','hair-start-analysis',{},'text-button hair-home-secondary')}</main>`,'hair-simple-shell');
}

function hairSimpleCatalogue(){
  const result=hairSimpleLatestReport(),filter=M.hairSimpleCatalogFilter||'Pour moi';
  let cuts=hairSimpleCuts(result);
  if(filter!=='Pour moi'&&filter!=='Toutes')cuts=cuts.filter(cut=>cut.length===filter);
  if(filter==='Pour moi')cuts=cuts.slice(0,6);
  return beautyPage(`<main class="hair-simple-catalogue"><header class="hair-simple-heading"><span>Catalogue</span><h1 tabindex="-1">Toutes les coupes.</h1><p>Votre analyse sert de point de départ, vous gardez le dernier mot.</p></header><div class="hair-simple-catalogue-filters" role="group" aria-label="Filtrer les coupes">${['Pour moi','Toutes','Très court','Court','Mi-long','Long'].map(value=>A(value,'hair-simple-filter',{value,pressed:value===filter},value===filter?'is-active':'')).join('')}</div><section class="hair-simple-catalogue-grid" aria-label="Coupes disponibles">${cuts.map(cut=>A(`<span>${hairSimpleCutImage(cut)}</span><strong>${esc(cut.name)}</strong><small>${esc(cut.length)}</small>`,'hair-simple-cut',{id:cut.id,analysis:result?.id||'',label:'Voir '+cut.name},'hair-simple-catalogue-card')).join('')}</section></main>`,'hair-simple-shell hair-simple-catalogue-shell');
}

function hairSimpleModelControls(){
  if(typeof HAIR_MODELS==='undefined')return '';
  const active=hairActiveModel();
  return `<details class="hair-cut-model"><summary>Changer le portrait de référence</summary><p>Ce choix change seulement l’aperçu catalogue, jamais votre classement.</p><div>${HAIR_MODELS.map(model=>A(`<span><img src="/assets/hair-models-v2/${model.id}/lob-soft.webp" alt="" width="48" height="48"></span><strong>${esc(model.name)}</strong>`,'hair-simple-model',{id:model.id,pressed:model.id===active.id},model.id===active.id?'is-active':'')).join('')}</div>${A('Suggestion automatique','hair-simple-model-auto',{},'text-button')}</details>`;
}
function hairSimpleCutPage(){
  const cut=STUDIO_HAIRCUTS.find(x=>x.id===M.haircutSelected),result=M.haircutAnalysis?M.analyses.find(x=>x.id===M.haircutAnalysis&&x.domain==='Cheveux'):hairSimpleLatestReport();
  if(!cut)return beautyPage(`<main class="hair-simple-empty"><h1>Choisissez une coupe</h1>${A('Voir les coupes','hair-simple-catalog',{},'beauty-button is-copper')}</main>`,'hair-simple-shell');
  const textures=cut.textures.join(', '),effect=cut.reason.split('.')[0]+'.';
  return beautyPage(`<main class="hair-simple-cut-page"><div class="hair-cut-visual">${hairSimpleCutImage(cut,null,true)}</div><header class="hair-simple-heading"><span>Votre coupe</span><h1 tabindex="-1">${esc(cut.name)}</h1></header><section class="hair-cut-facts"><div><small>Pourquoi elle fonctionne</small><strong>${esc(hairSimpleReason(cut,result))}</strong></div><div><small>Textures adaptées</small><strong>${esc(textures)}</strong></div><div><small>Longueur et effet</small><strong>${esc(cut.length)} · ${esc(effect)}</strong></div></section><section class="hair-salon-card"><span>${icon('scissors')}</span><div><small>Consigne salon</small><h2>À montrer à votre coiffeur</h2><p>${esc(cut.salon)}</p></div>${A('Copier','hair-salon-copy',{id:cut.id},'hair-salon-copy')}</section>${hairSimpleModelControls()}${A('Essayer sur ma photo','haircut-simulate',{id:cut.id,analysis:result?.id||''},'beauty-button is-copper hair-cut-try')}${A('Voir une autre coupe','hair-simple-catalog',{analysis:result?.id||''},'text-button')}</main>`,'hair-simple-shell hair-simple-cut-shell');
}

function hairSimpleScheduleGeneration(){
  clearTimeout(hairSimpleGenerationTimer);
  const draft=M.haircutDraft;
  if(!draft||['error','offline','pending','refused','unavailable'].includes(M.scenario))return;
  hairSimpleGenerationTimer=setTimeout(()=>{
    if(route==='ESS-02'&&M.haircutDraft===draft)ACTIONS['finish-haircut']();
  },1800);
}
function hairSimpleGenerationView(){
  const draft=M.haircutDraft,cut=STUDIO_HAIRCUTS.find(x=>x.id===draft?.haircut);
  if(!draft||!cut)return HAIR_SIMPLE_GENERATION_VIEW();
  if(['error','offline','pending','refused','unavailable'].includes(M.scenario)){
    return beautyPage(`<main class="hair-generation-error"><span>${icon('refresh')}</span><h1 tabindex="-1">L’essai n’a pas abouti.</h1><p>Rien n’a été consommé. Votre coupe et votre photo sont conservées.</p>${A('Réessayer','hair-generation-retry',{},'beauty-button is-copper')}${A('Retour à la coupe','hair-generation-back',{},'text-button')}</main>`,'hair-simple-shell hair-generation-shell');
  }
  hairSimpleScheduleGeneration();
  return beautyPage(`<main class="hair-generation"><div class="hair-generation-orb"><span>${hairSimpleCutImage(cut)}</span><i></i><i></i></div><span class="eyebrow">Beautify Hair</span><h1 tabindex="-1">Votre look se crée.</h1><p>Nous adaptons ${esc(cut.name)} à votre photo.</p><div class="hair-generation-progress" aria-label="Génération en cours"><i></i><i></i><i></i></div></main>`,'hair-simple-shell hair-generation-shell');
}

function hairSimpleLookResult(){
  const record=M.simulations.find(x=>x.id===M.context.simulation),cut=STUDIO_HAIRCUTS.find(x=>x.id===record?.haircut);
  if(!record||!cut)return HAIR_SIMPLE_LOOK_VIEW();
  const visual=record.resultImage?imageFor(record.resultImage,'','Votre résultat coiffure'):hairSimpleCutImage(cut,record,true);
  return beautyPage(`<main class="hair-look-result"><header class="hair-simple-heading"><span>Votre nouveau look</span><h1 tabindex="-1">${esc(cut.name)}</h1></header><div class="hair-look-visual">${visual}</div><section class="hair-salon-card hair-salon-result"><span>${icon('scissors')}</span><div><small>Consigne salon</small><h2>Montrez ceci à votre coiffeur</h2><p>${esc(cut.salon)}</p><div class="hair-salon-actions">${A('Copier','hair-salon-copy',{id:cut.id},'hair-salon-action')}${A('Partager','hair-salon-share',{id:cut.id},'hair-salon-action')}</div></div></section>${A('Essayer une autre coupe','hair-simple-catalog',{analysis:M.haircutAnalysis||''},'beauty-button is-copper')}${A('Voir tous mes looks','saved-hair-sims',{},'text-button')}</main>`,'hair-simple-shell hair-look-shell');
}

V['HAI-01']=hairSimpleHome;
V['HAI-02']=hairSimpleCatalogue;
V['HAI-03']=hairSimpleCutPage;
V['ESS-02']=hairSimpleGenerationView;
V['ESS-03']=hairSimpleLookResult;
V['ANA-09']=()=>{
  const result=report();
  if(result?.domain!=='Cheveux')return HAIR_SIMPLE_ANALYSIS_VIEW();
  return canonicalOwned()?hairSimpleAnalysisResult(result):hairSimpleFreeReveal(result);
};
V['ANA-10']=()=>{
  const result=report();
  if(result?.domain!=='Cheveux')return HAIR_SIMPLE_REPORT_VIEW();
  return canonicalOwned()?hairSimpleAnalysisResult(result):hairSimpleFreeReveal(result);
};
V['ANA-11']=V['ANA-10'];

ACTIONS['finish-analysis']=()=>{
  const hair=M.draft.domain==='Cheveux';
  HAIR_SIMPLE_FINISH_ANALYSIS();
  if(!hair||M.draft.status!=='complete'||canonicalOwned())return;
  const result=M.analyses.find(x=>x.id===M.draft.reportId&&x.domain==='Cheveux');
  if(!result)return;
  M.context.analysis=result.id;M.premiumIntent=null;M.premiumReturnState=null;M.context.returnTo='SAV-01';
  go('ANA-09',{replace:true,context:{analysis:result.id}});
};
ACTIONS['lg-history-report-open']=data=>{
  if(data.domain!=='Cheveux'||canonicalOwned()){HAIR_SIMPLE_HISTORY_OPEN(data);return;}
  const result=M.analyses.find(x=>x.id===data.id&&x.domain==='Cheveux'&&x.status==='complete');
  if(!result){toast('Cette analyse n’est plus disponible.');return;}
  M.context.analysis=result.id;M.canonicalReportStep=0;go('ANA-09',{context:{analysis:result.id}});
};
ACTIONS['result-open']=data=>{
  if(data.domain!=='Cheveux'||canonicalOwned()){HAIR_SIMPLE_RESULT_OPEN(data);return;}
  const result=M.analyses.filter(x=>x.domain==='Cheveux'&&x.status==='complete').at(-1);
  if(!result){go('HAI-01');return;}
  M.context.analysis=result.id;go('ANA-09',{context:{analysis:result.id}});
};
ACTIONS['studio-analysis']=data=>{
  if(data.domain==='Cheveux'&&!hairSimpleLatestReport()&&!['HAI-01','ANA-04','ANA-06','ANA-08'].includes(route)){go('HAI-01');return;}
  HAIR_SIMPLE_START_ANALYSIS(data);
};
ACTIONS['hair-start-analysis']=()=>HAIR_SIMPLE_START_ANALYSIS({domain:'Cheveux'});

ACTIONS['hair-prepay-variant']=data=>{
  if(!['A','B'].includes(data.value))return;
  M.hairPrepayVariant=data.value;persist();render({focus:true,scroll:0});
};
ACTIONS['hair-prepay-unlock']=data=>{
  const result=M.analyses.find(x=>x.id===data.id&&x.domain==='Cheveux')||hairSimpleLatestReport();
  if(!result)return;
  M.context.analysis=result.id;M.premiumIntent={kind:'report',id:result.id};go('PRE-01');
};
ACTIONS['hair-simple-understand']=data=>{
  const result=M.analyses.find(x=>x.id===data.analysis&&x.domain==='Cheveux')||hairSimpleLatestReport();
  if(!result)return;
  const profile=hairSimpleProfile(result),shape=String(result.faceShape||profile.shape||'À préciser').replace(' — déclaré','');
  modal('Comprendre mon analyse',`<div class="hair-understand"><div>${hairSimpleTokens(result)}</div><p><strong>Pourquoi ce classement ?</strong><br>Beautify compare les lignes de votre visage, votre texture et votre longueur avec les coupes du catalogue.</p><p><strong>À garder en tête</strong><br>Évitez surtout les lignes trop rigides et adaptez le volume ou la frange avec votre coiffeur.</p><small>Repères observés : ${esc(shape)}, ${esc(profile.texture||'texture à préciser')}.</small></div>`+A('Compris','close',{},'beauty-button is-copper'));
};
ACTIONS['hair-simple-cut']=data=>{
  const cut=STUDIO_HAIRCUTS.find(x=>x.id===data.id);if(!cut)return;
  const analysis=data.analysis||hairSimpleLatestReport()?.id||'';
  M.haircutSelected=cut.id;M.haircutAnalysis=analysis;go('HAI-03',{context:{analysis}});
};
ACTIONS['haircut-open']=data=>ACTIONS['hair-simple-cut'](data);
ACTIONS['hair-carousel-details']=data=>ACTIONS['hair-simple-cut'](data);
ACTIONS['hair-carousel-select']=data=>ACTIONS['hair-simple-cut'](data);
ACTIONS['hair-trial-select']=data=>ACTIONS['hair-simple-cut']({...data,analysis:data.analysis||hairSimpleLatestReport()?.id||''});
ACTIONS['hair-simple-catalog']=data=>{
  if(data.analysis)M.haircutAnalysis=data.analysis;
  M.hairSimpleCatalogFilter='Pour moi';go('HAI-02');
};
ACTIONS['hair-more']=()=>ACTIONS['hair-simple-catalog']({analysis:hairSimpleLatestReport()?.id||''});
ACTIONS['lg-hair-catalog']=ACTIONS['hair-more'];
ACTIONS['hair-simple-filter']=data=>{
  if(!['Pour moi','Toutes','Très court','Court','Mi-long','Long'].includes(data.value))return;
  M.hairSimpleCatalogFilter=data.value;render({focus:false,scroll:0});
};
ACTIONS['hair-simple-model']=data=>{HAIR_SIMPLE_MODEL(data);};
ACTIONS['hair-simple-model-auto']=()=>{HAIR_SIMPLE_MODEL_AUTO();};
ACTIONS['haircut-simulate']=data=>{
  const cut=STUDIO_HAIRCUTS.find(x=>x.id===data.id);if(!cut)return;
  const analysis=data.analysis===undefined?(M.haircutAnalysis||''):data.analysis;
  if(analysis&&!M.analyses.some(x=>x.id===analysis&&x.domain==='Cheveux'))return;
  if((M.haircutAnalysis||'')!==analysis)M.simulationPhoto='';
  M.haircutSelected=cut.id;M.haircutAnalysis=analysis;studioEnsure();
  if(!studioRemaining()){uxQuotaBlocked({kind:'haircut',id:cut.id,analysis,photo:M.simulationPhoto});return;}
  if(!canonicalHasPhoto(M.simulationPhoto))M.simulationPhoto='';
  if(!M.simulationPhoto)M.simulationPhoto=uxHaircutAnalysisPhoto(analysis);
  if(!canonicalHasPhoto(M.simulationPhoto)){
    modal('Ajouter votre photo',`<p>Une photo de face, nette et sans filtre suffit pour créer ce look.</p>${A(icon('camera')+'<span>Choisir ma photo</span>','file-pick',{purpose:'simulation'},'beauty-button is-copper')}${A('Retour à la coupe','close',{},'text-button')}`);return;
  }
  closeModal(false);HAIR_SIMPLE_GENERATE({id:cut.id,analysis});
  if(M.haircutDraft){M.haircutDraft.analysis=analysis;persist();render({focus:true,scroll:0});}
};
ACTIONS['finish-haircut']=()=>{
  if(M.haircutDraft&&['error','offline','pending','refused','unavailable'].includes(M.scenario)){clearTimeout(hairSimpleGenerationTimer);render({focus:true,scroll:0});return;}
  HAIR_SIMPLE_FINISH();
};
ACTIONS['hair-generation-retry']=()=>{M.scenario='normal';closeModal(false);render({focus:true,scroll:0});};
ACTIONS['canonical-retry-haircut']=ACTIONS['hair-generation-retry'];
ACTIONS['hair-generation-back']=()=>{
  clearTimeout(hairSimpleGenerationTimer);M.scenario='normal';
  const draft=M.haircutDraft;if(draft){M.haircutSelected=draft.haircut;M.haircutAnalysis=draft.analysis||M.haircutAnalysis||'';}
  go('HAI-03',{replace:true});
};
ACTIONS['hair-simple-resume']=()=>{
  const draft=M.haircutDraft;if(!draft)return render();
  M.haircutSelected=draft.haircut;M.haircutAnalysis=draft.analysis||M.haircutAnalysis||'';
  if(!canonicalHasPhoto(draft.source)){
    M.haircutDraft=null;M.simulationPhoto='';go('HAI-03');toast('Ajoutez à nouveau votre photo pour continuer.');return;
  }
  M.simulationPhoto=draft.source;go('ESS-02');
};
ACTIONS['hair-trial-resume']=ACTIONS['hair-simple-resume'];
ACTIONS['hair-simple-look']=data=>{
  if(!M.simulations.some(x=>x.id===data.id&&x.domain==='Cheveux'))return;
  go('ESS-03',{context:{simulation:data.id}});
};
ACTIONS['hair-trial-open']=ACTIONS['hair-simple-look'];
ACTIONS['saved-hair-sims']=()=>{go('HAI-01');};
ACTIONS['hair-salon-copy']=data=>{
  const cut=STUDIO_HAIRCUTS.find(x=>x.id===data.id);if(!cut)return;
  if(typeof navigator!=='undefined'&&navigator.clipboard?.writeText)navigator.clipboard.writeText(cut.salon).catch(()=>{});
  toast('Consigne salon copiée.');
};
ACTIONS['hair-salon-share']=data=>{
  const cut=STUDIO_HAIRCUTS.find(x=>x.id===data.id);if(!cut)return;
  const text=cut.name+' — '+cut.salon;
  if(typeof navigator!=='undefined'&&navigator.share)navigator.share({title:'Mon look Beautify',text}).catch(()=>{});
  else ACTIONS['hair-salon-copy'](data);
};
