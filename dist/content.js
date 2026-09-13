'use strict';
// Tutorial content is editorial guidance; images illustrate the intended look.
const LOOK_GUIDES={
 bun:{tools:'Un élastique souple, quelques épingles et un miroir.',steps:[
 ['Rassembler sans plaquer','Ramenez les longueurs vers la nuque avec les doigts. Gardez une légère souplesse au-dessus de la tête.','Si les cheveux sont trop courts pour être rassemblés, gardez cette référence pour plus tard.'],
 ['Former une base basse','Attachez une queue basse, à la hauteur qui vous semble confortable. L’élastique doit tenir sans tirer.','Vous pouvez laisser quelques mèches libres dès maintenant.'],
 ['Enrouler les longueurs','Tournez les longueurs souplement autour de la base. Maintenez le chignon d’une main et fixez-le progressivement avec les épingles.','Une petite mèche peut rester libre : le résultat n’a pas besoin d’être symétrique.'],
 ['Ajuster le volume','Desserrez légèrement quelques mèches avec les doigts. Regardez les côtés et l’arrière, puis retirez ou replacez ce qui vous gêne.','Bougez la tête : si une épingle tire, replacez-la.']
 ]},
 waves:{tools:'Vos doigts, un miroir et vos produits habituels si vous les utilisez.',steps:[
 ['Partir de votre texture','Ce pas à pas met en place des ondulations déjà présentes. Repérez les mèches que vous aimez et laissez-les guider la forme.','Si vos cheveux sont raides, choisissez une référence adaptée ou parlez de la mise en forme au salon.'],
 ['Choisir votre raie','Placez la raie à l’endroit qui vous plaît. Soulevez doucement les racines avec les doigts pour donner de l’aisance.','Une raie légèrement décalée peut changer le mouvement sans autre matériel.'],
 ['Placer les mèches du visage','Replacez les mèches qui encadrent le visage en suivant leur courbe naturelle. Évitez de les séparer plus que nécessaire.','Gardez les gestes qui fonctionnent déjà avec votre texture.'],
 ['Vérifier le résultat','Regardez la silhouette générale, puis ajustez seulement les zones qui vous gênent.','Le volume peut rester différent d’un côté à l’autre.']
 ]},
 coils:{tools:'Un miroir et les accessoires que vous utilisez déjà.',steps:[
 ['Choisir la forme','Observez votre volume de face et de profil. Décidez si vous préférez le garder rond, le dégager d’un côté ou l’accompagner d’un accessoire.','La photo est une référence de forme, pas une texture à reproduire exactement.'],
 ['Mettre en place doucement','Replacez vos boucles avec vos gestes habituels, sans tirer pour atteindre la forme de la photo.','Conservez le volume qui est confortable pour vous.'],
 ['Dégager ce que vous souhaitez','Si une mèche vous gêne, déplacez-la ou maintenez-la avec un accessoire que vous avez déjà.','Vous pouvez aussi garder les cheveux entièrement libres.']
 ]},
 sleek:{tools:'Un miroir ; un peigne si cela vous convient.',steps:[
 ['Partir de cheveux raides','Ce look utilise votre texture actuelle. Il ne nécessite pas de la transformer avec de la chaleur.','Pour une autre texture, retrouvez les idées de votre univers cheveux.'],
 ['Dessiner la raie','Avec les doigts ou votre peigne habituel, tracez une raie au milieu ou légèrement sur le côté.','Choisissez l’emplacement que vous aimez dans le miroir.'],
 ['Placer les longueurs','Glissez une ou deux mèches derrière les oreilles, puis laissez les autres suivre leur mouvement naturel.','Pour dégager davantage le visage, utilisez une barrette que vous avez déjà.']
 ]},
 glam:{tools:'Vos produits de maquillage habituels et leurs applicateurs propres.',steps:[
 ['Choisir ce que vous voulez souligner','Décidez si vous souhaitez unifier légèrement le teint, souligner les yeux, colorer les lèvres, ou seulement l’un de ces gestes.','Vous pouvez passer une partie du maquillage.'],
 ['Unifier par petites touches','Avec votre produit habituel, travaillez d’abord les zones que vous souhaitez unifier. Estompez les limites pour conserver un rendu léger.','Suivez le mode d’emploi de votre produit ; inutile d’en ajouter partout.'],
 ['Ajouter une nuance douce','Choisissez une couleur que vous aimez pour les yeux. Déposez-en peu, estompez, puis regardez le résultat avant d’intensifier.','Gardez la même teinte si vous débutez.'],
 ['Terminer selon votre envie','Ajoutez votre couleur de lèvres si vous le souhaitez. Vérifiez le rendu dans une lumière proche de celle de votre journée.','Le résultat est prêt dès qu’il vous convient.']
 ]},
 'soft-glam':{tools:'Votre fard cuivré ou brun habituel, un pinceau propre et une couleur de lèvres si souhaitée.',steps:[
 ['Choisir votre intensité','Posez vos produits devant vous et choisissez une teinte principale. Gardez une autre nuance uniquement si vous avez envie de la travailler.','Un seul fard peut suffire.'],
 ['Construire le regard','Appliquez peu de couleur sur la paupière mobile avec votre applicateur habituel. Estompez les bords avant d’ajouter une seconde touche.','Restez dans la zone d’utilisation indiquée sur le produit.'],
 ['Équilibrer le résultat','Regardez les deux yeux ensemble. Ajustez la quantité ou l’estompe plutôt que d’ajouter systématiquement plus de couleur.','Si le rendu est déjà assez présent, vous pouvez vous arrêter.'],
 ['Choisir la finition','Ajoutez, si vous le souhaitez, une couleur de lèvres qui accompagne le regard. Vérifiez l’ensemble avec la tenue prévue.','Pour un rendu plus discret, gardez les lèvres sans couleur.']
 ]},
 'evening-look':{tools:'Vos produits habituels pour les yeux et les lèvres.',steps:[
 ['Partir de votre tenue','Choisissez ce que vous souhaitez mettre en avant : le regard ou les lèvres. Préparez une ou deux teintes que vous connaissez.','Pas besoin de changer toute votre routine.'],
 ['Intensifier progressivement','Réalisez vos gestes habituels, puis augmentez seulement la couleur sur la zone choisie. Estompez avant de décider d’en ajouter.','Prenez un instant pour regarder l’ensemble dans le miroir.'],
 ['Préparer une retouche','Si vous prévoyez une retouche, gardez uniquement le produit et l’accessoire qui vous seront utiles dans votre sac.','Vous pouvez aussi garder le résultat tel quel toute la soirée.']
 ]},
 'bare-face':{tools:'Une pièce ou un accessoire que vous aimez ; aucun maquillage nécessaire.',steps:[
 ['Garder vos envies comme repère','Vous n’avez pas besoin d’ajouter de maquillage pour réaliser cette inspiration. Choisissez simplement la place que vous voulez donner aux cheveux et à la tenue.','Vous pouvez conserver votre routine actuelle.'],
 ['Choisir un détail','Dégagez le visage si vous le souhaitez, ou ajoutez un accessoire que vous aimez porter.','Un seul détail peut suffire.'],
 ['Vérifier votre confort','Regardez l’ensemble et ajustez ce qui vous gêne pour la journée.','Votre look peut rester très simple.']
 ]},
 everyday:{tools:'Une tenue de base et une paire de chaussures déjà dans votre dressing.',steps:[
 ['Choisir une pièce confortable','Partez du vêtement que vous avez le plus envie de porter aujourd’hui : pantalon, jupe ou robe.','Pensez aux déplacements et à ce que vous allez faire.'],
 ['Compléter avec une base simple','Associez une autre pièce dans une couleur que vous aimez avec la première. Essayez-les ensemble avant de chercher un accessoire.','Une tenue monochrome est aussi une possibilité.'],
 ['Prévoir la journée','Choisissez vos chaussures et une couche supplémentaire si nécessaire. Asseyez-vous et marchez quelques pas pour vérifier l’aisance.','Gardez ce qui vous permet de bouger confortablement.']
 ]},
 work:{tools:'Vos vêtements pour le travail, vos chaussures et un accessoire si souhaité.',steps:[
 ['Partir du contexte','Repérez les besoins de la journée : déplacement, réunion, travail assis ou debout. Choisissez votre pièce principale en fonction de cela.','Le code vestimentaire dépend de votre environnement.'],
 ['Composer une base','Associez le haut et le bas, ou votre robe. Ajoutez une veste seulement si elle vous est utile ou si vous en avez envie.','La référence illustre une possibilité, pas une tenue obligatoire.'],
 ['Vérifier les détails pratiques','Essayez les chaussures et préparez ce que vous devez emporter. Vérifiez que la tenue reste confortable assise et en mouvement.','Vous pouvez garder cette combinaison pour une autre journée.']
 ]},
 date:{tools:'Une tenue dans laquelle vous êtes à l’aise et vos accessoires habituels.',steps:[
 ['Penser au programme','Choisissez votre tenue en fonction du lieu et de ce que vous allez faire, puis de l’allure qui vous plaît.','Une tenue habillée n’est pas nécessaire pour toutes les sorties.'],
 ['Choisir un point fort','Gardez une couleur, une matière ou un accessoire comme point de départ. Complétez avec des pièces qui vous semblent faciles à porter.','Vous pouvez reprendre une tenue déjà appréciée.'],
 ['Essayer l’ensemble','Portez la tenue avec les chaussures prévues. Vérifiez l’aisance et préparez une couche supplémentaire si elle est utile.','Changez uniquement ce qui vous gêne.']
 ]},
 wedding:{tools:'L’invitation, votre tenue, vos chaussures et les accessoires choisis.',steps:[
 ['Relire les indications','Vérifiez le lieu, les horaires et les éventuelles indications vestimentaires de l’invitation.','En cas d’incertitude, demandez aux personnes qui organisent.'],
 ['Essayer la tenue complète','Associez la tenue et les chaussures. Asseyez-vous, marchez et bougez pour vérifier le confort.','Mieux vaut le vérifier avant le jour de l’événement.'],
 ['Rassembler les essentiels','Mettez de côté les accessoires, le sac et les éventuelles retouches que vous souhaitez emporter.','Une tenue déjà portée peut très bien convenir.'],
 ['Retrouver votre préparation','Vérifiez la coiffure et le maquillage seulement si vous avez choisi d’en préparer pour cette occasion.','Vous pouvez enregistrer l’ensemble pour le retrouver plus tard.']
 ]},
 layers:{tools:'La référence et quelques notes pour votre rendez-vous.',steps:[
 ['Repérer ce qui vous plaît','Notez la longueur, la place du volume et les mèches qui vous intéressent sur cette référence.','Cette image ne garantit pas le même rendu sur votre texture.'],
 ['Définir ce que vous souhaitez garder','Précisez la longueur minimale qui vous convient et le temps que vous souhaitez consacrer à la coiffure.','Vous pouvez noter ce que vous ne voulez pas changer.'],
 ['Préparer vos questions','Demandez au salon quelles adaptations seraient possibles sur vos cheveux et quel entretien elles demanderaient.','Gardez cette référence pour la montrer lors du rendez-vous.']
 ]},
 pixie:{tools:'La référence et vos questions pour le salon.',steps:[
 ['Observer les longueurs','Repérez les zones les plus courtes et le mouvement sur le dessus. Notez ce qui vous plaît dans la forme.','La couleur argentée est un élément de la référence, pas une étape à reproduire.'],
 ['Penser au quotidien','Notez la façon dont vous souhaitez vous coiffer et la fréquence de rendez-vous qui vous conviendrait.','Une coupe courte peut demander un entretien régulier.'],
 ['Discuter des adaptations','Présentez la référence et demandez ce qui peut être adapté à votre texture, à votre implantation et à vos envies.','Aucune coupe n’est réalisée dans ce pas à pas.']
 ]}
};
const ROUTINE_STARTERS=[
 {id:'starter-skin',name:'Mes essentiels du matin',domain:'Peau',moment:'Matin',frequency:'Chaque jour',image:'morning',minutes:5,source:'https://www.aad.org/public/everyday-care/skin-care-basics/care/skin-care-budget',steps:['Nettoyer doucement avec un produit adapté que je connais.','Appliquer mon hydratant habituel selon mes besoins.','Avant de sortir, prévoir ombre, vêtements et écran large spectre SPF 30 ou plus pour la peau exposée.']},
 {id:'starter-evening',name:'Une fin de journée toute simple',domain:'Peau',moment:'Soir',frequency:'Chaque jour',image:'evening',minutes:5,source:'https://www.aad.org/public/everyday-care/skin-care-basics/care/skin-care-budget',steps:['Retirer les traces de maquillage si j’en porte, avec mon produit habituel.','Nettoyer doucement le visage, sans frotter.','Appliquer mon hydratant habituel si nécessaire.']},
 {id:'starter-outfit',name:'Ma tenue prête pour demain',domain:'Garde-robe',moment:'Soir',frequency:'À mon rythme',image:'work',minutes:5,steps:['Regarder ce qui est prévu demain.','Choisir ma tenue et les chaussures qui me conviennent.','Mettre de côté les accessoires et ce que je veux emporter.']}
];
function guideSteps(x){if(LOOK_GUIDES[x.id])return LOOK_GUIDES[x.id].steps.map(([title,body,tip])=>({title,body,tip}));if(x.pieces){return [{title:'Retrouver les pièces choisies',body:x.pieces.map(id=>M.clothes.find(c=>c.id===id)?.name||'Pièce retirée du dressing').join(', '),tip:'Remplacez une pièce si elle n’est pas disponible.'},{title:'Essayer l’association',body:'Portez les pièces ensemble avec les chaussures prévues. Vérifiez votre aisance assise et en mouvement.',tip:'Ajustez les accessoires et les couches selon votre journée.'},{title:'Garder ce qui vous plaît',body:'Conservez cette association si elle vous convient. Vous pourrez ajuster la tenue depuis votre dressing.',tip:'Vous pouvez la retrouver dans vos enregistrés.'}];}if(x.components)return Object.entries(x.components).map(([domain,id])=>({title:'Préparer '+domain.toLowerCase(),body:'Votre choix : '+(item(id)?.name||'Contenu à remplacer')+'. Rassemblez les éléments nécessaires avant de commencer.',tip:'Vous pouvez retrouver la fiche de chaque composante dans votre look complet.'}));return (x.steps||[]).map(title=>({title,body:'Adaptez ce geste à vos habitudes et à votre matériel.',tip:''}));}
function tutorialKey(id,date=DATE(),event=''){return [id,date,event||'libre'].join('|');}
function activeTutorial(){const t=M.tutorials?.[M.context.tutorialKey];return t?.look===M.context.look?t:undefined;}
function startTutorial(id,options={}){const x=item(id);if(!x)return;const key=tutorialKey(id,options.date||DATE(),options.event);M.tutorials||={};let t=M.tutorials[key];if(t?.done){t={...t,index:0,done:false};M.tutorials[key]=t;}if(!t){t={id:key,look:id,index:0,steps:guideSteps(x),date:options.date||DATE(),event:options.event||'',domain:options.domain||'',done:false};M.tutorials[key]=t;}M.tutorialNavigation={key,returnState:snapshot()};go('DEC-04',{context:{look:id,tutorialKey:key,eventTutorial:t.event||null,eventTutorialDate:t.date,eventTutorialDomain:t.domain||null}});}
function tutorialLabel(x){const t=M.tutorials?.[tutorialKey(x.id)];return t&&!t.done&&t.index>0?'Reprendre le pas à pas':x.referenceOnly?'Préparer ma demande au salon':'Réaliser ce look';}
function tutorialScreen(){const x=currentLook();if(!x)return empty('Ce look n’est plus disponible','Retrouvez une autre inspiration.','DEC-01');const t=ensureTutorial(),steps=t?.steps||guideSteps(x),index=Math.max(0,Math.min(t?.index||0,steps.length-1)),s=steps[index];if(!s)return empty('Cette composition est vide','Ajoutez vos choix pour préparer ce look.','DEC-03','Revoir mon look');return head(esc(x.name),x.referenceOnly?'Préparer mon rendez-vous':'Mon pas à pas')+`<div class="guide-reference">${imageFor(x.image,'',x.name)}<div><strong>${x.referenceOnly?'Ma référence pour le salon':'Le résultat de référence'}</strong><small>${x.minutes||5} min environ, ${steps.length} étapes</small></div></div>`+progress(index+1,steps.length)+`<section class="guide-step"><span class="eyebrow">Étape ${index+1}</span><h2 tabindex="-1">${esc(s.title)}</h2>${P(esc(s.body))}${s.tip?`<div class="guide-tip">${icon('spark')}<p>${esc(s.tip)}</p></div>`:''}</section>`+`<div class="guide-controls">${index?A(icon('back'),'tutorial-step',{delta:-1,label:'Étape précédente'},'icon-button'):''}${index<steps.length-1?A('Étape suivante','tutorial-step',{delta:1}):A(x.referenceOnly?'Ma référence est prête':'J’ai réalisé ce look',x.referenceOnly?'salon-ready':'tutorial-complete')}</div>`+A('Reprendre plus tard','tutorial-pause',{},'text-button mt')+moreActions(`<ol class="all-steps">${steps.map(s=>`<li>${esc(s.title)}</li>`).join('')}</ol>`,'Voir les étapes en un coup d’œil');}
function savedContents(){const tab=M.savedTab||'Tous',q=fold(M.savedQuery);if(tab==='Collections'){const cs=M.collections.filter(c=>fold(c.name+' '+c.desc).includes(q));return sec('Mes collections')+(cs.length?cs.map(c=>row(esc(c.name),c.items.length+' idée'+(c.items.length>1?'s':''),'SAV-02','bookmark',{key:'collection',value:c.id})).join(''):empty(q?'Aucune collection correspondante':'Rassembler les idées qui vont ensemble',q?'Essayez un autre mot.':'Une occasion, une saison ou simplement une envie.'))+A('Créer une collection','new-collection',{},'secondary');}const xs=M.saved.map(item).filter(Boolean).filter(x=>(tab!=='À refaire'||M.contentFeedback?.[x.id]==='again')&&(!M.savedType||M.savedType==='Tous'||x.type===M.savedType)&&fold(x.name+' '+x.domain+' '+(x.desc||'')).includes(q));return sec(xs.length+' idée'+(xs.length>1?'s':''))+(xs.length?grid(xs):empty(q||M.savedType&&M.savedType!=='Tous'?'Aucune correspondance':tab==='À refaire'?'Vos looks préférés, prêts à revenir':'Gardez votre prochaine envie',tab==='À refaire'?'Après un look, choisissez « À refaire » pour le retrouver ici.':'Un appui sur le signet suffit.'))+(!xs.length?(q||M.savedType&&M.savedType!=='Tous'?A('Effacer la recherche et les filtres','saved-reset',{},'secondary'):B('Trouver une inspiration','DEC-01','secondary')):'');}
function savedScreen(){return head('Mes enregistrés','Retrouver ce que j’ai aimé.')+chips(['Tous','À refaire','Collections'],'savedTab',M.savedTab||'Tous')+`<div class="search-toolbar"><label class="sr-only" for="saved-search">Rechercher mes enregistrés</label><input id="saved-search" class="search-input" type="search" placeholder="Un nom, une couleur, une envie…" value="${esc(M.savedQuery||'')}">${M.savedTab!=='Collections'?A(icon('settings'),'saved-filters',{label:'Filtrer mes enregistrés'},'icon-button'):''}</div>`+(M.savedTab!=='Collections'&&M.savedType&&M.savedType!=='Tous'?`<div class="active-filters">${tag(esc(M.savedType))}${A('Effacer','saved-reset',{},'text-button')}</div>`:'')+`<div id="saved-results" aria-live="polite">${savedContents()}</div>`;}
V['DEC-04']=tutorialScreen;
V['SAV-01']=savedScreen;
Object.assign(ACTIONS,{
 tutorial:d=>startTutorial(d.id),
 'tutorial-step':d=>{const t=activeTutorial();if(!t)return;t.index=Math.max(0,Math.min(t.steps.length-1,t.index+Number(d.delta)));render({scroll:0,focus:true});document.querySelector('.guide-step h2')?.focus({preventScroll:true});},
 'tutorial-pause':()=>{const state=M.tutorialNavigation?.returnState;if(activeTutorial())persist();returnToState(state,'DEC-03');toast('Votre étape est gardée. Vous pourrez reprendre ici.');},
 'tutorial-read':()=>ACTIONS['tutorial-pause'](),
 'event-tutorial':d=>{const e=currentEvent();if(e)startTutorial(d.id,{date:e.date,event:e.id,domain:d.domain});},
 'saved-filters':()=>modal('Filtrer mes idées',form('saved-filter',select('type','Type de contenu',['Tous','Look','Palette','Produit','Routine','Conseil','Tutoriel','Simulation'],M.savedType||'Tous'),'Afficher')),
 'saved-reset':()=>{M.savedQuery='';M.savedType='Tous';clearDrafts('saved-filter');render();},
 'routine-starter':d=>{const t=ROUTINE_STARTERS.find(r=>r.id===d.id);if(!t)return;M.routineEdit={...clone(t),id:null,starter:t.id,templateSource:t.source||'',name:t.name};clearDrafts('routine');go('ROU-03');}
});
const completeGuidedLook=ACTIONS['tutorial-complete'];
ACTIONS['tutorial-complete']=()=>{const t=activeTutorial();if(t)t.done=true;completeGuidedLook();};
const saveSalonReference=ACTIONS['salon-ready'];
ACTIONS['salon-ready']=()=>{const t=activeTutorial();if(t)t.done=true;saveSalonReference();};
const applyLookFeedback=ACTIONS['look-feedback'];
ACTIONS['look-feedback']=d=>{if(d.value==='again'&&item(d.id)&&!M.saved.includes(d.id))M.saved.push(d.id);applyLookFeedback(d);};
F['saved-filter']=d=>{M.savedType=d.type;closeModal();render();};
function routineStarterList(){return ROUTINE_STARTERS.map(r=>A(`<span class="row-label">${icon(r.domain==='Peau'?'leaf':'dress','accent')}<span><strong>${esc(r.name)}</strong><small>${r.minutes} min, ${r.steps.length} gestes à personnaliser</small></span></span>${icon('chev')}`,'routine-starter',{id:r.id},'glass list-row')).join('');}

function ensureTutorial(){let t=activeTutorial();if(t)return t;const x=currentLook();if(!x)return;const key=tutorialKey(x.id);M.tutorials||={};t=M.tutorials[key]||{id:key,look:x.id,index:0,steps:guideSteps(x),date:DATE(),event:'',domain:'',done:false};M.tutorials[key]=t;M.context.tutorialKey=key;M.context.eventTutorial=null;M.context.eventTutorialDate=DATE();M.context.eventTutorialDomain=null;M.tutorialNavigation={key,returnState:{...snapshot(),route:'DEC-03',scroll:0}};return t;}
function viewStateFor(id){const keys={ 'ACC-02':['weekDate'],'ACC-03':['day'],'DEC-04':['tutorialNavigation'],'SAV-01':['savedQuery','savedType','savedTab'],'EVE-01':['eventTab','calendarMonth'],'EVE-02':['eventEdit'],'ROU-03':['routineEdit'],'PRO-02':['compareMode','comparison','compareFirst','compareSecond'],'PRO-03':['observationEdit'],'PRO-05':['goalEdit'],'GAR-02':['clothingFilter','clothingQuery'],'GAR-03':['clothingEdit'],'GAR-04':['outfitEdit'],'PRF-02':['profileEdit'],'PRF-03':['preferenceEdit'],'PRF-11':['documentTab'],'HAI-01':['hairTab'],'MAQ-01':['makeupTab'],'GAR-01':['wardrobeTab'] }[id]||[];return Object.fromEntries(keys.map(k=>[k,M[k]===undefined?null:clone(M[k])]));}
function routineSource(r){return moreActions(P('Modèle de départ à adapter à vos habitudes.')+((r.id==='morning'||r.starter==='starter-skin')?P('Pour la protection solaire, suivez aussi les indications de renouvellement du produit.'):'')+`<a class="inline-link" href="${esc(r.templateSource)}" target="_blank" rel="noopener noreferrer">Conseils de l’American Academy of Dermatology ↗</a>`,'À propos de ce modèle');}
function routineContentMigration(){const legacy={morning:['Préparer mon matériel','Réaliser mes gestes habituels','Noter mon ressenti'],evening:['Préparer mon espace','Réaliser mes gestes habituels','Prendre un moment pour moi']};Object.entries(legacy).forEach(([id,old])=>{const r=M.routines.find(r=>r.id===id),t=ROUTINE_STARTERS.find(t=>t.id===(id==='morning'?'starter-skin':'starter-evening'));if(r&&r.version===1&&r.steps.join('|')===old.join('|')){r.steps=t.steps.slice();r.templateSource=t.source;r.version=2;}});}
