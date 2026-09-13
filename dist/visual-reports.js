'use strict';

// Image-led redesign. Existing purchase, photo, draft and saved-report handlers
// remain the source of navigation and entitlement decisions.
const BEAUTY_OLD={capture:V['ANA-04'],confirm:V['ANA-06'],loading:V['ANA-08'],reveal:V['ANA-09'],report:canonicalReport,color:V['COL-01'],families:V['COL-02'],skin:skinScorePanel};
const BEAUTY_ASSET='/assets/beauty-v2/';
function beautyHeader(){return `<header class="beauty-header">${A(icon('back'),'back',{label:'Retour'},'beauty-back')}<button type="button" class="beauty-wordmark" data-act="home" aria-label="Accueil Beautify">Beautify<small>by UZMEK</small></button><span class="beauty-brand-star" aria-hidden="true">${icon('sparkles')}</span></header>`;}
function beautyPage(body,cls=''){return `<div class="lg-page beauty-page ${cls}">${beautyHeader()}${body}</div>`;}
function beautyTitle(title,kicker='',subtitle=''){return `<header class="beauty-title">${kicker?`<span class="eyebrow">${esc(kicker)}</span>`:''}<h1 tabindex="-1">${title}</h1>${subtitle?`<p>${esc(subtitle)}</p>`:''}</header>`;}
function beautyButton(text,action,data={},secondary=false,glyph=''){return A((glyph?icon(glyph):'')+`<span>${esc(text)}</span>`+icon('chev'),action,data,'beauty-button '+(secondary?'is-secondary':'is-copper'));}
function beautyPortrait(result,cls='',example=true){
  const key=result?result.photo:M.draft.photo,url=memoryPhotos[key];
  // Only a live photo blob represents the user's image. Artwork and legacy demo
  // keys never stand in for a measured face; the fallback is explicitly editorial.
  return `<figure class="beauty-portrait ${cls}"><img src="${esc(url||BEAUTY_ASSET+'portrait.png')}" alt="${url?'Photo sélectionnée':'Portrait d’illustration'}">${!url&&example?'<figcaption>Photo d’exemple</figcaption>':''}</figure>`;
}
function beautyFooter(result){return `<div class="beauty-report-actions">${A('<span class="beauty-action-symbol" aria-hidden="true">'+icon('clock')+'</span><span>Historique</span>','lg-history-domain',{domain:result.domain},'beauty-button is-secondary')}${A('<span class="beauty-action-symbol" aria-hidden="true">'+icon('plus')+'</span><span>Nouvelle analyse</span>','studio-analysis',{domain:result.domain},'beauty-button is-copper')}</div>`;}
function beautyColorSeason(result){return COLOR12_SEASONS[result?.season]||null;}
function beautyLightSwatch(hex){const rgb=hex.replace('#','').match(/.{2}/g)?.map(c=>parseInt(c,16));return rgb?.length===3&&(rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722)>205;}
function beautyColorSwatches(values,result,cls='',origin=''){
  return `<div class="beauty-swatches ${cls}">${values.map(([name,color])=>A(`<span class="beauty-swatch-color${beautyLightSwatch(color)?' is-light':''}" style="--swatch:${color}"></span><span>${esc(name)}</span>`,'beauty-swatch',{id:result?.id||'',season:result?.season||'',name,origin,label:name+', '+color},'beauty-swatch')).join('')}</div>`;
}
function beautySmallSwatches(values){return `<span class="beauty-small-swatches" aria-hidden="true">${values.map(([name,color])=>`<i title="${esc(name)}" class="${beautyLightSwatch(color)?'is-light':''}" style="background:${color}"></i>`).join('')}</span>`;}
function beautyMakeupShades(s){return s.colors.filter(([name])=>/rose|rouge|framboise|baie|corail|saumon|magenta|paprika|tomate|cannelle|bordeaux/i.test(name));}
// Retired introductions remain compatible aliases for the photo screen.
V['ANA-03']=()=>V['ANA-04']();
const BEAUTY_CAPTURE_COPY={
  'Colorimétrie':{title:'Une photo,<br>vos couleurs.',kicker:'Analyse couleurs',tip:['face-front','De face']},
  'Peau':{title:'Une photo,<br>votre peau.',kicker:'Analyse de peau',tip:['skin-clean','Peau propre']},
  'Cheveux':{title:'Une photo,<br>vos coupes.',kicker:'Analyse cheveux',tip:['hair-clear','Visage dégagé']}
};
function beautyCaptureArt(glyph){
  return `<span class="beauty-capture-art" data-capture-art="${esc(glyph)}" aria-hidden="true">${['selfie','photo-stack','face-front','skin-clean','hair-clear','sun','no-filter'].includes(glyph)?'':icon(glyph)}</span>`;
}
function beautyCaptureButton(text,action,data,secondary,glyph){
  const launch=action==='canonical-analyze-photo';
  const label=esc(text);
  return A(`${beautyCaptureArt(launch?'check':glyph)}<span class="beauty-capture-label">${label}</span><span class="beauty-capture-arrow" aria-hidden="true">${icon('chev')}</span>`,action,data,'beauty-button beauty-capture-button '+(launch?'is-launch':secondary?'is-gallery':'is-camera'));
}
function beautyCapture(confirm=false){
  const copy=BEAUTY_CAPTURE_COPY[M.draft.domain];
  const hasPhoto=canonicalHasPhoto();
  return beautyPage(beautyTitle(confirm?'Votre photo est prête.':copy.title,copy.kicker)+
    beautyPortrait(null,'beauty-capture-portrait')+
    `<div class="beauty-photo-tips">${[copy.tip,['sun','Lumière naturelle'],['no-filter','Sans filtre']].map(([glyph,label])=>`<div>${beautyCaptureArt(glyph)}<span>${label==='Lumière naturelle'?'Lumière<br>naturelle':esc(label)}</span></div>`).join('')}</div>`+
    `<div class="beauty-capture-actions">${hasPhoto?beautyCaptureButton('Lancer mon analyse','canonical-analyze-photo',{},false,'face-front'):''}${beautyCaptureButton(hasPhoto?'Reprendre une photo':'Prendre un selfie','file-pick',{purpose:'analysis',source:'camera',label:'Prendre un selfie avec la caméra'},hasPhoto,'selfie')}${beautyCaptureButton('Choisir dans la galerie','file-pick',{purpose:'analysis',source:'gallery',label:'Choisir dans la galerie'},true,'photo-stack')}</div>`+
    `<p class="beauty-note">Démo : photo privée dans cet onglet</p>`,'beauty-capture lg-funnel');
}
V['ANA-04']=()=>BEAUTY_CAPTURE_COPY[M.draft.domain]?beautyCapture():BEAUTY_OLD.capture();V['ANA-05']=V['ANA-04'];
V['ANA-06']=()=>BEAUTY_CAPTURE_COPY[M.draft.domain]?beautyCapture(canonicalHasPhoto()):BEAUTY_OLD.confirm();V['ANA-07']=V['ANA-06'];
V['ANA-08']=()=>{
  const original=BEAUTY_OLD.loading(); // Retains the completion timer and guards.
  const stages={
    'Colorimétrie':['Détection du visage','Lecture des nuances','Mesure du contraste','Comparaison des 12 saisons','Création de votre palette'],
    'Peau':['Détection du visage','Observation de la peau','Lecture des signes visibles','Préparation des conseils','Création de votre routine'],
    'Cheveux':['Détection du visage','Lecture des proportions','Observation des cheveux','Sélection des coupes','Création de votre profil']
  }[M.draft.domain];
  if(!stages||!canonicalHasPhoto()||['error','offline','pending','refused','unavailable'].includes(M.scenario))return original;
  const photo=memoryPhotos[M.draft.photo]||BEAUTY_ASSET+'portrait.png';
  return beautyPage(`<main class="beauty-analysis-main" style="--analysis-stage-duration:${CANONICAL_ANALYSIS_DURATION_MS/stages.length/1000}s">
    <div class="beauty-analysis-halo"><span class="beauty-analysis-bloom" aria-hidden="true"></span><span class="beauty-analysis-ring is-outer" aria-hidden="true"></span><span class="beauty-analysis-ring is-inner" aria-hidden="true"></span><div class="beauty-analysis-photo"><img src="${esc(photo)}" alt="${memoryPhotos[M.draft.photo]?'Votre photo sélectionnée':'Portrait d’illustration de la démo'}"></div></div>
    <div class="beauty-analysis-copy" role="status" aria-label="Préparation de votre aperçu ${esc(M.draft.domain.toLowerCase())} de démonstration">
      <span class="beauty-analysis-eyebrow">Analyse de votre selfie</span>
      <h1 class="beauty-analysis-labels" tabindex="-1" aria-label="Analyse en cours">${stages.map((label,i)=>`<span aria-hidden="true" style="--stage:${i}" class="${i===stages.length-1?'is-last':''}">${esc(label)}</span>`).join('')}</h1>
      <div class="beauty-analysis-rail" aria-hidden="true">${stages.map((_,i)=>`<i style="--stage:${i}"></i>`).join('')}</div>
    </div></main>`+
    `<footer class="beauty-analysis-footer"><p class="beauty-note">Démo : résultat illustratif</p></footer>`,'beauty-analysis-loading lg-funnel');
};
function beautyColorReveal(result){
  const s=beautyColorSeason(result);
  if(!s)return BEAUTY_OLD.reveal();
  return beautyPage(`<div class="beauty-reveal-hero">${beautyPortrait(result,'beauty-reveal-photo',false)}${beautyTitle('Votre saison<br>se révèle.','Analyse couleurs')}<div class="beauty-reveal-season"><span class="eyebrow">Votre saison</span><h2>${esc(s.name)}</h2><p>${esc(lgSeasonNames[result.season]||'')}</p></div></div>`+
    `<section class="beauty-reveal-palette"><h3>Aperçu de votre palette</h3>${beautySmallSwatches([s.colors[0],s.colors[5],s.colors[8],s.neutrals[0]])}</section>`+
    `<div class="beauty-locks">${[['palette','Palette complète'],['makeup','Nuances à porter'],['results','Profil de saison']].map(([art,label])=>`<div><img src="/assets/icons/${art}.webp" alt=""><strong>${label}</strong>${icon('lock')}</div>`).join('')}</div>`+
    B('<span>Voir mon rapport complet</span>'+icon('chev'),'PRE-01','beauty-button is-copper')+
    `<div class="beauty-reveal-note"><span>Démo : résultat illustratif</span>${B('Plus tard','SAV-01','text-button')}</div>`,'beauty-color-reveal');
}
V['ANA-09']=()=>{const r=report();return r?.domain==='Colorimétrie'&&!canonicalOwned()?beautyColorReveal(r):BEAUTY_OLD.reveal();};

function beautyPalettePanel(result,s){return `<div class="beauty-palette-panel">${beautyTitle(esc(s.name),'Vos couleurs signature',lgSeasonNames[result.season]||'')}${beautyColorSwatches(s.colors,result,'is-signature')}<section class="beauty-neutrals"><h2>Vos essentiels</h2>${beautyColorSwatches(s.neutrals,result,'is-neutral')}</section></div>`;}
function beautyUseArt(kind){return `<span class="beauty-use-art art-${kind}" aria-hidden="true"></span>`;}
// Explicit coverage of the recommendation vocabulary. Tone and surface finish
// are separate: "doux" means a muted hue, not an assumed matte surface.
const BEAUTY_METAL_STYLES={
  'or jaune brillant':'gold is-polished',
  'or rose clair':'rose is-light',
  'or jaune':'gold',
  'or rose chaud':'rose is-warm',
  'or clair':'gold is-light',
  'or rose doux':'rose is-soft',
  'argent clair':'silver is-light',
  'or blanc':'white-gold',
  'argent':'silver',
  'or blanc mat':'white-gold is-matte',
  'argent patiné':'silver is-patina',
  'or rose froid':'rose is-cool',
  'or mat':'gold is-matte',
  'bronze doux':'bronze is-soft',
  'cuivre':'copper',
  'bronze':'bronze',
  'or antique':'gold is-patina',
  'argent brillant':'silver is-polished',
  'platine':'platinum',
  'or blanc poli':'white-gold is-polished'
};
function beautyMetalStyle(name){
  const label=String(name).normalize('NFC').trim().replace(/\s+/g,' ').toLocaleLowerCase('fr');
  // Unmapped future labels have no color sample instead of pretending to be silver.
  return Object.hasOwn(BEAUTY_METAL_STYLES,label)?BEAUTY_METAL_STYLES[label]:'unknown';
}
function beautyMetalTags(names){return `<span class="beauty-metal-tags">${names.map(name=>`<span>${esc(name)}</span>`).join('')}</span>`;}
function beautyApplications(result,s){
  const pairs=[[s.colors[5],s.neutrals[0]],[s.colors[3],s.colors[9]],[s.neutrals[1],s.colors[8]]];
  const makeups=beautyMakeupShades(s);
  return `<div class="beauty-applications-panel">${beautyTitle('Vos nuances,<br>au quotidien.')}
    <section class="beauty-use-clothes"><header><h2>Vêtements</h2>${A('Voir tout '+icon('chev'),'beauty-color-detail',{id:result.id,season:result.season,kind:'clothes'},'text-button')}</header><div class="beauty-clothes-content">${beautyUseArt('clothes')}<div class="beauty-combinations">${pairs.map(pair=>`<div>${beautySmallSwatches(pair)}<span>${esc(pair.map(([name])=>name).join(' + '))}</span></div>`).join('')}</div></div></section>
    <div class="beauty-use-duo">${A('<strong>Cheveux</strong>'+beautyUseArt('hair')+`<span>${esc(s.hair.best[0])}</span>`+icon('chev'),'beauty-color-detail',{id:result.id,season:result.season,kind:'hair',label:'Voir les couleurs de cheveux'},'beauty-use-tile')}${A('<strong>Teintes maquillage</strong>'+beautyUseArt('makeup')+beautySmallSwatches(makeups)+icon('chev'),'beauty-color-detail',{id:result.id,season:result.season,kind:'makeup',label:'Voir les teintes de maquillage'},'beauty-use-tile')}</div>
    ${A(beautyUseArt('jewels')+`<span><strong>Bijoux</strong>${beautyMetalTags(s.metals)}</span>`+icon('chev'),'beauty-color-detail',{id:result.id,season:result.season,kind:'metals',label:'Voir les métaux conseillés'},'beauty-use-metals')}
    <div class="beauty-advice-links">${A('À nuancer '+icon('chev'),'beauty-color-detail',{id:result.id,season:result.season,kind:'avoid'},'beauty-advice-link')}${A('Conseils coloration '+icon('chev'),'beauty-color-detail',{id:result.id,season:result.season,kind:'hair'},'beauty-advice-link')}</div></div>`;
}
function beautySeasonFan(s,result){return `<div class="beauty-season-fan" aria-label="Couleurs de votre saison">${[s.colors[0],s.colors[2],s.colors[3],s.colors[5],s.colors[8],s.colors[10],s.neutrals[0],s.neutrals[1]].map(([name,color],i)=>A(`<i style="background:${color}"></i>`,'beauty-swatch',{id:result.id,season:result.season,name,label:name},'beauty-fan-swatch fan-'+i)).join('')}</div>`;}
function beautySeasonPanel(result,s){return `<div class="beauty-season-panel">${beautyTitle(esc(s.name),'Votre saison',lgSeasonNames[result.season]||'')}${beautySeasonFan(s,result)}
    <section class="beauty-season-profile"><h2>Votre profil couleur</h2><dl>${['Température','Profondeur','Intensité'].map((label,i)=>`<div><dt>${label}</dt><dd>${esc(s.axes[i])}</dd></div>`).join('')}</dl></section>
    ${A(beautySmallSwatches([s.neutrals[0],s.neutrals[1]])+`<span><strong>${esc(s.axes[3])}</strong><small>Comprendre ce contraste</small></span>`+icon('chev'),'beauty-color-detail',{id:result.id,season:result.season,kind:'contrast'},'beauty-contrast')}
    ${A('<span><strong>12 saisons</strong><small>Explorer les profils</small></span>'+`<span class="beauty-family-dots">${Object.values(COLOR12_FAMILIES).map(f=>`<i style="background:${COLOR12_SEASONS[f.seasons[1]].colors[0][1]}"></i>`).join('')}</span>`+icon('chev'),'beauty-seasons',{},'beauty-family-link')}</div>`;}

// The three new cosmetic criteria are a separate DEMO contract. They must never
// be obtained by renaming redness, shine or under-eye scores from skin-v1.
const BEAUTY_SKIN_DEMO={source:'demo/skin-quality-v1',score:78,metrics:[{key:'tone',label:'Uniformité du teint',score:82,detail:'L’apparence régulière du teint et les variations de couleur visibles.'},{key:'texture',label:'Grain de peau',score:74,detail:'L’aspect lisse ou irrégulier de la peau et la visibilité des pores.'},{key:'radiance',label:'Éclat du teint',score:78,detail:'L’apparence lumineuse ou terne du teint, sensible à l’éclairage.'}],observations:['Rougeurs discrètes','Quelques imperfections','Cernes légers'],priorities:['Uniformité','Confort']};
function beautySkinData(result){return result?.skinVisualReport?.source==='demo/skin-quality-v1'?result.skinVisualReport:BEAUTY_SKIN_DEMO;}
const BEAUTY_FINISH=ACTIONS['finish-analysis'];
ACTIONS['finish-analysis']=()=>{BEAUTY_FINISH();const r=report();if(r?.domain==='Peau'&&r.id===M.draft.reportId&&!r.skinVisualReport&&r.skinScoreSource!=='vision/skin-v1'){r.skinVisualReport=clone(BEAUTY_SKIN_DEMO);persist();}};
function beautySkinPanel(result){
  if(result.skinScoreSource==='vision/skin-v1')return BEAUTY_OLD.skin(result);
  const d=beautySkinData(result);
  return `<div class="beauty-skin-panel"><section class="beauty-skin-hero">${beautyPortrait(result,'beauty-skin-photo',false)}<h1 tabindex="-1">Qualité<br>de peau</h1><div class="beauty-quality-ring" style="--score:${d.score}%" role="img" aria-label="Qualité de peau, exemple ${d.score} sur 100"><span><strong>${d.score}</strong><small>/100</small><em>Exemple</em></span></div></section>
    <section class="beauty-skin-metrics" aria-label="Critères de qualité de peau">${d.metrics.map((m,i)=>A(`<span class="beauty-metric-icon">${icon(['sun','scan','sparkles'][i])}</span><span class="beauty-metric-copy"><span><strong>${esc(m.label)}</strong><b>${m.score}<small>/100</small></b></span><i class="beauty-metric-track"><i style="width:${m.score}%"></i></i></span>`,'beauty-skin-detail',{id:result.id,key:m.key,label:m.label+' : '+m.score+' sur 100. Voir le détail'},'beauty-skin-metric')).join('')}</section>
    <div class="beauty-observations">${d.observations.map(text=>`<span>${esc(text)}</span>`).join('')}</div>
    <section class="beauty-skin-priorities"><div><h2>Mes priorités</h2><p>${d.priorities.map(text=>`<span>${esc(text)}</span>`).join('')}</p></div>${A('Ma routine '+icon('chev'),'canonical-report-jump',{step:0},'beauty-button is-copper')}</section>
    <p class="beauty-note">Scores illustratifs, photo non analysée.<br>Observation cosmétique, pas un diagnostic médical.</p></div>`;
}
skinScorePanel=beautySkinPanel;
canonicalReport=function(){
  const r=report();
  if(!r||!canonicalOwned())return BEAUTY_OLD.report();
  const tabs=canonicalReportTabs(r.domain,r),step=Math.max(0,Math.min(Number(M.canonicalReportStep)||0,tabs.length-1));
  const isColor=r.domain==='Colorimétrie',isSkin=r.domain==='Peau';
  if(!isColor&&!isSkin)return BEAUTY_OLD.report();
  const s=isColor?beautyColorSeason(r):null;
  if(isColor&&!s)return BEAUTY_OLD.report();
  const body=isSkin?(tabs[step]==='Bilan'?beautySkinPanel(r):canonicalSkinPanel(tabs[step],r)):step===0?beautyPalettePanel(r,s):step===1?beautyApplications(r,s):beautySeasonPanel(r,s);
  return beautyPage(canonicalReportRail(tabs,step)+`<section class="canonical-report-panel beauty-report-panel" aria-live="polite" aria-label="${esc(tabs[step])}">${body}</section>`+beautyFooter(r),'beauty-report '+(isSkin?'beauty-skin-report':'beauty-color-report'));
};
V['ANA-10']=()=>{const html=canonicalReport();return /class="lg-page(?: |")/.test(html)?html:lgPage(html,'ux-secondary');};V['ANA-11']=V['ANA-10'];

function beautyResolveColor(data){
  if(data.id){if(!canonicalOwned())return null;const r=M.analyses.find(r=>r.id===data.id&&r.domain==='Colorimétrie');return r&&beautyColorSeason(r)?{result:r,season:beautyColorSeason(r)}:null;}
  const s=COLOR12_SEASONS[data.season];return s?{result:{id:'',season:data.season},season:s}:null;
}
ACTIONS['beauty-swatch']=data=>{
  const found=beautyResolveColor(data);if(!found)return;
  const pair=[...found.season.colors,...found.season.neutrals].find(([name])=>name===data.name);if(!pair)return;
  const returnControl=data.origin==='season-preview'?A('Revenir à cette saison','beauty-season-preview',{season:found.result.season},'beauty-button is-secondary'):['clothes','makeup'].includes(data.origin)?A('Revenir aux couleurs','beauty-color-detail',{id:found.result.id,season:found.result.season,kind:data.origin},'beauty-button is-secondary'):A('Revenir à ma palette','close',{},'beauty-button is-secondary');
  modal(esc(pair[0]),`<div class="beauty-swatch-detail" style="background:${pair[1]}"></div><p class="beauty-color-code">${esc(pair[1].toUpperCase())}</p><p>${esc(found.season.name)}, ${esc(lgSeasonNames[found.result.season]||'')}</p>`+returnControl);
};
// Approximate editorial hair samples, separate from the exact palette HEX data.
// They illustrate the existing shade names; they are not a dye formula or try-on.
function beautyHairTone(name){
  const n=name.toLowerCase();
  if(/noir et argent/.test(n))return ['#22272e','#c9c8c5'];
  if(/argent|platine|nacré/.test(n))return ['#a5a3a0','#ede8df'];
  if(/bordeaux/.test(n))return ['#321723','#794754'];
  if(/bleu.noir|noir bleuté/.test(n))return ['#111823','#485767'];
  if(/noir/.test(n))return ['#19191a','#59514d'];
  if(/auburn profond/.test(n))return ['#42241e','#8b5140'];
  if(/auburn|cuivr/.test(n))return /fraise|doux/.test(n)?['#9e6146','#d9a07c']:['#773b28','#c07a4b'];
  if(/espresso|brun profond|brun cendré profond|brun froid net|brun très froid/.test(n))return /froid|cendré/.test(n)?['#282327','#766467']:['#30231d','#79543c'];
  if(/chocolat/.test(n))return ['#483025','#946d4d'];
  if(/moka/.test(n))return ['#433838','#99847b'];
  if(/miel|doré|caramel|chaud/.test(n))return /brun|châtain/.test(n)?['#684428','#b58b54']:['#9a713e','#e4c38b'];
  if(/blond|beige/.test(n))return /foncé|fumé/.test(n)?['#776958','#b3a58e']:['#ac9a7d','#e3d4b7'];
  if(/noisette/.test(n))return ['#67513c','#b09673'];
  if(/châtain|cendré|taupe/.test(n))return /clair/.test(n)?['#7d6e61','#bba995']:['#52483f','#9a8976'];
  return ['#49382d','#aa8667'];
}
function beautyHairSample(name,compact=false){const [tone,glint]=beautyHairTone(name);return `<span class="beauty-hair-sample${compact?' is-compact':''}" style="--hair-tone:${tone};--hair-glint:${glint}" aria-hidden="true"></span>`;}
function beautyHairAdvice(s){return `<div class="beauty-advice-sheet beauty-hair-advice">
  <div class="beauty-advice-heading"><h3>Vos nuances</h3><span>${esc(COLOR12_FAMILIES[s.family].label)}</span></div>
  <div class="beauty-hair-shades">${s.hair.best.map(name=>`<figure class="beauty-hair-shade">${beautyHairSample(name)}<figcaption>${esc(name)}</figcaption></figure>`).join('')}</div>
  <section class="beauty-hair-caution"><h3>À nuancer</h3><div>${s.hair.avoid.map(name=>`<div>${beautyHairSample(name,true)}<span>${esc(name)}</span></div>`).join('')}</div></section>
  <aside class="beauty-advice-tip">${icon('sparkles')}<div><strong>À retenir</strong><p>${esc(s.hair.note)}</p></div></aside>
  <p class="beauty-sample-caption">Nuances illustratives, le rendu dépend de votre base.</p>
</div>`;}
function beautyAvoidAdvice(s){return `<div class="beauty-advice-sheet beauty-avoid-refined">
  <div class="beauty-avoid-context"><span>${esc(s.name)}</span><p>Des alternatives dans votre palette.</p></div>
  <div class="beauty-avoid-legend"><span>À nuancer</span><span>À privilégier</span></div>
  <div class="beauty-avoid-options">${s.avoid.map((pair,index)=>`<details class="beauty-avoid-option" name="beauty-color-alternatives">
    <summary aria-label="${esc(pair[0][0]+' : privilégier '+pair[1][0]+'. Pourquoi ?')}">
      <span class="beauty-avoid-comparison">${pair.slice(0,2).map(([name,color],i)=>`${i?`<span class="beauty-avoid-direction" aria-hidden="true">${icon('arrow')}</span>`:''}<span class="beauty-avoid-choice${i?' is-recommended':''}"><span class="beauty-avoid-dot${beautyLightSwatch(color)?' is-light':''}" style="background:${color}" aria-hidden="true"></span><span class="beauty-avoid-name">${esc(name)}</span></span>`).join('')}</span>
      <span class="beauty-avoid-explain"><span>Pourquoi cette alternative ?</span>${icon('chev')}</span>
    </summary>
    <p class="beauty-avoid-reason">${esc(pair[2])}</p>
  </details>`).join('')}</div>
</div>`;}
function beautyClothesAdvice(s,r){return `<div class="beauty-advice-sheet beauty-wardrobe-advice">
  <div class="beauty-advice-heading"><h3>Près du visage</h3><span>${s.colors.length} nuances</span></div>
  ${beautyColorSwatches(s.colors,r,'is-wardrobe','clothes')}
  <section class="beauty-wardrobe-bases"><div class="beauty-advice-heading"><h3>Bases & pantalons</h3><span>Les neutres</span></div>${beautyColorSwatches(s.neutrals,r,'is-wardrobe-neutral','clothes')}</section>
</div>`;}
function beautyMetalsAdvice(s){return `<div class="beauty-advice-sheet beauty-metals-advice">
  <div class="beauty-advice-heading"><h3>Vos finitions</h3><span>${esc(COLOR12_FAMILIES[s.family].label)}</span></div>
  <div class="beauty-metal-cards">${s.metals.map(name=>`<figure><span class="beauty-metal-sample is-${beautyMetalStyle(name)}" aria-hidden="true"></span><figcaption>${esc(name)}</figcaption></figure>`).join('')}</div>
</div>`;}
ACTIONS['beauty-color-detail']=data=>{
  const found=beautyResolveColor(data);if(!found)return;
  const {season:s,result:r}=found;let title='',body='';
  if(data.kind==='clothes'){title='Hauts & accessoires';body=beautyClothesAdvice(s,r);}
  else if(data.kind==='hair'){title='Conseils coloration';body=beautyHairAdvice(s);}
  else if(data.kind==='metals'){title='Vos métaux';body=beautyMetalsAdvice(s);}
  else if(data.kind==='makeup'){title='Teintes maquillage';body=beautyColorSwatches(beautyMakeupShades(s),r,'','makeup')+'<p>Repères de couleur pour les lèvres et les joues. Les looks et tutoriels arrivent plus tard.</p>';}
  else if(data.kind==='avoid'){title='Les couleurs à nuancer';body=beautyAvoidAdvice(s);}
  else if(data.kind==='contrast'){title=s.axes[3];body=beautySmallSwatches([s.neutrals[0],s.neutrals[1]])+'<p>'+esc(s.summary)+'</p><p>Un repère pour associer les nuances de votre palette, selon vos envies.</p>';}
  else return;
  modal(title,`<div class="beauty-color-detail">${body}</div>`+A('Revenir au rapport','close',{},'beauty-button is-secondary'));
};
ACTIONS['beauty-skin-detail']=data=>{
  if(!canonicalOwned()){go('PRE-01');return;}
  const r=M.analyses.find(r=>r.id===data.id&&r.domain==='Peau');if(!r||r.skinScoreSource==='vision/skin-v1')return;
  const metric=beautySkinData(r).metrics.find(m=>m.key===data.key);if(!metric)return;
  modal(esc(metric.label),`<div class="sc-score-detail"><p class="sc-score-detail-value">${metric.score}<span> /100</span></p><p>${esc(metric.detail)}</p><p>Plus le score est élevé, plus l’aspect illustré est favorable.</p><p class="beauty-note">Exemple de présentation, votre photo n’a pas été analysée.</p></div>`+A('Revenir au bilan','close',{},'beauty-button is-secondary'));
};
function beautySeasonDirectory(){return `<div class="beauty-season-directory">${Object.values(COLOR12_FAMILIES).map(f=>`<section><h3>${f.label}</h3>${f.seasons.map(key=>A(beautySmallSwatches(COLOR12_SEASONS[key].colors.slice(0,4))+`<span>${esc(lgSeasonNames[key])}</span>`+icon('chev'),'beauty-season-preview',{season:key},'beauty-season-option')).join('')}</section>`).join('')}</div>`;}
ACTIONS['beauty-seasons']=()=>modal('Les 12 saisons',beautySeasonDirectory()+A('Fermer les saisons','close',{},'beauty-button is-secondary'));
ACTIONS['beauty-season-preview']=data=>{
  if(!COLOR12_SEASONS[data.season])return;
  const s=COLOR12_SEASONS[data.season];modal(esc(lgSeasonNames[data.season]),'<p>Aperçu : votre profil reste inchangé.</p>'+beautyColorSwatches(s.colors,{season:data.season},'','season-preview')+A('Revenir aux 12 saisons','beauty-seasons',{},'beauty-button is-secondary'));
};
V['COL-01']=()=>{
  const r=report(),key=M.previewSeason||(r?.domain==='Colorimétrie'?r.season:M.colorProfile?.season),s=COLOR12_SEASONS[key];
  if(s&&(M.previewSeason||M.lgColorApplications)){
    const record={season:key,id:!M.previewSeason&&r?.domain==='Colorimétrie'?r.id:''};
    return beautyPage(`<p class="beauty-note">${M.previewSeason?'Aperçu : votre profil reste inchangé':'Vos couleurs au quotidien'}</p><section class="beauty-report-panel canonical-report-panel">${M.lgColorApplications?beautyApplications(record,s):beautyPalettePanel(record,s)}</section>`+A('Revenir à mon profil couleur','lg-color-close',{},'beauty-button is-secondary'),'beauty-report beauty-color-preview');
  }
  if(r?.domain==='Colorimétrie'&&canonicalOwned())return V['ANA-10']();
  if(s)return beautyPage(`<section class="beauty-report-panel canonical-report-panel">${beautyPalettePanel({season:key},s)}</section>`+beautyButton('Nouvelle analyse','studio-analysis',{domain:'Colorimétrie'})+A('Explorer les 12 saisons','beauty-seasons',{},'beauty-button is-secondary'),'beauty-report');
  return beautyPage(beautyTitle('Vos couleurs<br>vous attendent.')+`<figure class="beauty-fan-photo"><img src="${BEAUTY_ASSET}color-fan.png" alt="Éventail de couleurs"></figure>`+beautyButton('Analyser mes couleurs','studio-analysis',{domain:'Colorimétrie'})+A('Explorer les 12 saisons','beauty-seasons',{},'beauty-button is-secondary'),'beauty-color-intro');
};
V['COL-02']=()=>beautyPage(beautyTitle('Les 12 saisons','Quatre familles')+beautySeasonDirectory()+A('Revenir à mes couleurs','back',{},'beauty-button is-secondary')+'<p class="beauty-note">Explorer une saison ne change pas votre profil.</p>','beauty-color-directory');
ACTIONS['color-season-peek']=data=>ACTIONS['beauty-season-preview']({season:data.id});
