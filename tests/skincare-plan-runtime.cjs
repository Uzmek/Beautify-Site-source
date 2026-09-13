// Exercise the actual application scripts; these are behavior tests, not screenshots.
const fs = require('node:fs');
const prefix = fs.readFileSync('tests/flow-runtime.cjs','utf8').split('let checks = 0;')[0];
const runtime = new Function('require',prefix+'\nreturn runtime;')(require);
let checks=0;
function test(name,source){try{runtime().run(source);checks++;}catch(error){error.message=name+': '+error.message;throw error;}}
const analysis=`ACTIONS['studio-analysis']({domain:'Peau'});F.consent({consent:true});M.draft.photo='portrait';M.draft.answers=canonicalEngineAnswers('Peau');ACTIONS['canonical-analyze-photo']();ACTIONS['finish-analysis']();`;
const own=`ACTIONS['skin-open-routine']({moment:'Matin'});ACTIONS['skin-own-routine']();`;

test('first free analysis retains its paywall; unlock produces two immediately usable routines',analysis+`
  assert.equal(route,'ANA-09');assert.equal(skinRoutines().length,0);
  go('PRE-01');ACTIONS['premium-return']();assert.equal(route,'ANA-09');assert.equal(skinRoutines().length,0);
  go('PRE-01');go('PRE-02');ACTIONS.subscribe();assert.equal(route,'ANA-09');
  assert.ok(skinRoutine('Matin'));assert.ok(skinRoutine('Soir'));assert.equal(report().skinRoutineStatus,'ready');
  const page=V[route]();assert.ok(page.includes('skin-check-step'));assert.ok(!page.includes('Utiliser cette routine'));
  const morning=skinRoutine('Matin'),first=skinSteps(morning)[0];
  ACTIONS['skin-check-step']({routine:morning.id,step:first.id});assert.equal(skinDone(morning,first),true);
  go('ACC-01',{root:true});ACTIONS['skin-home-moment']({value:'Matin'});assert.equal(skinRoutine('Matin').id,morning.id);
  assert.ok(V[route]().includes('data-motion-value="1">1</span> / 3 soins faits'));assert.equal(skinSession(skinRoutine('Soir')),undefined);
`);
test('an existing subscriber receives the routine on completion without an activation screen',`M.subscription.status='active';`+analysis+`
  assert.equal(route,'ANA-10');assert.equal(skinRoutines().length,2);assert.ok(V[route]().includes('sc-live-report'));
  const before=JSON.stringify(M.routines);ACTIONS['finish-analysis']();V[route]();uxActivatePremium();
  assert.equal(JSON.stringify(M.routines),before);assert.equal(skinRoutines().length,2);
`);
for(const scenario of ['error','pending'])test(scenario+' checkout cannot prematurely create routines',analysis+`
  go('PRE-01');go('PRE-02');M.scenario='${scenario}';ACTIONS.subscribe();assert.equal(skinRoutines().length,0);
  assert.equal(canonicalOwned(),false);
`);
test('a new analysis preserves custom products, order, frequency and completed care',own+`
  const morning=skinRoutine('Matin'),first=skinSteps(morning)[0];
  ACTIONS['skin-replace-open']({routine:morning.id,step:first.id});F['skin-product']({productName:'Gel personnel',brand:'Ma marque'});
  ACTIONS['skin-step-frequency']({routine:morning.id,step:first.id,value:'days'});
  ACTIONS['skin-check-all']({routine:morning.id});
  const before=JSON.stringify(morning),sessions=JSON.stringify(M.sessions);M.subscription.status='active';
`+analysis+`
  assert.equal(JSON.stringify(morning),before);assert.equal(JSON.stringify(M.sessions),sessions);
  assert.equal(report().skinRoutineStatus,'review');assert.equal(skinRoutine('Soir'),undefined);
  const plan=JSON.stringify(report().skinPlan);ACTIONS['skin-review-plan']({id:report().id});
  ACTIONS['skin-proposal-keep']({id:report().id});assert.equal(JSON.stringify(morning),before);assert.equal(JSON.stringify(report().skinPlan),plan);
  assert.equal(report().skinRoutineStatus,'kept');assert.equal(M.skinPlanReview,null);
`);
test('only selected missing care is added, never duplicates or overwrites a personal product',own+`
  const morning=skinRoutine('Matin'),cleanser=skinSteps(morning)[0];
  ACTIONS['skin-replace-open']({routine:morning.id,step:cleanser.id});F['skin-product']({productName:'Mon gel'});
  const kept=JSON.stringify(cleanser);M.subscription.status='active';
`+analysis+`
  const record=report(),savedSnapshot=JSON.stringify(record.skinPlan);ACTIONS['skin-review-plan']({id:record.id});
  for(const key of [...M.skinPlanReview.selected])if(key!=='Soir:moisturize')ACTIONS['skin-proposal-toggle']({id:record.id,key});
  ACTIONS['skin-proposal-apply']({id:record.id});
  assert.equal(JSON.stringify(cleanser),kept);assert.equal(skinSteps(skinRoutine('Soir')).length,1);
  assert.equal(skinSteps(skinRoutine('Soir'))[0].type,'moisturize');
  assert.equal(JSON.stringify(record.skinPlan),savedSnapshot);assert.equal(record.skinRoutineStatus,'applied');
  const after=JSON.stringify(M.routines);ACTIONS['skin-proposal-apply']({id:record.id});assert.equal(JSON.stringify(M.routines),after);
`);
test('a historical skin entry opens its dated bilan and keeps the active routine synchronized',`M.subscription.status='active';`+analysis+`
  const older=report(),savedSnapshot=JSON.stringify(older.skinPlan);
  const r=skinRoutine('Matin');ACTIONS['skin-replace-open']({routine:r.id,step:skinSteps(r)[0].id});F['skin-product']({productName:'Gel actuel'});
`+analysis+`
  const before=JSON.stringify(M.routines);ACTIONS['lg-history-report-open']({id:older.id,domain:'Peau'});
  let html=V[route]();assert.ok(html.includes('sb-reference'));assert.equal(M.canonicalReportStep,2);
  assert.equal(JSON.stringify(older.skinPlan),savedSnapshot);assert.equal(JSON.stringify(M.routines),before);
  ACTIONS['ss-tab']({value:'Matin'});html=V[route]();assert.ok(html.includes('Routine actuelle'));assert.ok(html.includes('Gel actuel'));assert.ok(html.includes('Bilan du'));
`);
test('selected weekdays determine visible care and all-done counts, while optional care stays optional',own+`
  const r=skinRoutine('Matin');ACTIONS['skin-add-type']({routine:r.id,type:'mask'});F['skin-product']({productName:'Mon masque'});
  const mask=skinSteps(r).find(step=>step.type==='mask'),day=new Date(DATE()+'T12:00:00').getDay();
  ACTIONS['skin-step-frequency']({routine:r.id,step:mask.id,value:'days'});
  ACTIONS['skin-step-day']({routine:r.id,step:mask.id,day:(day+1)%7});ACTIONS['skin-step-day']({routine:r.id,step:mask.id,day});
  assert.equal(skinDue(mask),false);assert.equal(skinTodaySteps(r).length,3);assert.ok(!skinDailyBody(r).includes('Mon masque'));
  ACTIONS['skin-check-all']({routine:r.id});assert.equal(skinSession(r).steps.length,3);assert.equal(sessionComplete(skinSession(r)),true);
  const NativeDate=Date;Date=class extends NativeDate{constructor(...args){super(...(args.length?args:[NativeDate.now()+86400000]));}static now(){return NativeDate.now()+86400000;}};
  assert.equal(skinTodaySteps(r).length,4);assert.equal(skinCounted(r).length,4);assert.ok(skinDailyBody(r).includes('Mon masque'));
  ACTIONS['skin-step-frequency']({routine:r.id,step:mask.id,value:'needed'});ACTIONS['skin-check-all']({routine:r.id});
  assert.equal(skinSession(r).steps.length,3);assert.equal(skinDone(r,mask),false);
`);
test('a selected-day routine cannot accidentally have zero days',own+`
  const r=skinRoutine(),step=skinSteps(r)[0];ACTIONS['skin-step-frequency']({routine:r.id,step:step.id,value:'days'});
  const day=step.days[0];ACTIONS['skin-step-day']({routine:r.id,step:step.id,day});assert.equal(step.days.length,1);
  ACTIONS['skin-step-day']({routine:r.id,step:step.id,day:99});assert.equal(step.days.length,1);
`);
test('one saved product may be used in both moments with independent completion',own+`
  const morning=skinRoutine(),step=skinSteps(morning)[1];ACTIONS['skin-replace-open']({routine:morning.id,step:step.id});F['skin-product']({productName:'Ma crème',brand:'Ma marque'});
  const product=step.product;ACTIONS['skin-moment']({value:'Soir'});ACTIONS['skin-own-routine']();const evening=skinRoutine(),pm=skinSteps(evening)[1];
  ACTIONS['skin-replace-open']({routine:evening.id,step:pm.id});ACTIONS['skin-product-select']({id:product.id});
  assert.equal(M.skinCareProducts.length,1);assert.equal(pm.product.id,product.id);
  ACTIONS['skin-check-step']({routine:morning.id,step:step.id});assert.equal(skinDone(morning,step),true);assert.equal(skinDone(evening,pm),false);
`);
test('replacement preserves the used product for today and takes effect the next day',own+`
  const r=skinRoutine(),step=skinSteps(r)[0];ACTIONS['skin-replace-open']({routine:r.id,step:step.id});F['skin-product']({productName:'Ancien gel'});
  ACTIONS['skin-check-step']({routine:r.id,step:step.id});const savedSnapshot=JSON.stringify(skinSession(r).skinEntries);
  ACTIONS['skin-replace-open']({routine:r.id,step:step.id});F['skin-product']({productName:'Nouveau gel'});
  assert.equal(skinRecordedProduct(r,step).name,'Ancien gel');assert.equal(JSON.stringify(skinSession(r).skinEntries),savedSnapshot);
  const NativeDate=Date;Date=class extends NativeDate{constructor(...args){super(...(args.length?args:[NativeDate.now()+86400000]));}static now(){return NativeDate.now()+86400000;}};
  assert.ok(skinDailyBody(r).includes('Nouveau gel'));assert.equal(skinDone(r,step),false);
  ACTIONS['skin-check-step']({routine:r.id,step:step.id});assert.equal(skinRecordedProduct(r,step).name,'Nouveau gel');
`);
test('deleting the active routines is not undone when an analysis is reopened',`M.subscription.status='active';`+analysis+`
  const record=report();M.dataOperation={type:'Retirer',categories:['Routines']};ACTIONS['execute-data']();assert.equal(M.routines.length,0);
  assert.equal(skinPrepareRoutine(record),false);ACTIONS['lg-history-report-open']({id:record.id,domain:'Peau'});
  assert.equal(M.routines.length,0);assert.ok(V[route]().includes('sb-reference'));
  ACTIONS['ss-tab']({value:'Matin'});assert.ok(V[route]().includes('Revoir la proposition'));
`);
test('the empty evening call to action opens a proposal instead of looping on the empty screen',own+`M.subscription.status='active';`+analysis+`
  ACTIONS['skin-open-routine']({moment:'Soir'});assert.equal(skinRoutine('Soir'),undefined);
  ACTIONS['skin-apply-plan']({moment:'Soir'});assert.ok(document.getElementById('overlay').innerHTML.includes('skin-proposal-apply'));
  ACTIONS['skin-proposal-apply']({id:report().id});assert.ok(skinRoutine('Soir'));
  assert.ok(V[route]().includes('skin-check-step'));assert.equal(document.getElementById('overlay').innerHTML,'');
`);
console.log(checks+' automatic routine and daily care checks passed.');
