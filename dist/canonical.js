'use strict';

/* Canonical web rendering of the current Beautify mobile language. */
const CANONICAL_ANALYSIS_DURATION_MS=15000;
// A run belongs to this visible loading screen only, never to a saved draft.
let canonicalAnalysisRun=null;
function canonicalDiscardAnalysis(){
  clearTimeout(timer);canonicalAnalysisRun=null;
  if(M.draft.status==='complete')return;
  const {domain,entryState}=M.draft;
  clearDrafts('analysis-answers');clearDrafts('consent');
  M.draft={...clone(initial().draft),id:uid('draft'),domain,phase:'ANA-04',entryState:entryState||null};
  canonicalPhotoRequest++;
  M.analysisQuestionStep=0;M.scenario='normal';
}
function canonicalBeginAnalysis(){
  canonicalAnalysisRun={draft:M.draft};
  M.draft.phase='ANA-08';M.draft.status='processing';
  go('ANA-08');
}
window.addEventListener('pagehide',()=>{
  if(canonicalAnalysisRun||M.draft.status==='processing'){canonicalDiscardAnalysis();persist();}
});
window.addEventListener('pageshow',()=>{
  if(route==='ANA-08'&&!canonicalAnalysisRun&&M.draft.status!=='complete')render({focus:true,scroll:0});
});

M.canonicalReportStep=Number(M.canonicalReportStep)||0;

function canonicalMotif(domain,large){
  const kind=domain==='Colorimétrie'?'color':domain==='Peau'?'skin':'hair';
  const body=icon(kind==='color'?'palette':kind==='hair'?'hair':'drop');
  return '<span class="canonical-motif '+kind+(large?' large':'')+'">'+body+'</span>';
}

function canonicalModuleState(domain){
  if(domain==='Cheveux'){
    if(M.hairProfile)return 'Dernier résultat : '+String(M.hairProfile.shape||'Rapport prêt').replace(' — déclaré','');
    return 'Forme du visage et coupes';
  }
  if(domain==='Colorimétrie'){
    const profile=typeof color12ReportProfile==='function'?color12ReportProfile(null):null;
    return profile?'Dernier résultat : '+profile.name:'Profil complet en 12 saisons';
  }
  return M.skinProfile?'Dernier bilan : '+(M.skinProfile.goal||'Rapport prêt'):'Besoins visibles et routine';
}

function canonicalModuleRow(domain){
  return A(
    canonicalMotif(domain)+
    '<span class="canonical-module-copy"><strong>'+esc(domain==='Colorimétrie'?'Couleur':domain)+'</strong><small>'+esc(canonicalModuleState(domain))+'</small></span>'+
    icon('chev'),
    'studio-analysis',
    {domain:domain},
    'canonical-module-row'
  );
}

V['ACC-01']=function(){
  const actions=dailyActions();
  const next=actions.find(function(action){return !action.done;});
  const date=dateText(DATE());
  return '<div class="canonical-today">'+
    '<div class="canonical-today-copy"><span class="eyebrow">'+esc(M.profile.name?'Bonjour '+M.profile.name:date)+'</span><h1 tabindex="-1">'+(next?'Un moment pour vous,<br>aujourd’hui.':'Aujourd’hui est calme,<br>pour le moment.')+'</h1></div>'+
    '<div class="canonical-today-visual">'+imageFor('hair-butterfly-v2','','Illustration Beautify')+'</div>'+
    '<div class="canonical-today-bottom">'+
      (next
        ? A('<span>'+icon(next.kind==='routine'?'sun':'spark')+'</span><span><strong>'+esc(next.name)+'</strong><small>'+esc(next.done?'Terminé':'À votre rythme')+'</small></span>'+icon('chev'),'task-open',{id:next.id},'canonical-today-card')
        : '<p>Commencez une nouvelle analyse depuis Mes analyses.</p>')+
    '</div>'+
  '</div>';
};

function canonicalPaletteHero(values){
  const swatches=values?values.slice(0,6).map(x=>x[1]):['#1b1b22','#1f4e5f','#8e2f4b','#c77d6b','#e7d8c6','#dce6ea'];
  return '<div class="canonical-palette-hero" aria-hidden="true">'+swatches.map(function(color){return '<i style="--swatch:'+color+'"></i>';}).join('')+'</div>';
}

function canonicalChecklist(items){
  return '<div class="canonical-checklist">'+items.map(function(item){
    return '<div class="canonical-check"><span>'+icon('check')+'</span><strong>'+esc(item)+'</strong></div>';
  }).join('')+'</div>';
}

function canonicalHero(domain){
  if(domain==='Colorimétrie')return canonicalPaletteHero();
  if(domain==='Peau')return '<div class="canonical-object skin"><div class="canonical-skin-object">'+icon('bottle')+'</div></div>';
  return '<div class="canonical-object">'+imageFor('hair-butterfly-v2','','Illustration de coupe de cheveux')+'</div>';
}

function canonicalAnalysisCopy(domain){
  if(domain==='Colorimétrie')return {
    eyebrow:'Analyse couleur',
    title:'Certaines couleurs fonctionnent, tout simplement.',
    cta:'Trouver mes couleurs',
    items:['Votre saison, mesurée','Votre palette et vos meilleurs neutres','Les couleurs à éviter et leurs alternatives','Vos teintes cheveux, maquillage et métaux']
  };
  if(domain==='Peau')return {
    eyebrow:'Analyse de peau',
    title:'Une routine plus juste commence par votre peau.',
    cta:'Comprendre ma peau',
    items:['Les signes visibles sur votre photo','Vos priorités essentielles','Une routine simple matin et soir','Les précautions à garder en tête']
  };
  return {
    eyebrow:'Analyse cheveux',
    title:'La bonne coupe commence par la forme de votre visage.',
    cta:'Trouver mes coupes',
    items:['La forme de votre visage, mesurée','Les coupes qui la valorisent — et celles à éviter','Les couleurs de cheveux liées à votre saison']
  };
}

V['ANA-01']=function(){
  return '<div class="canonical-sheet-page"><section class="canonical-sheet" aria-label="Nouvelle analyse">'+
    '<div class="canonical-grabber" aria-hidden="true"></div>'+
    '<div class="canonical-sheet-head"><h1 tabindex="-1">Nouvelle analyse</h1></div>'+
    '<div class="canonical-module-list">'+canonicalModuleRow('Colorimétrie')+canonicalModuleRow('Peau')+canonicalModuleRow('Cheveux')+'</div>'+
    '<p class="canonical-sheet-note">'+icon('shield')+' Démo : votre photo reste uniquement dans cet onglet.</p>'+
  '</section></div>';
};
V['ANA-02']=V['ANA-01'];

V['ANA-03']=function(){
  const copy=canonicalAnalysisCopy(M.draft.domain);
  return '<div class="canonical-start">'+
    '<div class="canonical-start-main">'+
      canonicalHero(M.draft.domain)+
      '<div class="canonical-copy"><span class="eyebrow">'+esc(copy.eyebrow)+'</span><h1 tabindex="-1">'+esc(copy.title)+'</h1></div>'+
      canonicalChecklist(copy.items)+
    '</div>'+
    '<div class="canonical-start-actions"><form data-form="consent" data-draft-key="consent" class="form-stack"><input type="hidden" name="consent" value="on"><p class="form-feedback" role="alert" hidden></p><button class="primary" type="submit">'+esc(copy.cta)+'</button></form><p class="canonical-privacy">Mode démo : résultats illustratifs. Votre photo reste dans cet onglet jusqu’à son retrait ou au rechargement.</p></div>'+
  '</div>';
};

function canonicalFrame(tone,caption){
  return '<figure class="canonical-frame '+tone+'"><div class="canonical-frame-visual"><span class="canonical-frame-face">'+icon('face')+'</span><span class="canonical-frame-badge">'+icon(tone==='avoid'?'x':'check')+'</span></div><figcaption>'+esc(caption)+'</figcaption></figure>';
}

function canonicalRules(items){
  return '<div class="canonical-rules">'+items.map(function(item){
    return '<div class="canonical-rule"><span>'+icon('check')+'</span><strong>'+esc(item)+'</strong></div>';
  }).join('')+'</div>';
}

function canonicalCapture(){
  const domain=M.draft.domain;
  const title=domain==='Colorimétrie'?'Une bonne photo suffit pour trouver vos couleurs.':domain==='Peau'?'Une bonne photo suffit pour observer votre peau.':'Une bonne photo suffit pour trouver vos coupes.';
  const rules=domain==='Cheveux'
    ?['Visage et cheveux entièrement visibles','Cheveux dégagés du visage','Lumière naturelle et uniforme','Expression neutre, sans filtre']
    :domain==='Peau'
      ?['Visage entièrement visible','Peau propre si possible','Lumière naturelle et uniforme','Sans filtre ni mode beauté']
      :['Visage entièrement visible','Lumière du jour indirecte','Aucun filtre ni retouche','Évitez les lumières colorées'];
  return '<div class="canonical-capture">'+
    '<div class="canonical-capture-main">'+
      '<div class="canonical-capture-title"><span class="eyebrow">'+esc(canonicalAnalysisCopy(domain).eyebrow)+'</span><h1 tabindex="-1">'+esc(title)+'</h1></div>'+
      '<div class="canonical-framing">'+canonicalFrame('good','Lumière uniforme, visage centré')+canonicalFrame('avoid','Ombre, filtre ou visage incliné')+'</div>'+
      canonicalRules(rules)+
    '</div>'+
    '<div class="canonical-capture-actions">'+
      A('Prendre un selfie','file-pick',{purpose:'analysis',source:'camera',label:'Prendre un selfie avec la caméra'})+
      A('Choisir une photo','file-pick',{purpose:'analysis',source:'gallery',label:'Choisir une photo dans la galerie'},'text-button')+
      '<p class="canonical-privacy">Photo conservée uniquement en mémoire dans cet onglet.</p>'+
    '</div>'+
  '</div>';
}

V['ANA-04']=canonicalCapture;
V['ANA-05']=canonicalCapture;

function canonicalEngineAnswers(domain){
  if(domain==='Cheveux')return typeof rwHairObservation==='function'?rwHairObservation(M.draft.photo):{shape:'Ovale',texture:'Ondulés',length:'Mi-longue'};
  if(domain==='Colorimétrie')return {colorGoal:'Tout mon look',temperatureHint:'Froide / rosée',depthHint:'Profonde',chromaHint:'Nettes / lumineuses',contrastHint:'Fort'};
  return {afterWash:'Cela dépend',sensitivity:'Parfois',skinGoal:'Routine simple'};
}

function canonicalHasPhoto(key=M.draft.photo){
  return !!(key&&(!String(key).startsWith('photo-')||memoryPhotos[key]));
}

let canonicalPhotoRequest=0;
const CANONICAL_LOAD_PHOTO=loadPhoto;
loadPhoto=function(file,purpose){
  if(!['analysis','simulation'].includes(purpose))return CANONICAL_LOAD_PHOTO(file,purpose);
  if(!file)return;
  if(!file.type.startsWith('image/')||file.size>15*1024*1024){toast('Choisissez une image de moins de 15 Mo.');return;}
  const key=uid('photo');
  const url=URL.createObjectURL(file);
  const draft=M.draft,fromRoute=route,request=++canonicalPhotoRequest,cut=M.haircutSelected,analysis=M.haircutAnalysis||'';
  const dialog=document.getElementById('overlay').innerHTML;
  const probe=new Image();
  probe.onload=function(){
    if(request!==canonicalPhotoRequest||M.draft!==draft||route!==fromRoute){URL.revokeObjectURL(url);return;}
    if(purpose==='simulation'&&(M.haircutSelected!==cut||(M.haircutAnalysis||'')!==analysis||document.getElementById('overlay').innerHTML!==dialog)){URL.revokeObjectURL(url);return;}
    captureDrafts();
    memoryPhotos[key]=url;
    if(purpose==='simulation'){
      M.simulationPhoto=key;closeModal(false);ACTIONS['haircut-simulate']({id:cut,analysis});persist();return;
    }
    // A photo selected from a completed capture starts a fresh analysis.
    // Keep the previous report and its photo intact in history.
    if(draft.status==='complete'||M.analyses.some(r=>r.id===draft.reportId)){
      M.draft={...clone(initial().draft),id:uid('draft'),domain:draft.domain,consent:draft.consent,entryState:draft.entryState||null};
      M.context.analysis='';M.canonicalReportStep=0;
    }
    M.draft.photo=key;
    M.draft.withoutPhoto=false;
    // The capture page explains the demo; choosing a valid photo starts it.
    // Do not mark this intent on entry, cancellation or a failed image load.
    M.draft.consent=true;
    M.draft.answers=canonicalEngineAnswers(M.draft.domain);
    canonicalBeginAnalysis();
  };
  probe.onerror=function(){URL.revokeObjectURL(url);toast('Cette image ne peut pas être ouverte.');};
  probe.src=url;
};

V['ANA-06']=function(){
  if(!canonicalHasPhoto())return canonicalCapture();
  return '<div class="canonical-start"><div class="canonical-start-main"><div class="canonical-result-halo">'+canonicalPhotoHalo()+'</div><div class="canonical-copy"><span class="eyebrow">Photo sélectionnée</span><h1 tabindex="-1">Prête à continuer ?</h1></div>'+canonicalChecklist(['Visage de face et entièrement visible','Lumière naturelle et uniforme','Sans filtre ni retouche'])+'</div><div class="canonical-start-actions">'+A('Lancer mon analyse','canonical-analyze-photo')+A('Changer de photo','remove-photo',{},'text-button')+'</div></div>';
};
V['ANA-07']=V['ANA-06'];

function canonicalPhotoHalo(result){
  const key=result?result.photo:M.draft.photo,domain=result?result.domain:M.draft.domain;
  const visual=canonicalHasPhoto(key)?imageFor(key,'',result?'Photo de ce rapport':'Photo sélectionnée'):icon(domain==='Cheveux'?'face':domain==='Colorimétrie'?'palette':'leaf');
  return '<div class="canonical-halo">'+visual+'</div>';
}

V['ANA-08']=function(){
  clearTimeout(timer);
  if(!canonicalHasPhoto())return empty('Ajoutez votre photo','Elle est nécessaire pour poursuivre la démo.','ANA-04','Choisir une photo');
  if(['error','offline','pending','refused','unavailable'].includes(M.scenario))return head(M.scenario==='pending'?'Analyse en attente':'Analyse interrompue')+panel(P('Réessayez ici.')+A(M.scenario==='pending'?'Vérifier la démo':'Réessayer','canonical-retry-analysis'));
  const run=canonicalAnalysisRun;
  timer=setTimeout(function(){if(run&&canonicalAnalysisRun===run&&run.draft===M.draft&&route==='ANA-08')ACTIONS['finish-analysis']();},CANONICAL_ANALYSIS_DURATION_MS);
  const label=M.draft.domain==='Cheveux'?'Votre visage et vos cheveux':M.draft.domain==='Colorimétrie'?'Vos couleurs naturelles':'Les signes visibles de votre peau';
  return '<div class="canonical-analyzing">'+canonicalPhotoHalo()+'<span class="eyebrow">Démo Beautify</span><h1 tabindex="-1">Votre aperçu<br>se prépare.</h1><p>'+esc(label)+'. Résultat illustratif.</p><div class="canonical-progress" aria-label="Analyse en cours"><i></i><i></i><i></i></div></div>';
};

ACTIONS['canonical-analyze-photo']=function(){
  if(!canonicalHasPhoto()){go('ANA-04');return;}
  M.draft.consent=true;
  M.draft.answers=canonicalEngineAnswers(M.draft.domain);
  canonicalBeginAnalysis();
};
ACTIONS['canonical-retry-analysis']=()=>{M.scenario='normal';ACTIONS['canonical-analyze-photo']();};

function canonicalOwned(){
  return ['active','cancelled'].includes(M.subscription&&M.subscription.status);
}

function canonicalLockedRow(label,width){
  return '<div class="canonical-locked-row"><strong>'+esc(label)+'</strong><span class="canonical-mask" style="width:'+(width||'86px')+'"></span>'+icon('lock')+'</div>';
}

function canonicalColorProfile(result){
  return result?color12ReportProfile(result):null;
}

function canonicalTeaser(result){
  const domain=(result&&result.domain)||M.draft.domain;
  if(domain==='Colorimétrie'){
    const profile=canonicalColorProfile(result);
    return {eyebrow:'Votre analyse couleur',value:profile?.name||'Profil à compléter',hint:'Aperçu de démonstration',rows:['Votre palette complète','Vos meilleurs neutres','Couleurs à éviter','Cheveux, maquillage et métaux']};
  }
  if(domain==='Peau'){
    const observation=result?.skinProfile?.traits?.[0]||'Bilan de peau';
    return {eyebrow:'Votre analyse de peau',value:observation,hint:'Aperçu de démonstration',rows:['Votre bilan complet','Priorités de votre peau','Routine du matin','Routine du soir']};
  }
  const shape=result?.faceShape||result?.hairProfile?.shape||result?.answers?.shape||'Profil à compléter';
  return {eyebrow:'Votre analyse cheveux',value:String(shape).replace(' — déclaré',''),hint:'Aperçu de démonstration',rows:['Meilleure coupe','Autres coupes recommandées','Coupes à éviter','Essai IA, 10 par mois']};
}

function canonicalLockedResult(){
  const result=report();
  if(!result)return empty('Aucun rapport à ouvrir','Commencez par une analyse.','ANA-01','Nouvelle analyse');
  if(canonicalOwned())return canonicalReport();
  const teaser=canonicalTeaser(result);
  return '<div class="canonical-lockwall">'+
    '<div class="canonical-lock-main">'+
      '<div class="canonical-result-halo">'+canonicalPhotoHalo(result)+'</div>'+
      '<div class="canonical-lock-copy"><span class="eyebrow">'+esc(teaser.eyebrow)+'</span><h1 tabindex="-1">'+esc(teaser.value)+'</h1><p>'+esc(teaser.hint)+'</p></div>'+
      '<div class="canonical-locked-list">'+teaser.rows.map(function(label,index){return canonicalLockedRow(label,index%2?'74px':'96px');}).join('')+'</div>'+
    '</div>'+
    '<div class="canonical-lock-actions">'+B('Débloquer mon rapport','PRE-01')+'</div>'+
  '</div>';
}

V['ANA-09']=canonicalLockedResult;

function canonicalPaywallMotif(domain){
  return '<div class="canonical-paywall-card">'+canonicalMotif(domain,true)+'<small>'+esc(domain==='Colorimétrie'?'Couleur':domain)+'</small></div>';
}

V['PRE-01']=function(){
  if(canonicalOwned()){
    return '<div class="canonical-start"><div class="canonical-start-main"><div class="canonical-paywall-hero">'+canonicalPaywallMotif('Colorimétrie')+canonicalPaywallMotif('Peau')+canonicalPaywallMotif('Cheveux')+'</div><div class="canonical-copy" style="text-align:center"><span class="eyebrow">Beautify Plus</span><h1 tabindex="-1">Votre abonnement est déjà actif.</h1></div></div><div class="canonical-start-actions">'+A('Ouvrir mon rapport','premium-return')+'</div></div>';
  }
  const annual=M.subscription.offer!=='monthly';
  return '<div class="canonical-paywall">'+
    '<div class="canonical-paywall-header">'+logo()+A(icon('x'),'premium-return',{label:'Fermer le paywall'},'canonical-paywall-close')+'</div>'+
    '<div class="canonical-paywall-hero">'+canonicalPaywallMotif('Colorimétrie')+canonicalPaywallMotif('Peau')+canonicalPaywallMotif('Cheveux')+'</div>'+
    '<div class="canonical-paywall-head"><h1 tabindex="-1">Votre profil beauté complet<br>vous attend</h1><p>Vos résultats personnalisés sont prêts. Beautify Plus débloque les analyses Couleur, Peau et Cheveux.</p></div>'+
    '<div class="canonical-benefits">'+
      '<div class="canonical-benefit"><span>'+icon('palette')+'</span><strong>Profil couleur 12 saisons</strong></div>'+
      '<div class="canonical-benefit"><span>'+icon('hair')+'</span><strong>Coupes et essai IA</strong></div>'+
      '<div class="canonical-benefit"><span>'+icon('leaf')+'</span><strong>Analyse peau et routine</strong></div>'+
      '<div class="canonical-benefit"><span>'+icon('bars')+'</span><strong>Rapports et historique</strong></div>'+
    '</div>'+
    '<div class="canonical-plans">'+
      A('<span class="canonical-plan-radio"></span><span><strong>Annuel, meilleur choix</strong><small>Facturé 59,99 € aujourd’hui</small></span><span class="canonical-plan-price">≈ 5 € / mois</span>','offer',{value:'yearly',pressed:annual},'canonical-plan '+(annual?'selected':''))+
      A('<span class="canonical-plan-radio"></span><span><strong>Mensuel</strong><small>Sans engagement annuel</small></span><span class="canonical-plan-price">9,99 € / mois</span>','offer',{value:'monthly',pressed:!annual},'canonical-plan '+(!annual?'selected':''))+
    '</div>'+
    A('Débloquer Beautify Plus','subscribe')+
    '<p class="canonical-terms">Renouvellement automatique, résiliable à tout moment. Prix de démonstration, aucun débit réel.<br>'+B('Restaurer mes achats','PRE-04','text-button')+'</p>'+
  '</div>';
};

function canonicalReportTabs(domain,result){
  if(domain==='Colorimétrie')return ['Palette','Applications','Saison'];
  if(domain==='Peau')return ['Matin','Soir','Bilan'];
  const tabs=['Coupes','Visage','À éviter'];
  const hasColor=!!COLOR12_SEASONS[result?.colorProfile?.season];
  if(hasColor)tabs.push('Couleur');
  return tabs;
}

function canonicalReportRail(tabs,step){
  return '<nav class="canonical-report-rail" aria-label="Sections du rapport">'+tabs.map(function(tab,index){
    return A(esc(tab), 'canonical-report-jump',{step:index,pressed:index===step,label:'Ouvrir '+tab},index===step?'active':'');
  }).join('')+'</nav>';
}

function canonicalHairCuts(result){
  if(typeof STUDIO_HAIRCUTS==='undefined')return '';
  let cuts=STUDIO_HAIRCUTS.slice();
  const profile=result?.hairProfile||result?.answers||{};
  if(typeof studioHairScore==='function')cuts.sort(function(a,b){return studioHairScore(b,profile)-studioHairScore(a,profile);});
  return '<div class="studio-hair-grid">'+cuts.slice(0,4).map(function(cut,index){
    return A(studioHairTile(cut)+'<span>'+(index===0?'<small class="studio-badge">Meilleure option</small>':'')+'<strong>'+esc(cut.name)+'</strong><small>'+esc(cut.length||'Coupe recommandée')+'</small></span>','haircut-open',{id:cut.id,analysis:result?.id},'studio-hair-card');
  }).join('')+'</div>';
}

function canonicalColorGrid(values){
  return '<div class="canonical-color-grid">'+(values||[]).slice(0,12).map(function(value){
    return '<div class="canonical-color"><i style="--swatch:'+value[1]+'"></i><span>'+esc(value[0])+'</span></div>';
  }).join('')+'</div>';
}

function canonicalAdvice(label,title,copy){
  return '<div class="canonical-advice"><span>'+esc(label)+'</span><strong>'+esc(title)+'</strong><p>'+esc(copy)+'</p></div>';
}

function canonicalHairPanel(tab,result){
  const teaser=canonicalTeaser(result);
  const profile=result?.hairProfile||result?.answers||{};
  if(tab==='Visage'){
    return '<div class="canonical-report-heading"><span class="eyebrow">Votre analyse cheveux</span><h1 tabindex="-1">'+esc(teaser.value)+'</h1><p>La structure de votre visage guide le classement de vos coupes.</p></div><div class="canonical-result-halo">'+canonicalPhotoHalo(result)+'</div><div class="canonical-facts"><div class="canonical-fact"><small>Visage</small><strong>'+esc(teaser.value)+'</strong></div><div class="canonical-fact"><small>Texture</small><strong>'+esc(profile.texture||'Non disponible')+'</strong></div><div class="canonical-fact"><small>Longueur</small><strong>'+esc(profile.length||'Non disponible')+'</strong></div></div>';
  }
  if(tab==='Coupes')return '<div class="canonical-report-heading"><span class="eyebrow">Classées pour vous</span><h1 tabindex="-1">Vos meilleures coupes</h1><p>Ouvrez une coupe pour comprendre pourquoi elle fonctionne et l’essayer.</p></div>'+canonicalHairCuts(result)+A('Explorer toutes les coupes','hair-more',{},'secondary mt')+A('Mes essais coiffure','saved-hair-sims',{},'text-button lg-center-link');
  if(tab==='À éviter')return '<div class="canonical-report-heading"><span class="eyebrow">Garder l’équilibre</span><h1 tabindex="-1">Les coupes moins favorables</h1><p>Ce sont des repères de structure, jamais des interdictions.</p></div><div class="canonical-advice-list">'+canonicalAdvice('À nuancer','Volume uniquement sur les côtés','Il peut élargir visuellement la zone la plus présente du visage.')+canonicalAdvice('À adapter','Lignes très rigides','Un contour plus souple accompagne mieux vos proportions.')+canonicalAdvice('À demander au salon','Mouvement autour du visage','Gardez de la légèreté et adaptez la frange à votre implantation.')+'</div>';
  const season=COLOR12_SEASONS[result?.colorProfile?.season];
  return '<div class="canonical-report-heading"><span class="eyebrow">Lié à votre saison</span><h1 tabindex="-1">Vos couleurs de cheveux</h1><p>Préservez la profondeur et la température de votre profil couleur.</p></div>'+(season?'<div class="ux-colour-names">'+season.hair.best.map(name=>'<span>'+esc(name)+'</span>').join('')+'</div>':canonicalAdvice('Recommandation','Brun profond et reflets froids','Choisissez une profondeur proche de votre base naturelle.'));
}

function canonicalColorPanel(tab,result){
  const profile=canonicalColorProfile(result);
  const season=profile?COLOR12_SEASONS[profile.season]:null;
  if(!season)return canonicalAdvice('Profil couleur','Résultat à confirmer','Relancez une analyse dans une lumière naturelle uniforme.');
  if(tab==='Applications')return '<div class="canonical-report-heading"><h1 tabindex="-1">Porter mes couleurs</h1></div>'+experienceColorUses(season)+'<details class="ux-details"><summary>Les couleurs à nuancer</summary><div class="canonical-advice-list">'+season.avoid.map(pair=>canonicalAdvice(pair[0][0]+' → '+pair[1][0],pair[1][0],pair[2])).join('')+'</div></details><details class="ux-details"><summary>Mes repères pour une coloration</summary>'+canonicalColorPanel('Cheveux',result)+'</details>';
  if(tab==='Saison')return '<div class="canonical-report-heading"><span class="eyebrow">Profil 12 saisons</span><h1 tabindex="-1">'+esc(season.name)+'</h1><p>'+esc(season.summary)+'</p></div>'+canonicalPaletteHero(season.colors)+'<div class="canonical-facts">'+season.axes.slice(0,3).map(function(axis,index){return '<div class="canonical-fact"><small>'+['Température','Profondeur','Intensité'][index]+'</small><strong>'+esc(axis)+'</strong></div>';}).join('')+'</div>';
  if(tab==='Palette')return '<div class="canonical-report-heading"><span class="eyebrow">'+esc(season.name)+'</span><h1 tabindex="-1">Vos couleurs</h1></div>'+canonicalColorGrid(season.colors);
  if(tab==='Neutres')return '<div class="canonical-report-heading"><span class="eyebrow">Bases faciles</span><h1 tabindex="-1">Vos meilleurs neutres</h1><p>Pour manteaux, vestes, hauts essentiels et accessoires.</p></div>'+canonicalColorGrid(season.neutrals);
  if(tab==='À éviter')return '<div class="canonical-report-heading"><span class="eyebrow">Des alternatives, pas des règles</span><h1 tabindex="-1">À porter autrement</h1></div><div class="canonical-advice-list">'+season.avoid.map(function(pair){return canonicalAdvice(pair[0][0]+' → '+pair[1][0],pair[1][0],pair[2]);}).join('')+'</div>';
  return '<div class="canonical-report-heading"><span class="eyebrow">Coloration</span><h1 tabindex="-1">Vos couleurs de cheveux</h1><p>'+esc(season.hair.note)+'</p></div><div class="canonical-advice-list">'+season.hair.best.map(function(name,index){return canonicalAdvice(index===0?'Meilleure direction':'Option '+(index+1),name,'À ajuster avec votre base naturelle et votre coloriste.');}).join('')+'</div>';
}

function canonicalSkinPanel(tab,result){
  const plan=result?.skinPlan||{morning:[],evening:[]};
  const profile=result?.skinProfile||{goal:'Ancien bilan',traits:[]};
  if(!result?.skinPlan||!result?.skinProfile)return empty('Ce bilan est incomplet','Relancez une analyse pour obtenir vos routines.','ANA-01','Nouvelle analyse');
  if(tab==='Bilan')return canonicalSkinPanel('Lecture',result)+'<details class="ux-details"><summary>Mes priorités</summary>'+canonicalSkinPanel('Priorités',result)+'</details>';
  if(tab==='Lecture')return '<div class="canonical-report-heading"><span class="eyebrow">Votre analyse de peau</span><h1 tabindex="-1">'+esc(profile.goal||'Routine simple')+'</h1><p>Une observation cosmétique, jamais un diagnostic médical.</p></div><div class="canonical-result-halo">'+canonicalPhotoHalo(result)+'</div><div class="canonical-facts">'+(profile.traits||[]).slice(0,3).map(function(trait,index){return '<div class="canonical-fact"><small>'+['Hydratation','Confort','Éclat'][index]+'</small><strong>'+esc(trait.replace(/ à .*/,''))+'</strong></div>';}).join('')+'</div>';
  if(tab==='Priorités')return '<div class="canonical-report-heading"><span class="eyebrow">Aller à l’essentiel</span><h1 tabindex="-1">Vos priorités</h1><p>Peu de gestes, dans un ordre facile à suivre.</p></div><div class="canonical-advice-list">'+(profile.traits||[]).map(function(trait,index){return canonicalAdvice('Priorité '+(index+1),trait,index===0?'Commencez doucement et observez le confort.':'Ajustez seulement si votre peau le demande.');}).join('')+'</div>';
  const steps=tab==='Matin'?plan.morning:plan.evening;
  return '<div class="canonical-report-heading"><span class="eyebrow">Routine du '+tab.toLowerCase()+'</span><h1 tabindex="-1">'+(tab==='Matin'?'Protéger et préparer':'Nettoyer et soutenir')+'</h1><p>Chaque geste peut être adapté ou retiré selon votre confort.</p></div><div class="canonical-advice-list">'+(steps||[]).map(function(step,index){return canonicalAdvice('Étape '+(index+1),step,index===0?'Appliquez sans frotter inutilement.':'Laissez la peau confortable avant de poursuivre.');}).join('')+'</div>';
}

function canonicalReportPanel(domain,tab,result){
  if(domain==='Colorimétrie')return canonicalColorPanel(tab,result);
  if(domain==='Peau')return canonicalSkinPanel(tab,result);
  return canonicalHairPanel(tab,result);
}

function canonicalReport(){
  const result=report();
  if(!result)return empty('Ce rapport est introuvable','Relancez une analyse pour créer un nouveau résultat.','ANA-01','Nouvelle analyse');
  if(!canonicalOwned())return canonicalLockedResult();
  const tabs=canonicalReportTabs(result.domain,result);
  const step=Math.max(0,Math.min(Number(M.canonicalReportStep)||0,tabs.length-1));
  const tab=tabs[step];
  return '<div class="canonical-report'+(result.domain==='Peau'?' canonical-report--skin':'')+'">'+
    canonicalReportRail(tabs,step)+
    '<section class="canonical-report-panel" aria-live="polite" aria-label="'+esc(tab)+'">'+canonicalReportPanel(result.domain,tab,result)+'</section>'+
    '<div class="ux-report-actions">'+A(icon('clock')+' Historique','lg-history-domain',{domain:result.domain},'secondary')+A(icon('plus')+' Nouvelle analyse','studio-analysis',{domain:result.domain},'secondary')+'</div>'+
  '</div>';
}

V['ANA-10']=canonicalReport;
V['ANA-11']=canonicalReport;
V['ANA-12']=()=>{
  const domains=['Tous','Cheveux','Colorimétrie','Peau'];
  const selected=domains.includes(M.historyDomain)?M.historyDomain:'Tous';
  const list=M.analyses.filter(r=>selected==='Tous'||r.domain===selected).slice().reverse();
  return head('Mes analyses')+form('history-filter',select('domain','Domaine',domains,selected),'Filtrer')+
    (list.length?list.map(reportCard).join(''):empty('Aucune analyse pour le moment','Votre prochain résultat apparaîtra ici.','ANA-01','Faire une analyse'))+
    '';
};
ACTIONS['canonical-compare-analyses']=()=>{go('ANA-12',{replace:true});};

function canonicalOpenCompletedAnalysis(record){
  if(!record)return;
  M.context.analysis=record.id;
  if(canonicalOwned()){go('ANA-10',{replace:true,context:{analysis:record.id}});return;}
  M.premiumIntent={kind:'report',id:record.id};
  go('PRE-01',{replace:true});
  M.premiumReturnState=null;
  M.context.returnTo='SAV-01';
  persist();
}

ACTIONS['canonical-report-step']=function(data){
  const result=report();
  const tabs=result?canonicalReportTabs(result.domain,result):[];
  const step=Number(M.canonicalReportStep)||0;
  if(data.finish==='true'||(Number(data.delta)>0&&step>=tabs.length-1)){M.canonicalReportStep=0;go('SAV-01',{root:true});return;}
  M.canonicalReportStep=Math.max(0,Math.min(step+Number(data.delta||0),Math.max(0,tabs.length-1)));
  render({focus:true,scroll:0});
};
ACTIONS['canonical-report-jump']=function(data){M.canonicalReportStep=Number(data.step)||0;render({focus:true,scroll:0});};

ACTIONS['finish-analysis']=function(){
  const draft=M.draft,existing=M.analyses.find(r=>r.id===draft.reportId);
  if(existing){canonicalOpenCompletedAnalysis(existing);return;}
  if(!canonicalHasPhoto()){go('ANA-04',{replace:true});return;}
  if(!draft.consent){go('ANA-04',{replace:true});return;}
  if(['error','offline','pending','refused','unavailable'].includes(M.scenario)){render();return;}
  if(!['Cheveux','Colorimétrie','Peau'].includes(draft.domain)){go('ANA-01',{replace:true});return;}
  const answers=clone(draft.answers||{}),r={id:uid('analysis'),date:DATE(),createdAt:new Date().toISOString(),domain:draft.domain,status:'complete',photo:draft.photo,source:'Démonstration : résultat illustratif, sans analyse réelle de la photo',prefs:clone(M.prefs),answers,revises:draft.revises||null};
  if(r.domain==='Cheveux'){
    M.hairProfile={...rwHairObservation(draft.photo),basis:'Démonstration'};
    Object.assign(r,{hairProfile:clone(M.hairProfile),faceShape:M.hairProfile.shape,colorProfile:clone(M.colorProfile||null)});
  }else if(r.domain==='Colorimétrie'){
    const p=color12Classify(answers);
    Object.assign(r,{season:p.status==='needs_review'?null:p.season,match:p.match,alternatives:p.alternatives,colorStatus:p.status});
    if(r.season){M.colorProfile={...p,source:r.source};M.colorFamily=p.family;M.context.season=p.season;}
    M.colorSeasonTab='Profil';M.previewSeason=null;M.lgColorApplications=false;
  }else{
    M.skinPlan=uxSkinPlan(answers);
    M.skinProfile={goal:M.skinPlan.goal,traits:['Uniformité du teint','Rougeurs','Brillance et cernes'],basis:'Démonstration'};
    Object.assign(r,{skinPlan:clone(M.skinPlan),skinProfile:clone(M.skinProfile),skin:clone(SKIN_SCORE_DEMO),skinScoreSource:'demo/skin-v1'});
  }
  r.findings=reportDomains(r).filter(d=>domainAvailable(r,d)).map(d=>d+' : '+answersSummary(r,d));
  r.recommendations=reportRecommendations(r);
  M.analyses.push(r);if(typeof skinPrepareRoutine==='function')skinPrepareRoutine(r);draft.reportId=r.id;draft.status='complete';draft.phase='ANA-09';M.context.analysis=r.id;
  M.messages.push({id:uid('msg'),text:'Votre aperçu '+r.domain.toLowerCase()+' est prêt.',route:'ANA-10',objectKey:'analysis',objectId:r.id,read:false});
  M.canonicalReportStep=0;
  M.scenario='normal';persist();canonicalOpenCompletedAnalysis(r);
};

// Normalize direct links, refreshes and browser-back before a screen is painted.
function canonicalRouteGuard(id){
  if(canonicalAnalysisRun&&canonicalAnalysisRun.draft!==M.draft)canonicalAnalysisRun=null;
  if(M.draft.status==='processing'&&(!canonicalAnalysisRun||id!=='ANA-08'))canonicalDiscardAnalysis();
  if(canonicalAnalysisRun&&M.draft.status==='complete')canonicalAnalysisRun=null;
  // Old checkout history must not interrupt an already unlocked activity.
  if(/^PRE-0[123]$/.test(id)&&canonicalOwned()){
    const target=M.premiumReturnState||M.premiumCompletedState;
    if(target?.epoch===navigationEpoch&&!target.route.startsWith('PRE-')){
      M.context=clone(target.context);M.filters=clone(target.filters);M.navRoot=target.root;
      if(target.viewState)Object.assign(M,clone(target.viewState));
      id=resolveRoute(target.route);
    }else id='SAV-01';
  }
  if(id==='ESS-02'&&(!M.haircutDraft||!STUDIO_HAIRCUTS.some(c=>c.id===M.haircutDraft.haircut)||!canonicalHasPhoto(M.haircutDraft.source)))id='HAI-01';
  if(id==='ANA-08'){
    const finished=M.analyses.find(r=>r.id===M.draft.reportId);
    if(finished){M.context.analysis=finished.id;return canonicalOwned()?'ANA-10':'ANA-09';}
    if(!canonicalHasPhoto())return 'ANA-04';
    if(!M.draft.consent)return 'ANA-04';
  }
  if(['ANA-10','ANA-11'].includes(id)&&report()&&!canonicalOwned())return 'ANA-09';
  const domain={'HAI-01':'Cheveux','COL-01':'Colorimétrie','PEA-01':'Peau'}[id];
  if(domain&&!canonicalOwned()){
    const latest=M.analyses.filter(r=>r.domain===domain&&r.status==='complete').at(-1);
    if(latest){M.context.analysis=latest.id;return 'ANA-09';}
  }
  return id;
}

ACTIONS['studio-analysis']=function(data){
  if(!['Cheveux','Colorimétrie','Peau'].includes(data.domain))return;
  ACTIONS['canonical-new-analysis'](data);
};
ACTIONS['canonical-new-analysis']=data=>{
  const entryState=['ANA-01','DEC-01','ANA-12','ANA-09','ANA-10','ACC-01','ROU-01','PEA-01','PRO-02','COL-01','HAI-01'].includes(route)?snapshot():null;
  clearDrafts('analysis-answers');clearDrafts('consent');
  M.draft={...clone(initial().draft),id:uid('draft'),domain:data.domain,phase:'ANA-04',entryState};
  M.context.analysis='';M.canonicalReportStep=0;M.analysisQuestionStep=0;M.scenario='normal';
  go('ANA-04');
};
// Old entry points start over instead of reviving a saved run.
ACTIONS['canonical-resume-analysis']=()=>ACTIONS['canonical-new-analysis']({domain:M.draft.domain});
ACTIONS['cancel-analysis']=()=>{canonicalDiscardAnalysis();go('ANA-01');};
ACTIONS['result-open']=data=>{
  const latest=M.analyses.filter(r=>r.domain===data.domain&&r.status==='complete').at(-1);
  M.canonicalReportStep=0;M.previewSeason=null;M.lgColorApplications=false;M.hairTab='Pour moi';M.skinTab='Rapport';
  if(latest){
    if(canonicalOwned())go({'Cheveux':'HAI-01','Colorimétrie':'COL-01','Peau':'PEA-01'}[data.domain],{context:{analysis:latest.id}});
    else canonicalOpenCompletedAnalysis(latest);
    return;
  }
  ACTIONS['studio-analysis'](data);
};
ACTIONS['color-report-open']=data=>{
  const result=M.analyses.find(r=>r.id===data.id);
  if(!result){toast('Ce rapport est introuvable.');return;}
  M.canonicalReportStep=0;go('ANA-10',{context:{analysis:result.id}});
};

function canonicalResumeAfterPurchase(){
  if(!canonicalOwned())return;
  const previous=M.premiumReturnState,intent=M.premiumIntent;
  const fallback=String(M.context.returnTo||'SAV-01');
  M.premiumReturnState=null;M.premiumIntent=null;
  // Retain the origin, remove the checkout from the app's back stack.
  trail=trail.filter(state=>state&&!state.route.startsWith('PRE-'));
  if(previous&&!previous.route.startsWith('PRE-'))returnToState(previous);
  else go(fallback.startsWith('PRE-')?'SAV-01':fallback,{replace:true});
  M.premiumCompletedState=snapshot();
  if(intent?.kind==='haircut'&&STUDIO_HAIRCUTS.some(cut=>cut.id===intent.id)){
    M.haircutSelected=intent.id;M.haircutAnalysis=intent.analysis||'';
    if(intent.photo&&canonicalHasPhoto(intent.photo))M.simulationPhoto=intent.photo;
    ACTIONS['haircut-simulate']({id:intent.id,analysis:intent.analysis||''});
  }
  if(intent?.kind==='report'){
    const record=M.analyses.find(item=>item.id===intent.id&&item.status==='complete');
    if(record){M.context.analysis=record.id;go('ANA-10',{replace:true,context:{analysis:record.id}});}
  }
  persist();toast('Beautify Plus est actif.');
}
ACTIONS.subscribe=()=>{
  if(canonicalOwned()){if(route.startsWith('PRE-'))canonicalResumeAfterPurchase();return;}
  if(['error','offline','unavailable','refused'].includes(M.scenario))M.subscription.status='failed';
  else if(M.scenario==='pending')M.subscription.status='pending';
  else uxActivatePremium();
  persist();if(canonicalOwned())canonicalResumeAfterPurchase();else go('PRE-03');
};
ACTIONS['subscription-check']=()=>{
  if(['error','offline','unavailable','refused'].includes(M.scenario)){toast('Vérification impossible. Votre accès reste inchangé.');return;}
  // Checking a pending demo is the explicit confirmation action.
  if(M.subscription.status==='pending'){M.scenario='normal';uxActivatePremium();}
  persist();if(canonicalOwned()&&route.startsWith('PRE-'))canonicalResumeAfterPurchase();else render();
};
ACTIONS['restore-access']=()=>{
  const failed=['error','offline','unavailable','refused'].includes(M.scenario);
  ACTIONS.restore({result:failed?'error':canonicalOwned()?'found':'none'});
  if(!failed&&canonicalOwned()&&route.startsWith('PRE-'))canonicalResumeAfterPurchase();
};
ACTIONS['premium-return']=()=>{
  M.premiumIntent=null;
  const previous=M.premiumReturnState;M.premiumReturnState=null;
  if(previous&&!previous.route.startsWith('PRE-'))returnToState(previous);
  else go(!String(M.context.returnTo).startsWith('PRE-')?M.context.returnTo||'SAV-01':'SAV-01',{replace:true});
};
ACTIONS['saved-hair-sims']=()=>{
  if(!M.simulations.length){ACTIONS['hair-more']();return;}
  M.lgShowSimulations=true;go('SAV-01');
  document.querySelector('.lg-simulations')?.scrollIntoView?.({block:'start',behavior:'auto'});
};

ACTIONS['haircut-generate-confirm']=data=>{
  if(!STUDIO_HAIRCUTS.some(c=>c.id===data.id))return;
  if(!uxSimulationPhotoAvailable()){M.simulationPhoto='';ACTIONS['haircut-simulate'](data);return;}
  studioEnsure();if(!studioRemaining()){uxQuotaBlocked({kind:'haircut',id:data.id,analysis:data.analysis||M.haircutAnalysis||'',photo:M.simulationPhoto});return;}
  if(!M.haircutDraft||M.haircutDraft.haircut!==data.id||M.haircutDraft.source!==M.simulationPhoto)M.haircutDraft={id:uid('haircut'),haircut:data.id,source:M.simulationPhoto};
  go('ESS-02',{context:{haircut:data.id}});
};
ACTIONS['finish-haircut']=()=>{
  if(!M.haircutDraft){
    if(M.simulations.some(x=>x.id===M.context.simulation))go('ESS-03',{replace:true});
    else go('HAI-01',{replace:true});
    return;
  }
  if(!canonicalHasPhoto(M.haircutDraft.source)){M.simulationPhoto='';go('HAI-01');toast('Choisissez à nouveau votre photo pour continuer.');return;}
  if(['error','offline','pending','refused','unavailable'].includes(M.scenario)){
    modal('Génération non terminée',P('Aucun essai n’a été décompté. Votre sélection est conservée.')+A('Réessayer la démo','canonical-retry-haircut')+A('Plus tard','close',{},'secondary mt'));return;
  }
  studioEnsure();if(!studioRemaining()){uxQuotaBlocked({kind:'haircut',id:M.haircutDraft.haircut,analysis:M.haircutAnalysis||'',photo:M.haircutDraft.source});return;}
  UX_BASE.finishHaircut();
};
ACTIONS['canonical-retry-haircut']=()=>{M.scenario='normal';closeModal(false);ACTIONS['finish-haircut']();};
