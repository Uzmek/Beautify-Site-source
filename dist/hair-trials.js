'use strict';

// Natural hair-only artwork, shared by recommendations, catalogue and try-on previews.
const HAIR_TRIAL_ART_IDS=['lob-soft','bob','cascade','curly-shag','pixie-soft','butterfly','crop-soft','rounded-curls','long-waves','french-bob','shag-soft','sleek-long'];
STUDIO_HAIRCUTS.forEach(c=>{if(HAIR_TRIAL_ART_IDS.includes(c.id))c.image='/assets/tryon/'+c.id+'-cutout.png';});
// Hair analysis and try-on credits are separate; browsing never consumes an attempt.
const HAIR_TRIAL_TABS=canonicalReportTabs;
canonicalReportTabs=function(domain,result){const tabs=HAIR_TRIAL_TABS(domain,result);return domain==='Cheveux'?[...tabs,'Essais']:tabs;};
const HAIR_TRIAL_PANEL=canonicalHairPanel;
canonicalHairPanel=function(tab,r){return tab==='Essais'?hairTrialsHub():HAIR_TRIAL_PANEL(tab,r);};
function hairTrialReport(){const r=report();return r?.domain==='Cheveux'?r:M.analyses.filter(x=>x.domain==='Cheveux'&&x.status==='complete').at(-1);}
function hairTrialRecords(){return M.simulations.filter(x=>x.domain==='Cheveux'&&x.haircut).slice().reverse();}
function hairTrialCount(){const n=studioRemaining();return n+' essai'+(n===1?'':'s')+' restant'+(n===1?'':'s')+' sur '+M.hairGenerations.limit;}
function hairTrialsEntry(){return A(icon('sparkles')+'<span>Mes essais coiffure</span><strong class="hair-trials-count">'+studioRemaining()+'/'+M.hairGenerations.limit+'</strong>'+icon('chev'),'saved-hair-sims',{},'hair-report-row hair-trials-entry');}
function hairTrialQuotaPill(){return A('<strong>'+studioRemaining()+'</strong><span>/ '+M.hairGenerations.limit+'</span>'+icon('sparkles'),'hair-trial-quota',{label:hairTrialCount()+', détails du quota'},'hair-trial-quota-pill');}
function hairTrialTitle(title){return '<header class="hair-trial-title"><h1 tabindex="-1">'+esc(title)+'</h1>'+hairTrialQuotaPill()+'</header>';}
ACTIONS['hair-trial-quota']=()=>{studioEnsure();modal('Vos essais coiffure','<div class="hair-trial-quota-detail"><h3>'+hairTrialCount()+'</h3><p>'+M.hairGenerations.limit+' essai'+(M.hairGenerations.limit===1?'':'s')+' par période. Renouvellement le '+esc(dateText(M.hairGenerations.reset))+'.</p><p>Un essai est décompté seulement si le résultat aboutit. Consulter vos coupes et vos anciens essais ne consomme rien.</p></div>'+A('Compris','close',{},'beauty-button is-copper'));};
function hairTrialsHub(){
 const remaining=studioRemaining(),records=hairTrialRecords(),pages=Math.max(1,Math.ceil(records.length/4)),page=Math.min(Math.max(0,Number(M.hairTrialsPage)||0),pages-1);
 const suggestions=hairReportCuts(hairTrialReport()||{}).slice(0,4);
 return '<div class="hair-trials-hub">'+hairTrialTitle('Mes essais')+
 (M.haircutDraft?A('Reprendre mon essai '+icon('chev'),'hair-trial-resume',{},'hair-report-row'):'')+
 '<section class="hair-trials-library" aria-label="'+(records.length?'Mes essais enregistrés':'Coupes à essayer')+'">'+
 (records.length?'':'<div class="hair-trial-gallery-label">À essayer</div>')+'<div class="hair-trials-grid">'+
 (records.length?records.slice(page*4,page*4+4).map(x=>{const cut=STUDIO_HAIRCUTS.find(c=>c.id===x.haircut);return A('<span class="hair-trials-thumb">'+(x.resultImage?imageFor(x.resultImage,'','Résultat de votre essai'):cut?hairTrialRecordTile(cut,x):icon('hair'))+'</span><span class="hair-trial-card-caption"><strong>'+esc(cut?.name||x.name)+'</strong>'+icon('chev')+'</span>','hair-trial-open',{id:x.id},'hair-trials-card');}):
 suggestions.map(c=>A('<span class="hair-trials-thumb">'+studioHairTile(c)+'</span><span class="hair-trial-card-caption"><strong>'+esc(c.name)+'</strong>'+icon('plus')+'</span>','hair-trial-select',{id:c.id},'hair-trials-card'))).join('')+'</div>'+
 (pages>1?'<div class="hair-trials-pagination">'+(page?A(icon('back'),'hair-trials-page',{page:page-1,label:'Essais précédents'},'hair-report-link'):'<span></span>')+'<span>'+ (page+1)+' / '+pages+'</span>'+(page<pages-1?A(icon('arrow'),'hair-trials-page',{page:page+1,label:'Essais suivants'},'hair-report-link'):'<span></span>')+'</div>':'')+'</section>'+
 '<div class="hair-trials-bottom">'+(remaining?A(icon('plus')+'<span>Essayer une coupe</span>','hair-trial-choose',{},'beauty-button is-copper'):uxIsPremium()?'<p>Nouveaux essais le '+esc(dateText(M.hairGenerations.reset))+'.</p>':A('Débloquer 10 essais','hair-trial-upgrade',{},'beauty-button is-copper'))+'</div></div>';
}
ACTIONS['saved-hair-sims']=()=>{closeModal(false);M.hairTrialsPage=0;const r=hairTrialReport();if(r&&canonicalOwned()){M.context.analysis=r.id;M.canonicalReportStep=canonicalReportTabs('Cheveux',r).indexOf('Essais');go('HAI-01');}else go('ESS-04');};
V['ESS-04']=()=>beautyPage(hairTrialsHub(),'hair-report hair-trials-page');
ACTIONS['hair-trials-page']=d=>{M.hairTrialsPage=Math.max(0,Number(d.page)||0);render();};
ACTIONS['hair-trial-choose']=()=>{if(!studioRemaining())return ACTIONS['saved-hair-sims']();M.hairTrialChoosing=true;M.hairLengthFilter='Toutes';go('HAI-02');};
const HAIR_TRIAL_MORE=ACTIONS['hair-more'];
ACTIONS['hair-more']=()=>{M.hairTrialChoosing=false;HAIR_TRIAL_MORE();};
ACTIONS['hair-trial-select']=d=>ACTIONS['haircut-simulate']({id:d.id,analysis:hairTrialReport()?.id||''});
ACTIONS['hair-trial-upgrade']=()=>{M.premiumIntent=null;go('PRE-01');};
FLOW_INDEX.push({id:'HAI-03',title:'Préparer mon essai coiffure',kind:'P',nature:'Coupe et photo avant création'});
ACTIONS['haircut-simulate']=d=>{
 const cut=STUDIO_HAIRCUTS.find(c=>c.id===d.id);if(!cut)return;
 const analysis=d.analysis||'';
 if(analysis&&!M.analyses.some(r=>r.id===analysis&&r.domain==='Cheveux'))return;
 if((M.haircutAnalysis||'')!==analysis)M.simulationPhoto='';
 M.haircutAnalysis=analysis;M.haircutSelected=cut.id;M.hairTrialChoosing=false;
 if(!canonicalHasPhoto(M.simulationPhoto))M.simulationPhoto='';
 // Reuse only this report's photo; never silently use a different historical report.
 if(!M.simulationPhoto)M.simulationPhoto=uxHaircutAnalysisPhoto(analysis);
 if(!studioRemaining()){uxQuotaBlocked({kind:'haircut',id:cut.id,analysis,photo:M.simulationPhoto});return;}
 closeModal(false);if(route==='HAI-03')render();else go('HAI-03');
};
function hairTrialPrepare(){
 const cut=STUDIO_HAIRCUTS.find(c=>c.id===M.haircutSelected);
 if(!cut)return beautyPage(hairTrialTitle('Votre coupe')+A('Voir les coupes','hair-trial-choose',{},'beauty-button is-copper'),'hair-report');
 const ready=canonicalHasPhoto(M.simulationPhoto),remaining=studioRemaining();
 return beautyPage('<div class="hair-trial-prepare">'+hairTrialTitle('Votre essai')+
 '<div class="hair-trial-composition"><section class="hair-trial-chosen"><span class="hair-trial-large-art">'+studioHairTile(cut)+'</span><div><strong>'+esc(cut.name)+'</strong>'+A('Changer','hair-trial-choose',{label:'Changer la coupe'},'hair-report-link')+'</div></section>'+
 '<section class="hair-trial-photo"><span>'+(ready?imageFor(M.simulationPhoto,'','Votre photo pour cet essai'):icon('camera'))+'</span><strong>Votre photo</strong>'+A(ready?'Changer':'Ajouter','file-pick',{purpose:'simulation',label:ready?'Changer la photo':'Ajouter ma photo'},'hair-report-link')+'</section></div>'+
 '<div class="hair-trials-bottom">'+(remaining?(ready?A('<span>Créer mon essai</span><small>1 essai</small>','hair-trial-create',{id:cut.id,label:'Créer mon essai'},'beauty-button is-copper hair-trial-create'):A(icon('camera')+'<span>Ajouter ma photo</span>','file-pick',{purpose:'simulation'},'beauty-button is-copper')):A('Voir mes essais','saved-hair-sims',{},'beauty-button is-secondary'))+
 '<small class="hair-trial-demo">Démo, photo non transformée.</small></div></div>','hair-report');
}
V['HAI-03']=hairTrialPrepare;
ACTIONS['hair-trial-create']=d=>{
 if(route!=='HAI-03'||d.id!==M.haircutSelected)return;
 if(!canonicalHasPhoto(M.simulationPhoto))return render();
 if(!studioRemaining())return ACTIONS['saved-hair-sims']();
 ACTIONS['haircut-generate-confirm']({id:d.id,analysis:M.haircutAnalysis||''});
 // The current prototype completes its reference preview immediately. The production
 // renderer can replace finish-haircut; credit is committed only on success.
 if(route==='ESS-02')ACTIONS['finish-haircut']();
};
ACTIONS['hair-trial-resume']=()=>{const d=M.haircutDraft;if(!d)return ACTIONS['saved-hair-sims']();M.simulationPhoto=d.source;ACTIONS['haircut-simulate']({id:d.haircut,analysis:M.haircutAnalysis||''});};
ACTIONS['hair-trial-open']=d=>{if(!hairTrialRecords().some(x=>x.id===d.id))return;go('ESS-03',{context:{simulation:d.id}});};
V['ESS-02']=()=>beautyPage(hairReportHeading('Votre essai est conservé','Reprenez quand vous êtes prête.')+A('Reprendre mon essai','hair-trial-resume',{},'beauty-button is-copper')+A('Retour à mes essais','saved-hair-sims',{},'hair-report-link'),'hair-report');
const HAIR_TRIAL_RESULT=V['ESS-03'];
V['ESS-03']=()=>{
 const x=hairTrialRecords().find(x=>x.id===M.context.simulation),cut=STUDIO_HAIRCUTS.find(c=>c.id===x?.haircut);if(!x||!cut)return HAIR_TRIAL_RESULT();
 return beautyPage('<div class="hair-trial-result">'+hairTrialTitle(cut.name)+
 '<div class="hair-trial-result-art">'+(x.resultImage?imageFor(x.resultImage,'','Votre essai coiffure'):hairTrialRecordTile(cut,x))+'<span class="hair-trial-saved">'+icon('check')+'Enregistré</span></div>'+
 '<div class="hair-trial-result-tools">'+A('Conseil au salon','hair-trial-salon',{id:cut.id},'hair-report-row')+A('Ma photo','hair-trial-photo',{id:x.id},'hair-report-row')+'</div>'+
 '<div class="hair-trials-bottom">'+A('Mes essais','saved-hair-sims',{},'beauty-button is-copper')+(!x.resultImage?'<small class="hair-trial-demo">Démo, photo non transformée.</small>':'')+'</div></div>','hair-report');
};
ACTIONS['hair-trial-salon']=d=>{const c=STUDIO_HAIRCUTS.find(x=>x.id===d.id);if(c)modal('À montrer au salon','<h3>'+esc(c.name)+'</h3><p>'+esc(c.salon)+'</p>'+A('Fermer','close',{},'beauty-button is-secondary'));};
ACTIONS['hair-trial-photo']=d=>{const x=hairTrialRecords().find(x=>x.id===d.id);if(x)modal('Votre photo',x.source?imageFor(x.source,'article-photo','Photo utilisée pour cet essai'):'<p>Photo à sélectionner à nouveau.</p>');};
