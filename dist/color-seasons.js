'use strict';
// Complete 12-season color mockup, aligned with the Beautify domain model:
// four observable axes, four families and twelve seasons. Results are presented
// as explainable fit bands, never as a fake probability or an objective rule.
const COLOR12_FAMILIES={
 spring:{name:'Spring',label:'Printemps',summary:'Chaud, clair et lumineux',seasons:['bright_spring','warm_spring','light_spring']},
 summer:{name:'Summer',label:'Été',summary:'Froid, clair et doux',seasons:['light_summer','cool_summer','soft_summer']},
 autumn:{name:'Autumn',label:'Automne',summary:'Chaud, profond et feutré',seasons:['soft_autumn','warm_autumn','deep_autumn']},
 winter:{name:'Winter',label:'Hiver',summary:'Froid, profond et contrasté',seasons:['deep_winter','cool_winter','bright_winter']}
};
function color12Season(name,family,summary,axes,colors,neutrals,avoid,hair,metals,alternatives){return {name,family,summary,axes,colors,neutrals,avoid,hair,metals,alternatives};}
const COLOR12_SEASONS={
 bright_spring:color12Season('Bright Spring','spring','Des couleurs chaudes, nettes et pleines d’énergie.',
  ['Chaud à neutre','Clair à moyen','Très lumineux','Contraste élevé'],
  [['Corail vif','#ff6248'],['Coquelicot','#ed4035'],['Pastèque','#ff5777'],['Fuchsia chaud','#e94596'],['Cobalt clair','#3379dc'],['Lagon','#00afd1'],['Turquoise','#10c2bd'],['Jade','#00ae88'],['Pomme','#79bd36'],['Citron','#f9df3f'],['Soleil','#ffc32e'],['Mandarine','#ff8b2f']],
  [['Ivoire clair','#fff4dc'],['Camel doré','#b8834f'],['Pierre chaude','#ae9b86'],['Marine chaud','#253d55'],['Cacao','#65463a']],
  [[['Rose grisé','#a98f99'],['Corail vif','#ff6248'],'La netteté réveille davantage le visage.'],[['Taupe froid','#857b7c'],['Camel doré','#b8834f'],'Un neutre doré reste plus cohérent.'],[['Bordeaux noirci','#4b2533'],['Coquelicot','#ed4035'],'Une couleur franche évite l’effet trop lourd.']],
  {best:['Miel lumineux','Caramel clair','Cuivré net','Brun chaud brillant'],avoid:['Cendré mat','Noir bleuté'],note:'Conserver de la lumière et des reflets nets autour du visage.'},['Or jaune brillant','Or rose clair'],['warm_spring','bright_winter']),
 warm_spring:color12Season('Warm Spring','spring','Une chaleur dorée, fraîche et naturellement lumineuse.',
  ['Très chaud','Clair à moyen','Lumineux','Contraste moyen'],
  [['Tomate','#df4c36'],['Corail','#ef715a'],['Pêche','#f2a27d'],['Saumon','#ed806d'],['Jaune doré','#eebf39'],['Souci','#e5a52f'],['Feuille','#77a448'],['Mousse','#6f873f'],['Aqua chaud','#74cbc0'],['Turquoise chaud','#2aa59e'],['Sarcelle','#247d76'],['Bleu chaud','#467eb0']],
  [['Crème','#f7ead3'],['Camel','#ba8758'],['Cognac','#965932'],['Marine chaud','#2f4451'],['Chocolat lait','#68483a']],
  [[['Blanc optique','#fdfdfd'],['Crème','#f7ead3'],'Le blanc cassé respecte mieux la chaleur.'],[['Fuchsia froid','#bd376f'],['Corail','#ef715a'],'Un rose orangé se fond plus naturellement.'],[['Gris acier','#747b84'],['Cognac','#965932'],'Un brun chaud remplace le gris froid.']],
  {best:['Blond doré','Miel','Cuivre doux','Châtain doré'],avoid:['Platine froid','Noir bleuté'],note:'Les reflets dorés ou cuivrés prolongent la chaleur naturelle.'},['Or jaune','Or rose chaud'],['bright_spring','warm_autumn']),
 light_spring:color12Season('Light Spring','spring','Des pastels chauds, aériens et jamais ternes.',
  ['Chaud à neutre','Très clair','Lumineux doux','Faible à moyen'],
  [['Abricot','#f3b28f'],['Rose coquillage','#efb7b2'],['Corail clair','#f18f80'],['Blush chaud','#dca4a0'],['Beurre','#f3d978'],['Pistache','#b8cc85'],['Menthe','#9fd4b4'],['Aqua','#86d2cf'],['Turquoise clair','#65c2c1'],['Ciel','#91c6df'],['Pervenche','#9faed7'],['Lavande chaude','#b8a4ca']],
  [['Ivoire clair','#fff4e2'],['Avoine','#dbc9ac'],['Camel clair','#c9a173'],['Gris chaud clair','#b8b0a7'],['Cacao clair','#8a6756']],
  [[['Noir','#151515'],['Marine chaud','#43566b'],'Un sombre adouci crée moins de rupture.'],[['Prune sombre','#57364c'],['Lavande chaude','#b8a4ca'],'Une version claire garde la délicatesse.'],[['Kaki profond','#505640'],['Pistache','#b8cc85'],'Un vert plus frais évite d’alourdir.']],
  {best:['Blond doré clair','Beige miel','Cuivre fraise doux','Châtain clair chaud'],avoid:['Noir uniforme','Brun très froid'],note:'Privilégier une profondeur légère et des reflets transparents.'},['Or clair','Or rose doux'],['warm_spring','light_summer']),
 light_summer:color12Season('Light Summer','summer','Des nuances froides, claires et délicatement poudrées.',
  ['Froid à neutre','Très clair','Doux','Faible à moyen'],
  [['Rose poudre','#d9aebc'],['Eau de rose','#e5c4ca'],['Lilas','#bea9cd'],['Lavande','#aa9bc5'],['Pervenche','#9daed4'],['Bleu poudre','#a8c4da'],['Ciel froid','#8fc5dd'],['Brume aqua','#9dced0'],['Écume','#afd4c4'],['Menthe grisée','#b4cdbc'],['Framboise claire','#bd6d88'],['Citron glacé','#e9dfa0']],
  [['Blanc doux','#f2eeeb'],['Gris colombe','#b9bdc3'],['Beige rosé','#c9b7b2'],['Marine doux','#46566e'],['Taupe froid clair','#a79b9e']],
  [[['Orange brûlé','#b65832'],['Rose poudre','#d9aebc'],'Un rose froid reste plus aérien.'],[['Noir','#151515'],['Marine doux','#46566e'],'Le marine conserve la profondeur sans durcir.'],[['Moutarde','#b38a2f'],['Citron glacé','#e9dfa0'],'Une version glacée apporte de la lumière.']],
  {best:['Blond beige','Blond cendré clair','Châtain clair froid','Reflets nacrés'],avoid:['Noir intense','Cuivre orange'],note:'Garder une profondeur légère et des reflets froids peu contrastés.'},['Argent clair','Or blanc'],['light_spring','cool_summer']),
 cool_summer:color12Season('Cool Summer','summer','Une palette franchement froide, raffinée et modérément contrastée.',
  ['Très froid','Clair à moyen','Doux à net','Contraste moyen'],
  [['Rose froid','#c77996'],['Framboise','#a94d72'],['Baie','#8f4c68'],['Prune douce','#73536e'],['Lavande','#a597bd'],['Iris','#817aaf'],['Bleuet','#789bc1'],['Bleu vrai doux','#507ca8'],['Sarcelle froide','#397f82'],['Vert mer','#65a69a'],['Rose bleuté','#d18ca9'],['Rouge bleuté','#a94259']],
  [['Blanc froid doux','#f1edef'],['Gris bleuté','#9ba3ad'],['Charbon doux','#4e5059'],['Marine','#35445e'],['Taupe froid','#98898d']],
  [[['Camel doré','#b8834f'],['Taupe froid','#98898d'],'Un neutre froid soutient mieux la palette.'],[['Corail orangé','#e46f52'],['Rose froid','#c77996'],'La base bleutée s’accorde au sous-ton.'],[['Noir pur','#151515'],['Charbon doux','#4e5059'],'Le charbon limite un contraste trop dur.']],
  {best:['Brun cendré','Châtain froid','Blond foncé beige froid','Reflets moka froids'],avoid:['Cuivre orangé','Miel très doré'],note:'Les reflets froids et fondus respectent la douceur du profil.'},['Argent','Or blanc mat'],['light_summer','soft_summer']),
 soft_summer:color12Season('Soft Summer','summer','Des couleurs froides, grisées et calmes, faciles à combiner.',
  ['Froid à neutre','Moyen','Très doux','Faible'],
  [['Rose ancien','#b88696'],['Mauve','#987a91'],['Baie sourde','#8c596d'],['Bruyère','#9a849d'],['Bleu ardoise','#687d94'],['Denim','#627b96'],['Eucalyptus','#789a8e'],['Sauge','#91a18e'],['Sarcelle douce','#4e8584'],['Prune grisée','#725c72'],['Cacao rosé','#866c69'],['Marine fumé','#3f5062']],
  [['Huître','#ded8d1'],['Champignon','#aa9c93'],['Taupe froid','#8f8281'],['Étain','#777b82'],['Marine doux','#3f5062']],
  [[['Jaune vif','#f3d227'],['Sauge','#91a18e'],'Une couleur grisée respecte mieux la douceur.'],[['Noir','#151515'],['Marine fumé','#3f5062'],'Un sombre adouci évite de dominer le visage.'],[['Orange vif','#e76b36'],['Rose ancien','#b88696'],'Une chaleur atténuée reste plus harmonieuse.']],
  {best:['Châtain cendré','Brun taupe','Blond foncé fumé','Mèches beige froid'],avoid:['Noir bleuté','Cuivre vif'],note:'Des contrastes subtils et des reflets fondus fonctionnent le mieux.'},['Argent patiné','Or rose froid'],['cool_summer','soft_autumn']),
 soft_autumn:color12Season('Soft Autumn','autumn','Une chaleur feutrée, naturelle et peu contrastée.',
  ['Chaud à neutre','Moyen','Très doux','Faible'],
  [['Rose terre','#b77970'],['Saumon sourd','#c8846e'],['Cannelle','#a8694f'],['Camel doux','#b58d62'],['Moutarde douce','#b59a4b'],['Olive','#777543'],['Mousse','#68724f'],['Sauge chaude','#8d9a7b'],['Sarcelle sourde','#4e8177'],['Pétrole doux','#3f6e6b'],['Aubergine douce','#6e505b'],['Cacao','#72564b']],
  [['Crème','#eee3cf'],['Taupe chaud','#9c897a'],['Camel','#b58d62'],['Chocolat doux','#5c463d'],['Marine chaud doux','#45545b']],
  [[['Blanc optique','#fdfdfd'],['Crème','#eee3cf'],'Une base crémeuse évite une rupture trop forte.'],[['Fuchsia','#c93378'],['Rose terre','#b77970'],'Une version terreuse reste plus fondue.'],[['Bleu électrique','#215bd5'],['Pétrole doux','#3f6e6b'],'Un bleu verdi et assourdi suit la chaleur.']],
  {best:['Châtain noisette','Brun caramel','Miel mat','Cuivré doux'],avoid:['Platine froid','Noir uniforme'],note:'La palette gagne avec des reflets chauds, patinés et peu contrastés.'},['Or mat','Bronze doux'],['soft_summer','warm_autumn']),
 warm_autumn:color12Season('Warm Autumn','autumn','Des couleurs épicées, chaudes et riches sans être glacées.',
  ['Très chaud','Moyen à profond','Riche','Contraste moyen'],
  [['Tomate chaude','#b94731'],['Rouille','#a64e2f'],['Paprika','#a9482f'],['Orange brûlé','#c16632'],['Souci','#d09d2e'],['Moutarde','#ad8c2e'],['Olive','#6d7132'],['Forêt chaude','#3f633e'],['Paon','#27716c'],['Sarcelle','#286d68'],['Bordeaux chaud','#773e3c'],['Cuivre','#a95e36']],
  [['Ivoire','#f1e2ca'],['Camel','#b27c4d'],['Cognac','#8c4e2e'],['Espresso','#422f28'],['Marine chaud','#2e4448']],
  [[['Gris froid','#858993'],['Camel','#b27c4d'],'Le camel garde la chaleur de l’ensemble.'],[['Rose bonbon','#e36e9a'],['Tomate chaude','#b94731'],'Un rouge orangé s’intègre plus naturellement.'],[['Bleu glacier','#a9c8df'],['Paon','#27716c'],'Le paon apporte du bleu sans devenir froid.']],
  {best:['Auburn','Cuivre','Châtain doré','Brun chocolat chaud'],avoid:['Cendré froid','Noir bleuté'],note:'Les reflets roux, dorés ou chocolat prolongent la richesse du profil.'},['Or jaune','Cuivre','Bronze'],['warm_spring','deep_autumn']),
 deep_autumn:color12Season('Deep Autumn','autumn','Une profondeur chaude et enveloppante, avec des accents terreux.',
  ['Chaud à neutre','Très profond','Riche à feutré','Contraste élevé'],
  [['Sang-de-bœuf','#682d37'],['Bordeaux chaud','#75363a'],['Aubergine','#563747'],['Rouille','#964a2c'],['Cuivre profond','#9c5835'],['Moutarde profonde','#9f8129'],['Olive sombre','#585e2e'],['Forêt','#274c36'],['Sarcelle profonde','#205e5d'],['Pétrole','#274d56'],['Marine chaud','#253b46'],['Chocolat','#432d27']],
  [['Crème','#ede0c8'],['Camel sombre','#9c6d46'],['Espresso','#362822'],['Charbon chaud','#45413e'],['Olive noirci','#3e432f']],
  [[['Pastel glacé','#c9d8ed'],['Pétrole','#274d56'],'Une profondeur verte reste plus équilibrée.'],[['Blanc optique','#fdfdfd'],['Crème','#ede0c8'],'Le crème diminue l’écart de température.'],[['Rose froid clair','#d8a9bd'],['Bordeaux chaud','#75363a'],'Une teinte dense soutient mieux le contraste.']],
  {best:['Espresso','Brun chocolat','Auburn profond','Noir brun'],avoid:['Blond platine','Cendré très clair'],note:'Préserver la profondeur, avec une chaleur visible dans les reflets.'},['Or antique','Bronze','Cuivre'],['warm_autumn','deep_winter']),
 deep_winter:color12Season('Deep Winter','winter','Des couleurs froides, profondes et dramatiques, équilibrées par des glacés.',
  ['Froid à neutre','Très profond','Net','Contraste élevé'],
  [['Rouge profond','#8f1f34'],['Vin','#68223b'],['Magenta','#a42b70'],['Prune','#542f5c'],['Violet royal','#463b8f'],['Cobalt','#2456ae'],['Bleu nuit','#172b4c'],['Sarcelle profonde','#075e68'],['Émeraude','#08735b'],['Rose glacé','#edc6d5'],['Bleu glacé','#c4d9ee'],['Noir','#111216']],
  [['Blanc optique','#f7f7f5'],['Noir vrai','#111216'],['Charbon','#3c4048'],['Marine nuit','#172b4c'],['Taupe froid','#80767b']],
  [[['Camel doré','#b8834f'],['Taupe froid','#80767b'],'Un neutre refroidi respecte mieux le contraste.'],[['Orange doux','#d17b4e'],['Rouge profond','#8f1f34'],'Un rouge bleuté soutient la profondeur.'],[['Beige jaune','#d6bd8a'],['Rose glacé','#edc6d5'],'Un clair glacé illumine sans jaunir.']],
  {best:['Noir naturel','Espresso froid','Brun profond froid','Bordeaux noir'],avoid:['Blond doré clair','Cuivre orange'],note:'Les profondeurs froides et brillantes conservent le contraste naturel.'},['Argent brillant','Or blanc','Platine'],['cool_winter','deep_autumn']),
 cool_winter:color12Season('Cool Winter','winter','Une palette froide, nette et élégante, sans chaleur jaune.',
  ['Très froid','Moyen à profond','Net','Contraste élevé'],
  [['Rouge bleuté','#b52b47'],['Framboise vive','#b5376a'],['Fuchsia','#c22d83'],['Rose froid','#d8669a'],['Violet','#6543a2'],['Pourpre royal','#4f378a'],['Cobalt','#2555b2'],['Bleu vrai','#266dad'],['Bleu glacé','#c5daf0'],['Émeraude','#08765d'],['Pin','#174f47'],['Argent','#aeb5c0']],
  [['Blanc optique','#fafafa'],['Gris froid','#9299a3'],['Charbon','#40434b'],['Marine','#1e3554'],['Noir','#121316']],
  [[['Crème jaune','#eddbb9'],['Blanc optique','#fafafa'],'Le blanc net garde la fraîcheur du profil.'],[['Rouille','#a64e2f'],['Rouge bleuté','#b52b47'],'Une base bleue remplace l’orange.'],[['Olive chaude','#74733d'],['Pin','#174f47'],'Un vert froid conserve la profondeur.']],
  {best:['Noir bleuté','Brun cendré profond','Moka froid','Gris argent naturel'],avoid:['Miel doré','Cuivre chaud'],note:'Les reflets froids, francs et peu dorés suivent la palette.'},['Argent','Or blanc','Platine'],['deep_winter','bright_winter']),
 bright_winter:color12Season('Bright Winter','winter','Des couleurs froides, électriques et très contrastées.',
  ['Froid à neutre','Moyen à profond','Très lumineux','Contraste très élevé'],
  [['Rouge vif','#d6213e'],['Rose électrique','#ee3d88'],['Magenta vif','#c41c7b'],['Violet électrique','#6739c6'],['Bleu royal','#174fc4'],['Cobalt vif','#155fd2'],['Turquoise vif','#00a8b7'],['Émeraude vive','#009261'],['Vert franc','#27a646'],['Citron glacé','#eff06b'],['Rose glacé','#f1c4db'],['Noir','#0c0d10']],
  [['Blanc optique','#ffffff'],['Noir vrai','#0c0d10'],['Marine net','#102d55'],['Gris argent','#aeb7c3'],['Taupe froid','#817981']],
  [[['Camel','#b8834f'],['Taupe froid','#817981'],'Un neutre froid conserve l’éclat.'],[['Brique sourde','#984b3a'],['Rouge vif','#d6213e'],'Une teinte pure évite l’effet terni.'],[['Sauge grisée','#92a18d'],['Émeraude vive','#009261'],'Un vert saturé suit le contraste naturel.']],
  {best:['Noir brillant','Brun froid net','Bleu-noir','Contraste noir et argent'],avoid:['Beige doré','Cuivre mat'],note:'Garder une finition brillante et des contrastes assumés.'},['Argent brillant','Or blanc poli'],['cool_winter','bright_spring'])
};

const COLOR12_BASE={analysisFields,finish:ACTIONS['finish-analysis'],consent:V['ANA-03'],reveal:V['ANA-09'],result:V['ANA-10']};
function color12LegacySeason(p){return ({'palette':'warm_autumn','palette-cool':'cool_summer','palette-neutral':'soft_summer'})[p]||'cool_summer';}
function color12Ensure(){
 M.colorSeasonTab||='Profil';M.colorFamily||='winter';
 if(M.colorProfile&&!COLOR12_SEASONS[M.colorProfile.season]){
  const season=color12LegacySeason(M.colorProfile.palette),s=COLOR12_SEASONS[season];
  M.colorProfile={season,name:s.name,family:s.family,match:'Bonne correspondance',alternatives:s.alternatives,source:'Profil antérieur adapté au parcours 12 saisons'};
 }
}
function color12Current(){color12Ensure();return COLOR12_SEASONS[M.colorProfile?.season]||null;}
function color12ReportProfile(r=report()){
 const season=r?.season||M.colorProfile?.season;if(!COLOR12_SEASONS[season])return null;
 const s=COLOR12_SEASONS[season];return {season,name:s.name,family:s.family,match:r?.match||M.colorProfile?.match||'Bonne correspondance',alternatives:r?.alternatives||M.colorProfile?.alternatives||s.alternatives};
}
function color12Band(s,count=7,cls='season-band'){return `<div class="${cls}" aria-label="Extrait de la palette ${esc(s.name)}">${s.colors.slice(0,count).map(([name,c])=>`<i style="--season-color:${c}" title="${esc(name)}"></i>`).join('')}</div>`;}
function color12Traits(s){return `<div class="season-traits">${s.axes.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`;}
function color12ColorGrid(values,cls='season-color-grid'){return `<div class="${cls}">${values.map(([name,c])=>`<div><i style="--season-color:${c}"></i><span>${esc(name)}</span></div>`).join('')}</div>`;}
function color12FamilyCard(id){const f=COLOR12_FAMILIES[id],seasons=f.seasons.map(x=>COLOR12_SEASONS[x]);return A(`<span class="family-top"><span><small>Famille ${esc(f.label)}</small><strong>${esc(f.name)}</strong></span>${icon('chev')}</span>${color12Band(seasons[1],6,'family-band')}<em>${esc(f.summary)}</em><span class="family-variants">${seasons.map(x=>esc(x.name.replace(f.name,'').trim())).join(', ')}</span>`,'color-family-open',{id},'glass season-family-card');}
function color12ProfileCard(profile){const s=COLOR12_SEASONS[profile.season],f=COLOR12_FAMILIES[s.family];return `<section class="season-hero"><span class="eyebrow">${esc(f.label)}, profil 12 saisons</span><h2>${esc(s.name)}</h2><p>${esc(s.summary)}</p>${color12Band(s)}<div class="season-match">${icon('spark')}<span><strong>${esc(profile.match)}</strong><small>Indice explicatif, pas un pourcentage</small></span></div></section>`;}
function color12FutureContext(key){const s=color12Current();if(!s)return `<div class="future-context"><span>${icon('palette')}</span><div><strong>Votre futur module partira de votre profil couleur</strong><small>Analysez d’abord vos 12 saisons pour préparer cette personnalisation.</small></div></div>`;const copy=key==='makeup'?'Les lèvres, les yeux et le teint seront filtrés avec ces couleurs.':key==='wardrobe'?'Les pièces portées près du visage seront comparées à ces couleurs.':'Les teintes et gestes seront adaptés à votre profil.';return `<div class="future-context"><span>${icon('palette')}</span><div><small>Déjà prêt pour le lancement</small><strong>Votre profil ${esc(s.name)}</strong><p>${esc(copy)}</p>${color12Band(s,5,'future-season-band')}</div></div>`;}

studioStrip=function(){return `<section class="studio-strip"><div class="between"><div><span class="eyebrow">Mes analyses</span><h2>Trois façons de commencer</h2></div>${B('Tout voir','ANA-01','text-button')}</div><div class="studio-mini-grid">${B(`${icon('hair')}<strong>Ma coupe</strong><small>${studioRemaining()}/10 essais</small>`,'HAI-01','glass studio-mini')}${B(`${icon('palette')}<strong>Mes couleurs</strong><small>12 saisons</small>`,'COL-01','glass studio-mini')}${B(`${icon('leaf')}<strong>Ma peau</strong><small>Ma routine</small>`,'PEA-01','glass studio-mini')}</div></section>`;};

function color12Classify(a){
 const temperature=a.temperatureHint||'Je ne sais pas',depth=a.depthHint||'Je ne sais pas',chroma=a.chromaHint||'Je ne sais pas',contrast=a.contrastHint||'Je ne sais pas';let season='cool_summer';
 const warm=temperature.startsWith('Chaud'),cool=temperature.startsWith('Froid'),light=depth==='Claire',deep=depth==='Profonde',soft=chroma.startsWith('Douce'),bright=chroma.startsWith('Nette'),high=contrast==='Fort',low=contrast==='Faible';
 if(warm){if(deep)season='deep_autumn';else if(soft||low)season='soft_autumn';else if(light)season='light_spring';else if(bright||high)season='bright_spring';else season='warm_spring';}
 else if(cool){if(deep)season='deep_winter';else if(bright||high)season='bright_winter';else if(light)season='light_summer';else if(soft||low)season='soft_summer';else season='cool_winter';}
 else {if(deep)season=soft?'deep_autumn':'deep_winter';else if(light)season=soft?'light_summer':'light_spring';else if(bright||high)season='bright_winter';else if(soft||low)season='soft_summer';}
 const known=[temperature,depth,chroma,contrast].filter(x=>!x.startsWith('Je ne sais')).length,match=known>=4?'Correspondance forte':known>=2?'Bonne correspondance':'Résultat proche entre plusieurs saisons',s=COLOR12_SEASONS[season];
 return {season,name:s.name,family:s.family,match,alternatives:s.alternatives,source:'Démonstration fondée sur la photo et quatre axes explicatifs'};
}

analysisFields=function(){
 if(M.draft.domain!=='Colorimétrie')return COLOR12_BASE.analysisFields();const a=M.draft.answers||{};
 return select('colorGoal','Je veux utiliser ce profil pour',['Tout mon look','Mes vêtements','Mes cheveux','Comprendre mes couleurs'],a.colorGoal||'Tout mon look')+
 select('temperatureHint','Repère de température — si vous le savez',['Je ne sais pas','Chaud / doré','Froid / rosé','Neutre ou variable'],a.temperatureHint||'Je ne sais pas')+
 select('depthHint','Profondeur naturelle perçue',['Je ne sais pas','Claire','Moyenne','Profonde'],a.depthHint||'Je ne sais pas')+
 select('chromaHint','Les couleurs qui paraissent les plus harmonieuses',['Je ne sais pas','Douces / poudrées','Nette / lumineuse','Équilibrées'],a.chromaHint||'Je ne sais pas')+
 select('contrastHint','Contraste naturel entre cheveux, peau et yeux',['Je ne sais pas','Faible','Moyen','Fort'],a.contrastHint||'Je ne sais pas')+
 moreActions(field('colors','Une couleur dans laquelle je me sens bien — facultatif',a.colors||'')+area('avoidColors','Une couleur plus difficile à porter — facultatif',a.avoidColors||''),'Ajouter mes repères personnels')+
 note('Ces réponses aident à expliquer le résultat. Elles ne remplacent pas la photo et ne permettent pas de choisir artificiellement une saison.');
};

V['ANA-03']=()=>M.draft.domain!=='Colorimétrie'?COLOR12_BASE.consent():head('Avant de commencer','Pour déterminer votre saison parmi douze.')+panel(`<h3>Ce que Beautify observe</h3>${P('La température, la profondeur, l’intensité et le contraste visibles. La lumière et l’écran peuvent modifier le résultat.')}${P('Vous verrez une saison principale, deux alternatives proches et les éléments qui expliquent la proposition.')}`)+form('consent',check('consent','J’ai compris l’usage de cette photo dans la démonstration.',M.draft.consent),'Continuer')+B('Revenir à mes analyses','ANA-01','secondary mt')+note('Le mockup montre la logique produit. Aucun diagnostic colorimétrique réel n’est exécuté.');

studioPalette=function(){const s=color12Current();return s?{mood:s.name,colors:[...s.colors,...s.neutrals]}:PALETTES[M.context.palette||'palette-cool']||PALETTES['palette-cool'];};

function color12ProfilePanel(profile){
 const s=COLOR12_SEASONS[profile.season],tab=M.colorSeasonTab||'Profil';let body='';
 if(tab==='Profil')body=color12ProfileCard(profile)+sec('Pourquoi cette saison')+color12Traits(s)+panel(`<h3>Comment lire ce résultat</h3>${P('La saison principale rassemble le mieux les quatre axes observés. Elle sert de point de départ, jamais de règle sur ce que vous avez le droit de porter.')}`)+sec('Saisons proches')+`<div class="season-alternatives">${profile.alternatives.map(id=>{const a=COLOR12_SEASONS[id];return A(`${color12Band(a,4,'mini-season-band')}<span><strong>${esc(a.name)}</strong><small>${esc(a.summary)}</small></span>${icon('chev')}`,'color-season-peek',{id},'glass season-alt-row');}).join('')}</div>`+A('Refaire avec une lumière naturelle','studio-analysis',{domain:'Colorimétrie'},'secondary')+note('Le dépôt Beautify prévoit des bandes de correspondance, pas de faux pourcentage de précision.');
 else if(tab==='Palette')body=panel(`<span class="eyebrow">${s.colors.length} couleurs principales</span><h2>À porter près du visage</h2>${P('Commencez par un haut, une écharpe ou un accessoire. La matière et la lumière restent importantes.')}`)+color12ColorGrid(s.colors)+sec('Mes neutres')+color12ColorGrid(s.neutrals,'season-color-grid neutrals')+A('Cette couleur est-elle pour moi ?','color-check',{},'primary')+A(M.savedSeason?'Palette enregistrée':'Enregistrer ma palette','color-season-save',{pressed:!!M.savedSeason},'secondary mt');
 else if(tab==='À éviter')body=panel(`<h2>Comparer, pas interdire</h2>${P('Ces échanges proposent une nuance plus cohérente quand une couleur paraît éteindre le teint. Vous pouvez toujours porter celle que vous aimez.')}`)+`<div class="color-swaps">${s.avoid.map(([from,to,why])=>`<div class="color-swap"><div><i style="--season-color:${from[1]}"></i><small>À comparer</small><strong>${esc(from[0])}</strong></div>${icon('arrow')}<div><i style="--season-color:${to[1]}"></i><small>À essayer</small><strong>${esc(to[0])}</strong></div><p>${esc(why)}</p></div>`).join('')}</div>`+A('Vérifier une autre couleur','color-check',{},'secondary');
 else if(tab==='Cheveux')body=panel(`<span class="eyebrow">À discuter au salon</span><h2>Nuances les plus cohérentes</h2><div class="hair-color-list">${s.hair.best.map(x=>`<span>${esc(x)}</span>`).join('')}</div>${P(esc(s.hair.note))}`)+panel(`<h3>À comparer avant un grand changement</h3><div class="hair-color-list muted">${s.hair.avoid.map(x=>`<span>${esc(x)}</span>`).join('')}</div>${P('Apportez la palette et une photo de référence. Votre coiffeur adapte la formule à votre base réelle et à l’entretien souhaité.')}`)+A('Ouvrir Hair Studio','go-hair-color')+note('La colorimétrie donne une direction de reflet ; elle ne remplace pas un diagnostic capillaire au salon.');
 else body=sec('Votre profil prépare déjà la suite')+color12FutureContext('makeup')+`<div class="season-future-grid">${v1ComingCard('makeup')}${v1ComingCard('wardrobe')}</div>`+v1ComingCard('tutorial')+note('Ces aperçus restent consultables, mais aucun éditeur ni tutoriel ne se lance avant leur sortie.');
 return chips(['Profil','Palette','À éviter','Cheveux','À venir'],'colorSeasonTab',tab)+body;
}

V['COL-01']=()=>{color12Ensure();const profile=color12ReportProfile(null);return head('Color Studio',profile?'Votre saison, ses nuances et ses usages.':'Quatre familles, douze saisons, un profil expliqué.')+(profile?color12ProfilePanel(profile):intent('Trouver ma saison','Photo guidée, quatre axes et alternatives proches','studio-analysis',{domain:'Colorimétrie'},'sparkles')+panel(`<span class="eyebrow">La méthode Beautify</span><h2>4 familles et 12 saisons</h2>${P('Spring, Summer, Autumn et Winter se déclinent chacune en trois profils. L’analyse propose une saison principale et des alternatives, sans vous enfermer.')}`)+sec('Explorer les familles')+`<div class="season-family-grid">${Object.keys(COLOR12_FAMILIES).map(color12FamilyCard).join('')}</div>`)+note('Explorer une famille ne modifie pas votre résultat personnel.');};

V['COL-02']=()=>{color12Ensure();const id=COLOR12_FAMILIES[M.colorFamily]?M.colorFamily:'winter',f=COLOR12_FAMILIES[id];return head('Les 12 saisons','Comprendre les nuances sans changer votre profil.')+chips(Object.keys(COLOR12_FAMILIES).map(k=>COLOR12_FAMILIES[k].name),'colorFamilyLabel',f.name)+`<section class="family-detail"><span class="eyebrow">Famille ${esc(f.label)}</span><h2>${esc(f.name)}</h2><p>${esc(f.summary)}</p></section>`+`<div class="family-season-list">${f.seasons.map(sid=>{const s=COLOR12_SEASONS[sid];return A(`<span><small>${esc(s.axes[2])}</small><strong>${esc(s.name)}</strong><em>${esc(s.summary)}</em></span>${color12Band(s,7,'family-detail-band')}`,'color-season-peek',{id:sid},'glass family-season-card');}).join('')}</div>`+A(M.colorProfile?'Revenir à mon profil':'Analyser mes couleurs',M.colorProfile?'color-profile-return':'studio-analysis',M.colorProfile?{}:{domain:'Colorimétrie'})+note('Les palettes affichées sont des repères de démonstration. Le résultat personnel vient du parcours d’analyse.');};

V['ANA-09']=()=>{const r=report();if(r?.domain!=='Colorimétrie')return COLOR12_BASE.reveal();const p=color12ReportProfile(r);return head('Votre profil couleur est prêt','Une saison principale, deux pistes proches.')+panel(`${icon('palette','glow-icon xl')}<h2>${esc(p?.name||'Votre saison')}</h2>${P('Découvrez ce qui rapproche ce profil de votre contraste, votre profondeur, votre température et votre intensité.')}${p?color12Band(COLOR12_SEASONS[p.season]):''}`)+B('Voir mon résultat','ANA-10')+A('Corriger mes repères','edit-analysis',{},'text-button mt');};
V['ANA-10']=()=>{const r=report();if(r?.domain!=='Colorimétrie')return COLOR12_BASE.result();const p=color12ReportProfile(r),s=p&&COLOR12_SEASONS[p.season];if(!s)return COLOR12_BASE.result();return head('Mon profil 12 saisons',dateText(r.date))+color12ProfileCard(p)+color12Traits(s)+panel(`<h3>À retenir</h3>${P('Commencez par comparer vos couleurs principales et vos neutres près du visage, dans une lumière naturelle. Les saisons proches restent consultables si le rendu vous semble partagé.')}`)+A('Ouvrir mon Color Studio','color-report-open',{id:r.id})+A('Corriger cette analyse','edit-analysis',{},'secondary mt')+note('Correspondance indicative de démonstration ; ce n’est ni un diagnostic ni une mesure de beauté.');};

function color12FuturePreview(key){
 if(key==='makeup')return `<div class="future-demo makeup-demo"><div><span style="--season-color:#b35b79"></span><strong>Lèvres</strong><small>Bois de rose froid</small></div><div><span style="--season-color:#5d4a69"></span><strong>Yeux</strong><small>Prune douce</small></div><div><span style="--season-color:#c99d89"></span><strong>Teint</strong><small>Fini selon votre peau</small></div></div>`;
 if(key==='wardrobe')return `<div class="future-demo wardrobe-demo"><div>${icon('hanger')}<span><strong>Hauts près du visage</strong><small>Comparés à votre saison</small></span>${icon('lock')}</div><div>${icon('dress')}<span><strong>Tenues avec mes pièces</strong><small>Occasion, météo et date</small></span>${icon('lock')}</div></div>`;
 return `<div class="future-demo tutorial-demo"><div><span>01</span><p><strong>Préparer</strong><small>Matériel et durée</small></p></div><div><span>02</span><p><strong>Réaliser</strong><small>Étapes visuelles</small></p></div><div><span>03</span><p><strong>Reprendre</strong><small>Au bon endroit</small></p></div></div>`;
}
const color12BaseUpcomingPage=v1UpcomingPage;
v1UpcomingPage=function(key){const f=V1_UPCOMING[key],saved=!!M.comingSoonNotices?.[key];return head(f.title,'Un aperçu concret de ce qui rejoindra Beautify.')+`<section class="coming-hero">${imageFor(f.image,'coming-image',f.title)}<div class="coming-shade"></div><span class="coming-pill">Prévu après la V1</span><div class="coming-copy"><h2>${esc(f.subtitle)}</h2><p>Le module est visible pour que vous puissiez comprendre sa valeur, mais ses actions restent verrouillées.</p></div></section>`+color12FutureContext(key)+sec('Aperçu du module')+color12FuturePreview(key)+sec('Ce que vous pourrez faire')+`<div class="coming-list">${f.features.map((x,i)=>`<div><span>${i+1}</span><p>${esc(x)}</p></div>`).join('')}</div>`+A(saved?'Vous serez prévenue':'Me prévenir au lancement','coming-notify',{feature:key,pressed:saved},saved?'secondary':'primary')+B('Retour aux fonctions disponibles',key==='makeup'?'COL-01':'DEC-01','text-button mt')+note('Aucune date ni notification réelle dans ce mockup. Le module ne fait pas partie de la V1 payante.');};
V1_UPCOMING.makeup.features=['Choisir un rendu naturel, soft glam ou soirée','Recevoir des teintes reliées à votre saison','Adapter la proposition à l’occasion et au temps disponible'];
V1_UPCOMING.wardrobe.features=['Ajouter et classer les pièces que vous possédez','Composer des tenues avec votre palette personnelle','Préparer une tenue pour une date ou une occasion'];
V1_UPCOMING.tutorial.features=['Suivre des étapes visuelles, courtes et vérifiables','Voir le matériel, la durée et des alternatives simples','Reprendre exactement à l’étape quittée'];

const color12Finish=COLOR12_BASE.finish;
ACTIONS['finish-analysis']=()=>{const isColor=M.draft.domain==='Colorimétrie',answers=clone(M.draft.answers||{});color12Finish();if(!isColor||M.draft.status!=='complete')return;const profile=color12Classify(answers),r=M.analyses.find(x=>x.id===M.draft.reportId);M.colorProfile=profile;M.colorSeasonTab='Profil';M.colorFamily=profile.family;M.context.season=profile.season;if(r)Object.assign(r,{season:profile.season,match:profile.match,alternatives:profile.alternatives,colorAxes:COLOR12_SEASONS[profile.season].axes});persist();};

Object.assign(ACTIONS,{
 'color-family':()=>go('COL-02'),
 'color-family-open':d=>{if(!COLOR12_FAMILIES[d.id])return;M.colorFamily=d.id;go('COL-02');},
 'color-profile-return':()=>go('COL-01'),
 'color-season-peek':d=>{const s=COLOR12_SEASONS[d.id];if(!s)return;modal(s.name,color12Band(s)+P(s.summary)+color12Traits(s)+color12ColorGrid(s.colors.slice(0,8),'season-color-grid compact')+A('Fermer cet aperçu','close',{},'secondary')+note('Explorer cette saison ne modifie pas votre profil personnel.'));},
 'color-season-save':()=>{M.savedSeason=!M.savedSeason;persist();render();toast(M.savedSeason?'Palette enregistrée.':'Palette retirée des enregistrés.');},
 'color-check':()=>color12CheckModal(),
 'color-check-sample':d=>{M.colorCheck=d.result||'in';color12CheckModal();},
 'color-report-open':d=>{const r=M.analyses.find(x=>x.id===d.id),p=color12ReportProfile(r);if(p)M.colorProfile=p;M.colorSeasonTab='Profil';go('COL-01');}
});

const color12Choice=ACTIONS.choice;
ACTIONS.choice=d=>{if(d.key==='colorFamilyLabel'){const hit=Object.entries(COLOR12_FAMILIES).find(([,f])=>f.name===d.value);if(hit)M.colorFamily=hit[0];render();return;}color12Choice(d);};

function color12CheckModal(){const s=color12Current();if(!s){modal('Vérifier une couleur',P('Créez d’abord votre profil 12 saisons pour comparer une couleur.')+A('Commencer mon analyse','studio-analysis',{domain:'Colorimétrie'}));return;}const result=M.colorCheck;if(!result){modal('Cette couleur est-elle pour moi ?',P('Dans une prochaine version, vous pourrez photographier un vêtement. Beautify comparera sa couleur à votre palette et proposera une nuance proche.')+color12Band(s,6)+A('Tester une couleur harmonieuse','color-check-sample',{result:'in'})+A('Tester une couleur éloignée','color-check-sample',{result:'off'},'secondary mt')+note('La caméra, la lumière du magasin et l’écran peuvent modifier la couleur. La photo serait supprimée après l’échantillonnage.'));return;}const good=s.colors[0],bad=s.avoid[0][0],alt=s.avoid[0][1],inside=result==='in';modal(inside?'Cette couleur est dans votre palette':'Une alternative pourrait mieux fonctionner',`<div class="color-check-result"><i style="--season-color:${inside?good[1]:bad[1]}"></i><span><small>${inside?'Dans la palette':'Plus éloignée'}</small><strong>${esc(inside?good[0]:bad[0])}</strong></span></div>`+(inside?P('La teinte est proche des couleurs principales de votre saison. Vérifiez aussi la matière et le rendu en lumière naturelle.'):`<div class="check-alternative"><span>À comparer avec</span><i style="--season-color:${alt[1]}"></i><strong>${esc(alt[0])}</strong></div>${P(s.avoid[0][2])}`)+A('Tester un autre exemple','color-check-reset',{},'secondary')+note('Résultat de démonstration en trois niveaux : dans la palette, proche ou éloignée. Aucun pourcentage de précision.'));}
ACTIONS['color-check-reset']=()=>{M.colorCheck='';color12CheckModal();};

const color12Sample=sample;
sample=function(){color12Sample();const s=COLOR12_SEASONS.deep_winter;M.colorProfile={season:'deep_winter',name:s.name,family:s.family,match:'Correspondance forte',alternatives:s.alternatives,source:'Profil d’exemple 12 saisons'};M.colorFamily='winter';M.colorSeasonTab='Profil';M.analyses.push({id:'sample-color-analysis',date:DATE(),domain:'Colorimétrie',status:'complete',photo:'portrait',source:'Exemple éditorial : photo de référence',answers:{temperatureHint:'Froid / rosé',depthHint:'Profonde',chromaHint:'Nette / lumineuse',contrastHint:'Fort'},season:'deep_winter',match:'Correspondance forte',alternatives:s.alternatives,colorAxes:s.axes});persist();};

color12Ensure();
