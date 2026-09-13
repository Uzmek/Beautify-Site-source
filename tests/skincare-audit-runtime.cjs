// Targeted regressions against the scripts actually loaded by index.html.
const fs = require('node:fs');
const prefix = fs.readFileSync('tests/flow-runtime.cjs', 'utf8').split('let checks = 0;')[0];
const runtime = new Function('require', prefix + '\nreturn runtime;')(require);
let checks = 0;
function test(name, source) {
  try { runtime().run(source); checks++; }
  catch (error) { error.message = name + ': ' + error.message; throw error; }
}
const ownRoutine = `go('ACC-01',{root:true});ACTIONS['skin-open-routine']({moment:'Matin'});ACTIONS['skin-own-routine']();`;

test('selecting the current product preserves completion; a replacement preserves the product already used', ownRoutine + `
  const r=skinRoutine(),step=skinSteps(r)[0];
  ACTIONS['skin-replace-open']({routine:r.id,step:step.id});
  F['skin-product']({productName:'Mon gel personnel',brand:'Ma marque'});
  ACTIONS['skin-check-all']({routine:r.id});
  const before=JSON.stringify(skinSession(r)),version=r.version;
  ACTIONS['skin-replace-open']({routine:r.id,step:step.id});
  ACTIONS['skin-product-select']({id:step.product.id});
  assert.equal(JSON.stringify(skinSession(r)),before);
  assert.equal(r.version,version);assert.equal(sessionComplete(skinSession(r)),true);
  assert.equal(document.getElementById('overlay').innerHTML,'');assert.equal(M.skinProductPicker,null);
  ACTIONS['skin-replace-open']({routine:r.id,step:step.id});
  F['skin-product']({productName:'  Mon gel personnel ',brand:'Ma marque'});
  assert.equal(JSON.stringify(skinSession(r)),before);assert.equal(M.skinCareProducts.length,1);
  ACTIONS['skin-replace-open']({routine:r.id,step:step.id});
  ACTIONS['skin-product-select']({id:'skin-example-lait-nettoyant'});
  assert.equal(skinDone(r,step),true);
  assert.equal(skinSession(r).steps.filter(value=>value==='done').length,3);
  assert.equal(skinRecordedProduct(r,step).name,'Mon gel personnel');
  assert.equal(step.product.name,'Lait nettoyant');
`);

test('past session detail and resumption retain distinct product and brand snapshots', ownRoutine + `
  const r=skinRoutine();
  for(const [name,brand] of [['Sérum <A>','Marque & A'],['Sérum B','Marque B']]){
    ACTIONS['skin-add-type']({routine:r.id,type:'serum'});
    F['skin-product']({productName:name,brand});
  }
  ACTIONS['skin-check-all']({routine:r.id});
  const past=skinSession(r),before=JSON.stringify(past),serum=skinSteps(r).find(step=>step.type==='serum');
  const NativeDate=Date;
  Date=class extends NativeDate{constructor(...args){super(...(args.length?args:[NativeDate.now()+86400000]));}static now(){return NativeDate.now()+86400000;}};
  ACTIONS['skin-replace-open']({routine:r.id,step:serum.id});
  F['skin-product']({productName:'Nouveau sérum',brand:'Nouvelle marque'});
  ACTIONS['skin-view-progress']();ACTIONS['session-detail']({id:past.id});
  const detail=document.getElementById('overlay').innerHTML;
  for(const text of ['Sérum &lt;A&gt;','Marque &amp; A','Sérum B','Marque B',SKIN_TYPES.serum.instruction])assert.ok(detail.includes(text),text);
  assert.ok(!detail.includes('Nouveau sérum'));assert.ok(!detail.includes('Sérum <A>'));
  ACTIONS['session-resume']({id:past.id});
  assert.equal(route,'ROU-04');assert.equal(M.context.sessionDate,past.date);
  const resumed=V[route]();
  for(const text of ['Sérum &lt;A&gt;','Marque &amp; A','Sérum B','Marque B',SKIN_TYPES.serum.instruction])assert.ok(resumed.includes(text),text);
  assert.ok(!resumed.includes('Nouveau sérum'));
  assert.equal(JSON.stringify(past),before);
`);

test('older sessions without product snapshots retain their recorded instruction', `
  const r=M.routines[0],s=routineSession(r,addDays(DATE(),-1));
  s.steps[0]='done';s.confirmed=true;
  ACTIONS['session-detail']({id:s.id});
  assert.ok(document.getElementById('overlay').innerHTML.includes(s.labels[0]));
  ACTIONS['session-resume']({id:s.id});
  assert.ok(V[route]().includes(s.labels[0]));assert.ok(!V[route]().includes('undefined'));
`);

for(const [moment,count] of [['Matin',3],['Soir',2]]){
  test('home product creation opens the first product picker for '+moment, `
    go('ACC-01',{root:true});ACTIONS['skin-home-moment']({value:'${moment}'});
    ACTIONS['skin-home-create']({moment:'${moment}'});
    const r=skinRoutine('${moment}'),steps=skinSteps(r),before=JSON.stringify(r.steps);
    assert.equal(route,'ACC-01');assert.equal(steps.length,${count});
    assert.equal(M.skinProductPicker.routine,r.id);assert.equal(M.skinProductPicker.step,steps[0].id);
    assert.ok(document.getElementById('overlay').innerHTML.includes('skin-custom-open'));
    assert.ok(document.getElementById('overlay').innerHTML.includes('sp-query'));
    ACTIONS['skin-custom-open']();F['skin-product']({productName:'Mon gel du ${moment.toLowerCase()}'});
    assert.equal(steps[0].product.name,'Mon gel du ${moment.toLowerCase()}');
    assert.equal(JSON.stringify(r.steps),before);assert.equal(M.sessions.length,0);
    assert.equal(document.getElementById('overlay').innerHTML,'');
  `);
}

test('generic own-routine creation keeps its templates and does not open a picker', ownRoutine + `
  assert.equal(skinSteps(skinRoutine()).length,3);
  assert.equal(document.getElementById('overlay').innerHTML,'');
  ACTIONS['skin-moment']({value:'Soir'});ACTIONS['skin-own-routine']();
  assert.equal(skinSteps(skinRoutine()).length,2);
  assert.equal(document.getElementById('overlay').innerHTML,'');
`);

test('saving and editing a journal note removes the finished form from return history', `
  go('ACC-01',{root:true});go('PRO-01');
  ACTIONS.choice({key:'experienceProgressTab',value:'Journal'});ACTIONS['journal-new']();
  F.observation({date:DATE(),feeling:'Bien',note:'Première note'});
  assert.equal(route,'PRO-01');assert.equal(M.lgJournal,true);
  assert.ok(trail.every(state=>state.route!=='PRO-03'));
  ACTIONS['journal-open']({id:M.observations[0].id});
  F.observation({date:DATE(),feeling:'Bien',note:'Note corrigée'});
  assert.equal(M.observations.length,1);assert.equal(M.observations[0].note,'Note corrigée');
  assert.ok(trail.every(state=>state.route!=='PRO-03'));
  for(let i=0;i<3&&route!=='ACC-01';i++){ACTIONS.back();assert.notEqual(route,'PRO-03');}
  assert.equal(route,'ACC-01');
`);

console.log(checks+' targeted skincare audit checks passed.');
