'use strict';

// Application previews use the selected report's data, never a fixed outfit asset.
const BEAUTY_APPLICATION_CATEGORIES=[
  {key:'clothes',label:'Vêtements',glyph:'hanger',title:'Vos associations'},
  {key:'hair',label:'Cheveux',glyph:'waves',title:'Vos nuances cheveux'},
  {key:'makeup',label:'Maquillage',glyph:'cosmetic',title:'Vos teintes maquillage'},
  {key:'metals',label:'Bijoux',glyph:'ring',title:'Vos métaux'}
];
function beautyApplicationKey(result){return (result.id||'preview')+':'+result.season;}
function beautyApplicationPairs(s){
  return [[s.colors[5],s.neutrals[0]],[s.colors[3],s.colors[9]],[s.neutrals[1],s.colors[8]]].filter(pair=>pair.every(Boolean));
}
function beautyApplicationIcon(glyph){
  // Extend the existing outline icon family for the two category silhouettes.
  if(glyph==='ring')return '<svg class="b-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="14" r="7.5"/><path d="m9 3 1.5 3h3L15 3l-1-1h-4Z"/></svg>';
  if(glyph==='waves')return '<svg class="b-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M6 3c7 6-5 12 2 18M11 2c7 7-5 13 2 20M16 3c7 6-5 12 2 18"/></svg>';
  return icon(glyph);
}
beautyApplications=function(result,s){
  const selection=M.beautyApplicationSelection;
  const key=selection?.report===beautyApplicationKey(result)?selection.category:'clothes';
  const category=BEAUTY_APPLICATION_CATEGORIES.find(c=>c.key===key)||BEAUTY_APPLICATION_CATEGORIES[0];
  const data={id:result.id,season:result.season,kind:category.key};
  let rows='';
  if(category.key==='clothes')rows=beautyApplicationPairs(s).map((pair,index)=>A(
    beautySmallSwatches(pair)+`<span class="beauty-application-labels">${pair.map(([name])=>`<span>${esc(name)}</span>`).join('')}</span>`+icon('chev'),
    'beauty-application-pair',{...data,index,label:pair.map(([name])=>name).join(' et ')},'beauty-application-row')).join('');
  else if(category.key==='hair')rows=s.hair.best.map(name=>A(
    beautyHairSample(name,true)+`<span>${esc(name)}</span>`+icon('chev'),'beauty-color-detail',data,'beauty-application-row')).join('');
  else if(category.key==='makeup')rows=beautyMakeupShades(s).map(([name,color])=>A(
    beautySmallSwatches([[name,color]])+`<span>${esc(name)}</span>`+icon('chev'),'beauty-swatch',{...data,name,origin:'applications'},'beauty-application-row')).join('');
  else rows=s.metals.map(name=>A(
    `<span class="beauty-metal-sample is-${beautyMetalStyle(name)}" aria-hidden="true"></span><span>${esc(name)}</span>`+icon('chev'),'beauty-color-detail',data,'beauty-application-row')).join('');
  const tabs=BEAUTY_APPLICATION_CATEGORIES.map(c=>`<button type="button" id="beauty-application-tab-${c.key}" role="tab" aria-selected="${c.key===category.key}" aria-controls="beauty-application-content" tabindex="${c.key===category.key?0:-1}" class="beauty-application-tab${c.key===category.key?' is-active':''}" data-act="beauty-application-category" data-id="${esc(result.id||'')}" data-season="${esc(result.season)}" data-category="${c.key}">${beautyApplicationIcon(c.glyph)}<span>${c.label}</span></button>`).join('');
  return `<div class="beauty-applications-panel beauty-applications-v3">
    ${beautyTitle('Votre palette,<br>au quotidien.')}
    <div class="beauty-application-tabs" role="tablist" aria-label="Applications de votre palette">${tabs}</div>
    <section id="beauty-application-content" class="beauty-application-content" role="tabpanel" aria-labelledby="beauty-application-tab-${category.key}">
      <header><h2>${category.title}</h2>${A('Voir tout '+icon('chev'),'beauty-color-detail',data,'beauty-application-all')}</header>
      <div class="beauty-application-rows${category.key==='clothes'?' is-pairs':' is-singles'}">${rows||'<p class="beauty-application-empty">Aucune nuance disponible.</p>'}</div>
      ${category.key==='hair'?'<p class="beauty-application-caption">Nuances illustratives, selon votre base.</p>':''}
      ${A(icon('settings')+'<span>À nuancer</span>'+icon('chev'),'beauty-color-detail',{...data,kind:category.key==='hair'?'hair':'avoid'},'beauty-application-advice')}
    </section>
    ${A(icon('sparkles')+'<span>Conseils couleur</span>'+icon('chev'),'beauty-color-detail',{...data,kind:category.key==='hair'?'hair':'contrast'},'beauty-application-advice beauty-application-tip')}
  </div>`;
};
ACTIONS['beauty-application-category']=data=>{
  if(!BEAUTY_APPLICATION_CATEGORIES.some(c=>c.key===data.category))return;
  const found=beautyResolveColor(data);if(!found)return;
  M.beautyApplicationSelection={report:beautyApplicationKey(found.result),category:data.category};
  render();
  document.getElementById('beauty-application-tab-'+data.category)?.focus({preventScroll:true});
};
ACTIONS['beauty-application-pair']=data=>{
  const found=beautyResolveColor(data);if(!found)return;
  const pair=beautyApplicationPairs(found.season)[Number(data.index)];if(!pair)return;
  modal('Votre association',`<div class="beauty-application-pair-detail">${beautySmallSwatches(pair)}<div>${pair.map(([name,color])=>`<p><strong>${esc(name)}</strong><span>${esc(color.toUpperCase())}</span></p>`).join('')}</div></div>`+A('Revenir aux associations','close',{},'beauty-button is-secondary'));
};
document.addEventListener('keydown',event=>{
  const tab=event.target.closest?.('.beauty-application-tab');
  if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();
  const categories=BEAUTY_APPLICATION_CATEGORIES,index=categories.findIndex(c=>c.key===tab.dataset.category);
  const next=event.key==='Home'?0:event.key==='End'?categories.length-1:(index+(event.key==='ArrowRight'?1:-1)+categories.length)%categories.length;
  ACTIONS['beauty-application-category']({...tab.dataset,category:categories[next].key});
});
