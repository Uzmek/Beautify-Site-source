'use strict';

// Fourteen supplied compositions, with real controls and unchanged domain logic.
const LG_BASE = {
  hair:V['HAI-01'], color:V['COL-01'], skin:V['PEA-01'], paywall:V['PRE-01'],
  progress:V['PRO-01'], launcher:V['DEC-01'], chooser:V['ANA-01']
};
const lgBubble=(name,extra='')=>`<span class="lg-bubble ${extra}">${icon(name)}</span>`;
const lgCard=(html,extra='')=>`<section class="lg-card ${extra}">${html}</section>`;
const lgTitle=(title,subtitle='')=>`<header class="lg-title"><h1 tabindex="-1">${title}</h1>${subtitle?`<p>${subtitle}</p>`:''}</header>`;
const lgSectionTitle=(title,glyph)=>`<div class="lg-section-title">${lgBubble(glyph)}<h2>${title}</h2></div>`;
const lgArt=(name,label='')=>`<span class="lg-art lg-art-${name}" ${label?`role="img" aria-label="${esc(label)}"`:'aria-hidden="true"'}></span>`;
const lgModuleArt=domain=>`<span class="lg-module-art" aria-hidden="true"><img src="/assets/icons/${domain==='Cheveux'?'comb':domain==='Colorimétrie'?'palette':domain==='Peau'?'skin':'tryon'}.webp" width="64" height="64" alt=""></span>`;
const lgLatest=domain=>M.analyses.filter(x=>x.domain===domain&&x.status==='complete').slice(-1)[0];
const lgSeasonNames={light_spring:'Printemps clair',warm_spring:'Printemps chaud',bright_spring:'Printemps lumineux',light_summer:'Été clair',cool_summer:'Été froid',soft_summer:'Été doux',soft_autumn:'Automne doux',warm_autumn:'Automne chaud',deep_autumn:'Automne profond',deep_winter:'Hiver profond',cool_winter:'Hiver froid',bright_winter:'Hiver lumineux'};
const lgSeasonName=season=>lgSeasonNames[M.colorProfile?.season]||season?.name||'Votre palette';

function lgBrand(plus=false){
  const profile=route==='PRF-01',root=ROOTS.includes(route);
  const word=profile?'Profil':'Beautify'+(plus||canonicalOwned()?' Plus':'');
  const control=route==='ENT-02'?'':profile?B(lgBubble('settings'),'PRF-04','lg-brand-control',{label:'Réglages'}):root
    ?B(lgBubble('user'),'PRF-01','lg-brand-control',{label:'Mon profil'})
    :A(lgBubble(plus?'x':'back')+'<span>'+(plus?'Fermer':'Retour')+'</span>',plus?'premium-return':'back',{label:plus?'Fermer l’abonnement':'Retour'},'lg-brand-control flow-exit');
  return `<div class="lg-brand"><button type="button" class="lg-wordmark" data-act="home" aria-label="Accueil Beautify">${word}<small>BY UZMEK</small></button>${control}</div>`;
}
const lgPage=(body,extra='',plus=false)=>`<div class="lg-page ${extra}">${lgBrand(plus)}${body}</div>`;
const lgButtonContent=(text,glyph)=>`${lgBubble(glyph,'lg-action-icon')}<span class="lg-action-label">${text}</span>${icon('chev')}`;
const lgGo=(text,to,glyph='scan',extra='')=>B(lgButtonContent(text,glyph),to,'primary lg-action '+extra,{label:text});
const lgAct=(text,action,data={},glyph='spark',extra='')=>A(lgButtonContent(text,glyph),action,{...data,label:data.label||text},'primary lg-action '+extra);
const lgIntroActions=(label)=>`<div class="lg-intro-actions"><form data-form="consent" data-draft-key="consent" class="form-stack"><input type="hidden" name="consent" value="on"><p class="form-feedback" role="alert" hidden></p><button class="primary lg-intro-cta" type="submit">${icon('camera')}<span>${esc(label)}</span>${icon('chev')}</button></form><p class="lg-intro-privacy">${icon('lock')}Photo privée dans cet onglet</p><p class="lg-intro-demo">Démo : résultats illustratifs</p></div>`;
const lgRow=(title,sub,to,glyph)=>B(`${lgBubble(glyph)}<span class="lg-row-copy"><strong>${title}</strong>${sub?`<small>${sub}</small>`:''}</span>${icon('chev')}`,to,'lg-row',{label:title});
const lgSwatches=values=>`<div class="lg-swatches">${values.map(([name,color])=>`<span class="lg-swatch" style="--swatch:${color}" title="${esc(name)}" role="img" aria-label="${esc(name)}"></span>`).join('')}</div>`;
function lgNoResult(domain,title){
  return lgPage(lgTitle(title)+lgCard(`<div class="lg-empty-art">${lgModuleArt(domain)}</div><h2>Commençons par vous.</h2><p>Une photo pour découvrir ${domain==='Cheveux'?'les coupes qui vous vont':domain==='Peau'?'votre routine':'vos couleurs'}.</p>`+lgAct('Faire mon analyse','studio-analysis',{domain},'scan'),'lg-empty'),'lg-report-page');
}

// 01 — Welcome.
V['ENT-02']=()=>lgPage(lgTitle('Révélez ce qui<br>vous va vraiment.','Cheveux, couleurs et peau')+`<div class="lg-welcome-art">${lgArt('welcome','Cheveux, couleurs et soin dans des sphères de verre')}</div>`+lgGo('Commencer','ANA-01','play')+`<p class="lg-welcome-note">Sans compte</p>`,'lg-welcome lg-funnel');

// 02 — Today: artwork stays outside the content flow.
V['ACC-01']=()=>{
  const season=color12Current();
  return lgPage(lgTitle(M.profile.name?'Bonjour, '+esc(M.profile.name):'Bonjour à vous','AUJOURD’HUI')+
    skinHomeCard()+
    lgCard(`<span class="lg-glass-orb" aria-hidden="true"></span>${lgBubble('bars','lg-result-badge')}<span class="eyebrow">${season?'Dernier résultat':'Votre profil beauté'}</span><h2>${season?esc(lgSeasonName(season)):'Ce qui vous va.'}</h2>${season?`<div class="lg-home-palette">${lgSwatches(season.colors.slice(0,6))}</div>`:'<p>Cheveux, couleurs et peau</p>'}`+lgGo('Nouvelle analyse','ANA-01','scan'),'lg-home-result')+
    `<div class="lg-home-links">${B(icon('trend')+'<span>Ma progression</span>','PRO-01','text-button')}</div>`,'lg-home');
};

// 03 — Capture, with distinct camera and gallery sources.
function lgCapture(){
  const title=M.draft.domain==='Cheveux'?'Analyse cheveux':M.draft.domain==='Peau'?'Analyse de peau':'Analyse couleurs';
  return lgPage(lgTitle(title,'De face, en lumière naturelle.')+lgCard(
    `<div class="lg-photo-orb">${canonicalHasPhoto()?imageFor(M.draft.photo,'lg-selected-photo','Votre photo sélectionnée'):lgArt('capture','Visage centré dans le cadre de prise de photo')}</div><div class="lg-photo-rules">${[['sun','Lumière<br>naturelle'],['scan','Visage<br>centré'],['hair','Cheveux<br>dégagés'],['sparkles','Sans filtre']].map(([glyph,text])=>`<div>${lgBubble(glyph)}<span>${text}</span></div>`).join('')}</div>`+
    (canonicalHasPhoto()?lgAct('Lancer mon analyse','canonical-analyze-photo',{},'play'):'')+lgAct(canonicalHasPhoto()?'Reprendre une photo':'Prendre une photo','file-pick',{purpose:'analysis',source:'camera'},'camera')+
    lgAct('Choisir dans la galerie','file-pick',{purpose:'analysis',source:'gallery'},'image','lg-action-secondary')+
    `<div class="lg-privacy-pill">${lgBubble('lock')}<span>Votre photo lance l’aperçu.<br>Démo : photo privée dans cet onglet</span></div>`,'lg-capture-card'),'lg-upload');
}
V['ANA-04']=lgCapture;V['ANA-05']=lgCapture;

// Visual introductions retain the original consent and photo acquisition flow.
function lgVisualAnalysisIntro(domain){
  const hair=domain==='Cheveux',kind=hair?'hair':'color';
  const labels=hair?['Votre visage','Vos coupes','Essai sur photo']:['12 saisons','Votre palette','Vos nuances'];
  return `<div class="lg-page lg-visual-intro lg-visual-intro-${kind} lg-funnel"><div class="lg-intro-brand">`+
    A(lgBubble('back'),'back',{label:'Revenir à la page précédente'},'lg-intro-back')+
    `<button type="button" class="lg-intro-wordmark" data-act="home" aria-label="Accueil Beautify">Beautify<small>by UZMEK</small></button></div>`+
    `<header class="lg-intro-heading"><span class="eyebrow">${hair?'Analyse cheveux':'Analyse couleurs'}</span><h1 tabindex="-1">${hair?'Les coupes faites<br>pour vous.':'Vos couleurs,<br>naturellement.'}</h1></header>`+
    `<figure class="lg-intro-art" role="img" aria-label="${hair?'Illustration : un visage et trois idées de coupes, du carré aux cheveux longs.':'Illustration : éventail de nuances, soie et métaux pour une palette personnelle.'}"><img src="/assets/${kind}-intro-composition-v1.png" width="852" height="1847" alt=""></figure>`+
    `<ul class="lg-intro-outcomes" aria-label="Votre analyse">${labels.map(label=>`<li>${label}</li>`).join('')}</ul>`+
    lgIntroActions(hair?'Trouver mes coupes':'Trouver mes couleurs')+`</div>`;
}
const LG_ANALYSIS_INTRO=V['ANA-03'];
V['ANA-03']=()=>{
  if(['Cheveux','Colorimétrie'].includes(M.draft.domain))return lgVisualAnalysisIntro(M.draft.domain);
  if(M.draft.domain!=='Peau')return LG_ANALYSIS_INTRO();
  return lgPage(
    `<header class="lg-title"><span class="eyebrow">Analyse de peau</span><h1 tabindex="-1">Votre peau,<br>mieux comprise.</h1><p>Une routine qui part de vous.</p></header>`+
    `<figure class="lg-skin-intro-portrait"><img src="/assets/skin-editorial-v1.webp" width="960" height="640" alt="Portrait éditorial, peau naturelle en lumière douce"><figcaption>${icon('camera')}Une photo suffit</figcaption></figure>`+
    lgCard(`<div class="lg-skin-outcome">${lgModuleArt('Peau')}<div><h2>Votre bilan</h2><p>Signes visibles et priorités</p></div></div><div class="lg-skin-outcome"><span class="lg-module-art" aria-hidden="true"><img src="/assets/icons/bottle.webp" width="64" height="64" alt=""></span><div><h2>Votre routine</h2><p>Matin, soir et précautions</p></div></div>`,'lg-skin-outcomes')+
    `<div class="lg-skin-intro-actions"><form data-form="consent" data-draft-key="consent" class="form-stack"><input type="hidden" name="consent" value="on"><p class="form-feedback" role="alert" hidden></p><button class="primary lg-action" type="submit">${lgButtonContent('Comprendre ma peau','camera')}</button></form><p class="lg-fine">Démo : résultats illustratifs.<br>Votre photo reste privée dans cet onglet.</p></div>`,'lg-skin-intro lg-funnel');
};

// 04 — Free reveal. Premium still opens at the same point in the flow.
V['ANA-09']=()=>{
  if(canonicalOwned())return canonicalReport();
  const result=report();if(!result)return canonicalLockedResult();const teaser=canonicalTeaser(result);
  return lgPage(lgTitle('Votre analyse est prête')+
    lgCard(`${lgBubble(result.domain==='Cheveux'?'oval':result.domain==='Peau'?'drop':'palette','lg-reveal-symbol')}<div><span class="eyebrow">${esc(teaser.eyebrow)}</span><h2>${esc(teaser.value)}</h2><p>${esc(teaser.hint)}</p></div>`,'lg-reveal-summary')+
    `<div class="lg-locked-list">${teaser.rows.map((label,i)=>lgCard(`${lgBubble(['hair','scissors','palette','spark','bars'][i%5])}<strong>${esc(label)}</strong><span class="lg-blur" aria-hidden="true"></span>${icon('lock')}`,'lg-lock-row')).join('')}</div>`+
    lgGo('Voir mon rapport complet','PRE-01','lock')+B('Plus tard','SAV-01','text-button lg-center-link'),'lg-reveal lg-funnel');
};

// 05 — Text-free editorial artwork with visible native text in reference coordinates.
const lgPaywallArt=kind=>{
  const crops={
    close:[746,34,78,78],
    lock:[128,1510,51,63],
    hem:[0,1778,853,66]
  };
  const [x,y,w,h]=crops[kind];
  return `<span class="pw-art pw-art-${kind}" aria-hidden="true" style="aspect-ratio:${w}/${h}"><img src="/assets/paywall-composition-v1.png" width="853" height="1844" alt="" draggable="false" style="width:${853/w*100}%;left:${-x/w*100}%;top:${-y/h*100}%"></span>`;
};
V['PRE-01']=()=>{
  if(canonicalOwned())return LG_BASE.paywall();
  const selected=M.subscription.offer==='monthly'?'monthly':'yearly';
  const benefits=[
    ['Rapports complets','Cheveux, couleurs et peau'],
    ['Palette 12 saisons','Personnalisée pour vous'],
    ['10 essais coiffure IA','par mois'],
    ['Routine soin','Matin et soir'],
    ['Recommandations classées','et historique inclus']
  ];
  return `<div class="lg-page lg-funnel pw-page">`+
    `<div class="pw-editorial"><img class="pw-editorial-composition" src="/assets/paywall-artwork-clean.png" width="853" height="1844" alt="" aria-hidden="true" draggable="false">`+
      A(lgPaywallArt('close'),'premium-return',{label:'Fermer l’abonnement et revenir à mon activité'},'pw-close')+
      `<header class="pw-hero-copy"><p class="pw-brand">Beautify Plus</p><p class="pw-byline">BY UZMEK</p><h1 tabindex="-1">Tout ce qui<br>vous révèle.</h1><p class="pw-tagline">BEAUTÉ PLUS SIMPLE.<br>CHAQUE JOUR.</p></header>`+
      `<section class="pw-benefits-copy" aria-label="Inclus dans Beautify Plus">${benefits.map(([title,detail],i)=>`<div class="pw-benefit-copy pw-benefit-${i}"><strong>${['Rapports<br>complets','Palette<br>12 saisons','10 essais<br>coiffure IA','Routine<br>soin','Recommandations classées'][i]}</strong><p>${['Cheveux, couleurs<br>et peau','Personnalisée<br>pour vous','par mois','Matin et soir','et historique inclus'][i]}</p></div>`).join('')}</section></div>`+
    `<div class="pw-offers" role="group" aria-label="Choisir mon abonnement">`+
      [['yearly','Annuel','59,99 € / an'],['monthly','Mensuel','9,99 € / mois']].map(([value,title,price])=>A(`<span class="pw-radio" aria-hidden="true"></span><span class="pw-plan-copy"><strong>${title}</strong><small>${price}</small></span>${value==='yearly'?'<span class="pw-monthly-equivalent">≈ 5 € / mois</span>':''}`,'offer',{value,pressed:value===selected,label:title+' — '+price},'pw-plan '+(value===selected?'selected':''))).join('')+`</div>`+
    A(`${lgPaywallArt('lock')}<span>Débloquer Beautify Plus</span>${icon('chev')}`,'subscribe',{label:'Débloquer Beautify Plus'},'pw-unlock')+
    `<footer class="pw-terms">${B('Restaurer mes achats','PRE-04','pw-restore')}<p>Renouvellement automatique, résiliable à tout moment</p><small>Démo : aucun débit réel</small></footer>${lgPaywallArt('hem')}</div>`;
};

// 06 — The approved visual grid; artwork windows contain no baked-in UI text.
const lgResultIllustration=kind=>`<span class="lg-result-illustration lg-result-illustration-${kind}" aria-hidden="true"><img src="/assets/results-composition-v1.webp" width="852" height="1847" alt=""></span>`;
const lgDomainAnalyses=domain=>M.analyses.map((record,index)=>({record,index})).filter(({record})=>record.domain===domain&&['complete','partial'].includes(record.status)).sort((a,b)=>String(b.record.date||'').localeCompare(String(a.record.date||''))||b.index-a.index).map(({record})=>record);
// Empty history remains visible as a disabled, clearly labelled action.
ACTIONS['lg-results-domain']=data=>{
  if(!['Cheveux','Colorimétrie','Peau'].includes(data.domain))return;
  const domain=data.domain,title=domain==='Colorimétrie'?'Couleurs':domain;
  const count=lgDomainAnalyses(domain).length;
  const kind=domain==='Cheveux'?'hair':domain==='Peau'?'skin':'color';
  const historyLabel=count?`Historique : ${count} analyse${count>1?'s':''}`:'Historique indisponible : pas encore d’analyse';
  const historyContent=`<span class="category-history-surface" aria-hidden="true"><img src="/assets/history-glass-surface.png" width="1463" height="1075" alt=""></span><span class="category-history-clock">${icon('history')}</span><span class="category-history-copy"><strong>Historique</strong><small>${count?`${count} analyse${count>1?'s':''}`:'Pas encore d’analyse'}</small></span>${icon(count?'chev':'lock')}`;
  modal(title,`<div class="category-sheet-composition">`+
    `<img class="category-sheet-art" src="/assets/category-sheet-${kind}-v2.png" width="1463" height="1075" alt="" aria-hidden="true">`+
    `<img class="category-sheet-art category-sheet-action-art" src="/assets/category-sheet-actions-history-first.png" width="1463" height="1075" alt="" aria-hidden="true">`+
    (count?A(historyContent,'lg-history-domain',{domain,label:historyLabel},'category-sheet-history is-available'):`<button type="button" class="category-sheet-history is-empty" disabled aria-label="${historyLabel}">${historyContent}</button>`)+
    A('<span class="category-sheet-accessible">Nouvelle analyse</span>','studio-analysis',{domain,label:'Nouvelle analyse '+title},'category-sheet-new')+`</div>`);
};
const LG_ANALYSIS_HISTORY=V['ANA-12'];
const lgHistorySummary=record=>record.domain==='Colorimétrie'?(lgSeasonNames[record.season]||canonicalTeaser(record).value):record.domain==='Cheveux'?(record.faceShape||record.hairProfile?.shape?'Visage '+String(record.faceShape||record.hairProfile.shape).toLowerCase():'Analyse cheveux'):(record.skinProfile?.goal||'Analyse de peau');
function lgHistoryDate(record){
  const raw=record.createdAt||record.date||'',date=new Date(raw.length===10?raw+'T12:00:00':raw);
  if(Number.isNaN(date.getTime()))return {day:'—',month:'',group:'Sans date',label:'Date non renseignée',time:''};
  return {day:new Intl.DateTimeFormat('fr',{day:'2-digit'}).format(date),month:new Intl.DateTimeFormat('fr',{month:'short'}).format(date).replace('.',''),group:new Intl.DateTimeFormat('fr',{month:'long',year:'numeric'}).format(date),label:new Intl.DateTimeFormat('fr',{day:'numeric',month:'long',year:'numeric'}).format(date),time:raw.includes('T')?new Intl.DateTimeFormat('fr',{hour:'2-digit',minute:'2-digit'}).format(date):''};
}
V['ANA-12']=()=>{
  const domain=M.historyDomain;
  if(!['Cheveux','Colorimétrie','Peau'].includes(domain))return LG_ANALYSIS_HISTORY();
  const skinHistory=domain==='Peau',title=domain==='Colorimétrie'?'Couleurs':domain,list=lgDomainAnalyses(domain),groups=new Map();
  for(const record of list){const date=lgHistoryDate(record);if(!groups.has(date.group))groups.set(date.group,[]);groups.get(date.group).push({record,date});}
  const rows=[...groups].map(([month,entries])=>`<section class="history-month"><h2>${esc(month)}</h2><ul>`+entries.map(({record,date})=>`<li>`+A(
    `<span class="history-date-tile" aria-hidden="true"><strong>${esc(date.day)}</strong><small>${esc(date.month)}</small></span><span class="history-entry-copy"><span class="history-entry-heading"><strong>${esc(lgHistorySummary(record))}</strong>${record===list[0]?`<span class="history-latest-badge">${skinHistory?'Dernier':'Dernière'}</span>`:''}</span><span class="history-entry-meta"><time datetime="${esc(record.createdAt||record.date||'')}">${esc(date.label)}${date.time?', '+esc(date.time):''}</time>${record.status==='partial'?'<span class="history-partial">Aperçu partiel</span>':''}</span></span>${icon('chev')}`,
    'lg-history-report-open',{id:record.id,domain,label:lgHistorySummary(record)+' — '+date.label+(date.time?' à '+date.time:'')},'history-entry')+`</li>`).join('')+`</ul></section>`).join('');
  const currentRoutine=skinHistory&&(skinRoutine('Matin')||skinRoutine('Soir'))?A(`${icon('refresh')}<span><strong>Routine actuelle</strong><small>Matin et soir, synchronisée</small></span>${icon('chev')}`,'skin-open-routine',{moment:skinRoutine('Matin')?'Matin':'Soir'},'history-current-routine'):'';
  return `<div class="lg-page compact-history${skinHistory?' skin-bilan-history':''}"><div class="history-brand">${A(icon('back'),'back',{label:'Retour'},'history-back')}<button type="button" data-act="home" class="history-wordmark" aria-label="Accueil Beautify">Beautify</button></div>`+
    lgTitle(skinHistory?'Mes bilans':'Historique',skinHistory?list.length+' bilan'+(list.length>1?'s':'')+' de peau':title+', '+list.length+' analyse'+(list.length>1?'s':''))+
    currentRoutine+A(icon('plus')+`<span>${skinHistory?'Nouveau bilan':'Nouvelle analyse'}</span>`,'studio-analysis',{domain},'history-new')+
    (list.length?`<div class="history-records" tabindex="0" role="region" aria-label="${skinHistory?'Bilans de peau':'Historique '+esc(title)}">${rows}</div>`:`<section class="history-empty">${icon('clock')}<h2>${skinHistory?'Votre premier bilan vous attend':'Votre historique commence ici'}</h2><p>${skinHistory?'Vos bilans apparaîtront ici<br>après chaque analyse.':'Vos analyses apparaîtront ici<br>après votre premier résultat.'}</p></section>`)+`</div>`;
};
ACTIONS['lg-history-report-open']=data=>{
  const record=lgDomainAnalyses(data.domain).find(item=>item.id===data.id);
  if(!record){toast('Cette analyse n’est plus disponible.');return;}
  M.canonicalReportStep=data.domain==='Peau'?2:0;M.previewSeason=null;M.lgColorApplications=false;
  if(canonicalOwned())go('ANA-10',{context:{analysis:record.id}});
  else canonicalOpenCompletedAnalysis(record);
};
const LG_VIEW_STATE=viewStateFor;
viewStateFor=id=>{
  const state=LG_VIEW_STATE(id);
  if(id==='ANA-12')state.historyDomain=M.historyDomain||'Tous';
  return state;
};

// 07 — Identity, subscription and grouped settings.
V['PRF-01']=()=>lgPage(lgTitle('Mon profil')+
  lgCard(B(`<span class="lg-bubble lg-avatar">${M.profile.name?esc(M.profile.name[0].toUpperCase()):icon('user')}</span><strong>${esc(M.profile.name||'Votre profil')}</strong>${icon('chev')}`,'PRF-02','lg-profile-identity'),'lg-identity-card')+
  lgCard(`<div class="lg-subscription-info">${lgBubble('crown')}<div><h2>${canonicalOwned()?'Beautify Plus':'Beautify'}</h2><p>${canonicalOwned()?studioRemaining()+' sur 10 essais disponibles':'Offre découverte'}</p></div>${canonicalOwned()?'<span class="lg-status">Actif</span>':''}</div>`+lgGo('Gérer mon abonnement','PRF-06','credit'),'lg-subscription-card')+
  lgCard(lgRow(M.profile.connected?'Mon compte':'Compte facultatif','',M.profile.connected?'PRF-02':'ENT-05','user')+lgRow('Réglages','','PRF-04','settings')+lgRow('Notifications','','PRF-05','bell')+lgRow('Photos et confidentialité','','PRF-07','shield')+lgRow('Aide','','PRF-10','help'),'lg-settings-card')+
  B('Mes préférences','PRF-03','text-button lg-center-link'),'lg-profile');

// 08 — Ranked hero, then three distinct alternatives; no changed ranking.
V['HAI-01']=()=>{
  if(['Couleurs','Toutes'].includes(M.hairTab))return lgPage(LG_BASE.hair(),'lg-detail');
  if(!M.hairProfile)return lgNoResult('Cheveux','Votre rapport cheveux');
  const cuts=STUDIO_HAIRCUTS.slice().sort((a,b)=>studioHairScore(b)-studioHairScore(a)),best=cuts[0];
  return lgPage(lgTitle('Votre rapport cheveux')+
    lgCard(`${lgBubble('oval')}<div><h2>${M.hairProfile.shape?'Visage '+esc(M.hairProfile.shape.toLowerCase()):'Votre visage'}</h2><span class="eyebrow">Votre forme de visage</span></div>`,'lg-face-card')+
    lgCard(`<div class="lg-best-heading">${lgBubble('crown')}<div><span class="eyebrow">Meilleure option</span><h2>${esc(best.name)}</h2></div></div><div class="lg-hair-main">${studioHairTile(best)}<div class="lg-hair-reason"><p>${esc(best.reason)}</p>${lgAct('Essayer','haircut-open',{id:best.id,label:'Essayer la coupe '+best.name},'spark','lg-action-compact')}<small class="lg-quota">${icon('spark')}${studioRemaining()} essais IA restants</small></div></div>`,'lg-hair-best')+
    lgCard(lgSectionTitle('Autres coupes recommandées','scissors')+`<div class="lg-hair-alts">${cuts.slice(1,4).map(c=>A(studioHairTile(c)+`<span>${esc(c.name)}</span>`,'haircut-open',{id:c.id,label:'Voir '+c.name},'lg-hair-alternative')).join('')}</div>`,'lg-alternatives-card')+
    lgAct('Catalogue de coupes','lg-hair-catalog',{},'scissors'),'lg-hair lg-report-page');
};
ACTIONS['lg-hair-catalog']=()=>{M.hairLengthFilter='Toutes';go('HAI-02');};

// 09 — Actual 12-season colors, with individual glass-finished swatches.
V['COL-01']=()=>{
  if(M.lgColorApplications||M.previewSeason)return lgPage(A('Retour à mon profil couleur','lg-color-close',{},'text-button')+LG_BASE.color(),'lg-detail');
  const season=color12Current();if(!season)return lgNoResult('Colorimétrie','Votre profil couleur');
  const fabric=`<span class="lg-palette-medallion">${lgSwatches(season.colors.slice(0,4))}</span>`;
  return lgPage(lgTitle('Votre profil couleur','PROFIL 12 SAISONS')+
    lgCard(`${fabric}<div class="lg-season-content"><h2>${esc(lgSeasonName(season))}</h2><div class="lg-triad">${season.axes.slice(0,3).map((axis,i)=>`<div>${lgBubble(['snow','moon','sun'][i])}<small>${esc(axis)}</small></div>`).join('')}</div></div>`,'lg-season-card')+
    lgCard(lgSectionTitle('Votre palette','palette')+lgSwatches(season.colors.slice(0,12)),'lg-palette-card')+
    lgCard(lgSectionTitle('Meilleurs neutres','leaf')+lgSwatches(season.neutrals.slice(0,6)),'lg-neutrals-card')+
    lgAct('Voir mes applications','lg-color-apps',{},'hanger'),'lg-color lg-report-page');
};
ACTIONS['lg-color-apps']=()=>{M.lgColorApplications=true;render();};
ACTIONS['lg-color-close']=()=>{M.lgColorApplications=false;M.previewSeason=null;M.colorSeasonTab='Profil';render();};

// 10 — Morning and evening are visual sequences, using the existing plan.
V['PEA-01']=()=>{
  if(['Matin','Soir','Suivi'].includes(M.skinTab))return lgPage(LG_BASE.skin(),'lg-detail');
  if(!M.skinProfile)return lgNoResult('Peau','Votre rapport peau');
  const plan=M.skinPlan||{morning:[],evening:[]};
  return lgPage(lgTitle('Votre rapport peau')+
    lgCard(`${lgModuleArt('Peau')}<div><h2>${esc(M.skinProfile.goal||'Routine essentielle')}</h2><div class="lg-triad">${[['drop','Hydratation'],['heart','Confort'],['spark','Éclat']].map(([glyph,text])=>`<div>${lgBubble(glyph)}<small>${text}</small></div>`).join('')}</div></div>`,'lg-skin-summary')+
    ['morning','evening'].map((key,i)=>lgCard(lgSectionTitle(`${i?'Soir':'Matin'}, ${(plan[key]||[]).length} étapes`,i?'moon':'sun')+`<ol class="lg-routine-steps">${(plan[key]||[]).map((step,n)=>`<li>${lgArt('product-'+(i?n===0?'pump':'cream':n===0?'cleanser':n===1?'serum':'spf'))}<span>${esc(step)}</span></li>`).join('')}</ol>`,'lg-routine-card')).join('')+
    lgAct(M.routines.some(r=>r.generatedSkinPlan)?'Voir mes routines':'Adopter ma routine','skin-apply-plan',{},'calendar')+`<div class="lg-skin-disclaimer">${icon('help')}<span>Observation cosmétique, pas un diagnostic.</span></div>`,'lg-skin lg-report-page');
};

// 11 + 12 — Locked previews, never a false live feature.
function lgUpcoming(key){
  const makeup=key==='makeup',title=makeup?'Maquillage':'Garde-robe';
  const features=makeup?[['wine','Selon<br>l’occasion'],['palette','Lié à vos<br>couleurs'],['guide','Guides<br>pas à pas']]:[['hanger','Ajouter vos pièces'],['sparkles','Composer une tenue'],['calendar','Préparer une date']];
  const featureCards=features.map(([glyph,text])=>lgCard(`<div class="lg-row lg-disabled-row" aria-disabled="true">${lgBubble(glyph)}<span class="lg-row-copy"><strong>${text}</strong></span>${makeup?'':icon('lock')}</div>`,'lg-future-feature')).join('');
  return lgPage(lgTitle(title,makeup?'':'BIENTÔT')+
    (!makeup?'<p class="lg-wardrobe-intro">Votre dressing, accordé à vos couleurs.</p>':'')+
    lgCard(lgArt(key,title+' — bientôt')+(makeup?`<div class="lg-coming-copy"><h2>Bientôt</h2><p>Des teintes pensées<br>pour votre profil.</p></div>`:''),'lg-coming-hero')+
    `<div class="lg-coming-features">${featureCards}</div>`+
    lgAct(M.comingSoonNotices?.[key]?'Intérêt enregistré':'Me prévenir','coming-notify',{feature:key},'bell')+`<p class="lg-fine">Cette fonctionnalité n’est pas incluse dans la V1.</p>`,'lg-coming lg-coming-'+key);
}
V['MAQ-01']=()=>lgUpcoming('makeup');V['GAR-01']=()=>lgUpcoming('wardrobe');

// 14 — Actual activity, not a fabricated streak.
V['PRO-01']=()=>{
  if(M.lgJournal)return lgPage(A('Retour à ma progression','lg-journal-close',{},'text-button')+LG_BASE.progress(),'lg-detail');
  const days=Array.from({length:7},(_,i)=>{
    const d=new Date(DATE()+'T12:00:00');d.setDate(d.getDate()-6+i);
    const date=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
    return {label:['DIM','LUN','MAR','MER','JEU','VEN','SAM'][d.getDay()],date,done:M.sessions.some(s=>s.date===date&&s.kind==='routine'&&sessionComplete(s)&&M.routines.find(r=>r.id===s.ref)?.moment==='Matin')};
  });
  const count=days.filter(d=>d.done).length;
  return lgPage(lgTitle('Ma progression')+
    lgCard(lgSectionTitle('Cette semaine','calendar')+`<div class="lg-progress-summary"><span>Routine du matin</span><strong>${count} jour${count===1?'':'s'} sur 7</strong></div><div class="lg-week">${days.map(d=>`<div class="${d.done?'done':''}" aria-label="${d.date} : ${d.done?'routine terminée':'non terminée'}"><span class="lg-bubble">${d.done?icon('check'):''}</span><small>${d.label}</small></div>`).join('')}</div>`,'lg-streak-card')+
    lgCard(lgSectionTitle('Mes analyses','bars')+['Cheveux','Colorimétrie','Peau'].map(domain=>A(`${lgModuleArt(domain)}<strong>${domain==='Colorimétrie'?'Couleurs':domain}</strong><small>${lgLatest(domain)?esc(dateText(lgLatest(domain).date)):'À faire'}</small>${icon('chev')}`,'lg-history-domain',{domain,label:'Historique '+domain},'lg-history-row')).join(''),'lg-progress-analyses')+
    lgCard(`${lgBubble('leaf')}<p>${count?'Chaque petit geste compte.':'Votre régularité se construit.'}</p>`,'lg-progress-message')+
    lgAct('Ajouter une note','journal-new',{},'edit')+A('Voir mon journal','lg-journal-open',{},'text-button lg-center-link'),'lg-progress');
};
ACTIONS['lg-journal-open']=()=>{M.lgJournal=true;render();};
ACTIONS['lg-journal-close']=()=>{M.lgJournal=false;render();};
ACTIONS['lg-history-domain']=data=>{M.historyDomain=data.domain;go('ANA-12');};

// Retire the event module after the legacy layers have registered their views.
// Keep historical session data intact; only its feature entry points are removed.
for(const id of Object.keys(V))if(id.startsWith('EVE-'))delete V[id];
for(const name of Object.keys(ACTIONS))if(/^(?:(?:new|edit|delete)-event(?:-|$)|event-|lg-events-|calendar-(?:prev|next|day)$)/.test(name))delete ACTIONS[name];
delete F.event;
delete F['event-note'];

// Decorative windows from the supplied composition; labels and actions stay native.
function lgLauncherArtwork(x,y,width,height,extra=''){
  return `<span class="lg-launcher-art ${extra}" aria-hidden="true" style="--art-width:${width/787*100}%;--art-ratio:${width}/${height};--image-width:${853/width*100}%;--image-left:${-x/width*100}%;--image-top:${-y/height*100}%"><img src="/assets/analysis-launcher-reference.png" width="853" height="1844" alt=""></span>`;
}
function lgAnalysisLauncher(){
  const cards=[
    ['Cheveux','Cheveux','Vos coupes',315,377,505,333,'hair'],
    ['Colorimétrie','Couleurs','12 saisons',312,730,508,316,'color'],
    ['Peau','Peau','Votre routine',282,1068,538,310,'skin']
  ].map(([domain,title,subtitle,x,y,width,height,kind])=>A(
    lgLauncherArtwork(x,y,width,height)+`<span class="lg-launcher-copy"><strong>${title}</strong><span>${subtitle}</span>${lgBubble('chev','lg-launcher-arrow')}</span>`,
    'lg-results-domain',{domain,label:'Choisir une action : '+title},'lg-launcher-card lg-launcher-card-'+kind
  )).join('');
  const future=[['Maquillage',108,1471,140,100],['Garde-robe',374,1471,132,100],['Tutoriels',630,1471,125,100]]
    .map(([title,x,y,width,height])=>`<li aria-disabled="true" aria-label="${title}, à venir">${lgLauncherArtwork(x,y,width,height,'lg-launcher-future-art')}<span>${title}</span></li>`).join('');
  return `<div class="lg-page lg-analysis-launcher"><div class="lg-results-brand lg-launcher-brand">`+
    `<button type="button" class="lg-results-wordmark" data-act="home" aria-label="Accueil Beautify">${icon('spark')}<span>Beautify</span><small>by UZMEK</small></button>`+
    B(lgBubble('user'),'PRF-01','lg-results-profile',{label:'Mon profil'})+`</div>`+
    lgTitle('Votre espace beauté','Retrouvez vos résultats ou lancez<br>une nouvelle analyse.')+
    `<div class="lg-launcher-cards">${cards}</div><section class="lg-launcher-future" aria-labelledby="lg-coming-title"><h2 id="lg-coming-title">À venir</h2><ul>${future}</ul></section></div>`;
}
V['DEC-01']=lgAnalysisLauncher;
V['ANA-01']=lgAnalysisLauncher;
for(const [id,title] of [['ANA-01','Analyses'],['DEC-01','Analyses']]){
  const entry=FLOW_INDEX.find(item=>item.id===id);
  if(entry){entry.title=title;entry.nature='Destination principale';}
}
nav=function(){
  const navRoute=route.startsWith('PRE-')?(M.premiumReturnState?.route||'PRF-01'):route;
  const analysis=/^(SAV|HAI|COL|PEA|ESS|DEC|ANA)-/.test(navRoute),profile=/^(PRF|PRE|ENT)-/.test(navRoute);
  const activeIndex=analysis?1:profile?2:0;
  return `<nav class="bottom-nav lg-bottom-nav" aria-label="Navigation principale"><span class="lg-nav-lens" aria-hidden="true" data-index="${activeIndex}" data-mode="track" style="--nav-index:${activeIndex}"></span>${[
    ['ACC-01','Accueil','home',!analysis&&!profile],
    ['ANA-01','Analyses','bars',analysis],['PRF-01','Profil','user',profile]
  ].map(([to,label,glyph,active])=>`<button type="button" data-go="${to}" data-root="true" class="${active?'active':''}" ${active?'aria-current="page"':''}>${icon(glyph)}<span>${label}</span></button>`).join('')}</nav>`;
};
