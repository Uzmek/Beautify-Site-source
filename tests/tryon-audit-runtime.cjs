// Focused regressions for historical try-on context and return destinations.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
process.chdir(path.resolve(__dirname, '..'));
const harness = fs.readFileSync(path.join(__dirname, 'flow-runtime.cjs'), 'utf8').split('let checks = 0;')[0];
const runtime = new Function('require', harness + '\nreturn runtime;')(require);
let checks = 0;
function test(name, callback) {
  try { callback(runtime()); checks++; }
  catch (error) { error.message = name + ': ' + error.message; throw error; }
}
const historicalHair = `
  uxActivatePremium();
  memoryPhotos['photo-old']='blob:old-photo';memoryPhotos['photo-new']='blob:new-photo';
  M.hairProfile={shape:'Rond',texture:'Raides',length:'Long'};
  M.analyses=[
    {id:'hair-old',domain:'Cheveux',date:'2026-09-01',status:'complete',photo:'photo-old',faceShape:'Carré',hairProfile:{shape:'Carré',texture:'Bouclés',length:'Court'}},
    {id:'hair-new',domain:'Cheveux',date:'2026-09-07',status:'complete',photo:'photo-new',faceShape:'Rond',hairProfile:M.hairProfile}
  ];
  go('SAV-01',{root:true});ACTIONS['lg-results-domain']({domain:'Cheveux'});
  ACTIONS['lg-history-domain']({domain:'Cheveux'});
  ACTIONS['lg-history-report-open']({domain:'Cheveux',id:'hair-old'});
  ACTIONS['haircut-open']({id:'curly-shag',analysis:'hair-old'});
  ACTIONS['haircut-simulate']({id:'curly-shag',analysis:'hair-old'});
`;

test('a historical report reuses its own photo and preserves its detail context', ({ run }) => {
  run(historicalHair);
  run(`
    assert.equal(M.haircutAnalysis,'hair-old');
    assert.equal(M.haircutAnalysis,'hair-old');
    ACTIONS['haircut-use-analysis-photo']({id:'curly-shag',analysis:'hair-old'});
    assert.equal(M.simulationPhoto,'photo-old');assert.equal(report().id,'hair-old');
    assert.match(document.getElementById('app').innerHTML,/blob:old-photo/);
    assert.doesNotMatch(document.getElementById('app').innerHTML,/blob:new-photo/);
    assert.equal(M.haircutAnalysis,'hair-old');
    ACTIONS['haircut-open']({id:'curly-shag',analysis:M.haircutAnalysis});
    assert.ok(document.getElementById('overlay').innerHTML.includes(uxHairFit(STUDIO_HAIRCUTS.find(x=>x.id==='curly-shag'),M.analyses[0].hairProfile)));
    ACTIONS['haircut-generate-confirm']({id:'curly-shag',analysis:'hair-old'});
    ACTIONS['finish-haircut']();
    assert.equal(M.simulations[0].source,'photo-old');assert.equal(M.hairGenerations.used,1);
  `);
});

test('a generic catalogue try-on clears historical context and its selected photo', ({ run }) => {
  run(historicalHair);
  run(`
    ACTIONS['haircut-use-analysis-photo']({id:'curly-shag',analysis:'hair-old'});
    closeModal(false);ACTIONS['hair-more']();
    ACTIONS['haircut-open']({id:'curly-shag'});ACTIONS['haircut-simulate']({id:'curly-shag'});
    assert.equal(M.haircutAnalysis,'');assert.equal(M.simulationPhoto,'photo-new');
    assert.doesNotMatch(document.getElementById('app').innerHTML,/data-analysis="hair-old"|blob:old-photo/);
    ACTIONS['haircut-use-analysis-photo']({id:'curly-shag',analysis:''});
    assert.equal(M.simulationPhoto,'photo-new');assert.equal(M.haircutAnalysis,'');
  `);
});

test('an unavailable historical photo never falls back to another report photo', ({ run }) => {
  run(historicalHair);
  run(`
    delete memoryPhotos['photo-old'];ACTIONS['haircut-simulate']({id:'curly-shag',analysis:'hair-old'});
    assert.doesNotMatch(document.getElementById('app').innerHTML,/Réutiliser la photo de mon analyse|blob:new-photo/);
    ACTIONS['haircut-use-analysis-photo']({id:'curly-shag',analysis:'hair-old'});
    assert.ok(!M.simulationPhoto);assert.equal(M.haircutAnalysis,'hair-old');
  `);
});

test('uploading a try-on photo retains the historical report for reviewing the cut', ({ run, probes }) => {
  run(historicalHair);
  run(`loadPhoto({type:'image/png',size:1024},'simulation');`);
  probes.at(-1).onload();
  run(`
    assert.equal(M.haircutAnalysis,'hair-old');assert.ok(M.simulationPhoto);
    assert.notEqual(M.simulationPhoto,'photo-old');assert.notEqual(M.simulationPhoto,'photo-new');
    assert.equal(M.haircutAnalysis,'hair-old');
    assert.match(document.getElementById('app').innerHTML,/Changer la coupe/);
  `);
});

test('a completed try-on returns to the filtered catalogue and keeps its saved result', ({ run, tick }) => {
  run(`
    uxActivatePremium();go('SAV-01',{root:true});ACTIONS['saved-hair-sims']();ACTIONS['hair-more']();
    ACTIONS.choice({key:'hairLengthFilter',value:'Court'});
    ACTIONS['haircut-open']({id:'bob'});ACTIONS['haircut-simulate']({id:'bob'});
    M.simulationPhoto='portrait';ACTIONS['haircut-generate-confirm']({id:'bob'});ACTIONS['finish-haircut']();
    assert.equal(route,'ESS-03');assert.equal(M.simulations.length,1);assert.equal(M.hairGenerations.used,1);
    assert.ok(!trail.some(state=>state.route==='ESS-02'));ACTIONS.back();
  `);
  tick(180);
  run(`
    assert.equal(route,'HAI-03');assert.equal(M.hairLengthFilter,'Court');
    ACTIONS['saved-hair-sims']();ACTIONS['result-simulation']({id:M.simulations[0].id});
    assert.equal(route,'ESS-03');ACTIONS.back();assert.equal(route,'ESS-04');
    assert.equal(M.simulations.length,1);assert.equal(M.hairGenerations.used,1);
  `);
});

assert.equal(checks,5);
console.log(checks + ' try-on audit runtime checks passed.');
