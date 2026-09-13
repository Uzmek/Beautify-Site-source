'use strict';

// Shared destinations and navigation affordances for the V1 customer paths.
function experiencePending(){return M.draft.status!=='complete'&&!!(M.draft.photo||Object.keys(M.draft.answers||{}).length);}
function experienceResume(){return '';}

V['ACC-01']=()=>{
  const ready=M.analyses.some(record=>record.status==='complete'||record.status==='partial');
  const analyses=lgCard(`${lgBubble('bars','lg-result-badge')}<span class="eyebrow">Cheveux, couleurs et peau</span><h2>${ready?'Vos analyses':'Votre première analyse'}</h2>`+
      (ready?lgGo('Voir mes analyses','SAV-01','bars'):lgGo('Nouvelle analyse','ANA-01','sparkles')),'lg-home-result ux-home-analyses');
  const firstVisit=!ready&&!skinRoutines().length;
  return lgPage(lgTitle(M.profile.name?'Bonjour, '+esc(M.profile.name):'Bonjour à vous','AUJOURD’HUI')+experienceResume()+(firstVisit?analyses+skinHomeCard():skinHomeCard()+analyses)+`<div class="lg-home-links">${B(icon('trend')+'<span>Mon suivi</span>','PRO-01','text-button')}</div>`,'lg-home ux-direct-home');
};
delete V['SAV-01'];
const retiredAnalysesIndex=FLOW_INDEX.findIndex(page=>page.id==='SAV-01');
if(retiredAnalysesIndex>=0)FLOW_INDEX.splice(retiredAnalysesIndex,1);

// A catalogue remains beneath its detail sheet; closing a cut no longer loses it.
FLOW_INDEX.push({id:'HAI-02',title:'Catalogue de coupes',kind:'P',nature:'Choix d’une coupe'},{id:'ESS-04',title:'Mes essais coiffure',kind:'P',nature:'Historique des essais'});
V['HAI-02']=()=>lgPage(lgTitle('Catalogue de coupes')+`<div class="ux-quota">${icon('sparkles')}<strong>${studioRemaining()} essai${studioRemaining()>1?'s':''} disponible${studioRemaining()>1?'s':''}</strong></div>`+
  chips(['Toutes','Très court','Court','Mi-long','Long'],'hairLengthFilter',M.hairLengthFilter||'Toutes')+
  studioHairList(false)+A('Mes essais coiffure','saved-hair-sims',{},'text-button lg-center-link'),'ux-hair-catalog');
ACTIONS['hair-more']=()=>{M.hairLengthFilter='Toutes';go('HAI-02');};
ACTIONS['saved-hair-sims']=()=>go('ESS-04');
V['ESS-04']=()=>lgPage(lgTitle('Mes essais coiffure')+
  (M.simulations.length?`<div class="result-simulation-grid">${M.simulations.slice().reverse().map(calmSimulationCard).join('')}</div>`:
    lgCard(`<div class="lg-empty-art">${lgModuleArt('Essais')}</div><h2>Votre premier essai</h2><p>Choisissez une coupe, puis ajoutez votre photo.</p>`,'lg-empty'))+
  lgAct(M.simulations.length?'Essayer une autre coupe':'Choisir une coupe','hair-more',{},'sparkles')+`<p class="ux-small-note">Vos essais apparaissent ici automatiquement.</p>`,'ux-simulations');
const EXPERIENCE_SIMULATION=V['ESS-03'];
V['ESS-03']=()=>EXPERIENCE_SIMULATION().replace(/data-go="SAV-01"/g,'data-go="ESS-04"').replaceAll('Tous mes résultats','Tous mes essais').replaceAll('Mes résultats','Mes essais').replaceAll('Ma simulation','Mon essai coiffure');
const EXPERIENCE_TRYON=ACTIONS['haircut-simulate'];
ACTIONS['haircut-simulate']=data=>{EXPERIENCE_TRYON(data);const overlay=document.getElementById('overlay');if(overlay.innerHTML.includes('Préparer ma simulation')){overlay.innerHTML=overlay.innerHTML.replace('Préparer ma simulation','Préparer mon essai').replace('Annuler</button>', 'Fermer</button>').replace('</section>',A('Revoir cette coupe','haircut-open',{id:data.id,analysis:data.analysis},'text-button lg-center-link')+'</section>');overlay.querySelector('button')?.focus();}};

// Reports expose their sections by name and retain their selected page on return.
const EXPERIENCE_REPORT=canonicalReport;
canonicalReport=function(){const r=report();return (r?`<div class="ux-report-context"><span>${r.domain==='Colorimétrie'?'Couleurs':esc(r.domain)}</span><time datetime="${esc(r.date)}">${esc(shortDate(r.date))}</time></div>`:'')+EXPERIENCE_REPORT();};
V['ANA-10']=canonicalReport;V['ANA-11']=canonicalReport;
const EXPERIENCE_HISTORY=V['ANA-12'];
V['ANA-12']=()=>{
  if(!['Cheveux','Colorimétrie','Peau'].includes(M.historyDomain))return lgPage(lgTitle('Mes analyses')+['Cheveux','Colorimétrie','Peau'].map(domain=>A(`${lgModuleArt(domain)}<span><strong>${domain==='Colorimétrie'?'Couleurs':domain}</strong><small>${lgDomainAnalyses(domain).length} analyse${lgDomainAnalyses(domain).length>1?'s':''}</small></span>${icon('chev')}`,'lg-history-domain',{domain},'ux-domain-row')).join(''),'ux-history-hub');
  return EXPERIENCE_HISTORY();
};
ACTIONS['result-open']=data=>{if(['Cheveux','Colorimétrie','Peau'].includes(data.domain))ACTIONS['lg-results-domain'](data);};
ACTIONS['lg-history-domain']=data=>{if(!['Cheveux','Colorimétrie','Peau'].includes(data.domain))return;M.historyDomain=data.domain;go('ANA-12');};

// Colour applications stay focused on colour, without extra upcoming modules.
function experienceColorUses(s){return lgCard(`<h2>Hauts & accessoires</h2>${canonicalColorGrid(s.colors.slice(0,6))}`,'ux-colour-use')+
  lgCard(`<h2>Bases & pantalons</h2>${canonicalColorGrid(s.neutrals)}`,'ux-colour-use')+
  lgCard(`<h2>Cheveux</h2><div class="ux-colour-names">${s.hair.best.map(name=>`<span>${esc(name)}</span>`).join('')}</div>`,'ux-colour-use')+
  (s.metals?lgCard(`<h2>Métaux</h2><p>${esc(Array.isArray(s.metals)?s.metals.join(', '):s.metals)}</p>`,'ux-colour-use'):'');}
const EXPERIENCE_COLOR=V['COL-01'];
V['COL-01']=()=>{
  if(!M.lgColorApplications&&!M.previewSeason)return EXPERIENCE_COLOR();
  const s=COLOR12_SEASONS[M.previewSeason||M.colorProfile?.season];
  if(!s)return lgNoResult('Colorimétrie','Vos couleurs');
  const preview=!!M.previewSeason;
  return lgPage(lgTitle(preview?(lgSeasonNames[M.previewSeason]||s.name):'Porter mes couleurs',preview?'Aperçu : votre profil reste inchangé':'')+
    experienceColorUses(s)+
    A('Revenir à mon profil couleur','lg-color-close',{},'secondary'),'ux-colour-applications');
};

// The daily routine and its history use the same morning/evening vocabulary.
function experienceSessions(moment){
  const list=M.sessions.filter(s=>s.kind==='routine'&&(s.skinMoment||M.routines.find(r=>r.id===s.ref)?.moment)===moment&&(s.confirmed||s.steps?.some(value=>value!=='todo'))).slice().sort((a,b)=>b.date.localeCompare(a.date));
  return list.length?list.map(s=>A(`<span><strong>${esc(s.name||'Ma routine du '+moment.toLowerCase())}</strong><small>${dateText(s.date)}, ${sessionComplete(s)?'Réalisée':'Partielle'}</small></span>${icon('chev')}`,'session-detail',{id:s.id},'glass list-row journal-entry')).join(''):'<p class="ux-small-note">Vos séances du '+moment.toLowerCase()+' apparaîtront ici.</p>';
}
V['PRO-01']=()=>{
  const moment=M.progressMoment==='Soir'?'Soir':'Matin';
  const dates=Array.from({length:7},(_,i)=>addDays(DATE(),i-6));
  const days=dates.map(date=>({date,done:M.sessions.some(s=>s.kind==='routine'&&s.date===date&&sessionComplete(s)&&(s.skinMoment||M.routines.find(r=>r.id===s.ref)?.moment)===moment)}));
  const count=days.filter(day=>day.done).length;
  const notes=M.observations.slice().sort((a,b)=>b.date.localeCompare(a.date));
  const tab=M.lgJournal?'Journal':'Routines';
  return lgPage(lgTitle('Mon suivi')+chips(['Routines','Journal'],'experienceProgressTab',tab)+
    (tab==='Journal'?lgAct('Ajouter une note','journal-new',{},'edit')+(notes.length?notes.map(note=>A(`<span><time>${esc(dateText(note.date))}</time><strong>${esc(note.feeling||'Mon observation')}</strong><small>${esc(note.note||'Photo enregistrée')}</small></span>${icon('chev')}`,'journal-open',{id:note.id},'ux-journal-row')).join(''):lgCard('<h2>Votre premier repère</h2><p>Une note, un ressenti ou une photo.</p>','ux-journal-empty'))+(notes.length>=2?B('Comparer deux observations','PRO-02','text-button lg-center-link'):''):
      chips(['Matin','Soir'],'progressMoment',moment)+lgCard(`<div class="lg-progress-summary"><span>Ces 7 derniers jours</span><strong>${count} / 7</strong></div><div class="lg-week">${days.map(day=>`<div class="${day.done?'done':''}" aria-label="${dateText(day.date)} : ${day.done?'routine terminée':'non terminée'}"><span class="lg-bubble">${day.done?icon('check'):''}</span><small>${new Date(day.date+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'short'}).slice(0,3)}</small></div>`).join('')}</div>`,'lg-streak-card')+
      lgAct('Ma routine du '+moment.toLowerCase(),'skin-open-routine',{moment},moment==='Soir'?'moon':'sun')+
      `<details class="ux-details"><summary>Mes séances du ${moment.toLowerCase()}</summary>${experienceSessions(moment)}</details>`+
      B('Mes habitudes','PRO-04','text-button lg-center-link')),'lg-progress ux-progress');
};
const EXPERIENCE_CHOICE=ACTIONS.choice;
ACTIONS.choice=data=>{if(data.key==='experienceProgressTab'){M.lgJournal=data.value==='Journal';M.compareMode='Observations';render({scroll:0});return;}if(['compareMode','compareDomain'].includes(data.key)){M[data.key]=data.value;M.comparison=null;M.compareFirst=null;M.compareSecond=null;clearDrafts('compare');render({scroll:0});return;}EXPERIENCE_CHOICE(data);};
const EXPERIENCE_OBSERVATION=F.observation;
F.observation=data=>{const result=EXPERIENCE_OBSERVATION(data);if(result!==false){M.lgJournal=true;render();}return result;};
const EXPERIENCE_JOURNAL_NEW=ACTIONS['journal-new'];
ACTIONS['journal-new']=()=>{M.lgJournal=true;EXPERIENCE_JOURNAL_NEW();};

V['PRO-02']=()=>{
  M.compareMode='Observations';
  const list=M.observations.slice().sort((a,b)=>a.date.localeCompare(b.date));
  const options=list.map(x=>({value:x.id,label:dateText(x.date)+', '+(x.feeling||'Observation')+(x.note?', '+x.note.slice(0,34):'')}));
  const first=list.find(x=>x.id===M.compareFirst)?.id||list[0]?.id;
  const second=list.find(x=>x.id===M.compareSecond&&x.id!==first)?.id||list.findLast(x=>x.id!==first)?.id;
  return head('Comparer deux observations')+
    (list.length<2?panel('<h2>Encore un peu tôt</h2><p>Il faut deux observations pour les comparer.</p>'+A('Ajouter une note','journal-new')):
      form('compare',select('first','Premier moment',options,first)+select('second','Second moment',options,second),'Comparer')+comparisonContent(list));
};
const EXPERIENCE_COMPARISON=comparisonContent;
comparisonContent=list=>{
  if(M.compareMode!=='Analyses')return EXPERIENCE_COMPARISON(list);
  const records=(M.comparison||[]).map(id=>list.find(record=>record.id===id));if(records.length!==2||records.some(record=>!record))return '';
  return `<div class="comparison ux-analysis-comparison">${records.map(record=>`<section>${record.photo?imageFor(record.photo,'','Photo de cette analyse'):''}<time>${dateText(record.date)}</time><h2>${esc(canonicalTeaser(record).value)}</h2>${canonicalOwned()?P(esc((record.findings||[]).join(', '))):''}${A(canonicalOwned()?'Ouvrir le rapport':'Voir mon aperçu','lg-history-report-open',{domain:record.domain,id:record.id},'secondary')}</section>`).join('')}</div>`;
};

// Settings labels describe the actual destination; support answers match the V1.
V['PRF-03']=()=>head('Mes préférences','Les centres d’intérêt de votre espace.')+chips(['Cheveux','Colorimétrie','Peau'],'interests',(M.preferenceEdit||M.prefs).interests)+
  form('preferences','<p class="ux-small-note">Les analyses utilisent votre photo. Ces préférences ne modifient pas vos rapports.</p>','Enregistrer')+A('Retirer mes préférences','clear-prefs-request',{},'text-button lg-center-link');
V['PRF-10']=()=>head('Aide')+`<div class="faq">${[
 ['Où retrouver mon analyse ?','Ouvrez Analyses, choisissez Cheveux, Couleurs ou Peau, puis Historique pour retrouver vos résultats. Nouvelle analyse lance une nouvelle photo.'],
 ['Que se passe-t-il si je quitte une analyse ?','L’analyse est annulée. Lancez une nouvelle analyse et attendez les 15 secondes complètes.'],
 ['Où sont mes essais coiffure ?','Dans Analyses → Essais coiffure IA. Chaque essai est ajouté automatiquement.'],
 ['Comment changer un produit ?','Ouvrez Ma routine depuis l’accueil, choisissez Matin ou Soir, touchez le soin, puis Remplacer le produit.'],
 ['Ai-je besoin d’un compte ?','Vous pouvez parcourir la démo sans compte. Les données restent dans cet onglet ; aucune synchronisation réelle n’est active.'],
 ['Les analyses et achats sont-ils réels ?','Ce site est un mockup : les résultats et les essais sont illustratifs, les produits proposés sont des exemples et aucun paiement réel n’est effectué.'],
 ['Pourquoi ma photo a disparu ?','Les photos importées restent en mémoire de la page. Après un rechargement, sélectionnez-les à nouveau. Vos textes restent dans la session de cet onglet.']
 ].map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>`+
 `<details class="ux-details"><summary>Une autre question</summary>${form('support',select('topic','Sujet',['Photo','Analyse','Routine','Essai coiffure','Abonnement','Compte','Données'],'Routine')+area('message','Votre question'),'Prévisualiser ma demande')}<p class="ux-small-note">Demande simulée, aucun message envoyé.</p></details>`;
V['PRF-08']=()=>head('Gérer mes données')+form('data',select('operation','Que souhaitez-vous faire ?',['Exporter','Retirer'],'Exporter')+['Profil','Préférences','Photos','Rapports','Essais','Suivi','Routines',...(M.saved.length||M.collections.length?['Enregistrés']:[]),...(M.clothes.length||M.outfits.length?['Dressing']:[]),...(M.orders.length?['Commandes']:[])].map(key=>check('data'+key,key==='Routines'?'Routines et produits':key==='Essais'?'Essais coiffure':key,false)).join(''),'Vérifier ma sélection')+`<p class="ux-small-note">Les images ne sont pas incluses dans l’export.</p>`;
dataInventory=()=>[
 ['Profil',M.profile.name?'Renseigné':'Facultatif'],['Photos',Object.keys(memoryPhotos).length+' photos importées'],
 ['Rapports',M.analyses.length+' analyses'],['Essais coiffure',M.simulations.length+' essais'],
 ['Routines et produits',M.routines.length+' routines, '+(M.skinCareProducts||[]).length+' produits personnels'],
 ['Suivi',M.observations.length+' notes, '+M.sessions.length+' séances']
].map(([title,value])=>`<div class="data-check"><strong>${title}</strong><p>${value}</p></div>`).join('');
const EXPERIENCE_ACCOUNT=V['ENT-05'];
V['ENT-05']=()=>EXPERIENCE_ACCOUNT().replace('Sauvegarder mes données','Compte facultatif').replace('Facultatif : seulement pour les retrouver sur un autre appareil.','Parcours de démonstration.').replace(/<div class="account-benefits">[\s\S]*?<\/div>/,'').replace('Activer la synchronisation','Créer le compte démo');
const EXPERIENCE_EDIT_PROFILE=V['PRF-02'];
V['PRF-02']=()=>EXPERIENCE_EDIT_PROFILE().replace('Activer la synchronisation','Compte facultatif');
const EXPERIENCE_SUBSCRIPTION=V['PRF-06'];
V['PRF-06']=()=>EXPERIENCE_SUBSCRIPTION().replace('Ouvrir Hair Studio','Mes essais coiffure').replace('data-go="HAI-01"','data-go="ESS-04"').replace('pour découvrir Hair Studio','pour essayer une coupe');

const EXPERIENCE_ROUTE_GROUPS=[
 ['Les trois repères',['ACC-01','SAV-01','PRF-01']],
 ['Nouvelle analyse',['ENT-02','ANA-01','ANA-04','ANA-06','ANA-08','ANA-09','ANA-10','ANA-12']],
 ['Essais coiffure',['HAI-02','ESS-01','ESS-02','ESS-03','ESS-04']],
 ['Routine et suivi',['ROU-01','ROU-02','ROU-03','ROU-04','PRO-01','PRO-02','PRO-03','PRO-04','PRO-05','PRO-06']],
 ['Profil, données et abonnement',FLOW_INDEX.filter(page=>/^(PRF-|PRE-|ENT-0[5-8])/.test(page.id)&&page.id!=='PRF-01').map(page=>page.id)]
];
ACTIONS.explorer=()=>{
  const current=new Set(EXPERIENCE_ROUTE_GROUPS.flatMap(([,ids])=>ids));
  const links=ids=>ids.map(id=>{const page=FLOW_INDEX.find(page=>page.id===id);return page?B(`<small>${id}</small><span>${esc(page.title.split(' / ')[0])}</span>`,id,'flow-link '+(id===route?'selected':'')):'';}).join('');
  modal('Revoir les parcours',`<input class="explorer-search" type="search" placeholder="Rechercher une page…" aria-label="Rechercher un parcours"><div class="flow-explorer">${EXPERIENCE_ROUTE_GROUPS.map(([title,ids])=>`<details><summary>${title}</summary>${links(ids)}</details>`).join('')}<details><summary>Écrans secondaires et anciens aperçus</summary><p>Hors des accès principaux de la V1. Les anciennes entrées redirigent vers le parcours actuel.</p>${links(FLOW_INDEX.filter(page=>!current.has(page.id)).map(page=>page.id))}</details></div>`);
};

const EXPERIENCE_STATE=viewStateFor;
viewStateFor=id=>{
  const state=EXPERIENCE_STATE(id),keys=/^ANA-(09|10|11)$/.test(id)?['canonicalReportStep']:id==='HAI-02'?['hairLengthFilter']:id==='PRO-01'?['progressMoment','lgJournal']:id==='PRO-02'?['compareDomain']:[];
  keys.forEach(key=>state[key]=M[key]??null);return state;
};
// All secondary forms share the same branded header and visible back control.
for(const id of Object.keys(V)){
  const original=V[id];V[id]=()=>{const html=original();return /class="lg-page(?: |")/.test(html)?html:lgPage(html,'ux-secondary');};
}
for(const [id,title] of Object.entries({'PRO-01':'Mon suivi','PRO-03':'Mon journal','PRF-03':'Mes préférences','PRF-04':'Réglages','ESS-03':'Mon essai coiffure','ENT-05':'Compte facultatif','ENT-03':'Choisir une analyse','ANA-02':'Choisir une analyse'})){const page=FLOW_INDEX.find(page=>page.id===id);if(page)page.title=title;}
