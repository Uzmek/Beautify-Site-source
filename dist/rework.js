'use strict';

// The normal mobile experience is organized around the three useful V1
// outcomes. The full route registry remains available to reviewers.
const RW_ANALYSIS_FLOW=FLOW_INDEX.find(item=>item.id==='DEC-01');
if(RW_ANALYSIS_FLOW)RW_ANALYSIS_FLOW.title='Analyser — trois studios';

function rwDomainReady(domain){
  if(domain==='Cheveux')return !!M.hairProfile;
  if(domain==='Colorimétrie')return !!color12ReportProfile(null);
  return !!M.skinProfile;
}

function rwDomainMeta(domain){
  if(domain==='Cheveux'){
    studioEnsure();
    const shape=String(M.hairProfile?.shape||'').replace(' — déclaré','');
    return rwDomainReady(domain)?['Rapport prêt',shape||'Top 4 personnalisé']:['Top 4 personnalisé',studioRemaining()+' essai offert'];
  }
  if(domain==='Colorimétrie'){
    const profile=color12ReportProfile(null);
    return profile?['Profil prêt',uxSeasonLabel(profile.season)]:['Profil couleur','12 saisons'];
  }
  return rwDomainReady(domain)?['Rituel prêt',M.skinProfile.goal||'Matin et soir']:['Routine personnalisée','Matin et soir'];
}

function rwStatusMark(ready){
  return `<span class="rw-status ${ready?'ready':''}">${ready?icon('check'):icon('arrow')}</span>`;
}

function rwStudioCard(domain,variant='small'){
  const ready=rwDomainReady(domain),meta=rwDomainMeta(domain);
  if(domain==='Cheveux')return A(`<span class="rw-hair-visual">${imageFor('beautify-hair-hero-turkey-v2','','Portrait éditorial pour Hair Studio')}<i>${ready?'MON RAPPORT':'COMMENCER'}</i></span><span class="rw-studio-card-copy"><small>CHEVEUX</small><strong>${ready?'Mes meilleures coupes':'Quelles coupes me vont ?'}</strong><em>${esc(meta[0])}, ${esc(meta[1])}</em></span>${rwStatusMark(ready)}`,'result-open',{domain},'rw-studio-card hero');
  if(domain==='Colorimétrie'){
    const profile=color12ReportProfile(null),season=profile&&COLOR12_SEASONS[profile.season];
    return A(`<span class="rw-studio-symbol color">${color12Band(season||COLOR12_SEASONS.cool_summer,5,'rw-color-band')}</span><span class="rw-studio-card-copy"><small>COULEURS</small><strong>${ready?'Ma saison':'Quelles couleurs me vont ?'}</strong><em>${esc(meta[0])}, ${esc(meta[1])}</em></span>${rwStatusMark(ready)}`,'result-open',{domain},'rw-studio-card '+variant);
  }
  return A(`<span class="rw-studio-symbol skin">${icon('leaf')}</span><span class="rw-studio-card-copy"><small>PEAU</small><strong>${ready?'Ma routine':'De quoi ma peau a besoin ?'}</strong><em>${esc(meta[0])}, ${esc(meta[1])}</em></span>${rwStatusMark(ready)}`,'result-open',{domain},'rw-studio-card '+variant);
}

function rwStudioGrid(){
  return `<section class="rw-studios" aria-label="Analyses disponibles"><div class="rw-studio-grid">${rwStudioCard('Cheveux','hero')}${rwStudioCard('Colorimétrie')}${rwStudioCard('Peau')}</div></section>`;
}

function rwFutureModule(title,iconName){
  return `<div class="rw-future-module" aria-disabled="true"><span>${icon(iconName)}<i>${icon('lock')}</i></span><strong>${esc(title)}</strong><small>Bientôt</small></div>`;
}

function rwFutureDock(){
  return `<section class="rw-future-dock" aria-label="Fonctionnalités en préparation"><span class="eyebrow">En préparation</span><div class="rw-future-grid">${rwFutureModule('Maquillage','cosmetic')}${rwFutureModule('Garde-robe','hanger')}${rwFutureModule('Tutoriels','guide')}</div></section>`;
}

function rwResultSummary(){
  return `<section class="rw-summary"><div class="rw-section-heading"><span><small>VOS ESPACES</small><strong>En un coup d’œil</strong></span>${B('Tout voir','SAV-01','text-button')}</div><div class="rw-summary-grid">${['Cheveux','Colorimétrie','Peau'].map(domain=>{const ready=rwDomainReady(domain),meta=rwDomainMeta(domain),iconName=domain==='Cheveux'?'hair':domain==='Colorimétrie'?'palette':'leaf';return A(`${icon(iconName)}<strong>${domain==='Colorimétrie'?'Couleurs':domain}</strong><small>${esc(ready?meta[1]:'À faire')}</small>`,'result-open',{domain},'rw-summary-card '+(ready?'ready':''));}).join('')}</div></section>`;
}

// Four clear destinations. "Découvrir" and the duplicate analysis tab disappear.
nav=function(){
  const active=M.navRoot||homeFor(route),analysisActive=['DEC-01','ANA-01'].includes(active)||route.startsWith('ANA-');
  return `<nav class="bottom-nav rw-bottom-nav" aria-label="Navigation principale">${[
    ['ACC-01','Accueil','home',active==='ACC-01'],
    ['DEC-01','Analyser','face',analysisActive],
    ['SAV-01','Résultats','bars',active==='SAV-01'],
    ['PRF-01','Profil','user',active==='PRF-01']
  ].map(([page,title,iconName,isActive])=>`<button type="button" data-go="${page}" data-root="true" class="${isActive?'active':''}" ${isActive?'aria-current="page"':''}>${icon(iconName)}<span>${title}</span></button>`).join('')}</nav>`;
};

V['ACC-01']=()=>{
  const actions=dailyActions(),draft=M.draft.status!=='complete'&&(M.draft.photo||Object.keys(M.draft.answers||{}).length),anyResult=['Cheveux','Colorimétrie','Peau'].some(rwDomainReady);
  const hero=draft
    ? `<section class="rw-home-hero resume"><span class="rw-home-icon">${icon('spark')}</span><span><small>EN COURS</small><h2>Reprendre mon analyse</h2><p>${esc(M.draft.domain)}</p></span>${B('Continuer',M.draft.phase,'rw-hero-action')}</section>`
    : actions.length
      ? `<section class="rw-home-focus"><div class="rw-section-heading"><span><small>AUJOURD’HUI</small><strong>Mon prochain geste</strong></span>${B('Ma journée','ACC-03','text-button')}</div>${calmTask(actions[0])}</section>`
      : `<section class="rw-home-hero"><div class="rw-home-portrait">${imageFor('beautify-home-hero-turkey-v3','','Portrait éditorial Beautify')}</div><div class="rw-home-copy"><small>${anyResult?'À VOUS DE CHOISIR':'VOTRE PREMIER RÉSULTAT'}</small><h2>${anyResult?'Retrouvez ce qui vous va.':'Commencez par vous.'}</h2>${B(anyResult?'Nouvelle analyse':'Choisir mon analyse','DEC-01','rw-hero-action')}</div></section>`;
  return `<div class="rw-page-title"><span class="eyebrow">${M.profile.name?'Bonjour '+esc(M.profile.name):'Bonjour à vous'}</span><h1 tabindex="-1">Votre beauté,<br><em>plus simple.</em></h1></div>${hero}${rwResultSummary()}`;
};

// DEC-01 is retained as a route identifier for compatibility, but its product
// role is now the only analysis launcher in the normal navigation.
V['DEC-01']=()=>head('Par quoi commencer ?')+`<p class="rw-intro">Un choix suffit.</p>`+rwStudioGrid()+rwFutureDock();

V['ANA-01']=()=>{
  const reports=['Cheveux','Colorimétrie','Peau'].map(domain=>{const result=studioLatest(domain);return result?reportCard(result):'';}).join('');
  return head('Nouvelle analyse')+rwStudioGrid()+(reports?calmDisclosure('Mes derniers comptes rendus',reports):'');
};

V['ANA-02']=()=>head('Choisir une analyse')+rwStudioGrid()+B('Retour à l’accueil','ACC-01','text-button rw-back-home');

V['ANA-03']=()=>{
  const domain=M.draft.domain,details={
    Cheveux:['Beautify analyse votre visage et vos cheveux.','Aucun questionnaire avant le résultat.'],
    Colorimétrie:['La photo donne les premiers repères couleur.','Vos réponses permettent de les confirmer.'],
    Peau:['La photo complète vos ressentis.','Ce bilan ne remplace pas un diagnostic.']
  }[domain]||['Votre photo lance l’analyse.','Vos réponses restent modifiables.'];
  return head('Avant de commencer',domain)+`<section class="rw-consent-card"><span class="rw-consent-icon">${icon(domain==='Cheveux'?'hair':domain==='Colorimétrie'?'palette':'leaf')}</span><div class="rw-consent-facts"><span>${icon('camera')}<strong>Photo de face nécessaire</strong></span><span>${icon('check')}<strong>${esc(details[0])}</strong></span><span>${icon('refresh')}<strong>${esc(details[1])}</strong></span></div></section>`+form('consent',check('consent','J’ai compris et je continue.',M.draft.consent),'Continuer')+B('Annuler','DEC-01','text-button rw-back-home');
};

// Analysis capture and questionnaire: one mobile decision per screen.
const RW_QUESTIONS={
  Colorimétrie:[
    {key:'colorGoal',title:'Que voulez-vous choisir plus facilement ?',options:['Tout mon look','Mes vêtements','Mes cheveux','Comprendre mes couleurs']},
    {key:'temperatureHint',title:'Votre peau vous semble plutôt…',hint:'Aucun problème si vous hésitez.',options:['Je ne sais pas','Chaude / dorée','Froide / rosée','Neutre ou variable']},
    {key:'depthHint',title:'Près du visage, vous préférez les tons…',options:['Je ne sais pas','Claire','Moyenne','Profonde']},
    {key:'chromaHint',title:'Quelles couleurs vous semblent les plus harmonieuses ?',options:['Je ne sais pas','Douces / poudrées','Nettes / lumineuses','Équilibrées']},
    {key:'contrastHint',title:'Votre contraste naturel vous paraît…',options:['Je ne sais pas','Faible','Moyen','Fort']}
  ],
  Peau:[
    {key:'afterWash',title:'Après le nettoyage, votre peau…',options:['Confortable','Elle tire','Elle brille vite','Cela dépend']},
    {key:'sensitivity',title:'Votre peau réagit-elle facilement ?',options:['Souvent','Parfois','Rarement','Je ne sais pas']},
    {key:'skinGoal',title:'Votre priorité aujourd’hui ?',options:['Confort','Hydratation','Éclat','Imperfections','Routine simple']}
  ]
};

function rwQuestions(){return RW_QUESTIONS[M.draft.domain]||[];}
function rwQuestionStep(){const questions=rwQuestions(),step=Number(M.analysisQuestionStep)||0;return questions.length?Math.max(0,Math.min(step,questions.length-1)):0;}
function rwEngineLabel(){return M.draft.domain==='Cheveux'?'Visage et cheveux':M.draft.domain==='Colorimétrie'?'Repères couleur':'Signes visibles';}
function rwPhotoFacts(){return `<div class="rw-photo-facts"><span>${icon('sun')}<strong>Lumière naturelle</strong></span><span>${icon('face')}<strong>Visage de face</strong></span><span>${icon('ban')}<strong>Sans filtre</strong></span></div>`;}

V['ANA-04']=()=>head('Ajouter votre photo',M.draft.domain)+progress(2,M.draft.domain==='Cheveux'?4:5)+`<section class="rw-photo-card"><span class="rw-photo-face">${icon('face')}</span><div><small>ÉTAPE NÉCESSAIRE</small><h2>Une photo nette, de face</h2><p>${M.draft.domain==='Cheveux'?'Notre moteur observe votre visage et vos cheveux.':'Elle sert de point de départ à votre analyse.'}</p></div></section><div class="rw-photo-sources">${A(`${icon('camera')}<span><strong>Prendre une photo</strong><small>Ouvrir la caméra</small></span>${icon('chev')}`,'file-pick',{purpose:'analysis',source:'camera',label:'Prendre une photo avec la caméra'},'rw-photo-source')}${A(`${icon('image')}<span><strong>Choisir dans la galerie</strong><small>Utiliser une photo existante</small></span>${icon('chev')}`,'file-pick',{purpose:'analysis',source:'gallery',label:'Choisir une photo dans la galerie'},'rw-photo-source')}</div>`+rwPhotoFacts()+B('Conseils pour réussir la photo','ANA-05','text-button rw-photo-help')+B('Retour','ANA-03','text-button rw-back-home');

V['ANA-05']=()=>head('Réussir votre photo','Trois repères suffisent.')+`<section class="rw-guide-face"><span>${icon('face')}</span><i></i></section>`+rwPhotoFacts()+`<p class="rw-guide-copy">Retirez vos lunettes si elles cachent le contour du visage et gardez une expression naturelle.</p>`+A('Ouvrir la caméra','file-pick',{purpose:'analysis',source:'camera'})+A('Choisir dans la galerie','file-pick',{purpose:'analysis',source:'gallery'},'secondary mt')+B('Retour','ANA-04','text-button rw-back-home');

V['ANA-06']=()=>{
  if(M.draft.photo?.startsWith('photo-')&&!memoryPhotos[M.draft.photo])M.draft.photo='';
  if(!M.draft.photo)return head('Votre photo','Ajoutez une photo pour lancer l’analyse.')+empty('Aucune photo sélectionnée','Prenez une photo ou choisissez-en une dans votre galerie.','ANA-04','Ajouter une photo');
  const blocked=['error','unavailable'].includes(M.scenario);
  return head('Vérifier votre photo',M.draft.domain)+progress(3,M.draft.domain==='Cheveux'?4:5)+`<section class="rw-photo-preview">${imageFor(M.draft.photo,'detail-photo','Photo sélectionnée pour l’analyse')}<span>${blocked?icon('x'):icon('check')}<strong>${blocked?'Photo à remplacer':'Visage bien visible'}</strong></span></section>`+(blocked?panel(`<h3>Cette photo ne peut pas être analysée.</h3>${P('Reprenez-la de face, en lumière naturelle et sans filtre.')}`):`<div class="rw-engine-ready"><span>${icon('spark')}</span><div><small>ANALYSE BEAUTIFY</small><strong>${esc(rwEngineLabel())}</strong><p>${M.draft.domain==='Cheveux'?'Un seul appel analyse la forme du visage, la texture et la longueur visibles.':'Quelques questions permettront ensuite de personnaliser le résultat.'}</p></div></div>`)+(blocked?'':A(M.draft.domain==='Cheveux'?'Analyser ma photo':'Continuer','analysis-photo-continue'))+B('Changer de photo','ANA-04','secondary mt')+A('Supprimer la photo','remove-photo',{},'text-button mt');
};

V['ANA-07']=()=>{
  if(M.draft.domain==='Cheveux')return head('Votre photo suffit','Aucune information visible ne vous est redemandée.')+panel(`${icon('spark','glow-icon xl')}<h2>Prête pour l’analyse</h2>${P('Beautify détecte directement la forme du visage, la texture et la longueur des cheveux.')}`)+A('Analyser ma photo','analysis-photo-continue')+B('Changer de photo','ANA-04','secondary mt');
  const questions=rwQuestions(),step=rwQuestionStep(),q=questions[step],selected=M.draft.answers?.[q.key]||'';
  const options=q.options.map(value=>`<label class="rw-answer-option"><input type="radio" name="answer" value="${esc(value)}" ${selected===value?'checked':''} required><span><strong>${esc(value)}</strong>${icon('check')}</span></label>`).join('');
  return `<div class="rw-question-top"><span>Question ${step+1} sur ${questions.length}</span></div><div class="rw-question-progress" role="progressbar" aria-label="Progression du questionnaire" aria-valuemin="1" aria-valuemax="${questions.length}" aria-valuenow="${step+1}"><span style="width:${100*(step+1)/questions.length}%"></span></div><section class="rw-question-copy"><small>${esc(M.draft.domain.toUpperCase())}</small><h1 tabindex="-1">${esc(q.title)}</h1>${q.hint?`<p>${esc(q.hint)}</p>`:''}</section><form data-form="analysis-question" data-draft-key="analysis-question:${esc(M.draft.id||'current')}:${step}" class="form-stack rw-question-form"><fieldset><legend class="sr-only">${esc(q.title)}</legend><div class="rw-answer-list">${options}</div></fieldset><p class="form-feedback" role="alert" hidden></p><button class="primary" type="submit">${step===questions.length-1?'Voir mon analyse':'Suivant'}${icon('arrow')}</button></form>`;
};

V['ANA-08']=()=>{
  const steps=M.draft.domain==='Cheveux'?['Forme du visage','Texture et longueur','Coupes recommandées']:M.draft.domain==='Colorimétrie'?['Lecture des repères','Profil 12 saisons','Palette personnelle']:['Lecture des signes visibles','Besoins prioritaires','Rituel simple'];
  return head('Analyse prête',M.draft.domain)+progress(M.draft.domain==='Cheveux'?4:5,M.draft.domain==='Cheveux'?4:5)+`<section class="rw-scan-card"><span class="rw-scan-orbit">${icon(M.draft.domain==='Cheveux'?'face':M.draft.domain==='Colorimétrie'?'palette':'leaf')}</span><small>MOTEUR BEAUTIFY</small><h2>${esc(rwEngineLabel())}</h2><div class="rw-engine-steps">${steps.map((label,index)=>`<span>${icon('check')}<strong>${esc(label)}</strong><small>${M.draft.domain==='Cheveux'||index<steps.length-1?'Analysé':'Personnalisé'}</small></span>`).join('')}</div></section>`+A('Afficher mon résultat','finish-analysis')+(M.draft.domain==='Cheveux'?B('Changer de photo','ANA-04','secondary mt'):B('Modifier mes réponses','ANA-07','secondary mt'));
};

ACTIONS['file-pick']=data=>{
  const input=document.createElement('input');
  input.type='file';input.accept='image/*';
  if(data.source==='camera')input.capture='user';
  input.addEventListener('change',()=>loadPhoto(input.files?.[0],data.purpose||'analysis'));
  input.click();
};

const RW_STUDIO_ANALYSIS=ACTIONS['studio-analysis'];
ACTIONS['studio-analysis']=data=>{M.analysisQuestionStep=0;clearDrafts('analysis-question');RW_STUDIO_ANALYSIS(data);};
ACTIONS['edit-analysis']=()=>{
  const r=report();if(!r)return;
  const stale=r.photo?.startsWith('photo-')&&!memoryPhotos[r.photo];
  M.analysisQuestionStep=0;clearDrafts('analysis-question');clearDrafts('analysis-answers');
  M.draft={id:uid('draft'),domain:r.domain,photo:stale?'':r.photo||'',withoutPhoto:false,answers:clone(r.answers||{}),consent:true,status:'draft',phase:stale||!r.photo?'ANA-04':'ANA-07',revises:r.id};
  go(M.draft.phase);
};
ACTIONS['analysis-photo-continue']=()=>{
  M.analysisQuestionStep=0;clearDrafts('analysis-question');
  if(M.draft.domain==='Cheveux'){
    M.draft.answers=rwHairObservation(M.draft.photo);
    M.draft.phase='ANA-08';M.draft.status='ready';go('ANA-08');return;
  }
  M.draft.phase='ANA-07';go('ANA-07');
};
ACTIONS['analysis-question-back']=()=>{const step=rwQuestionStep();if(step>0){M.analysisQuestionStep=step-1;clearDrafts('analysis-question');render({focus:true,scroll:0});}else go('ANA-06');};
// Capture is now question-free; always use the shared navigation contract.
ACTIONS.back=back;
ACTIONS['without-photo']=()=>go('ANA-04');

F['analysis-question']=data=>{
  const questions=rwQuestions(),step=rwQuestionStep(),q=questions[step];
  if(!data.answer)return formError('Choisissez une réponse pour continuer.');
  M.draft.answers||={};M.draft.answers[q.key]=data.answer;clearDrafts('analysis-question');
  if(step<questions.length-1){M.analysisQuestionStep=step+1;render({focus:true,scroll:0});return;}
  M.analysisQuestionStep=0;M.draft.phase='ANA-08';M.draft.status='ready';go('ANA-08');
};

function rwHairObservation(photoId){
  // Fixed demonstration payload; production replaces this function with the
  // structured response returned by the selected vision provider.
  return {shape:'Ovale',texture:'Ondulés',length:'Mi-longue'};
}

const RW_FINISH_ANALYSIS=ACTIONS['finish-analysis'];
ACTIONS['finish-analysis']=()=>{
  if(!M.draft.photo){go('ANA-04');return;}
  const domain=M.draft.domain;
  if(domain==='Cheveux')M.draft.answers={...M.draft.answers,...rwHairObservation(M.draft.photo)};
  RW_FINISH_ANALYSIS();
  if(M.draft.status!=='complete')return;
  const r=M.analyses.find(item=>item.id===M.draft.reportId)||M.analyses.at(-1);
  if(domain==='Cheveux'){
    const shape=M.draft.answers.shape;
    M.hairProfile={shape,texture:M.draft.answers.texture,length:M.draft.answers.length,basis:'Analyse visuelle Beautify'};
    if(r)Object.assign(r,{hairProfile:clone(M.hairProfile),faceShape:shape,source:'Visage et cheveux analysés par Beautify'});
  }else if(domain==='Colorimétrie'&&r?.colorStatus!=='needs_review')r.source='Photo et réponses, profil 12 saisons';
  else if(domain==='Peau'&&r)r.source='Photo et ressentis, bilan non médical';
  persist();if(route==='ANA-10')render();
};

studioResultView=function(r){
  if(r?.domain==='Cheveux'){
    const profile=r.hairProfile||M.hairProfile||{},shape=r.faceShape||profile.shape||'Profil coupe';
    return head('Mes coupes recommandées',dateText(r.date))+`<section class="rw-analysis-result"><span>${icon('face')}</span><div><small>ANALYSÉ SUR VOTRE PHOTO</small><h2>${esc(shape)}</h2><p>${[profile.texture,profile.length].filter(Boolean).map(esc).join(', ')}</p></div></section>`+studioHairList(true)+A('Ouvrir Hair Studio','studio-result-open',{domain:'Cheveux'})+note('Beautify classe directement les coupes selon votre visage et vos cheveux.');
  }
  if(r?.domain==='Colorimétrie'){
    const profile=color12ReportProfile(r),season=profile&&COLOR12_SEASONS[profile.season];
    if(!profile||!season)return `<section class="rw-analysis-result"><span>${icon('palette')}</span><div><small>PROFIL À COMPLÉTER</small><h2>Quelques repères manquent</h2><p>Modifiez une réponse pour obtenir votre saison.</p></div></section>`+A('Modifier mes réponses','edit-analysis');
    return head('Mon profil 12 saisons',dateText(r.date))+color12ProfileCard(profile)+color12Traits(season)+panel(`<h3>À retenir</h3>${P('Comparez ces couleurs près du visage en lumière naturelle. Vous pourrez toujours ajuster votre profil.')}`)+A('Explorer ce résultat dans Color Studio','color-report-open',{id:r.id})+A('Modifier mes réponses','edit-analysis',{},'secondary mt')+note('La photo donne les premiers repères ; vos réponses les précisent.');
  }
  if(r?.domain==='Peau')return head('Mon bilan de peau',dateText(r.date))+panel(`<span class="eyebrow">Photo + ressentis</span><h2>Un rituel simple à essayer</h2>${P('Ajoutez-le, puis adaptez ou retirez chaque geste selon votre confort.')}`)+uxSkinPlanHtml(r.skinPlan||M.skinPlan)+A('Ajouter ces rituels','skin-apply-plan')+(r.skinPlan?.sensitive||M.skinPlan?.sensitive?note('En cas de brûlure, réaction persistante, traitement ou allergie connue, demandez conseil à un professionnel.'):'')+note('Ce bilan ne constitue pas un diagnostic médical.');
  return '';
};

V['ANA-10']=()=>{
  const r=report();
  if(r?.domain==='Colorimétrie'&&r.colorStatus==='needs_review')return head('Complétons votre profil couleur','Un repère supplémentaire suffit.')+panel(`${icon('palette','glow-icon xl')}<h2>Aucune saison attribuée au hasard</h2>${P('Modifiez une réponse de température, profondeur, intensité ou contraste pour affiner le résultat.')}`)+A('Modifier mes réponses','edit-analysis')+B('Explorer les 12 saisons','COL-02','secondary mt');
  return studioResultView(r);
};
V['ANA-09']=()=>V['ANA-10']();

const RW_HAIR_HOME=V['HAI-01'];
V['HAI-01']=()=>RW_HAIR_HOME()
  .replace('Des coupes classées selon vos réponses, puis un essai sur votre photo.','Les meilleures coupes classées à partir de votre photo.')
  .replace('Texture, longueur, changement et entretien','Une photo suffit')
  .replace('Profil fondé sur mes réponses','Profil analysé par Beautify')
  .replace('Chaque réponse influence le classement. Vous gardez toujours le dernier mot.','Classement établi à partir de votre visage et de vos cheveux.');

studioHairScore=function(c,profile=M.hairProfile||{}){
  const shape=String(profile.shape||'').replace(' — déclaré',''),texture=profile.texture,length=uxNormalizeLength(profile.length);let score=0;
  if(c.shapes?.includes(shape))score+=8;
  if(c.textures.includes(texture))score+=6;
  if(length&&c.length===length)score+=2;
  return score;
};
uxHairFit=function(c,profile=M.hairProfile||{}){
  const shape=String(profile.shape||'').replace(' — déclaré',''),hits=[];
  if(c.shapes?.includes(shape))hits.push('votre visage');
  if(c.textures.includes(profile.texture))hits.push('vos cheveux');
  return hits.length?'Adaptée à '+hits.join(' et '):'Alternative sélectionnée par Beautify';
};
studioHairList=function(recommended=false,analysisId=null){
  let list=STUDIO_HAIRCUTS.slice();
  const profile=analysisId?(M.analyses.find(r=>r.id===analysisId)?.hairProfile||{}):(M.hairProfile||{});
  if(!recommended&&M.hairLengthFilter&&M.hairLengthFilter!=='Toutes')list=list.filter(c=>c.length===M.hairLengthFilter);
  list.sort((a,b)=>recommended?studioHairScore(b,profile)-studioHairScore(a,profile):a.name.localeCompare(b.name));
  if(recommended)list=list.slice(0,4);
  return `<div class="studio-hair-grid" role="region" aria-live="polite">${list.map((cut,index)=>A(`${studioHairTile(cut)}<span>${recommended&&index===0?'<small class="studio-badge">Meilleure correspondance</small>':''}<strong>${esc(cut.name)}</strong><small>${esc(cut.length)}</small>${recommended?`<small class="match-reason">${esc(uxHairFit(cut,analysisId?(M.analyses.find(r=>r.id===analysisId)?.hairProfile||{}):(M.hairProfile||{})))}</small>`:''}</span>`,'haircut-open',{id:cut.id,...(analysisId?{analysis:analysisId}:{})},'studio-hair-card')).join('')}</div>`;
};

calmHairProfile=function(){
  const profile=M.hairProfile,shape=String(profile?.shape||'À définir').replace(' — déclaré','');
  if(!profile)return '';
  return `<section class="hair-report-profile"><div class="between"><span class="eyebrow">Analyse de ma photo</span></div><div class="hair-profile-facts rw-observed-facts"><span><small>Visage</small><strong>${esc(shape)}</strong></span><span><small>Cheveux</small><strong>${esc(profile.texture||'—')}</strong></span><span><small>Longueur</small><strong>${esc(uxNormalizeLength(profile.length)||'—')}</strong></span></div></section>`;
};
ACTIONS['hair-profile-edit']=()=>ACTIONS['studio-analysis']({domain:'Cheveux'});
ACTIONS['haircut-open']=data=>{
  const cut=STUDIO_HAIRCUTS.find(item=>item.id===data.id);if(!cut)return;
  M.haircutSelected=cut.id;
  const profile=data.analysis?M.analyses.find(r=>r.id===data.analysis)?.hairProfile:M.hairProfile;
  modal(cut.name,studioHairTile(cut,true)+`<div class="hair-modal-fit"><span class="eyebrow">${profile?'Votre correspondance':'Référence de coupe'}</span>${profile?`<strong>${esc(uxHairFit(cut,profile))}</strong>`:''}<p>${esc(cut.reason)}</p></div><div class="cut-meta"><span>${esc(cut.length)}</span></div>`+calmDisclosure('À dire au salon',P(esc(cut.salon)))+A('Essayer sur ma photo','haircut-simulate',{id:cut.id,analysis:data.analysis})+A('Fermer','close',{},'text-button calm-skip'));
};

const RW_COLOR_PROFILE_CARD=color12ProfileCard;
color12ProfileCard=profile=>RW_COLOR_PROFILE_CARD(profile).replace('Fondé sur vos réponses, sans score artificiel','Photo + réponses, sans score artificiel');
const RW_SKIN_HOME=V['PEA-01'];
V['PEA-01']=()=>RW_SKIN_HOME().replace('Bilan fondé sur mes réponses','Bilan photo + ressentis');

function rwCompactResultCard(domain){
  const ready=rwDomainReady(domain),meta=rwDomainMeta(domain),iconName=domain==='Cheveux'?'hair':domain==='Colorimétrie'?'palette':'leaf';
  return A(`<span class="result-icon">${icon(iconName)}</span><span class="result-copy"><small>${domain==='Colorimétrie'?'COULEURS':esc(domain.toUpperCase())}</small><strong>${esc(ready?meta[1]:'Commencer')}</strong><em>${esc(ready?meta[0]:meta.join(', '))}</em></span>${rwStatusMark(ready)}`,'result-open',{domain},'result-card rw-result-card');
}

V['SAV-01']=()=>{
  const simulations=M.simulations.slice().reverse();
  return head('Résultats')+`<div class="rw-section-heading first"><span><small>MES RAPPORTS</small><strong>Tout au même endroit</strong></span></div><div class="result-stack">${rwCompactResultCard('Cheveux')}${rwCompactResultCard('Colorimétrie')}${rwCompactResultCard('Peau')}</div>`+(simulations.length?`<div class="result-section-title"><span><small>SIMULATIONS</small><strong>Mes essais de coupes</strong></span><span>${simulations.length}</span></div><div class="result-simulation-grid">${simulations.slice(0,6).map(calmSimulationCard).join('')}</div>`:`<div class="rw-simulation-empty"><span>${icon('sparkles')}</span><strong>Vos essais de coupes apparaîtront ici.</strong></div>`);
};

V['ENT-03']=()=>head('Votre premier résultat')+`<p class="rw-intro">Qu’aimeriez-vous savoir ?</p><div class="onboarding-choice-list">${calmOnboardingChoice('Quelles coupes me vont ?','Top 4 et essai sur photo','Cheveux','hair')}${calmOnboardingChoice('Quelles couleurs me vont ?','Profil complet en 12 saisons','Colorimétrie','palette')}${calmOnboardingChoice('De quoi ma peau a besoin ?','Bilan et rituel matin / soir','Peau','leaf')}</div>`+B('Je choisirai plus tard','DEC-01','text-button rw-back-home');
