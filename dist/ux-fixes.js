'use strict';
// UX audit fixes. This layer keeps the 82-screen review registry intact while
// making the customer paths coherent, deterministic and honest about the mockup.
const UX_BASE={
 nav,card,item,openItem,sample,eventCard,catalogResults,analysisFields,loadPhoto,
 studioEnsure,studioHairTile,studioHairScore,studioHairList,studioResultView,
 colorProfilePanel:color12ProfilePanel,colorProfileCard:color12ProfileCard,colorTraits:color12Traits,
 colorReportProfile:color12ReportProfile,colorClassify:color12Classify,
 finishAnalysis:ACTIONS['finish-analysis'],choice:ACTIONS.choice,
 subscribe:ACTIONS.subscribe,subscriptionCheck:ACTIONS['subscription-check'],restore:ACTIONS.restore,
 finishHaircut:ACTIONS['finish-haircut'],observation:F.observation,
 col01:V['COL-01'],col02:V['COL-02'],ana03:V['ANA-03'],ana06:V['ANA-06'],
 pre01:V['PRE-01'],prf06:V['PRF-06']
};

const UX_SEASON_FR={
 bright_spring:'Printemps lumineux',warm_spring:'Printemps chaud',light_spring:'Printemps clair',
 light_summer:'Été clair',cool_summer:'Été froid',soft_summer:'Été doux',
 soft_autumn:'Automne doux',warm_autumn:'Automne chaud',deep_autumn:'Automne profond',
 deep_winter:'Hiver profond',cool_winter:'Hiver froid',bright_winter:'Hiver lumineux'
};
const UX_AXIS_NAMES=['Température','Profondeur','Intensité','Contraste'];
const UX_PREMIUM_STATES=['active','cancelled'];

function uxSeasonLabel(id){const s=COLOR12_SEASONS[id];return s?(UX_SEASON_FR[id]+', '+s.name):'Profil couleur';}
function uxIsPremium(){return UX_PREMIUM_STATES.includes(M.subscription?.status);}
function uxAnalysisPhotoAvailable(key=M.draft?.photo){return !!(key&&String(key).startsWith('photo-')&&memoryPhotos[key]);}
function uxSimulationPhotoAvailable(){return !!(M.simulationPhoto&&(!String(M.simulationPhoto).startsWith('photo-')||memoryPhotos[M.simulationPhoto]));}
function uxLatestAnalysisPhoto(){return M.analyses.slice().reverse().find(x=>x.domain==='Cheveux'&&uxAnalysisPhotoAvailable(x.photo))?.photo||'';}
function uxNextReset(){const d=new Date();d.setMonth(d.getMonth()+1,1);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-01';}
function uxActivatePremium(){
 const previous=M.hairGenerations;
 M.subscription.status='active';
 // Restoring an existing subscription must not grant another ten generations.
 M.hairGenerations=previous?.tier==='premium'&&previous.reset>DATE()
   ?{...previous,used:Math.max(0,Number(previous.used)||0),limit:10}
   :{used:0,limit:10,reset:uxNextReset(),tier:'premium'};
}
function uxEnsure(){
 M.subscription||={status:'free',offer:'yearly'};
 const premium=uxIsPremium(),limit=premium?10:1,tier=premium?'premium':'discovery';
 if(!M.hairGenerations||M.hairGenerations.tier!==tier){M.hairGenerations={used:Math.min(Number(M.hairGenerations?.used)||0,limit),limit,reset:uxNextReset(),tier};}
 if(!M.hairGenerations.reset||M.hairGenerations.reset<=DATE()){M.hairGenerations={used:0,limit,reset:uxNextReset(),tier};}
 M.hairGenerations.limit=limit;M.hairGenerations.tier=tier;
 if(M.draft?.photo?.startsWith('photo-')&&!memoryPhotos[M.draft.photo])M.draft.photo='';
 if(M.simulationPhoto?.startsWith('photo-')&&!memoryPhotos[M.simulationPhoto])M.simulationPhoto='';
 if(M.savedSeason&&M.colorProfile?.season){const id='season:'+M.colorProfile.season;if(!M.saved.includes(id))M.saved.push(id);M.savedSeason=false;}
 M.hairLengthFilter||='Toutes';
}

studioEnsure=function(){UX_BASE.studioEnsure();uxEnsure();};
studioRemaining=function(){studioEnsure();return Math.max(0,M.hairGenerations.limit-M.hairGenerations.used);};
nav=function(){return UX_BASE.nav().replace(/>Pour moi</g,'>Analyses<');};

// Twelve concrete, filterable salon references. Ranking uses every declared answer.
Object.assign(STUDIO_HAIRCUTS[0],{shapes:['Ovale','Carré','Cœur'],changes:['Discret','Visible'],fringes:['Non','Pourquoi pas'],careLevel:'Modéré'});
Object.assign(STUDIO_HAIRCUTS[1],{shapes:['Ovale','Allongé','Cœur'],changes:['Visible','Radical'],fringes:['Non'],careLevel:'Régulier'});
Object.assign(STUDIO_HAIRCUTS[2],{shapes:['Ovale','Rond','Cœur'],changes:['Visible','Radical'],fringes:['Oui','Pourquoi pas'],careLevel:'Modéré'});
Object.assign(STUDIO_HAIRCUTS[3],{shapes:['Ovale','Rond','Carré'],changes:['Radical'],fringes:['Non','Pourquoi pas'],careLevel:'Régulier'});
STUDIO_HAIRCUTS.push(
 {id:'butterfly',name:'Butterfly layers',image:'hair-butterfly-v2',length:'Long',textures:['Raides','Ondulés'],care:'Entretien modéré',careLevel:'Modéré',shapes:['Rond','Carré','Cœur'],changes:['Visible'],fringes:['Pourquoi pas','Oui'],reason:'Crée du mouvement autour du visage sans sacrifier la longueur.',salon:'Longues couches papillon, contour du visage progressif, longueur conservée.'},
 {id:'lob-soft',name:'Lob souple',image:'hair-lob-soft-v2',length:'Mi-long',textures:['Raides','Ondulés'],care:'Entretien simple',careLevel:'Très simple',shapes:['Ovale','Rond','Carré'],changes:['Discret','Visible'],fringes:['Non'],reason:'Une longueur polyvalente qui reste facile à attacher et à coiffer.',salon:'Carré long sous les clavicules, ligne souple, peu de dégradé.'},
 {id:'crop-soft',name:'Crop féminin',image:'hair-crop-soft-v2',length:'Très court',textures:['Raides','Ondulés','Bouclés'],care:'Entretien régulier',careLevel:'Régulier',shapes:['Ovale','Allongé','Cœur'],changes:['Radical'],fringes:['Oui','Pourquoi pas'],reason:'Dégage le visage avec une frange modulable et un dessus texturé.',salon:'Crop court, dessus texturé, frange souple et contours non géométriques.'},
 {id:'rounded-curls',name:'Boucles arrondies',image:'hair-rounded-curls-v2',length:'Mi-long',textures:['Bouclés','Crépus'],care:'Entretien modéré',careLevel:'Modéré',shapes:['Ovale','Allongé','Carré'],changes:['Discret','Visible'],fringes:['Oui','Pourquoi pas'],reason:'Structure le volume en respectant la texture et son ressort naturel.',salon:'Forme arrondie sur cheveux secs, volume équilibré, longueur adaptée au rétrécissement.'},
 {id:'long-waves',name:'Longues ondulations',image:'hair-long-waves-v2',length:'Long',textures:['Ondulés','Bouclés'],care:'Entretien simple',careLevel:'Très simple',shapes:['Ovale','Rond','Carré','Cœur'],changes:['Discret'],fringes:['Non'],reason:'Conserve la matière naturelle avec un contour du visage très léger.',salon:'Longueur conservée, pointes pleines, contour discret sans sur-dégradé.'},
 {id:'french-bob',name:'French bob',image:'hair-french-bob-v2',length:'Court',textures:['Raides','Ondulés','Bouclés'],care:'Entretien régulier',careLevel:'Régulier',shapes:['Ovale','Allongé','Cœur'],changes:['Visible','Radical'],fringes:['Oui','Pourquoi pas'],reason:'Une coupe courte expressive dont la frange peut être adaptée.',salon:'Carré court entre pommette et mâchoire, frange adaptée à l’implantation.'},
 {id:'shag-soft',name:'Shag souple',image:'hair-shag-soft-v2',length:'Mi-long',textures:['Ondulés','Bouclés'],care:'Entretien modéré',careLevel:'Modéré',shapes:['Rond','Carré','Cœur'],changes:['Visible','Radical'],fringes:['Oui'],reason:'Apporte du mouvement et une frange fondue sans ligne trop stricte.',salon:'Dégradé shag progressif, frange rideau fondue, volume conservé aux pointes.'},
 {id:'sleek-long',name:'Long lisse graphique',image:'hair-sleek-long-v2',length:'Long',textures:['Raides'],care:'Entretien simple',careLevel:'Très simple',shapes:['Ovale','Rond','Carré'],changes:['Discret'],fringes:['Non'],reason:'Une forme nette et simple quand la priorité est un entretien minimal.',salon:'Longueur pleine, contour très léger, ligne nette et facile à attacher.'}
);

function uxNormalizeLength(v){v=String(v||'');if(v.startsWith('Très'))return 'Très court';if(v.startsWith('Court'))return 'Court';if(v.startsWith('Mi'))return 'Mi-long';if(v.startsWith('Long'))return 'Long';return v;}
studioHairScore=function(c){
 const p=M.hairProfile||{},texture=p.texture||M.prefs.hair,length=uxNormalizeLength(p.length),care=p.care||'Modéré',shape=String(p.shape||'').replace(' — déclaré',''),change=p.change||'Visible',fringe=p.fringe||'Pourquoi pas';let score=0;
 if(c.textures.includes(texture))score+=7;if(length&&c.length===length)score+=3;if(c.shapes?.includes(shape))score+=3;if(c.changes?.includes(change))score+=2;if(c.fringes?.includes(fringe))score+=2;if(c.careLevel===care)score+=2;return score;
};
studioHairTile=function(c,large=false){if(c.image)return imageFor(c.image,'hair-reference '+(large?'large':''),c.name+' — référence de coupe');return UX_BASE.studioHairTile(c,large);};
function uxHairFit(c){const p=M.hairProfile||{},hits=[];if(c.textures.includes(p.texture))hits.push('texture');if(c.shapes?.includes(String(p.shape||'').replace(' — déclaré','')))hits.push('forme');if(c.careLevel===p.care)hits.push('entretien');return hits.length?'Selon '+hits.join(', '):'Option à comparer';}
studioHairList=function(recommended=false){
 let list=STUDIO_HAIRCUTS.slice();if(!recommended&&M.hairLengthFilter!=='Toutes')list=list.filter(c=>c.length===M.hairLengthFilter);
 list.sort((a,b)=>recommended?studioHairScore(b)-studioHairScore(a):a.name.localeCompare(b.name));if(recommended)list=list.slice(0,4);
 return `<div class="studio-hair-grid" role="region" aria-live="polite">${list.map((c,i)=>A(`${studioHairTile(c)}<span>${recommended&&i===0?'<small class="studio-badge">Meilleure correspondance</small>':''}<strong>${esc(c.name)}</strong><small>${esc(c.length)}, ${esc(c.care)}</small>${recommended?`<small class="match-reason">${esc(uxHairFit(c))}</small>`:''}</span>`,'haircut-open',{id:c.id},'studio-hair-card')).join('')}</div>`;
};

analysisFields=function(){
 if(M.draft.domain!=='Cheveux')return UX_BASE.analysisFields();const a=M.draft.answers||{},p=M.prefs;
 return select('shape','Forme de visage à comparer — si vous la connaissez',['Je ne sais pas','Ovale','Rond','Allongé','Carré','Cœur'],a.shape||'Je ne sais pas')+
 select('texture','Texture naturelle',['Raides','Ondulés','Bouclés','Crépus','Je ne sais pas'],a.texture||p.hair)+
 select('length','Longueur actuelle',['Très courte','Courte','Mi-longue','Longue'],a.length||'Mi-longue')+
 select('change','Changement souhaité',['Discret','Visible','Radical'],a.change||'Visible')+
 select('fringe','Une frange ?',['Pourquoi pas','Oui','Non'],a.fringe||'Pourquoi pas')+
 select('care','Entretien accepté',['Très simple','Modéré','Régulier'],a.care||'Modéré');
};

V['ANA-03']=()=>head('Avant de commencer','Vous choisissez les informations utilisées.')+progress(1,5)+panel(`<h3>${esc(M.draft.domain)}</h3>${P('La photo est facultative. Dans cette version, elle sert uniquement de référence pour une simulation de coupe et n’est pas interprétée par un moteur visuel.')}${P('Les recommandations de coupe, de couleurs et de soin sont calculées à partir de vos réponses déclarées. Vous pourrez toujours les corriger.')}`)+form('consent',check('consent','J’ai compris comment mes réponses et, si je le souhaite, ma photo seront utilisées.',M.draft.consent),'Continuer')+B('Ne pas poursuivre','ANA-01','secondary mt')+B('Informations sur mes données','PRF-11','text-button mt',{document:'Données'});
V['ANA-04']=()=>head('Ajouter une photo ?','Cette étape est toujours facultative.')+progress(2,5)+panel(`${icon('image','glow-icon xl')}<h2>${M.draft.domain==='Cheveux'?'Réutilisable pour vos essais de coupe':'Une référence personnelle'}</h2>${P(M.draft.domain==='Cheveux'?'Une photo de face, nette et sans filtre pourra être reprise dans Hair Studio. Les recommandations restent fondées sur vos réponses.':'Le résultat de cette version reste fondé sur vos réponses, avec ou sans photo.')}`)+`<div class="analysis-choice">${A('Choisir une photo','file-pick',{purpose:'analysis'})}${A('Continuer avec mes réponses','without-photo',{},'secondary')}</div>`+moreActions(B('Conseils pour une photo de face','ANA-05','text-button'),'Besoin d’aide');
V['ANA-05']=()=>head('Réussir ma photo','Trois repères suffisent.')+panel(`<h2>Face à l’objectif</h2><div class="skin-traits"><div>${icon('sun')}<strong>Lumière naturelle et uniforme</strong></div><div>${icon('user')}<strong>Visage de face, expression neutre</strong></div><div>${icon('spark')}<strong>Sans filtre ni retouche</strong></div></div>${P('Évitez le contre-jour et les lumières colorées. Pour la peau ou la colorimétrie, le résultat présenté restera fondé sur vos réponses.')}`)+A('Choisir ma photo','file-pick',{purpose:'analysis'})+A('Continuer sans photo','without-photo',{},'secondary mt')+B('Retour','ANA-04','text-button mt');
V['ANA-06']=()=>{if(M.draft.photo?.startsWith('photo-')&&!memoryPhotos[M.draft.photo])M.draft.photo='';return UX_BASE.ana06();};

function uxHairProfile(answers){const shape=answers.shape&&answers.shape!=='Je ne sais pas'?answers.shape+' — déclaré':'Forme non renseignée';return {shape,texture:answers.texture||M.prefs.hair,length:answers.length||'Mi-longue',change:answers.change||'Visible',fringe:answers.fringe||'Pourquoi pas',care:answers.care||'Modéré',basis:'Réponses déclarées'};}
function uxColorKnown(a){return ['temperatureHint','depthHint','chromaHint','contrastHint'].filter(k=>a[k]&&!String(a[k]).startsWith('Je ne sais')&&a[k]!=='Neutre ou variable').length;}
color12Classify=function(a){const known=uxColorKnown(a);if(!known)return {season:'soft_summer',name:'Profil à compléter',family:'summer',match:'Informations insuffisantes',alternatives:[],status:'needs_review',source:'Réponses insuffisantes — aucune photo interprétée'};const p=UX_BASE.colorClassify(a);p.status=known>=3?'coherent':'indicative';p.match=known>=3?'Correspondance cohérente':'Profil indicatif à comparer';p.source='Réponses déclarées sur '+known+' axe'+(known>1?'s':'')+' — aucune photo interprétée';return p;};
color12ReportProfile=function(r){const source=arguments.length?r:report();if(source&&typeof source==='object'&&!source.season)return null;const season=source?.season||(!source?M.colorProfile?.season:null);if(!COLOR12_SEASONS[season])return null;const s=COLOR12_SEASONS[season];return {season,name:s.name,family:s.family,match:source?.match||M.colorProfile?.match||'Profil indicatif',alternatives:source?.alternatives||M.colorProfile?.alternatives||s.alternatives,status:source?.colorStatus||M.colorProfile?.status||'indicative'};};

function uxSkinPlan(a){
 const sensitive=a.sensitivity==='Souvent',tight=a.afterWash==='Elle tire',shine=a.afterWash==='Elle brille vite';
 const morning=[tight?'Nettoyer seulement si nécessaire, avec un produit doux déjà bien toléré.':'Nettoyer doucement, sans frotter, avec un produit déjà bien toléré.',tight?'Appliquer un hydratant confortable sur peau légèrement humide.':shine?'Appliquer un hydratant léger selon le confort ressenti.':'Appliquer son hydratant habituel selon les besoins.','Avant de sortir, protéger la peau exposée avec ombre, vêtements et écran large spectre SPF 30 ou plus.'];
 const evening=['Retirer le maquillage si besoin avec un produit déjà bien toléré.','Nettoyer doucement le visage, sans frotter.','Appliquer son hydratant habituel si la peau en ressent le besoin.'];
 if(sensitive)evening.push('Introduire un seul changement à la fois et arrêter en cas de brûlure ou de réaction persistante.');
 return {goal:a.skinGoal||'Routine simple',sensitive,morning,evening,source:'https://www.aad.org/public/everyday-care/skin-care-basics/care/skin-care-budget'};
}
function uxSkinPlanHtml(plan=M.skinPlan){if(!plan)return '';return `<section class="skin-plan"><div class="skin-plan-column"><h3>Matin, ${plan.morning.length} gestes</h3><ol>${plan.morning.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div><div class="skin-plan-column"><h3>Soir, ${plan.evening.length} gestes</h3><ol>${plan.evening.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div></section>`;}

ACTIONS['finish-analysis']=()=>{
 const domain=M.draft.domain,answers=clone(M.draft.answers||{}),previousColor=clone(M.colorProfile||null);UX_BASE.finishAnalysis();if(M.draft.status!=='complete')return;const r=M.analyses.find(x=>x.id===M.draft.reportId)||M.analyses.at(-1);
 if(domain==='Cheveux'){M.hairProfile=uxHairProfile(answers);if(r)Object.assign(r,{hairProfile:clone(M.hairProfile),source:'Recommandations fondées sur les réponses déclarées'});}
 if(domain==='Colorimétrie'){const p=color12Classify(answers);if(p.status==='needs_review')M.colorProfile=previousColor;else{M.colorProfile=p;M.colorFamily=p.family;M.context.season=p.season;}if(r)Object.assign(r,{season:p.status==='needs_review'?null:p.season,match:p.match,alternatives:p.alternatives,colorStatus:p.status,source:p.source});M.colorSeasonTab='Profil';}
 if(domain==='Peau'){M.skinPlan=uxSkinPlan(answers);M.skinProfile={traits:[answers.afterWash==='Elle tire'?'Confort et hydratation à soutenir':answers.afterWash==='Elle brille vite'?'Brillance à observer':'Hydratation à observer',answers.sensitivity==='Souvent'?'Sensibilité souvent ressentie':'Tolérance à suivre',answers.skinGoal==='Éclat'?'Éclat à accompagner':'Routine à simplifier'],goal:answers.skinGoal||'Routine simple',basis:'Réponses déclarées'};if(r)Object.assign(r,{skinPlan:clone(M.skinPlan),skinProfile:clone(M.skinProfile),source:'Bilan fondé sur les réponses déclarées'});}
 persist();go('ANA-10',{replace:true});
};

studioResultView=function(r){
 if(r?.domain==='Cheveux')return head('Mes coupes recommandées',dateText(r.date))+panel(`<span class="eyebrow">D’après mes réponses</span><h2>${esc(M.hairProfile?.shape||'Profil coupe')}</h2>${P([M.hairProfile?.texture,M.hairProfile?.length,M.hairProfile?.change].filter(Boolean).map(esc).join(', '))}`)+studioHairList(true)+A('Ouvrir Hair Studio','studio-result-open',{domain:'Cheveux'})+note('Le classement utilise vos réponses. La photo n’a pas servi à déterminer la forme du visage.');
 if(r?.domain==='Colorimétrie'){const p=color12ReportProfile(r),s=p&&COLOR12_SEASONS[p.season];if(!p||!s)return UX_BASE.studioResultView(r);return head('Mon profil 12 saisons',dateText(r.date))+color12ProfileCard(p)+color12Traits(s)+panel(`<h3>À retenir</h3>${P('Comparez d’abord ces couleurs près du visage en lumière naturelle. Les saisons proches restent disponibles si le rendu vous paraît partagé.')}`)+A('Explorer ce résultat dans Color Studio','color-report-open',{id:r.id})+A('Corriger mes repères','edit-analysis',{},'secondary mt')+note('Correspondance indicative fondée sur vos réponses ; aucune photo n’a été interprétée.');}
 if(r?.domain==='Peau')return head('Mon bilan de peau',dateText(r.date))+panel(`<span class="eyebrow">D’après mes réponses</span><h2>Un rituel simple à essayer</h2>${P('Vous pouvez l’ajouter, puis modifier ou retirer chaque geste.')}`)+uxSkinPlanHtml(r.skinPlan||M.skinPlan)+A('Ajouter ces rituels','skin-apply-plan')+(r.skinPlan?.sensitive||M.skinPlan?.sensitive?note('En cas de brûlure, de réaction persistante, de traitement ou d’allergie connue, demandez conseil à un professionnel avant de changer de routine.'):'')+note('Ce bilan ne constitue pas un diagnostic médical.');
 return UX_BASE.studioResultView(r);
};
V['ANA-10']=()=>{const r=report();if(r?.domain==='Colorimétrie'&&r.colorStatus==='needs_review')return head('Complétons votre profil couleur','Vos réponses ne donnent pas encore assez de repères.')+panel(`${icon('palette','glow-icon xl')}<h2>Aucune saison attribuée au hasard</h2>${P('Ajoutez au moins un repère de température, profondeur, intensité ou contraste. Une photo seule n’est pas interprétée dans cette version.')}`)+A('Compléter mes repères','edit-analysis')+B('Explorer les 12 saisons','COL-02','secondary mt')+note('Votre profil couleur actif, s’il existait déjà, n’a pas été modifié.');if(r?.domain==='Colorimétrie'&&!r.season)return head('Ancien compte rendu','Ce résultat ne contient pas encore les données 12 saisons.')+panel(`<h2>Une nouvelle analyse est nécessaire</h2>${P('Nous ne remplaçons pas un ancien résultat par votre profil actuel : cela fausserait votre historique.')}`)+A('Créer un profil 12 saisons','studio-analysis',{domain:'Colorimétrie'})+B('Tous mes comptes rendus','ANA-12','secondary mt');return studioResultView(r);};
V['ANA-09']=()=>V['ANA-10']();

function uxHairColorPanel(){const s=color12Current();if(!s)return intent('Trouver mes couleurs','Créer d’abord mon profil 12 saisons','studio-analysis',{domain:'Colorimétrie'},'palette');return panel(`<span class="eyebrow">${esc(uxSeasonLabel(M.colorProfile.season))}</span><h2>Nuances à discuter au salon</h2>${P(esc(s.hair.note))}<div class="hair-color-list">${s.hair.best.map(x=>`<strong>${esc(x)}</strong>`).join('')}</div>`)+A('Voir les détails dans Color Studio','open-color-use',{use:'Cheveux'});
}
function uxHairDraft(){const d=M.haircutDraft,c=STUDIO_HAIRCUTS.find(x=>x.id===d?.haircut);return c?panel(`<span class="eyebrow">Simulation en cours</span><h2>${esc(c.name)}</h2>${P('Votre photo et votre choix sont conservés. Aucun essai n’a encore été décompté.')}${A('Reprendre ma simulation','resume-haircut',{id:c.id})}`,'hair-draft'):'';}
V['HAI-01']=()=>{studioEnsure();const tab=M.hairTab||'Recommandées',premium=uxIsPremium();return head('Hair Studio','Des coupes classées selon vos réponses, puis un essai sur votre photo.')+`<div class="quota-card"><div><span>${icon('spark')}</span><strong>${studioRemaining()} essai${studioRemaining()>1?'s':''} disponible${studioRemaining()>1?'s':''}</strong><small>${premium?'Premium, 10 par mois':'Découverte, 1 essai offert'}, renouvellement ${dateText(M.hairGenerations.reset)}</small></div><span class="quota-number">${studioRemaining()}</span></div>`+uxHairDraft()+(!M.hairProfile?intent('Créer mon profil coupe','Texture, longueur, changement et entretien','studio-analysis',{domain:'Cheveux'},'sparkles'):panel(`<span class="eyebrow">Profil fondé sur mes réponses</span><h2>${esc(M.hairProfile.shape)}</h2>${P([M.hairProfile.texture,M.hairProfile.length,M.hairProfile.change,M.hairProfile.care].filter(Boolean).map(esc).join(', '))}${A('Corriger mon profil','hair-profile-edit',{},'text-button')}`))+chips(['Recommandées','Toutes','Couleurs'],'hairTab',tab)+`<div role="region" aria-live="polite">${tab==='Couleurs'?uxHairColorPanel():tab==='Recommandées'?sec('Mes meilleures correspondances')+studioHairList(true)+note('Chaque réponse influence le classement. Vous gardez toujours le dernier mot.'):sec('Toutes les références')+`<div class="hair-filters"><small>Filtrer par longueur</small>${chips(['Toutes','Très court','Court','Mi-long','Long'],'hairLengthFilter',M.hairLengthFilter)}</div>`+studioHairList(false)}</div>`+A(M.simulations.some(x=>M.saved.includes(x.id))?'Voir mes simulations enregistrées':'Voir mes simulations','saved-hair-sims',{},'secondary mt');};

function uxQuotaBlocked(intent){if(uxIsPremium())modal('Vos 10 essais ont été utilisés',`<div class="quota-lock"><span class="quota-number">0</span>${P('Votre quota se renouvelle le '+dateText(M.hairGenerations.reset)+'. Vos recommandations et vos résultats enregistrés restent accessibles.')}</div>`+A('Voir mes simulations enregistrées','saved-hair-sims')+A('Retour aux coupes','close',{},'secondary mt'));else{M.premiumIntent=intent||null;go('PRE-01');}}
function uxHaircutAnalysisPhoto(analysis){
 if(!analysis)return uxLatestAnalysisPhoto();
 const record=M.analyses.find(x=>x.id===analysis&&x.domain==='Cheveux');
 return record&&uxAnalysisPhotoAvailable(record.photo)?record.photo:'';
}
ACTIONS['haircut-simulate']=d=>{
 const c=STUDIO_HAIRCUTS.find(x=>x.id===d.id);if(!c)return;
 // An omitted analysis starts a generic catalogue try-on, never an old report.
 const analysis=d.analysis||'';
 if((M.haircutAnalysis||'')!==analysis)M.simulationPhoto='';
 M.haircutAnalysis=analysis;
 M.haircutSelected=c.id;studioEnsure();if(!studioRemaining()){closeModal();uxQuotaBlocked({kind:'haircut',id:c.id,analysis,photo:M.simulationPhoto});return;}
 if(!uxSimulationPhotoAvailable())M.simulationPhoto='';
 const analysisPhoto=uxHaircutAnalysisPhoto(analysis);
 modal('Préparer ma simulation',P('L’essai sera décompté uniquement quand le résultat sera créé.')+(M.simulationPhoto?imageFor(M.simulationPhoto,'article-photo','Photo prête pour la simulation')+P('Votre photo est prête.'):P('Choisissez une photo de face, nette et sans filtre.'))+(analysisPhoto&&!M.simulationPhoto?A('Réutiliser la photo de mon analyse','haircut-use-analysis-photo',{id:c.id,analysis},'secondary'):'')+A(M.simulationPhoto?'Changer ma photo':'Choisir ma photo','file-pick',{purpose:'simulation'},'secondary mt')+(M.simulationPhoto?A('Générer cette coupe','haircut-generate-confirm',{id:c.id,analysis},'mt'):'')+A('Annuler','close',{},'text-button mt'));
};
ACTIONS['haircut-use-analysis-photo']=d=>{
 const analysis=d.analysis===undefined?M.haircutAnalysis||'':d.analysis;
 const p=uxHaircutAnalysisPhoto(analysis);if(!p)return toast('Cette photo doit être choisie à nouveau.');
 M.simulationPhoto=p;closeModal(false);ACTIONS['haircut-simulate']({id:d.id||M.haircutSelected,analysis});
};
ACTIONS['resume-haircut']=d=>{M.haircutSelected=d.id;go('ESS-02',{context:{haircut:d.id}});};
ACTIONS['finish-haircut']=()=>{studioEnsure();if(!studioRemaining()){uxQuotaBlocked();return;}UX_BASE.finishHaircut();};
loadPhoto=function(file,purpose){if(!file)return;if(!file.type.startsWith('image/')||file.size>15*1024*1024){toast('Choisissez une image de moins de 15 Mo.');return;}const key=uid('photo'),url=URL.createObjectURL(file),probe=new Image();probe.onload=()=>{captureDrafts();memoryPhotos[key]=url;if(purpose==='profile'){M.profileEdit||=clone(M.profile);M.profileEdit.avatar=key;}else if(purpose==='clothing')M.context.clothingPhoto=key;else if(purpose==='observation')M.context.observationPhoto=key;else if(purpose==='simulation')M.simulationPhoto=key;else{M.draft.photo=key;M.draft.withoutPhoto=false;}if(purpose==='analysis'){M.draft.phase='ANA-06';go('ANA-06');}else if(purpose==='simulation'){closeModal(false);ACTIONS['haircut-simulate']({id:M.haircutSelected});toast('Photo prête pour la simulation.');}else{render();toast('Photo sélectionnée.');}};probe.onerror=()=>{URL.revokeObjectURL(url);toast('Cette image ne peut pas être ouverte.');};probe.src=url;};

function uxApplySkinPlan(plan=M.skinPlan){
 if(!plan)return false;
 [['Matin',plan.morning,'morning'],['Soir',plan.evening,'evening']].forEach(([moment,steps,image])=>{
  const id='skin-plan-'+moment.toLowerCase();
  // An adopted routine is user-owned: preserve edits, versions and sessions.
  if(!M.routines.some(r=>r.id===id)&&Array.isArray(steps)&&steps.length){
   M.routines.push({id,name:'Mon rituel conseillé du '+moment.toLowerCase(),domain:'Peau',moment,frequency:'Chaque jour',steps:steps.slice(),image,type:'Routine',version:1,generatedSkinPlan:true,templateSource:plan.source});
   if(!M.active.includes(id))M.active.push(id);
   M.schedules[id]={start:DATE(),days:[0,1,2,3,4,5,6]};
  }
 });
 return M.routines.some(r=>r.generatedSkinPlan);
}
function uxInProgressRoutine(){return M.sessions.find(s=>s.kind==='routine'&&!s.confirmed&&s.steps?.some(x=>x==='done')&&s.steps.some(x=>x!=='done'));}
function uxRoutineRows(routines){return routines.map(r=>`<div class="routine-studio-row"><button type="button" class="row-label" data-go="ROU-02" data-key="routine" data-value="${esc(r.id)}"><span><strong>${esc(r.name)}</strong><small>${r.steps.length} gestes, ${esc(r.frequency)}</small></span></button>${A('Adapter','routine-edit-direct',{id:r.id},'text-button')}</div>`).join('');}
V['PEA-01']=()=>{const tab=M.skinTab||'Analyse',routines=M.routines.filter(r=>r.domain==='Peau'),progressSession=uxInProgressRoutine();return head('Skin Studio','Comprendre, essayer, puis ajuster selon votre ressenti.')+(progressSession?panel(`<span class="eyebrow">En cours</span><h2>${esc(progressSession.name)}</h2>${P(progressSession.steps.filter(x=>x==='done').length+' / '+progressSession.steps.length+' gestes réalisés')}${B('Reprendre mon rituel','ROU-04','secondary',{key:'routine',value:progressSession.ref})}`):'')+chips(['Analyse','Matin','Soir','Suivi'],'skinTab',tab)+`<div role="region" aria-live="polite">${tab==='Analyse'?(!M.skinProfile?intent('Comprendre les besoins de ma peau','Mes ressentis et mes habitudes actuelles','studio-analysis',{domain:'Peau'},'sparkles'):`<section class="skin-profile-card"><span class="eyebrow">Bilan fondé sur mes réponses</span><h2>${esc(M.skinProfile.goal)}</h2><div class="skin-traits">${studioSkinTraits().map((x,i)=>`<div><span>${icon(i===0?'drop':i===1?'heart':'spark')}</span><strong>${esc(x)}</strong></div>`).join('')}</div>${M.skinPlan?uxSkinPlanHtml()+A('Ajouter ces rituels','skin-apply-plan'):''}${A('Refaire ou corriger mon analyse','studio-analysis',{domain:'Peau'},'secondary')}</section>`)+note('Aucun diagnostic médical. En cas de réaction persistante, demandez conseil à un professionnel.'):tab==='Suivi'?row('Mes observations de peau','Retrouver mes ressentis et photos','PRO-01','bars')+A('Ajouter une observation de peau','skin-add-observation'):sec('Mes rituels du '+tab.toLowerCase())+(uxRoutineRows(routines.filter(r=>r.moment===tab))||empty('Aucun rituel pour ce moment','Ajoutez le rituel proposé ou partez d’un modèle.'))+A('Créer un rituel à moi','new-routine')}</div>`;};
ACTIONS['skin-apply-plan']=()=>{if(!uxApplySkinPlan()){toast('Refaites d’abord votre bilan de peau.');return;}M.skinTab='Matin';persist();go('PEA-01');toast('Vos deux rituels sont prêts et modifiables.');};
ACTIONS['routine-edit-direct']=d=>{const r=M.routines.find(x=>x.id===d.id);if(!r)return;M.routineEdit=clone(r);clearDrafts('routine');go('ROU-03');};
ACTIONS['skin-add-observation']=()=>{M.observationDomain='Peau';M.observationEdit=null;clearDrafts('observation');go('PRO-03',{context:{observationPhoto:''}});};
F.observation=(d,f)=>{const editing=M.observationEdit?.id,domain=M.observationDomain||M.observationEdit?.domain||'';const before=new Set(M.observations.map(x=>x.id)),result=UX_BASE.observation(d,f);const o=editing?M.observations.find(x=>x.id===editing):M.observations.find(x=>!before.has(x.id));if(o&&domain)o.domain=domain;M.observationDomain='';return result;};

// Saved seasonal palettes are first-class items and history never mutates the active profile silently.
function uxSeasonItem(id){if(!String(id).startsWith('season:'))return null;const sid=String(id).slice(7),s=COLOR12_SEASONS[sid];return s?{id,name:uxSeasonLabel(sid),domain:'Colorimétrie',type:'Palette',desc:s.summary,season:sid}:null;}
item=function(id){return uxSeasonItem(id)||UX_BASE.item(id);};
card=function(x){if(x?.season&&String(x.id).startsWith('season:')){const saved=M.saved.includes(x.id);return `<article class="content-card season-saved-card"><button type="button" data-open="${esc(x.id)}">${color12Band(COLOR12_SEASONS[x.season],7,'saved-season-band')}<span class="card-type">Palette, Colorimétrie</span><h3>${esc(x.name)}</h3><p>${esc(x.desc)}</p></button>${A(icon(saved?'check':'bookmark'),'save',{id:x.id,pressed:saved,label:(saved?'Retirer ':'Enregistrer ')+x.name},'heart-save')}</article>`;}return UX_BASE.card(x);};
openItem=function(id){const season=uxSeasonItem(id),x=item(id),key=v1UpcomingKey(x);if(season){M.previewSeason=season.season;go('COL-01');return;}if(key){ACTIONS['coming-open']({feature:key});return;}UX_BASE.openItem(id);};
color12Traits=function(s){return `<div class="season-traits">${s.axes.map((x,i)=>`<div class="season-axis"><small>${UX_AXIS_NAMES[i]}</small><strong>${esc(x)}</strong></div>`).join('')}</div>`;};
color12ProfileCard=function(profile){const s=COLOR12_SEASONS[profile.season],f=COLOR12_FAMILIES[s.family];return `<section class="season-hero"><span class="eyebrow">${esc(f.label)}, profil 12 saisons</span><h2>${esc(uxSeasonLabel(profile.season))}</h2><p>${esc(s.summary)}</p>${color12Band(s)}<div class="season-match">${icon('spark')}<span><strong>${esc(profile.match)}</strong><small>Fondé sur vos réponses, sans score artificiel</small></span></div></section>`;};
color12ProfilePanel=function(profile){const original=M.colorSeasonTab||'Profil';if(original==='À comparer')M.colorSeasonTab='À éviter';let html=UX_BASE.colorProfilePanel(profile);M.colorSeasonTab=original;html=html.replaceAll('À éviter','À comparer').replace('Le dépôt Beautify prévoit des bandes de correspondance, pas de faux pourcentage de précision.','Les quatre axes expliquent le résultat sans faux pourcentage de précision.').replace('dans le produit final','dans une prochaine version');const sid=profile?.season,id=sid?'season:'+sid:'',saved=id&&M.saved.includes(id);html=html.replace(/Palette enregistrée|Enregistrer ma palette/g,saved?'Retirer des enregistrés':'Enregistrer ma palette');if(original==='Profil')html+=A('Explorer les 12 saisons','color-family',{},'secondary mt');return html;};
V['COL-01']=()=>{uxEnsure();if(M.previewSeason&&COLOR12_SEASONS[M.previewSeason]){const sid=M.previewSeason,s=COLOR12_SEASONS[sid],active=M.colorProfile?.season===sid,p={season:sid,match:'Aperçu de saison',alternatives:s.alternatives};return head('Aperçu couleur',uxSeasonLabel(sid))+`<div class="preview-banner"><strong>${active?'C’est votre profil actif':'Votre profil actif n’a pas changé'}</strong><small>Vous consultez une palette enregistrée ou un ancien résultat.</small></div>`+color12ProfileCard(p)+color12Traits(s)+color12ColorGrid(s.colors)+(!active?A('Utiliser comme profil actif','color-set-active',{id:sid}):'')+A('Fermer cet aperçu','color-preview-close',{},'secondary mt');}let html=UX_BASE.col01();Object.keys(UX_SEASON_FR).forEach(id=>{html=html.replaceAll('>'+COLOR12_SEASONS[id].name+'<','>'+uxSeasonLabel(id)+'<');});return html.replaceAll('Nette / lumineuse','Nettes / lumineuses');};
V['COL-02']=()=>{let html=UX_BASE.col02();Object.keys(UX_SEASON_FR).forEach(id=>{html=html.replaceAll(COLOR12_SEASONS[id].name,uxSeasonLabel(id));});return html;};
ACTIONS['color-season-save']=()=>{const sid=M.colorProfile?.season;if(!sid)return toast('Créez d’abord votre profil couleur.');const id='season:'+sid,i=M.saved.indexOf(id);if(i>=0)M.saved.splice(i,1);else M.saved.push(id);persist();render();toast(i>=0?'Palette retirée des enregistrés.':'Palette enregistrée.');};
ACTIONS['color-report-open']=d=>{const r=M.analyses.find(x=>x.id===d.id);if(!r?.season){toast('Cet ancien résultat doit être recréé en 12 saisons.');return;}M.previewSeason=r.season;go('COL-01');};
ACTIONS['color-set-active']=d=>{const s=COLOR12_SEASONS[d.id];if(!s)return;M.colorProfile={season:d.id,name:s.name,family:s.family,match:'Profil choisi par vous',alternatives:s.alternatives,status:'chosen',source:'Saison choisie depuis un aperçu'};M.colorFamily=s.family;M.colorSeasonTab='Profil';M.previewSeason='';persist();render();toast('Votre profil actif a été mis à jour.');};
ACTIONS['color-preview-close']=()=>{M.previewSeason='';go('COL-01');};
ACTIONS['open-color-use']=d=>{M.colorUse=d.use;M.colorSeasonTab=d.use==='Cheveux'?'Cheveux':'Profil';go('COL-01');};

ACTIONS['hair-profile-edit']=()=>modal('Corriger mon profil',form('hair-profile',select('shape','Forme à comparer',['Ovale','Rond','Allongé','Carré','Cœur','Je ne sais pas'],String(M.hairProfile?.shape||'Je ne sais pas').replace(' — déclaré',''))+select('texture','Texture',['Raides','Ondulés','Bouclés','Crépus','Je ne sais pas'],M.hairProfile?.texture||M.prefs.hair)+select('length','Longueur',['Très courte','Courte','Mi-longue','Longue'],M.hairProfile?.length||'Mi-longue')+select('change','Changement',['Discret','Visible','Radical'],M.hairProfile?.change||'Visible')+select('fringe','Une frange ?',['Pourquoi pas','Oui','Non'],M.hairProfile?.fringe||'Pourquoi pas')+select('care','Entretien',['Très simple','Modéré','Régulier'],M.hairProfile?.care||'Modéré'),'Mettre à jour'));
F['hair-profile']=d=>{M.hairProfile=uxHairProfile(d);M.prefs.hair=d.texture;closeModal();render();toast('Profil mis à jour et recommandations reclassées.');};

// Coming-soon pages remain strategic previews, with honest interest tracking and origin-aware return.
function uxFuturePreview(key){const s=color12Current(),colors=s?.colors.slice(0,3)||[['Rose doux','#b77990'],['Prune','#634b68'],['Taupe','#9b8982']];if(key==='makeup')return `<div class="future-demo makeup-demo">${colors.map(([name,c],i)=>`<div><span style="--season-color:${c}"></span><strong>${['Lèvres','Yeux','Teint'][i]}</strong><small>${esc(name)}</small></div>`).join('')}</div>`;return color12FuturePreview(key);}
v1UpcomingPage=function(key){const f=V1_UPCOMING[key],saved=!!M.comingSoonNotices?.[key];return head(f.title,'Découvrez ce qui est en préparation.')+`<section class="coming-hero">${imageFor(f.image,'coming-image',f.title)}<div class="coming-shade"></div><span class="coming-pill">Bientôt</span><div class="coming-copy"><h2>${esc(f.subtitle)}</h2><p>Un aperçu pour comprendre comment cette fonctionnalité complétera vos studios actuels.</p></div></section>`+color12FutureContext(key)+sec('Comment cela fonctionnera')+uxFuturePreview(key)+sec('Ce que vous pourrez faire')+`<div class="coming-list">${f.features.map((x,i)=>`<div><span>${i+1}</span><p>${esc(x)}</p></div>`).join('')}</div>`+`<div class="coming-interest">${P(saved?'Votre intérêt est enregistré. Vous pourrez le retirer à tout moment.':'Gardez cette nouveauté dans vos intérêts pour la retrouver dans votre profil.')}${A(saved?'Retirer de mes intérêts':'Garder cette nouveauté','coming-notify',{feature:key,pressed:saved},saved?'secondary':'primary')}</div>`+A('Revenir à la page précédente','coming-return',{},'text-button mt');};
ACTIONS['coming-open']=d=>{M.comingReturnState=snapshot();go(d.feature==='tutorial'?'DEC-04':d.feature==='makeup'?'MAQ-01':'GAR-01');};
ACTIONS['coming-return']=()=>{const s=M.comingReturnState;M.comingReturnState=null;returnToState(s,'DEC-01');};
ACTIONS['coming-notify']=d=>{M.comingSoonNotices||={};M.comingSoonNotices[d.feature]=!M.comingSoonNotices[d.feature];persist();render();toast(M.comingSoonNotices[d.feature]?'Intérêt enregistré.':'Intérêt retiré.');};
const UX_EVENT_SELECT=ACTIONS['event-select'];
ACTIONS['event-select']=d=>{if(d.domain==='Maquillage'){ACTIONS['coming-open']({feature:'makeup'});return;}if(d.domain==='Garde-robe'){ACTIONS['coming-open']({feature:'wardrobe'});return;}UX_EVENT_SELECT(d);};
ACTIONS['go-makeup']=()=>ACTIONS['coming-open']({feature:'makeup'});
ACTIONS.tutorial=d=>{if(d.id)M.context.look=d.id;ACTIONS['coming-open']({feature:'tutorial'});};

// One card per unavailable module in search, and preference-aware discovery.
catalogResults=function(){const f=M.filters,s=M.context.selection;let source=s&&M.selectionSource==='Mes enregistrés'?M.saved.map(item).filter(Boolean):[...CATALOG.filter(x=>x.type!=='Routine'),...M.routines];if(s?.kind==='event')source=[...source,...(M.selectionSource==='Mes enregistrés'?[]:M.outfits.filter(x=>x.pieces))];let xs=source.filter(x=>(!s||canSelect(x,s))&&(!s?(f.domain==='Tous'||x.domain===f.domain)&&(f.type==='Tous'||x.type===f.type)&&(f.occasion==='Toutes'||x.occasion===f.occasion||x.occasion==='Toutes'):true)&&(!f.q||fold(x.name+' '+(x.desc||'')+' '+x.domain).includes(fold(f.q)))&&(!s?(f.time==='Tous'||x.minutes<=(f.time==='5 minutes'?5:15))&&(f.budget==='Tous'||(f.budget==='Sans achat'?x.budget==='Sans achat':x.type==='Produit'&&x.price<30)):true));const seen=new Set();xs=xs.filter(x=>{const key=v1UpcomingKey(x);if(!key)return true;if(seen.has(key))return false;seen.add(key);return true;});if(M.scenario==='empty')xs=[];if(s?.kind==='event')xs.sort((a,b)=>(b.occasion===M.events.find(e=>e.id===s.eventId)?.occasion?1:0)-(a.occasion===M.events.find(e=>e.id===s.eventId)?.occasion?1:0));return sec(`${xs.length} idée${xs.length>1?'s':''}`)+(s?.kind==='event'?note('Les idées de votre occasion apparaissent d’abord. Vous pouvez aussi choisir une autre inspiration.'):'')+(xs.length?grid(xs):empty('Aucune correspondance','Essayez un autre mot ou élargissez vos choix.')+A(s?'Voir toutes les inspirations':'Effacer les filtres','reset-filters',{},'secondary'));};
function uxInterestCards(){const prefs=M.prefs.interests||[],order=[...prefs,...['Cheveux','Colorimétrie','Peau']].filter((x,i,a)=>['Cheveux','Colorimétrie','Peau'].includes(x)&&a.indexOf(x)===i);return `<div class="studio-stack compact">${order.map(d=>d==='Cheveux'?studioCard('Mes coupes recommandées','Un classement selon mes envies.','go-hair-home','Cheveux','hair'):d==='Colorimétrie'?studioCard('Mon profil 12 saisons','Des couleurs pour vêtements, cheveux et plus.','go-color-home','Colorimétrie','palette'):studioCard('Mon rituel de peau','Un plan matin et soir adaptable.','go-skin-home','Peau','leaf')).join('')}</div>`;}
V['DEC-01']=()=>head('Découvrir','Commencez par ce qui vous intéresse aujourd’hui.')+A(icon('search')+' Rechercher une inspiration…','catalog',{},'search-entry')+sec('Pour moi','PRF-03','Affiner')+uxInterestCards()+sec('En préparation')+`<div class="coming-preview-grid">${['makeup','wardrobe','tutorial'].map(v1ComingCard).join('')}</div>`;
Object.assign(ACTIONS,{'go-hair-home':()=>go('HAI-01'),'go-color-home':()=>go('COL-01'),'go-skin-home':()=>go('PEA-01')});

eventCard=function(e){const chosen=e.look?.Cheveux?1:0;return `<button class="glass dark event-row" data-go="EVE-03" data-key="event" data-value="${e.id}">${photo('wedding')}<span><h3>${esc(e.name)}</h3><p>${dateText(e.date)}</p><small>${chosen?esc(item(e.look.Cheveux)?.name||'Coiffure choisie'):'Coiffure à choisir'}</small></span>${icon('chev')}</button>`;};
sample=function(){UX_BASE.sample();M.events.forEach(e=>{e.needs=['Cheveux'];e.look={Cheveux:e.look?.Cheveux||'bun'};e.tasks={Cheveux:!!e.tasks?.Cheveux};});uxEnsure();persist();};

// Premium activation grants a fresh monthly quota; expiration never loops back to checkout.
ACTIONS.subscribe=()=>{UX_BASE.subscribe();if(M.subscription.status==='active')uxActivatePremium();persist();render();};
ACTIONS['subscription-check']=()=>{UX_BASE.subscriptionCheck();uxActivatePremium();persist();render();};
ACTIONS.restore=d=>{UX_BASE.restore(d);if(d.result==='found')uxActivatePremium();persist();render();};
V['PRE-01']=()=>head('Beautify Premium','Dix essais de coupes par mois, sans perdre vos autres repères.')+`<section class="glass premium-value"><span class="eyebrow">Inclus chaque mois</span><h2>10 simulations<br><span class="accent">de coupes</span></h2><p>Comparez vos meilleures recommandations sur votre photo. Les analyses couleur et peau restent disponibles pour construire votre profil.</p>${B('Voir Hair Studio','HAI-01','secondary')}</section>`+`<div class="offer-comparison"><div><span>Découverte</span><p>1 simulation de coupe offerte, profil 12 saisons et rituel de peau.</p></div><div><span>Premium</span><p>10 simulations de coupes renouvelées chaque mois, favoris et historique.</p></div></div>`+`<fieldset class="billing"><legend>Choisir mon rythme</legend>${['monthly','yearly'].map(v=>A(`<strong>${v==='yearly'?'Annuel':'Mensuel'}</strong><span>${v==='yearly'?'59,99 € / an':'9,99 € / mois'}</span><small>${v==='yearly'?'Environ 5 € par mois':'Sans engagement annuel'}</small>`,'offer',{value:v,pressed:M.subscription.offer===v},M.subscription.offer===v?'selected':'')).join('')}</fieldset>`+A('Choisir Premium — démonstration','subscribe')+A('Continuer avec mon accès découverte','premium-return',{},'text-button mt')+note('Prix et paiement simulés : aucun débit réel. Maquillage, garde-robe et tutoriels restent indiqués « Bientôt ».');
V['PRF-06']=()=>{studioEnsure();return head('Mon abonnement',subscriptionLabel())+panel(`<h2>${uxIsPremium()?'Mon espace Premium':'Mon accès découverte'}</h2>${P(uxIsPremium()?'10 simulations de coupes par mois. Prochain renouvellement : '+dateText(M.hairGenerations.reset)+'.':'1 simulation de coupe offerte pour découvrir Hair Studio.')}`)+(uxIsPremium()?B('Ouvrir Hair Studio','HAI-01')+A('Gérer mon abonnement','manage-subscription',{},'secondary mt'):B('Découvrir Premium','PRE-01'))+B('Retrouver un accès existant','PRE-04','text-button mt');};

// Keep same-screen tab controls keyboard-friendly after their live region updates.
ACTIONS.choice=d=>{UX_BASE.choice(d);setTimeout(()=>document.querySelector(`.choice-chip[data-key="${String(d.key).replace(/"/g,'')}"][aria-pressed="true"]`)?.focus({preventScroll:true}),0);};
const UX_VIEW_STATE=viewStateFor;
viewStateFor=function(id){const state=UX_VIEW_STATE(id),extra={ 'HAI-01':['hairLengthFilter'],'COL-01':['colorSeasonTab','colorFamily','previewSeason'],'PEA-01':['skinTab'] }[id]||[];extra.forEach(k=>state[k]=M[k]===undefined?null:clone(M[k]));return state;};

const UX_ESS03=V['ESS-03'],UX_ANA01=V['ANA-01'],UX_PRF01=V['PRF-01'];
V['ESS-03']=()=>UX_ESS03().replace('Simulation enregistrée','Retirer des enregistrés').replace('Le produit final transformerait uniquement les cheveux.','La transformation réelle devra modifier uniquement les cheveux et conserver le reste de la photo.');
V['ANA-01']=()=>UX_ANA01().replace('Mockup : les résultats montrent le fonctionnement prévu. Aucun moteur réel n’est exécuté ici.','Les résultats de cette version sont fondés sur vos réponses ; aucune photo n’est interprétée.');
V['PRF-01']=()=>{const interested=Object.keys(M.comingSoonNotices||{}).filter(k=>M.comingSoonNotices[k]);return UX_PRF01()+(interested.length?sec('Mes nouveautés enregistrées')+interested.map(k=>A(`<span class="row-label">${icon('spark','accent')}<span><strong>${esc(V1_UPCOMING[k].title)}</strong><small>Intérêt enregistré, toucher pour gérer</small></span></span>${icon('chev')}`,'coming-open',{feature:k},'glass list-row')).join(''):'');};
ACTIONS['saved-hair-sims']=()=>{if(!M.simulations.some(x=>M.saved.includes(x.id))){modal('Aucune simulation enregistrée',P(M.simulations.length?'Utilisez le signet sur un résultat pour le retrouver ici.':'Votre première simulation enregistrée apparaîtra ici.')+A('Choisir une coupe','hair-more')+A('Fermer','close',{},'secondary mt'));return;}M.savedTab='Tous';M.savedType='Simulation';go('SAV-01');};
ACTIONS['haircut-example']=()=>toast('Choisissez votre propre photo pour préparer une simulation.');

function uxRemoveComingInline(html){return html.replace(/<div class="coming-inline">[\s\S]*?<\/div>/g,'');}
['ENT-03','ENT-04','ANA-02','EVE-02','EVE-04','EVE-05','PRF-03'].forEach(id=>{const base=V[id];V[id]=()=>uxRemoveComingInline(base()).replaceAll('Disponible dans la V1','Disponible maintenant').replaceAll('disponibles dans la V1','disponibles maintenant').replaceAll('dans cette V1','aujourd’hui');});

uxEnsure();
