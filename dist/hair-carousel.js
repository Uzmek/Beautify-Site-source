'use strict';

// Editorial models are catalogue references, independent of the user's photo and quota.
// They are never selected from a perceived ethnicity. The automatic choice only uses
// non-sensitive hair traits already present in the hair report.
const HAIR_MODELS=[
 {id:'amina',name:'Amina'},
 {id:'mei',name:'Mei'},
 {id:'leila',name:'Leïla'},
 {id:'clara',name:'Clara'}
];
const HAIR_MODEL_BASE_TILE=studioHairTile;
function hairPreviewProfile(){
 const report=typeof hairTrialReport==='function'?hairTrialReport():null;
 return (report&&(report.hairProfile||report.answers))||M.hairProfile||{};
}
function hairSuggestedModel(){
 const texture=String(hairPreviewProfile().texture||M.prefs?.hair||'').toLocaleLowerCase('fr');
 const id=texture.includes('crép')?'amina':texture.includes('boucl')?'leila':texture.includes('raid')?'mei':'clara';
 return HAIR_MODELS.find(model=>model.id===id)||HAIR_MODELS[0];
}
function hairActiveModel(){
 const override=HAIR_MODELS.find(model=>model.id===M.hairPreviewModelOverride);
 const model=override||hairSuggestedModel();M.hairPreviewModel=model.id;return model;
}
function hairModelSource(cut,model,art=2){return '/assets/'+(art===1?'hair-models':'hair-models-v2')+'/'+model.id+'/'+cut.id+'.webp';}
function hairModelTile(cut,model=hairActiveModel(),eager=false,art=2){
 return '<img class="hair-reference hair-model-portrait'+(art===2?' hair-model-cutout':'')+'" data-model="'+model.id+'" data-cut="'+cut.id+'" src="'+hairModelSource(cut,model,art)+'" alt="'+esc(cut.name+', portrait de face')+'" width="1024" height="1024" loading="'+(eager?'eager':'lazy')+'" decoding="async" draggable="false">';
}
studioHairTile=function(c,large=false){return HAIR_TRIAL_ART_IDS.includes(c.id)?hairModelTile(c):HAIR_MODEL_BASE_TILE(c,large);};
function hairTrialRecordTile(c,x){const model=HAIR_MODELS.find(m=>m.id===x.previewModel);return model?hairModelTile(c,model,false,x.previewArt||1):HAIR_MODEL_BASE_TILE(c);}
function hairCarouselCuts(){const filter=M.hairLengthFilter||'Toutes';return STUDIO_HAIRCUTS.filter(c=>filter==='Toutes'||c.length===filter);}
function hairCarouselCurrent(){const cuts=hairCarouselCuts();return cuts.find(c=>c.id===M.hairCarouselCut)||cuts[0];}
function hairModelSummary(){
 const model=hairActiveModel(),profile=hairPreviewProfile(),texture=profile.texture&&!/sais pas/i.test(profile.texture)?String(profile.texture).toLowerCase():'';
 return '<section class="hair-model-summary"><span class="hair-model-summary-avatar" aria-hidden="true"><img src="/assets/hair-models-v2/'+model.id+'/lob-soft.webp" alt="" width="64" height="64" draggable="false"></span><span class="hair-model-summary-copy"><small>Aperçu adapté automatiquement</small><strong>'+(texture?'Selon vos cheveux '+esc(texture):'Portrait catalogue')+'</strong></span>'+A('Ajuster','hair-model-settings',{label:'Ajuster le portrait de référence'},'hair-model-adjust')+'</section>';
}
function hairModelPicker(){
 const model=hairActiveModel(),automatic=!M.hairPreviewModelOverride;
 return '<div class="hair-model-sheet"><p>La suggestion se base uniquement sur la texture de cheveux enregistrée dans votre analyse.</p><div class="hair-model-options">'+HAIR_MODELS.map(item=>A('<span class="hair-model-avatar"><img src="/assets/hair-models-v2/'+item.id+'/lob-soft.webp" alt="" width="72" height="72" draggable="false"></span><span>'+item.name+'</span>','hair-model',{id:item.id,label:'Utiliser le portrait de '+item.name,pressed:item.id===model.id&&!automatic},'hair-model-option'+(item.id===model.id&&!automatic?' is-selected':''))).join('')+'</div>'+A('Revenir à la suggestion automatique','hair-model-auto',{},'hair-model-auto'+(automatic?' is-active':''))+'</div>';
}
function hairCarouselSlide(c,index,total,current,model,clone=''){
 const cloneAttrs=clone?' data-clone="'+clone+'" aria-hidden="true"':' role="group" aria-roledescription="diapositive" aria-label="'+esc(c.name+', '+(index+1)+' sur '+total)+'" aria-current="'+(c===current)+'"';
 return '<article class="hair-carousel-slide'+(clone?' is-clone':'')+'" data-cut="'+c.id+'"'+cloneAttrs+'><div class="hair-carousel-photo">'+hairModelTile(c,model,Boolean(clone)||c===current)+'</div><div class="hair-carousel-caption"><div><h2>'+esc(c.name)+'</h2><p>'+esc(c.length)+'</p></div>'+(clone?'':A(icon('plus'),'hair-carousel-details',{id:c.id,label:'Détails de la coupe '+c.name},'hair-carousel-detail'))+'</div></article>';
}
V['HAI-02']=()=>{
 const cuts=hairCarouselCuts(),current=hairCarouselCurrent(),index=cuts.indexOf(current),model=hairActiveModel();
 const slides=cuts.length>1?hairCarouselSlide(cuts.at(-1),cuts.length-1,cuts.length,current,model,'before')+cuts.map((c,i)=>hairCarouselSlide(c,i,cuts.length,current,model)).join('')+hairCarouselSlide(cuts[0],0,cuts.length,current,model,'after'):cuts.map((c,i)=>hairCarouselSlide(c,i,cuts.length,current,model)).join('');
 return beautyPage('<div class="hair-carousel-page">'+hairTrialTitle('Votre prochaine coupe')+hairModelSummary()+
 '<div class="hair-carousel-filters" role="group" aria-label="Longueur de coupe">'+['Toutes','Très court','Court','Mi-long','Long'].map(value=>A(value,'hair-carousel-filter',{value,pressed:(M.hairLengthFilter||'Toutes')===value},'hair-length-option')).join('')+'</div>'+
 '<section class="hair-carousel-track" role="region" aria-roledescription="carrousel" aria-label="Coupes à comparer" tabindex="0">'+slides+'</section>'+
 '<div class="hair-carousel-controls">'+A(icon('back'),'hair-carousel-step',{direction:-1,label:'Coupe précédente'},'hair-carousel-arrow')+'<div><span class="hair-carousel-position" aria-live="polite" aria-atomic="true">'+(index+1)+' / '+cuts.length+'</span><progress class="hair-carousel-progress" value="'+(index+1)+'" max="'+cuts.length+'" aria-label="Position dans les coupes"></progress></div>'+A(icon('arrow'),'hair-carousel-step',{direction:1,label:'Coupe suivante'},'hair-carousel-arrow')+'</div>'+
 A('Choisir cette coupe '+icon('arrow'),'hair-carousel-pick',{id:current?.id||''},'beauty-button is-copper hair-carousel-primary')+'</div>','hair-report hair-carousel-shell');
};
ACTIONS['hair-carousel-filter']=d=>{if(!['Toutes','Très court','Court','Mi-long','Long'].includes(d.value))return;M.hairLengthFilter=d.value;M.hairCarouselCut=hairCarouselCurrent()?.id;render();document.querySelector('.hair-length-option[aria-pressed="true"]')?.focus({preventScroll:true});};
ACTIONS['hair-model']=d=>{
 const model=HAIR_MODELS.find(m=>m.id===d.id);if(!model)return;M.hairPreviewModelOverride=model.id;M.hairPreviewModel=model.id;closeModal();persist();render();
};
ACTIONS['hair-model-settings']=()=>modal('Ajuster l’aperçu',hairModelPicker());
ACTIONS['hair-model-auto']=()=>{M.hairPreviewModelOverride=null;M.hairPreviewModel=hairSuggestedModel().id;closeModal();persist();render();};
ACTIONS['hair-carousel-details']=d=>{const c=STUDIO_HAIRCUTS.find(c=>c.id===d.id);if(!c)return;modal(c.name,'<div class="hair-carousel-description"><p>'+esc(c.reason)+'</p><h3>À dire au salon</h3><p>'+esc(c.salon)+'</p></div>'+A('Choisir cette coupe','hair-carousel-select',{id:c.id},'beauty-button is-copper')+A('Fermer','close',{},'hair-report-link'));};
ACTIONS['hair-carousel-select']=d=>{if(!hairCarouselCuts().some(c=>c.id===d.id))return;M.hairCarouselCut=d.id;ACTIONS['hair-trial-select']({id:d.id});};
ACTIONS['hair-carousel-pick']=()=>{hairCarouselSync(hairCarouselTrack());const cut=hairCarouselCurrent();if(cut)ACTIONS['hair-carousel-select']({id:cut.id});};
function hairCarouselTrack(){return document.querySelector('.hair-carousel-track');}
function hairCarouselOffset(track,slide){return slide.offsetLeft-track.firstElementChild.offsetLeft;}
function hairCarouselMove(index,behavior='smooth'){
 const track=hairCarouselTrack();if(!track)return;const slides=[...track.children].filter(slide=>!slide.dataset.clone);if(!slides.length)return;
 const next=((index%slides.length)+slides.length)%slides.length,target=slides[next];M.hairCarouselCut=target.dataset.cut;
 track.scrollTo({left:hairCarouselOffset(track,target),behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':behavior});
}
ACTIONS['hair-carousel-step']=d=>{
 const track=hairCarouselTrack();if(!track)return;const slides=[...track.children],current=slides.reduce((best,s)=>Math.abs(hairCarouselOffset(track,s)-track.scrollLeft)<Math.abs(hairCarouselOffset(track,best)-track.scrollLeft)?s:best,slides[0]),direction=Number(d.direction)<0?-1:1,target=slides[Math.max(0,Math.min(slides.length-1,slides.indexOf(current)+direction))];
 if(!target)return;M.hairCarouselCut=target.dataset.cut;track.scrollTo({left:hairCarouselOffset(track,target),behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
};
function hairCarouselSync(track,save=true){
 if(!track||!track.isConnected)return;
 const slides=[...track.children],slide=slides.reduce((best,s)=>Math.abs(hairCarouselOffset(track,s)-track.scrollLeft)<Math.abs(hairCarouselOffset(track,best)-track.scrollLeft)?s:best,slides[0]);if(!slide)return;
 const realSlides=slides.filter(s=>!s.dataset.clone),index=Math.max(0,realSlides.findIndex(s=>s.dataset.cut===slide.dataset.cut));M.hairCarouselCut=slide.dataset.cut;
 slides.forEach(s=>s.setAttribute('aria-current',String(s===slide||(!s.dataset.clone&&s.dataset.cut===slide.dataset.cut))));
 const root=track.closest('.hair-carousel-page'),position=root.querySelector('.hair-carousel-position'),progress=root.querySelector('progress'),primary=root.querySelector('.hair-carousel-primary');
 if(position)position.textContent=(index+1)+' / '+realSlides.length;if(progress){progress.max=realSlides.length;progress.value=index+1;}if(primary){primary.dataset.id=slide.dataset.cut;primary.setAttribute('aria-label','Choisir '+hairCarouselCurrent().name);}
 const prev=root.querySelector('[data-direction="-1"]'),next=root.querySelector('[data-direction="1"]');if(prev)prev.disabled=false;if(next)next.disabled=false;
 if(save){persist();if(slide.dataset.clone&&realSlides[index])track.scrollTo({left:hairCarouselOffset(track,realSlides[index]),behavior:'auto'});}
}
let hairCarouselFrame=null,hairCarouselTimer=null;
document.addEventListener('scroll',e=>{
 if(!e.target.matches?.('.hair-carousel-track'))return;
 const track=e.target,schedule=window.requestAnimationFrame||((fn)=>setTimeout(fn,16));
 if(hairCarouselFrame===null)hairCarouselFrame=schedule(()=>{hairCarouselFrame=null;hairCarouselSync(track,false);});
 clearTimeout(hairCarouselTimer);hairCarouselTimer=setTimeout(()=>hairCarouselSync(track),120);
},true);
document.addEventListener('keydown',e=>{const track=e.target.closest?.('.hair-carousel-track');if(!track||e.target!==track||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();if(e.key==='Home'||e.key==='End')hairCarouselMove(e.key==='Home'?0:hairCarouselCuts().length-1);else ACTIONS['hair-carousel-step']({direction:e.key==='ArrowLeft'?-1:1});});
const HAIR_CAROUSEL_RENDER=render;
render=function(...args){const result=HAIR_CAROUSEL_RENDER(...args);const track=hairCarouselTrack();if(track){const index=hairCarouselCuts().indexOf(hairCarouselCurrent());hairCarouselMove(index,'auto');hairCarouselSync(track);}return result;};
// Freeze the catalogue model on each saved reference. Browsing another model later
// must never silently change an old preview or pretend to transform the user's photo.
const HAIR_MODEL_CONFIRM=ACTIONS['haircut-generate-confirm'];
ACTIONS['haircut-generate-confirm']=d=>{HAIR_MODEL_CONFIRM(d);if(M.haircutDraft){M.haircutDraft.previewModel=hairActiveModel().id;M.haircutDraft.previewArt=2;}};
const HAIR_MODEL_FINISH=ACTIONS['finish-haircut'];
ACTIONS['finish-haircut']=()=>{const draft=M.haircutDraft,model=draft?.previewModel;HAIR_MODEL_FINISH();const record=draft&&M.simulations.find(x=>x.id===draft.id);if(record&&model&&!record.previewModel){record.previewModel=model;record.previewArt=draft.previewArt||1;persist();render();}};
const HAIR_MODEL_RESUME=ACTIONS['hair-trial-resume'];
ACTIONS['hair-trial-resume']=()=>{if(HAIR_MODELS.some(m=>m.id===M.haircutDraft?.previewModel)){M.hairPreviewModel=M.haircutDraft.previewModel;M.hairPreviewModelOverride=M.haircutDraft.previewModel;}HAIR_MODEL_RESUME();};
