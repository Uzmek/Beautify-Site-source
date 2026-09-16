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

// Profile V1 uses the real routes, with explicit local-data and demo states.
function profileAccessLabel(){
  return ({free:'Accès découverte',active:'Beautify Plus · Actif',cancelled:'Beautify Plus · Renouvellement désactivé',pending:'Activation en attente',failed:'Activation non confirmée',expired:'Accès expiré'})[M.subscription.status]||'Statut indisponible';
}
function profileDocumentLinks(){
  return `<footer class="ux-profile-documents" aria-label="Informations Beautify">${[['À propos','À propos'],['Confidentialité','Données'],['Conditions','Abonnement'],['Crédits','Crédits']].map(([label,document])=>B(label,'PRF-11','text-button',{document})).join('')}</footer>`;
}
const EXPERIENCE_PROFILE_GUARD=canonicalRouteGuard;
canonicalRouteGuard=id=>EXPERIENCE_PROFILE_GUARD(['PRF-03','PRF-04'].includes(id)?'PRF-01':id==='PRF-08'?'PRF-07':id);
for(const id of ['PRF-03','PRF-04','PRF-08']){const index=FLOW_INDEX.findIndex(page=>page.id===id);if(index>=0)FLOW_INDEX.splice(index,1);}
V['PRF-05']=()=>{
  const settings=M.formDrafts[draftKey('reminders')]||M.reminders;
  return lgPage(lgTitle('Rappel des routines')+
    form('reminders',check('routine','Rappel quotidien',settings.routine)+`<div class="ux-profile-reminder-time"${settings.routine?'':' hidden'}>`+field('routineTime','Heure du rappel',settings.routineTime||M.reminders.routineTime||'08:00','time').replace('<input ','<input '+(settings.routine?'':'disabled '))+'</div>','Enregistrer')+
    `<p class="ux-small-note">Pour toutes vos routines.</p>`,'ux-profile-screen');
};
document.addEventListener('change',event=>{
  if(!event.target.matches('form[data-form="reminders"] input[name="routine"]'))return;
  const time=event.target.form.elements.namedItem('routineTime');if(time)time.disabled=!event.target.checked;
  time?.closest('.ux-profile-reminder-time')?.toggleAttribute('hidden',!event.target.checked);
});
function profileActionRow(title,subtitle,action,glyph,data={},disabled=false){
  const button=A(`${lgBubble(glyph)}<span class="lg-row-copy"><strong>${esc(title)}</strong><small>${esc(subtitle)}</small></span>${icon('chev')}`,action,{...data,label:title},'lg-row ux-profile-action-row');
  return disabled?button.replace('<button ','<button disabled '):button;
}
V['PRF-07']=()=>{
  const count=Object.keys(memoryPhotos).length;
  return lgPage(lgTitle('Photos et données')+
    lgCard(profileActionRow('Exporter mes données','Fichier JSON, sans les images','profile-export','bars')+
      profileActionRow('Supprimer mes photos',count?count+' photo'+(count>1?'s':'')+' importée'+(count>1?'s':'')+' · Analyses conservées':'Aucune photo importée en mémoire','profile-remove-photos','image',{},!count)+
      profileActionRow('Tout supprimer','Données locales et profil','profile-delete-open','shield'),'ux-profile-action-list')+
    A('Où sont conservées mes données ?','profile-data-details',{},'text-button ux-profile-details')+
    B('Informations et confidentialité','PRF-11','text-button ux-profile-details',{document:'Données'}),'ux-profile-screen ux-profile-data-screen');
};
V['PRF-08']=()=>V['PRF-07']();
V['PRF-09']=()=>lgPage(lgTitle('Tout supprimer','Cette action est irréversible.')+
  lgCard(`<h2>${esc(M.profile.connected&&M.profile.email?M.profile.email:M.profile.name||'Sans compte')}</h2><p>Efface vos photos, analyses, essais, routines et autres données de ce navigateur. Vous serez déconnecté.</p><p>Cette suppression locale ne résilie pas votre abonnement.</p>`,'ux-profile-delete-summary')+
  A('Exporter avant de supprimer','profile-export',{},'secondary')+
  form('delete-account',field('confirmation','Écrivez SUPPRIMER pour confirmer','','text',true),'Supprimer définitivement')+
  B('Annuler','PRF-07','text-button ux-profile-details'),'ux-profile-screen ux-profile-delete');
const PROFILE_HELP_TOPICS={
  photo:{title:'Ma photo ne s’importe pas',glyph:'image',text:'Vérifiez que le fichier choisi est bien une image, puis réessayez l’import. Si le problème persiste, décrivez-le dans une demande de contact.',label:'Signaler le problème',action:'profile-contact-open'},
  analyse:{title:'Mon analyse ne s’affiche pas',glyph:'bars',text:'Si l’analyse a été interrompue, relancez-la depuis le module concerné. Si un résultat enregistré ne s’ouvre plus, signalez le problème.',label:'Signaler le problème',action:'profile-contact-open'},
  acces:{title:'Mon accès Plus n’est pas reconnu',glyph:'crown',text:'Une activation en attente ne donne pas encore accès à Plus. Si vous aviez déjà un accès, essayez de le restaurer.',label:'Restaurer mon accès',to:'PRE-04'}
};
V['PRF-10']=()=>lgPage(lgTitle('Aide et contact')+
  lgAct('Nous contacter','profile-contact-open',{},'help','ux-help-contact-button')+
  `<h2 class="ux-help-section-title">Un problème ?</h2>`+
  lgCard(Object.entries(PROFILE_HELP_TOPICS).map(([id,topic])=>A(`${lgBubble(topic.glyph)}<span class="lg-row-copy"><strong>${esc(topic.title)}</strong></span>${icon('chev')}`,'profile-help-open',{id,label:topic.title},'lg-row ux-help-row')).join(''),'ux-help-topics')+
  B('Informations et confidentialité','PRF-11','text-button ux-help-documents',{document:'Données'}),'ux-help-v2 ux-profile-screen');
function profileHelpSheet(title,body){
  modal(title,`<div class="ux-help-sheet">${body}</div>`);
  const sheet=document.querySelector('#overlay .modal');
  sheet.classList.add('ux-help-modal');
  sheet.querySelector('.close')?.setAttribute('aria-label','Fermer');
}
Object.assign(ACTIONS,{
  'profile-help-open':data=>{
    const topic=PROFILE_HELP_TOPICS[data.id];if(!topic)return;
    const steps=topic.steps?`<ol class="ux-help-steps">${topic.steps.map((step,index)=>`<li><span class="ux-help-number" aria-hidden="true">${index+1}</span><span>${esc(step)}</span></li>`).join('')}</ol>`:'';
    const facts=topic.facts?`<div class="ux-help-facts">${topic.facts.map(([title,text])=>`<div><strong>${esc(title)}</strong><p>${esc(text)}</p></div>`).join('')}</div>`:'';
    profileHelpSheet(topic.title,steps+facts+(topic.text?P(esc(topic.text)):'')+A(topic.label,'profile-help-shortcut',{id:data.id},'primary')+(data.id==='acces'?A('Nous contacter','profile-contact-open',{},'text-button ux-help-sheet-documents'):''));
  },
  'profile-help-shortcut':data=>{
    const topic=PROFILE_HELP_TOPICS[data.id];if(!topic)return;
    if(topic.to)go(topic.to);else ACTIONS[topic.action]?.();
  },
  'profile-contact-open':()=>{
    captureDrafts();closeModal(false);
    profileHelpSheet('Nous contacter',form('support','<label class="field"><span>Votre message</span><textarea name="message" rows="4" maxlength="2000" required placeholder="Comment pouvons-nous vous aider ?"></textarea></label>','Enregistrer ma demande'));
  }
});
const PROFILE_DOCUMENT_COPY={
  'À propos':'Beautify by UZMEK réunit vos analyses cheveux, couleurs et peau, vos essais coiffure et vos routines. Le maquillage, la garde-robe et les tutoriels sont à venir.',
  Données:'Votre profil, vos textes, vos produits et vos routines sont conservés dans ce navigateur sur cet appareil, si son stockage est disponible. Les photos importées restent en mémoire de la page et disparaissent au rechargement.<br><br>La recherche de produits transmet le nom recherché ou le code-barres à Open Beauty Facts. Les photos du scanner sont lues sur votre appareil.<br><br>Vous pouvez exporter vos données ou les supprimer depuis Photos et données. Les images ne sont pas incluses dans l’export.',
  Abonnement:'Consultez votre statut et vos essais disponibles depuis Mon accès Beautify. Cet écran permet aussi d’accéder à la gestion de votre abonnement et de restaurer un accès existant.<br><br>Une activation en attente ou non confirmée ne donne pas accès à Beautify Plus. Supprimer les données locales ne résilie pas un abonnement.',
  Crédits:'Les visuels proviennent des maquettes fournies et de portraits éditoriaux générés avec IA. Les textes de parcours s’appuient sur Beautify — Parcours et contenus, version 0.1.<br><br>Catalogue <a href="https://world.openbeautyfacts.org" target="_blank" rel="noopener noreferrer">Open Beauty Facts</a>, données <a href="https://opendatacommons.org/licenses/odbl/1-0/" target="_blank" rel="noopener noreferrer">ODbL</a>, photos <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener noreferrer">CC BY-SA</a>.'
};
V['PRF-11']=()=>{
  const tab=Object.hasOwn(PROFILE_DOCUMENT_COPY,M.documentTab)?M.documentTab:'À propos';
  return lgPage(lgTitle('Informations')+chips(['À propos','Données','Abonnement','Crédits'],'documentTab',tab)+
    lgCard(`<div class="ux-profile-document-copy"><h2>${esc(tab)}</h2>${P(PROFILE_DOCUMENT_COPY[tab])}</div>`+
      `<footer class="ux-profile-document-footer">${B('Nous contacter','PRF-10','secondary')}</footer>`,'ux-profile-document-card'),'ux-profile-screen ux-profile-documents-screen');
};
function profileViewportHeight(){
  const viewport=window.visualViewport;
  if(viewport&&viewport.scale!==1)return;
  document.documentElement.style.setProperty('--profile-viewport-height',Math.round(viewport?.height||window.innerHeight)+'px');
  document.documentElement.style.setProperty('--app-viewport-height',Math.round(viewport?.height||window.innerHeight)+'px');
}
window.visualViewport?.addEventListener('resize',profileViewportHeight);
window.visualViewport?.addEventListener('scroll',profileViewportHeight);
window.addEventListener('resize',profileViewportHeight);
profileViewportHeight();
Object.assign(ACTIONS,{
  'profile-export':()=>{M.dataOperation={type:'Exporter',categories:['Profil','Préférences','Rapports','Essais','Suivi','Enregistrés','Routines']};ACTIONS['execute-data']();toast('Export JSON préparé. Images non incluses.');},
  'profile-remove-photos':()=>{if(!Object.keys(memoryPhotos).length)return;M.dataOperation={type:'Retirer',categories:['Photos']};confirmAction('Supprimer les photos importées ?','Toutes les photos importées en mémoire seront supprimées. Les textes de vos analyses, vos essais enregistrés et votre suivi seront conservés. Cette action ne peut pas être annulée.','execute-data');},
  'profile-delete-open':()=>go('PRF-09'),
  'profile-data-details':()=>profileHelpSheet('Vos données, sur cet appareil','<div class="ux-help-facts"><div><strong>Textes, analyses et routines</strong><p>Sauvegardés dans ce navigateur, si son stockage est disponible. Aucune synchronisation réelle.</p></div><div><strong>Photos importées</strong><p>En mémoire de la page uniquement. Elles disparaissent au rechargement. Les supprimer conserve les textes de vos analyses.</p></div><div><strong>Votre export</strong><p>Profil, préférences, analyses, essais, suivi, éléments enregistrés, routines, produits et rappels. Les images et demandes de contact ne sont pas incluses.</p></div></div>'+B('Informations et confidentialité','PRF-11','secondary',{document:'Données'})),
  'profile-account-details':()=>profileHelpSheet('À propos du compte','<div class="ux-help-facts"><div><strong>Compte facultatif</strong><p>Vous pouvez utiliser Beautify sans connexion. Vos données restent sur cet appareil.</p></div><div><strong>Modifier votre email</strong><p>Une vérification est demandée pour confirmer la nouvelle adresse.</p></div></div>'),
  'profile-open-analyses':()=>{M.historyDomain='Tous';go('ANA-12');},
  'profile-open-routine':()=>ACTIONS['skin-open-routine']({moment:'Matin'}),
  'profile-open-data':()=>go('PRF-07')
});
F.support=data=>{
  const message=data.message?.trim();if(!message)return formError('Écrivez votre question en quelques mots.');
  if(message.length>2000)return formError('Limitez votre question à 2 000 caractères.');
  M.supportDraft={topic:'Aide',message,attachment:''};clearDrafts('support');ACTIONS['send-support']();M.supportDraft=null;
};
const EXPERIENCE_ACCOUNT=V['ENT-05'];
V['ENT-05']=()=>EXPERIENCE_ACCOUNT().replace('Sauvegarder mes données','Compte facultatif').replace('Facultatif : seulement pour les retrouver sur un autre appareil.','Parcours de démonstration.').replace(/<div class="account-benefits">[\s\S]*?<\/div>/,'').replace('Activer la synchronisation','Créer le compte démo');
V['PRF-02']=()=>{
  const profile=M.profileEdit||M.profile;
  return lgPage(lgTitle('Mon compte')+
    `<p class="ux-profile-status">${M.profile.connected?'Connecté':'Sans compte · Connexion facultative'}</p>`+
    form('profile',field('name','Nom d’usage (facultatif)',profile.name)+(M.profile.connected?field('email','Adresse email',profile.email,'email',true):''),'Enregistrer')+
    (M.profile.connected?A('Se déconnecter','logout-request',{},'secondary'):B('Se connecter','ENT-06','secondary')+B('Créer un compte','ENT-05','text-button ux-profile-details'))+
    A('À propos du compte','profile-account-details',{},'text-button ux-profile-details'),'ux-profile-screen ux-profile-account-screen');
};
V['PRF-06']=()=>{
  studioEnsure();const owned=canonicalOwned(),pending=M.subscription.status==='pending';
  return lgPage(lgTitle('Mon accès Beautify')+
    lgCard(`<div class="ux-profile-fact">${lgBubble('crown')}<div><h2>${profileAccessLabel()}</h2><p>${owned?studioRemaining()+' essais coiffure disponibles.':pending?'Votre accès Plus n’est pas confirmé.':'Essais disponibles dans le module Cheveux.'}</p></div></div>`,'ux-profile-access-detail')+
    (owned?A('Gérer mon abonnement','manage-subscription',{},'primary'):pending?A('Vérifier mon accès','subscription-check',{},'primary'):B('Découvrir Beautify Plus','PRE-01','primary'))+
    B('Restaurer mes achats','PRE-04','secondary')+
    B('Informations sur l’abonnement','PRF-11','text-button ux-profile-details',{document:'Abonnement'}),'ux-profile-screen ux-profile-access-screen');
};

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
// Secondary forms share navigation controls, not a repeated brand signature.
for(const id of Object.keys(V)){
  const original=V[id];V[id]=()=>{const html=original();return /class="lg-page(?: |")/.test(html)?html:lgPage(html,'ux-secondary');};
}
for(const [id,title] of Object.entries({'PRO-01':'Mon suivi','PRO-03':'Mon journal','PRF-03':'Mes préférences','PRF-04':'Réglages','ESS-03':'Mon essai coiffure','ENT-05':'Compte facultatif','ENT-03':'Choisir une analyse','ANA-02':'Choisir une analyse'})){const page=FLOW_INDEX.find(page=>page.id===id);if(page)page.title=title;}
