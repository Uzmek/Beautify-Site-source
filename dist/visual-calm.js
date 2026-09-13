'use strict';

// A quieter information architecture for the high-traffic screens. All product
// capabilities remain reachable; secondary material is progressively disclosed.
const CALM_BASE={premium:V['PRE-01'],analysisResult:V['ANA-10'],color:V['COL-01']};

function calmDisclosure(title,body,description=''){
  return `<details class="calm-disclosure"><summary><span><strong>${esc(title)}</strong>${description?`<small>${esc(description)}</small>`:''}</span>${icon('chev')}</summary><div class="calm-disclosure-body">${body}</div></details>`;
}

function calmStudioLink(title,subtitle,page,iconName,meta=''){
  return B(`<span class="calm-studio-icon">${icon(iconName)}</span><span class="calm-studio-copy"><strong>${esc(title)}</strong>${subtitle?`<small>${esc(subtitle)}</small>`:''}</span>${meta?`<span class="calm-studio-meta">${esc(meta)}</span>`:''}${icon('chev')}`,page,'calm-studio-link');
}

function calmActionLink(title,meta,action,domain,iconName){
  return A(`<span class="calm-studio-icon">${icon(iconName)}</span><span class="calm-studio-copy"><strong>${esc(title)}</strong><small>${esc(meta)}</small></span>${icon('chev')}`,action,{domain},'calm-studio-link calm-analysis-link');
}

function calmTabs(items,key,current,label){
  return `<div class="choice-chips calm-tabs" role="group" aria-label="${esc(label)}">${items.map(([value,text])=>A(esc(text),'choice',{key,value,pressed:current===value},'choice-chip '+(current===value?'selected':''))).join('')}</div>`;
}

function calmHairRanked(){return STUDIO_HAIRCUTS.slice().sort((a,b)=>studioHairScore(b)-studioHairScore(a)).slice(0,4);}

function calmHairProfile(){
  const profile=M.hairProfile,shape=String(profile?.shape||'À définir').replace(' — déclaré','');
  if(!profile)return '';
  return `<section class="hair-report-profile"><div class="between"><span class="eyebrow">Mon profil</span>${A('Modifier','hair-profile-edit',{},'text-button')}</div><div class="hair-profile-facts"><span><small>Visage</small><strong>${esc(shape)}</strong></span><span><small>Texture</small><strong>${esc(profile.texture||'—')}</strong></span><span><small>Longueur</small><strong>${esc(uxNormalizeLength(profile.length)||'—')}</strong></span><span><small>Entretien</small><strong>${esc(profile.care||'—')}</strong></span></div></section>`;
}

function calmHairRanking(){
  const ranked=calmHairRanked(),best=ranked[0];
  return `<section class="hair-ranking"><div class="hair-report-title"><span><small>Votre sélection</small><strong>Top 4</strong></span><span class="hair-count">4 coupes</span></div>${A(`<span class="hair-rank">1</span>${studioHairTile(best)}<span class="hair-best-copy"><small>Meilleure correspondance</small><strong>${esc(best.name)}</strong><em>${esc(uxHairFit(best))}</em></span>`,'haircut-open',{id:best.id},'hair-best-card')}<div class="hair-alternatives">${ranked.slice(1).map((cut,index)=>A(`<span class="hair-rank">${index+2}</span>${studioHairTile(cut)}<span><strong>${esc(cut.name)}</strong><small>${esc(cut.length)}</small></span>`,'haircut-open',{id:cut.id},'hair-alternative-card')).join('')}</div></section>`;
}

function calmHairGallery(cuts){
  return `<div class="hair-gallery" role="region" aria-live="polite">${cuts.map(cut=>A(`${studioHairTile(cut)}<span><strong>${esc(cut.name)}</strong><small>${esc(cut.length)}</small></span>`,'haircut-open',{id:cut.id},'hair-gallery-card')).join('')}</div>`;
}

function calmColorFamilies(){
  return `<div class="color-family-tiles">${Object.entries(COLOR12_FAMILIES).map(([id,family])=>{const middle=COLOR12_SEASONS[family.seasons[1]];return A(`<span><small>${esc(family.label)}</small><strong>${esc(family.name)}</strong></span>${color12Band(middle,5,'family-band')}`,'color-family-open',{id},'color-family-tile');}).join('')}</div>`;
}

function calmColorTabs(tab){return calmTabs([['Profil','Profil'],['Palette','Palette'],['Cheveux','Cheveux']],'colorSeasonTab',tab,'Vue du rapport couleur');}

function calmColorProfile(profile,season){
  return `<section class="color-report-hero"><span class="eyebrow">Mon profil 12 saisons</span><small>${esc(season.name)}</small><h2>${esc(uxSeasonLabel(profile.season))}</h2>${color12Band(season,8)}${color12Traits(season)}</section>`;
}

function calmColorPalette(profile,season){
  return `<div class="color-section-title"><strong>Mes couleurs</strong><small>${season.colors.length}</small></div>${color12ColorGrid(season.colors)}<div class="color-section-title"><strong>Mes neutres</strong><small>${season.neutrals.length}</small></div>${color12ColorGrid(season.neutrals,'season-color-grid neutrals')}${A('Cette couleur est-elle pour moi ?','color-check')}`;
}

function calmColorSwaps(season){
  return `<div class="color-section-title"><strong>Teintes à comparer</strong><small>${season.avoid.length}</small></div><div class="color-swaps simple">${season.avoid.map(([from,to])=>`<div class="color-swap"><div><i style="--season-color:${from[1]}"></i><small>Comparer</small><strong>${esc(from[0])}</strong></div>${icon('arrow')}<div><i style="--season-color:${to[1]}"></i><small>Essayer</small><strong>${esc(to[0])}</strong></div></div>`).join('')}</div>${A('Tester une autre couleur','color-check',{},'secondary')}`;
}

function calmColorHair(season){
  return `<div class="color-section-title"><strong>Nuances les plus cohérentes</strong></div><div class="hair-color-list calm-color-list">${season.hair.best.map(color=>`<span>${esc(color)}</span>`).join('')}</div><div class="color-section-title muted-title"><strong>À comparer</strong></div><div class="hair-color-list muted calm-color-list">${season.hair.avoid.map(color=>`<span>${esc(color)}</span>`).join('')}</div>${A('Ouvrir mon rapport coupe','go-hair-color')}`;
}

function calmColorFuture(){
  return `<div class="color-section-title"><strong>Bientôt avec ma palette</strong></div><div class="calm-future-row">${A(`${icon('eye')}<span>Maquillage</span>`,'coming-open',{feature:'makeup'},'future-chip')}${A(`${icon('dress')}<span>Garde-robe</span>`,'coming-open',{feature:'wardrobe'},'future-chip')}${A(`${icon('spark')}<span>Tutoriels</span>`,'coming-open',{feature:'tutorial'},'future-chip')}</div>`;
}

function calmSkinTabs(tab){return calmTabs([['Analyse','Bilan'],['Matin','Matin'],['Soir','Soir'],['Suivi','Suivi']],'skinTab',tab,'Vue de Skin Studio');}

nav=function(){
  const active=M.navRoot||homeFor(route);
  return `<nav class="bottom-nav" aria-label="Navigation principale">${[['ACC-01','Accueil','home'],['DEC-01','Studios','sparkles'],['ANA-01','Analyser','face'],['SAV-01','Résultats','bars'],['PRF-01','Profil','user']].map(([page,title,iconName])=>`<button type="button" data-go="${page}" data-root="true" class="${page===active?'active':''}" ${page===active?'aria-current="page"':''}>${icon(iconName)}<span>${title}</span></button>`).join('')}</nav>`;
};

function calmTask(action){
  const archived=action.kind==='routine'&&!M.routines.some(routine=>routine.id===action.ref);
  return `<div class="calm-task ${action.done?'done':''}">${archived?`<span class="calm-task-state" aria-hidden="true">${icon(action.done?'check':'sun')}</span>`:A(`<span class="check-circle">${action.done?icon('check'):''}</span>`,'task',{id:action.id,pressed:action.done,label:(action.done?'Marquer à faire : ':'Marquer faite : ')+action.name},'calm-task-state')}<span class="calm-task-copy"><strong>${esc(action.name)}</strong><small>${action.done?'Terminé':archived?'Séance conservée':'Prête à commencer'}</small></span>${A(action.done?'Revoir':'Commencer','task-open',{id:action.id},'text-button')}</div>`;
}

studioStrip=function(){
  return `<section class="calm-studios"><div class="calm-section-title"><div><span class="eyebrow">Mes studios</span><h2>Choisir</h2></div>${B('Tout voir','DEC-01','text-button')}</div><div class="calm-studio-list">${calmStudioLink('Mes coupes','','HAI-01','hair',studioRemaining()+' essai'+(studioRemaining()>1?'s':''))}${calmStudioLink('Mes couleurs','','COL-01','palette','12 saisons')}${calmStudioLink('Ma peau','','PEA-01','leaf','Matin et soir')}</div></section>`;
};

V['ACC-01']=()=>{
  const actions=dailyActions(),next=M.events.filter(e=>e.date>=DATE()&&e.status!=='done').sort((a,b)=>a.date.localeCompare(b.date))[0];
  const focus=actions.length
    ? `<section class="calm-focus"><div class="calm-section-title"><div><span class="eyebrow">Aujourd’hui</span><h2>Mon prochain geste</h2></div>${B('Ma journée','ACC-03','text-button')}</div>${calmTask(actions[0])}${actions.length>1?`<p class="calm-caption">+ ${actions.length-1} autre action dans votre journée</p>`:''}</section>`
    : `<section class="calm-focus"><span class="eyebrow">Aujourd’hui</span><h2>De quoi avez-vous envie ?</h2>${P('Une suggestion courte, adaptée au temps que vous avez.')}${intent('Trouver une idée en 5 minutes','Cheveux, couleurs ou soin de la peau','catalog',{time:'5 minutes'},'sparkles')}</section>`;
  const occasion=next?eventCard(next):intent('Préparer une occasion','Choisir une coiffure pour une date','new-event',{},'calendar');
  return head(M.profile.name?'Bonjour '+esc(M.profile.name):'Un moment pour vous',dateText(DATE()))+focus+studioStrip()+`<div class="quick-links">${B(icon('calendar')+' Semaine','ACC-02','secondary')}${B(icon('sun')+' Routines','ROU-01','secondary')}</div>`+calmDisclosure('Ma prochaine occasion',occasion,next?dateText(next.date):'Aucune date')+calmDisclosure('Mon espace',B('Mon journal','PRO-01','secondary')+B('Mes messages','ACC-04','secondary mt'));
};

V['ANA-01']=()=>{
  const draft=M.draft.status!=='complete'&&(M.draft.photo||Object.keys(M.draft.answers||{}).length)
    ? row('Reprendre mon analyse',M.draft.domain,M.draft.phase,'spark') : '';
  const results=['Cheveux','Colorimétrie','Peau'].map(domain=>{
    const result=studioLatest(domain);
    return result?reportCard(result):row(domain,'Aucune analyse enregistrée','ANA-02',DOMAINS.find(x=>x[0]===domain)?.[1]||'spark');
  }).join('');
  return head('Analyser')+draft+`<section class="calm-choice"><span class="eyebrow">Choisir un bilan</span><div class="calm-studio-list">${calmActionLink('Les coupes qui me correspondent','4 recommandations','studio-analysis','Cheveux','hair')}${calmActionLink('Les couleurs qui me mettent en valeur','Profil 12 saisons','studio-analysis','Colorimétrie','palette')}${calmActionLink('Comprendre les besoins de ma peau','Rituel matin et soir','studio-analysis','Peau','leaf')}</div></section>`+calmDisclosure('Mes résultats',results)+calmDisclosure('Historique et données',B('Tous mes comptes rendus','ANA-12','secondary')+B('Mes photos','PRF-07','secondary mt'));
};

function calmStudioHomeLinks(){
  const interests=M.prefs.interests||[],domains=[...interests,...['Cheveux','Colorimétrie','Peau']].filter((domain,index,all)=>['Cheveux','Colorimétrie','Peau'].includes(domain)&&all.indexOf(domain)===index);
  return domains.map(domain=>domain==='Cheveux'?calmStudioLink('Mes coupes recommandées','','HAI-01','hair',studioRemaining()+' essai'+(studioRemaining()>1?'s':'')):domain==='Colorimétrie'?calmStudioLink('Mon profil 12 saisons','','COL-01','palette','Couleurs'):calmStudioLink('Mon rituel de peau','','PEA-01','leaf','Matin et soir')).join('');
}

function calmFutureModule(title,iconName){
  return `<div class="future-module" aria-disabled="true"><span class="future-module-icon">${icon(iconName)}<i>${icon('lock')}</i></span><strong>${esc(title)}</strong><small>Bientôt</small></div>`;
}

V['DEC-01']=()=>head('Mes studios')+`<section class="available-studios"><span class="eyebrow">Disponible maintenant</span><div class="calm-studio-list">${calmStudioLink('Cheveux','Coupes recommandées et essais','HAI-01','hair',studioRemaining()+' essai'+(studioRemaining()>1?'s':''))}${calmStudioLink('Couleurs','Votre profil complet','COL-01','palette','12 saisons')}${calmStudioLink('Peau','Bilan et rituels','PEA-01','leaf','Matin et soir')}</div></section><section class="future-dock" aria-label="Fonctionnalités à venir"><div class="future-dock-title"><span class="eyebrow">Plus tard</span><small>Un aperçu, sans faux bouton</small></div><div class="future-module-grid">${calmFutureModule('Maquillage','eye')}${calmFutureModule('Garde-robe','dress')}${calmFutureModule('Tutoriels','spark')}</div></section>`;

V['HAI-01']=()=>{
  studioEnsure();const tab=M.hairTab||'Recommandées',premium=uxIsPremium(),remaining=studioRemaining(),draft=uxHairDraft();
  const credits=`<div class="hair-credit"><span>${icon('spark')}<strong>${remaining}</strong> essai${remaining>1?'s':''}</span><small>${premium?'sur 10 ce mois-ci':'offert'}</small></div>`;
  if(!M.hairProfile){
    const examples=STUDIO_HAIRCUTS.slice(0,4);
    return head('Hair Studio')+credits+draft+`<section class="hair-start"><span class="hair-start-icon">${icon('face')}</span><h2>Quelles coupes vous vont ?</h2>${A('Créer mon profil coupe','studio-analysis',{domain:'Cheveux'})}</section>`+`<div class="hair-report-title"><span><small>Avant de commencer</small><strong>Quelques styles</strong></span></div>`+calmHairGallery(examples);
  }
  let content='';
  if(tab==='Couleurs')content=uxHairColorPanel();
  else if(tab==='Toutes'){
    let cuts=STUDIO_HAIRCUTS.slice();if(M.hairLengthFilter!=='Toutes')cuts=cuts.filter(cut=>cut.length===M.hairLengthFilter);cuts.sort((a,b)=>a.name.localeCompare(b.name));
    content=`<div class="hair-filter-title"><strong>Toutes les coupes</strong><small>${cuts.length} résultats</small></div>${calmTabs([['Toutes','Toutes'],['Très court','Très court'],['Court','Court'],['Mi-long','Mi-long'],['Long','Long']],'hairLengthFilter',M.hairLengthFilter,'Filtrer par longueur')}${calmHairGallery(cuts)}`;
  }else content=calmHairRanking();
  return head('Mon rapport coupe')+credits+draft+calmHairProfile()+calmTabs([['Recommandées','Top 4'],['Toutes','Toutes'],['Couleurs','Couleurs']],'hairTab',tab,'Vue du rapport coupe')+`<div role="region" aria-live="polite">${content}</div>`+A('Mes simulations','saved-hair-sims',{},'secondary mt');
};

V['COL-01']=()=>{
  uxEnsure();if(M.previewSeason)return CALM_BASE.color();
  const profile=color12ReportProfile(null);
  if(!profile)return head('Color Studio')+`<section class="color-start"><span class="color-start-icon">${icon('palette')}</span><h2>Quelles couleurs vous illuminent ?</h2>${A('Trouver ma saison','studio-analysis',{domain:'Colorimétrie'})}</section><div class="color-section-title"><strong>Explorer les 12 saisons</strong></div>`+calmColorFamilies();
  const season=COLOR12_SEASONS[profile.season],tab=['Profil','Palette','Cheveux','À comparer','À éviter'].includes(M.colorSeasonTab)?M.colorSeasonTab:'Profil';M.colorSeasonTab=tab;let content='';
  if(tab==='Palette')content=calmColorPalette(profile,season);
  else if(tab==='Cheveux')content=calmColorHair(season);
  else if(tab==='À comparer'||tab==='À éviter')content=calmColorSwaps(season);
  else content=calmColorProfile(profile,season);
  return head('Mon rapport couleur')+calmColorTabs(tab)+`<div role="region" aria-live="polite">${content}</div><div class="color-report-actions">${A('Comparer','choice',{key:'colorSeasonTab',value:'À comparer',pressed:tab==='À comparer'},'text-button')}${B('Explorer les 12 saisons','COL-02','text-button')}</div>`;
};

V['PEA-01']=()=>{
  const tab=M.skinTab||'Analyse',routines=M.routines.filter(routine=>routine.domain==='Peau'),progressSession=uxInProgressRoutine();
  let content='';
  if(tab==='Analyse'){
    content=!M.skinProfile?`<section class="skin-start"><span class="skin-start-icon">${icon('leaf')}</span><h2>Comprendre ma peau</h2>${A('Faire mon bilan','studio-analysis',{domain:'Peau'})}</section>`:`<section class="skin-summary"><span class="eyebrow">Ma priorité</span><h2>${esc(M.skinProfile.goal)}</h2><div class="skin-traits compact">${studioSkinTraits().map((trait,index)=>`<div><span>${icon(index===0?'drop':index===1?'heart':'spark')}</span><strong>${esc(trait)}</strong></div>`).join('')}</div>${M.skinPlan?`<div class="skin-plan-preview">${A(`<span>${icon('sun')}</span><strong>Matin</strong><small>${M.skinPlan.morning.length} gestes</small>`,'choice',{key:'skinTab',value:'Matin'},'skin-plan-shortcut')}${A(`<span>${icon('moon')}</span><strong>Soir</strong><small>${M.skinPlan.evening.length} gestes</small>`,'choice',{key:'skinTab',value:'Soir'},'skin-plan-shortcut')}</div>${A('Ajouter mes deux rituels','skin-apply-plan')}`:''}${A('Modifier mon bilan','studio-analysis',{domain:'Peau'},'text-button calm-skip')}</section>`;
  }else if(tab==='Suivi')content=row('Mes observations','Photos et ressentis','PRO-01','bars')+A('Ajouter une observation','skin-add-observation');
  else content=uxRoutineRows(routines.filter(routine=>routine.moment===tab))||empty('Aucun rituel',tab==='Matin'?'Ajoutez votre rituel du matin.':'Ajoutez votre rituel du soir.')+A('Créer un rituel','new-routine');
  return head('Skin Studio')+(progressSession?`<div class="skin-progress-shortcut"><span><small>En cours</small><strong>${esc(progressSession.name)}</strong></span>${B('Reprendre','ROU-04','text-button',{key:'routine',value:progressSession.ref})}</div>`:'')+calmSkinTabs(tab)+`<div role="region" aria-live="polite">${content}</div>`;
};

V['ANA-10']=()=>{
  const result=report();
  if(result?.domain!=='Cheveux')return CALM_BASE.analysisResult();
  return head('Vos meilleures coupes')+calmHairProfile()+calmHairRanking()+B('Ouvrir mon rapport complet','HAI-01')+A('Corriger mon profil','edit-analysis',{},'text-button calm-skip');
};

ACTIONS['haircut-open']=data=>{
  const cut=STUDIO_HAIRCUTS.find(item=>item.id===data.id);if(!cut)return;M.haircutSelected=cut.id;
  modal(cut.name,studioHairTile(cut,true)+`<div class="hair-modal-fit"><span class="eyebrow">Pourquoi elle vous va</span><strong>${esc(uxHairFit(cut))}</strong><p>${esc(cut.reason)}</p></div><div class="cut-meta"><span>${esc(cut.length)}</span><span>${esc(cut.care)}</span></div>`+calmDisclosure('À dire au salon',P(esc(cut.salon)))+A('Essayer sur ma photo','haircut-simulate',{id:cut.id})+A('Fermer','close',{},'text-button calm-skip'));
};

V['PRE-01']=()=>{
  const comparison=`<div class="offer-comparison calm-offer-list"><div><span>Découverte</span><p>1 simulation de coupe offerte, profil 12 saisons et rituel de peau.</p></div><div><span>Premium</span><p>10 simulations de coupes renouvelées chaque mois, résultats et historique.</p></div></div>`;
  return head('Beautify Premium')+`<section class="glass premium-value calm-premium"><span class="eyebrow">Chaque mois</span><p class="calm-premium-number">10</p><h2>simulations de coupes</h2></section>`+`<fieldset class="billing calm-billing"><legend>Choisir mon rythme</legend>${['monthly','yearly'].map(value=>A(`<strong>${value==='yearly'?'Annuel':'Mensuel'}</strong><span>${value==='yearly'?'59,99 € / an':'9,99 € / mois'}</span><small>${value==='yearly'?'≈ 5 € / mois':'Sans engagement'}</small>`,'offer',{value,pressed:M.subscription.offer===value},M.subscription.offer===value?'selected':'')).join('')}</fieldset>`+A('Choisir Premium — démonstration','subscribe')+A('Continuer gratuitement','premium-return',{},'text-button calm-skip')+calmDisclosure('Comparer les accès',comparison)+note('Démonstration : aucun débit réel.');
};

// Guest-first onboarding: an account is a sync option, never a prerequisite.
V['ENT-02']=()=>`<div class="welcome-brand">${logo(true)}</div><div class="welcome-editorial">${imageFor('beautify-hair-hero-turkey-v2','','Portrait éditorial, cheveux bruns ondulés')}<span class="editorial-caption">Beauté. Style. Vous.</span></div><div class="welcome-copy"><span class="welcome-private">${icon('lock')} Aucun compte requis</span><h1 tabindex="-1">Ce qui vous va.<br><span class="accent">Vraiment.</span></h1>${P('Coupes, couleurs et peau réunies dans un seul espace.')}${B('Commencer','ENT-03')}</div>`;

function calmOnboardingChoice(title,meta,domain,iconName){
  return A(`<span class="onboarding-choice-icon">${icon(iconName)}</span><span><strong>${esc(title)}</strong><small>${esc(meta)}</small></span>${icon('chev')}`,'onboarding-domain',{domain},'onboarding-choice');
}

V['ENT-03']=()=>head('Par quoi commencer ?','Un seul choix suffit. Vous pourrez tout retrouver ensuite.')+`<div class="onboarding-choice-list">${calmOnboardingChoice('Mes meilleures coupes','4 recommandations et essai sur photo','Cheveux','hair')}${calmOnboardingChoice('Mes couleurs','Profil complet en 12 saisons','Colorimétrie','palette')}${calmOnboardingChoice('Ma peau','Bilan et rituel matin / soir','Peau','leaf')}</div>`+B('Voir tous les studios','DEC-01','text-button mt');

V['ENT-05']=()=>head('Sauvegarder mes données','Facultatif : seulement pour les retrouver sur un autre appareil.')+`<div class="account-benefits"><span>${icon('check')} Synchroniser mes rapports</span><span>${icon('check')} Retrouver mes simulations</span><span>${icon('check')} Restaurer mon accès Premium</span></div>`+MOCK_NOTICE+form('register',field('name','Prénom ou pseudo',M.profile.name,'text',true)+field('email','Adresse email','mia@example.test','email',true)+check('terms','J’accepte de parcourir la synchronisation simulée.'),'Activer la synchronisation')+A('Continuer sans compte','account-cancel',{},'text-button calm-skip');

function calmResultCard(domain){
  if(domain==='Cheveux'){
    const ready=!!M.hairProfile,shape=String(M.hairProfile?.shape||'').replace(' — déclaré','');
    return A(`<span class="result-icon">${icon('hair')}</span><span class="result-copy"><small>COUPES</small><strong>${ready?'Top 4 prêt':'À découvrir'}</strong><em>${esc(ready?(shape||M.hairProfile.texture||'Profil créé'):'Créez votre profil coupe')}</em></span><span class="result-state ${ready?'ready':''}">${ready?icon('check'):icon('arrow')}</span>`,'result-open',{domain},'result-card');
  }
  if(domain==='Colorimétrie'){
    const profile=color12ReportProfile(null),season=profile&&COLOR12_SEASONS[profile.season];
    return A(`<span class="result-icon">${icon('palette')}</span><span class="result-copy"><small>COULEURS</small><strong>${profile?esc(uxSeasonLabel(profile.season)):'À découvrir'}</strong><em>${profile?'Palette 12 saisons':'Trouvez votre saison'}</em></span>${season?color12Band(season,4,'result-color-band'):`<span class="result-state">${icon('arrow')}</span>`}`,'result-open',{domain},'result-card');
  }
  const ready=!!M.skinProfile;
  return A(`<span class="result-icon">${icon('leaf')}</span><span class="result-copy"><small>PEAU</small><strong>${ready?esc(M.skinProfile.goal||'Bilan prêt'):'À découvrir'}</strong><em>${ready?'Matin et soir':'Comprenez vos besoins'}</em></span><span class="result-state ${ready?'ready':''}">${ready?icon('check'):icon('arrow')}</span>`,'result-open',{domain},'result-card');
}

function calmSimulationCard(simulation){
  const cut=STUDIO_HAIRCUTS.find(item=>item.id===simulation.haircut);
  return A(`${cut?studioHairTile(cut):imageFor(simulation.image||'layers','','Simulation de coupe')}<span><strong>${esc(cut?.name||simulation.name)}</strong><small>${dateText(simulation.date)}</small></span>`,'result-simulation',{id:simulation.id},'result-simulation-card');
}

V['SAV-01']=()=>{
  const simulations=M.simulations.slice().reverse();
  return head('Mes résultats','Tout ce qui est personnel, automatiquement au même endroit.')+`<div class="result-stack">${calmResultCard('Cheveux')}${calmResultCard('Colorimétrie')}${calmResultCard('Peau')}</div>`+(simulations.length?`<div class="result-section-title"><span><small>SIMULATIONS</small><strong>Mes essais de coupes</strong></span><span>${simulations.length}</span></div><div class="result-simulation-grid">${simulations.slice(0,6).map(calmSimulationCard).join('')}</div>`:`<div class="result-empty"><span>${icon('spark')}</span><div><strong>Vos simulations apparaîtront ici</strong><small>Elles sont conservées automatiquement après chaque essai.</small></div></div>`);
};

V['PRF-01']=()=>{
  const accountAction=M.profile.connected?row('Compte et synchronisation',M.profile.email||'Accès connecté','PRF-02','check'):B(`${icon('lock')} Sauvegarder et synchroniser`,'ENT-05','secondary optional-account');
  return head('Mon espace')+`<section class="glass mock-profile simple-profile">${M.profile.avatar?imageFor(M.profile.avatar,'avatar','Ma photo de profil'):`<div class="account-icon">${icon('user')}</div>`}<div><h2>${esc(M.profile.name||'Votre espace')}</h2><p>${M.profile.connected?'Données synchronisées':'Données sur cet appareil'}</p>${B('Modifier','PRF-02','text-button')}</div></section>`+accountAction+row('Mes préférences','Affiner mes recommandations','PRF-03','spark')+row('Mon abonnement',subscriptionLabel(),'PRF-06','star')+row('Photos et confidentialité','Gérer mes données','PRF-07','lock')+row('Réglages et aide','Notifications, FAQ, informations','PRF-04','settings');
};

V['PRF-02']=()=>{const profile=M.profileEdit||M.profile;return head('Mon profil','Le prénom et la photo sont facultatifs.')+form('profile',field('name','Prénom ou pseudo',profile.name)+(M.profile.connected?field('email','Adresse email',profile.email,'email'):'')+A(icon('image')+' Choisir une photo','file-pick',{purpose:'profile'},'secondary')+(profile.avatar?imageFor(profile.avatar,'avatar','Portrait sélectionné pour le profil'):'')+(profile.avatar?A('Retirer ma photo','avatar-remove-request',{},'text-button'):''),'Enregistrer')+(!M.profile.connected?A('Activer la synchronisation','account-sync',{},'text-button calm-skip'):'');};

V['PRF-04']=()=>head('Réglages')+row('Rappels & notifications','Seulement ceux que vous choisissez','PRF-05','calendar')+row('Abonnement','État et restauration','PRF-06','star')+row('Photos et confidentialité','Inventaire et gestion','PRF-07','lock')+row('Aide','Questions fréquentes','PRF-10','spark')+row('À propos de Beautify','Informations et crédits','PRF-11','bookmark')+(M.profile.connected?A('Se déconnecter','logout-request',{},'text-button calm-skip'):'');

// Discovery contains only experiences that can be used today.
catalogResults=function(){
  const filters=M.filters,selection=M.context.selection;
  let source=selection&&M.selectionSource==='Mes enregistrés'?M.saved.map(item).filter(Boolean):[...CATALOG.filter(content=>content.type!=='Routine'),...M.routines];
  if(selection?.kind==='event')source=[...source,...(M.selectionSource==='Mes enregistrés'?[]:M.outfits.filter(outfit=>outfit.pieces))];
  let results=source.filter(content=>!v1UpcomingKey(content)&&(!selection||canSelect(content,selection))&&(!selection?(filters.domain==='Tous'||content.domain===filters.domain)&&(filters.type==='Tous'||content.type===filters.type)&&(filters.occasion==='Toutes'||content.occasion===filters.occasion||content.occasion==='Toutes'):true)&&(!filters.q||fold(content.name+' '+(content.desc||'')+' '+content.domain).includes(fold(filters.q)))&&(!selection?(filters.time==='Tous'||content.minutes<=(filters.time==='5 minutes'?5:15))&&(filters.budget==='Tous'||(filters.budget==='Sans achat'?content.budget==='Sans achat':content.type==='Produit'&&content.price<30)):true));
  if(M.scenario==='empty')results=[];
  if(selection?.kind==='event')results.sort((a,b)=>(b.occasion===M.events.find(event=>event.id===selection.eventId)?.occasion?1:0)-(a.occasion===M.events.find(event=>event.id===selection.eventId)?.occasion?1:0));
  return sec(`${results.length} idée${results.length>1?'s':''}`)+(selection?.kind==='event'?note('Les idées de votre occasion apparaissent d’abord. Vous pouvez aussi choisir une autre inspiration.'):'')+(results.length?grid(results):empty('Aucune correspondance','Essayez un autre mot ou élargissez vos choix.')+A(selection?'Voir toutes les inspirations':'Effacer les filtres','reset-filters',{},'secondary'));
};

const CALM_EVENT_DETAIL=V['EVE-03'];
V['EVE-03']=()=>uxRemoveComingInline(CALM_EVENT_DETAIL());

ACTIONS['onboarding-domain']=data=>{M.started=true;M.navRoot='ANA-01';ACTIONS['studio-analysis']({domain:data.domain});};
ACTIONS['account-sync']=()=>{M.accountReturn='PRF-02';M.accountReturnState=snapshot();go('ENT-05');};
ACTIONS['result-open']=data=>{const ready=data.domain==='Cheveux'?M.hairProfile:data.domain==='Colorimétrie'?color12ReportProfile(null):M.skinProfile;if(ready)go(({Cheveux:'HAI-01',Colorimétrie:'COL-01',Peau:'PEA-01'})[data.domain]);else{M.navRoot='ANA-01';ACTIONS['studio-analysis']({domain:data.domain});}};
ACTIONS['result-simulation']=data=>{const simulation=M.simulations.find(item=>item.id===data.id);if(!simulation)return;go('ESS-03',{context:{simulation:simulation.id,haircut:simulation.haircut}});};
ACTIONS['saved-hair-sims']=()=>{if(!M.simulations.length){modal('Aucune simulation pour le moment',P('Après votre premier essai de coupe, le résultat apparaîtra automatiquement ici.')+A('Choisir une coupe','hair-more')+A('Fermer','close',{},'secondary mt'));return;}go('SAV-01',{root:true});};

V['ESS-03']=()=>{const simulation=M.simulations.find(item=>item.id===M.context.simulation),cut=STUDIO_HAIRCUTS.find(item=>item.id===simulation?.haircut);if(!cut)return empty('Simulation indisponible','Retrouvez vos autres résultats.','SAV-01','Mes résultats');return head('Ma simulation',cut.name)+`<div class="comparison studio-comparison"><div>${simulation.source?imageFor(simulation.source,'','Photo de départ'):panel(P('Photo retirée'))}<h3>Avant</h3></div><div>${studioHairTile(cut,true)}<h3>Coupe choisie</h3></div></div>`+panel(`<span class="eyebrow">À montrer au salon</span><h2>${esc(cut.name)}</h2>${P(esc(cut.salon))}`)+B('Tous mes résultats','SAV-01')+A('Essayer une autre coupe','hair-more',{},'secondary mt')+note('Cette simulation est conservée automatiquement dans le mockup.');};
