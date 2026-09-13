const fs=require('node:fs'),assert=require('node:assert/strict');
const harness=fs.readFileSync('tests/flow-runtime.cjs','utf8').split('let checks = 0;')[0];
const runtime=new Function('require',harness+'\nreturn runtime;')(require);
let checks=0;
function test(name,fn){try{fn(runtime());checks++;}catch(e){e.message=name+': '+e.message;throw e;}}
const setup=`uxActivatePremium();memoryPhotos['photo-current']='blob:current';M.simulations=[];M.hairProfile={shape:'Ovale',texture:'Ondulés',length:'Mi-longue'};M.analyses=[{id:'h',domain:'Cheveux',status:'complete',photo:'photo-current',date:DATE(),hairProfile:clone(M.hairProfile)}];M.context.analysis='h';M.hairPreviewModelOverride=null;ACTIONS['hair-trial-choose']();`;
test('hair traits choose the reference automatically while the manual fallback stays discreet',({run})=>run(setup+`
 M.hairCarouselCut='bob';const before=M.hairGenerations.used;assert.equal(hairActiveModel().id,'clara');
 const page=V['HAI-02']();assert.ok(page.includes('Aperçu adapté automatiquement'));assert.ok(!page.includes('hair-model-option'));assert.ok(!page.includes('modèle africain'));assert.equal((page.match(/class="hair-carousel-slide"/g)||[]).length,12);assert.equal((page.match(/class="hair-carousel-slide is-clone"/g)||[]).length,2);
 M.analyses[0].hairProfile.texture='Crépus';assert.equal(hairSuggestedModel().id,'amina');assert.equal((V['HAI-02']().match(/data-model="amina"/g)||[]).length,14);M.analyses[0].hairProfile.texture='Bouclés';assert.equal(hairSuggestedModel().id,'leila');M.analyses[0].hairProfile.texture='Raides';assert.equal(hairSuggestedModel().id,'mei');
 ACTIONS['hair-model']({id:'clara'});assert.equal(hairActiveModel().id,'clara');assert.equal(hairCarouselCurrent().id,'bob');assert.equal(hairCarouselCuts().length,12);assert.equal(M.hairGenerations.used,before);assert.equal(M.simulationPhoto||'','');
 ACTIONS['hair-model-auto']();assert.equal(hairActiveModel().id,'mei');
`));
test('filters retain compatible selection and never leave inaccessible selection',({run})=>run(setup+`
 M.hairCarouselCut='bob';ACTIONS['hair-carousel-filter']({value:'Court'});assert.equal(hairCarouselCurrent().id,'bob');assert.equal(hairCarouselCuts().length,2);
 ACTIONS['hair-carousel-filter']({value:'Long'});assert.equal(hairCarouselCurrent().length,'Long');assert.ok(hairCarouselCuts().every(c=>c.length==='Long'));
 ACTIONS['hair-carousel-select']({id:'bob'});assert.equal(route,'HAI-02');ACTIONS['hair-carousel-filter']({value:'Toutes'});assert.equal(hairCarouselCuts().length,12);
`));
test('select, generate and revisit retain model without changing a saved reference',({run})=>run(setup+`
 ACTIONS['hair-model']({id:'mei'});ACTIONS['hair-carousel-select']({id:'bob'});assert.equal(route,'HAI-03');assert.equal(M.haircutAnalysis,'h');assert.equal(M.simulationPhoto,'photo-current');assert.equal(M.hairGenerations.used,0);
 ACTIONS['hair-trial-create']({id:'bob'});assert.equal(M.simulations[0].previewModel,'mei');assert.equal(M.simulations[0].previewArt,2);assert.equal(M.hairGenerations.used,1);
 ACTIONS['hair-model']({id:'clara'});assert.ok(V['ESS-03']().includes('hair-models-v2/mei/bob.webp'));assert.ok(!V['ESS-03']().includes('hair-models-v2/clara'));
 const c=STUDIO_HAIRCUTS.find(c=>c.id==='bob');assert.ok(hairTrialRecordTile(c,{}).includes('tryon/bob-cutout.png'));assert.ok(hairTrialRecordTile(c,{previewModel:'mei'}).includes('/hair-models/mei/bob.webp'));
`));
test('failed preview resumes original model and charges only once on retry',({run})=>run(setup+`
 ACTIONS['hair-model']({id:'leila'});ACTIONS['hair-carousel-select']({id:'cascade'});M.scenario='error';ACTIONS['hair-trial-create']({id:'cascade'});assert.equal(M.haircutDraft.previewModel,'leila');assert.equal(M.hairGenerations.used,0);
 ACTIONS['hair-model']({id:'amina'});ACTIONS['hair-trial-resume']();assert.equal(hairActiveModel().id,'leila');assert.equal(route,'HAI-03');ACTIONS['canonical-retry-haircut']();assert.equal(M.simulations[0].previewModel,'leila');assert.equal(M.hairGenerations.used,1);
`));
test('scroll position chooses nearest card and keeps circular controls available',({run})=>run(setup+`
 {const attrs={},position={},progress={},primary={dataset:{},setAttribute:(k,v)=>attrs[k]=v},prev={},next={};
 const root={querySelector:s=>s==='.hair-carousel-position'?position:s==='progress'?progress:s==='.hair-carousel-primary'?primary:s.includes('-1')?prev:next};
 const slides=hairCarouselCuts().map((c,i)=>({dataset:{cut:c.id},offsetLeft:20+i*300,setAttribute:(k,v)=>{}}));
 const track={children:slides,firstElementChild:slides[0],scrollLeft:920,isConnected:true,closest:()=>root};
 hairCarouselSync(track);assert.equal(hairCarouselCurrent().id,slides[3].dataset.cut);assert.equal(primary.dataset.id,slides[3].dataset.cut);assert.equal(position.textContent,'4 / 12');assert.equal(progress.value,4);assert.equal(prev.disabled,false);
 track.scrollLeft=3300;hairCarouselSync(track);assert.equal(next.disabled,false);track.scrollLeft=0;hairCarouselSync(track);assert.equal(prev.disabled,false);}
`));
console.log(checks+' hair carousel checks passed');
