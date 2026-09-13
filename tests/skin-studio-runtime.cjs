// Exercise long routines and guided care against the application's loaded scripts.
const fs=require('node:fs');
const prefix=fs.readFileSync('tests/flow-runtime.cjs','utf8').split('let checks = 0;')[0];
const runtime=new Function('require',prefix+'\nreturn runtime;')(require);
let checks=0;
function test(name,source){try{runtime().run(source);checks++;}catch(e){e.message=name+': '+e.message;throw e;}}
const own=`ACTIONS['skin-open-routine']({moment:'Matin'});ACTIONS['skin-own-routine']();`;
const analysis=`M.subscription.status='active';ACTIONS['studio-analysis']({domain:'Peau'});M.draft.photo='portrait';M.draft.answers=canonicalEngineAnswers('Peau');ACTIONS['canonical-analyze-photo']();ACTIONS['finish-analysis']();`;
test('24 products stay in one continuous list with safe labels and fixed actions',own+`
 const r=skinRoutine();for(let i=0;i<21;i++){ACTIONS['skin-add-type']({routine:r.id,type:'serum'});F['skin-product']({productName:'Sérum '+i+' <hydratant> '+('long '.repeat(12)),brand:'Ma marque'});}
 const steps=skinSteps(r);assert.equal(steps.length,24);const html=V[route]();
 const ids=[...html.matchAll(/data-step-id="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,24);assert.equal(new Set(ids).size,24);for(const step of steps)assert.ok(ids.includes(step.id));
 assert.ok(!html.includes('<hydratant>'));assert.ok(html.includes('ss-guide-start'));assert.ok(html.includes('skin-add-open'));
 assert.ok(html.includes('ss-product-list is-long'));assert.ok(!html.includes('ss-page'));assert.ok(html.includes('Me guider'));
 for(const step of steps.slice(5))ACTIONS['skin-remove-step']({routine:r.id,step:step.id});
 const short=V[route]();assert.equal((short.match(/data-step-id=/g)||[]).length,5);assert.ok(short.includes('ss-product-list is-short'));
`);
test('checking a lower product keeps scroll position without mixing routine or filter positions',own+`
 const r=skinRoutine(),step=skinSteps(r)[0];
 const key=r.id+':'+DATE()+':today',oldList={dataset:{ssScrollKey:key},scrollTop:640},newList={dataset:{ssScrollKey:key},scrollTop:0};
 const query=document.querySelector;let listQueries=0;
 document.querySelector=selector=>selector==='.ss-product-list[data-ss-scroll-key]'?(listQueries++===0?oldList:newList):query(selector);
 ACTIONS['skin-check-step']({routine:r.id,step:step.id});assert.equal(newList.scrollTop,640);assert.equal(skinDone(r,step),true);
 document.querySelector=query;
 const other={dataset:{ssScrollKey:r.id+':'+DATE()+':all'},scrollTop:0};skinStudioRestoreList(other);assert.equal(other.scrollTop,0);
 other.scrollTop=128;skinStudioRememberList(other);newList.scrollTop=0;skinStudioRestoreList(newList);assert.equal(newList.scrollTop,640);
`);
test('today and all filters retain off-day products without adding them to the guide',own+`
 const r=skinRoutine(),first=skinSteps(r)[0];first.frequency='days';first.days=[(new Date(DATE()+'T12:00:00').getDay()+1)%7];
 assert.ok(!V[route]().includes('data-step-id="'+first.id+'"'));
 ACTIONS['ss-filter']({routine:r.id,value:'all'});assert.ok(V[route]().includes('data-step-id="'+first.id+'"'));
 ACTIONS['ss-guide-start']({routine:r.id});assert.ok(!M.skinStudioGuide.ids.includes(first.id));
`);
test('guided skip stays undone, next is idempotent and the completion count is honest',own+`
 const r=skinRoutine(),steps=skinSteps(r);ACTIONS['ss-guide-start']({routine:r.id});
 const skip={routine:r.id,step:steps[0].id,index:0,done:'no'};ACTIONS['ss-guide-next'](skip);assert.equal(skinDone(r,steps[0]),false);
 const done={routine:r.id,step:steps[1].id,index:1,done:'yes'};ACTIONS['ss-guide-next'](done);assert.equal(skinDone(r,steps[1]),true);
 ACTIONS['ss-guide-next'](done);assert.equal(M.skinStudioGuide.index,2);assert.equal(skinDone(r,steps[2]),false);
 ACTIONS['ss-guide-next']({routine:r.id,step:steps[2].id,index:2,done:'yes'});
 assert.equal(skinSession(r).confirmed,false);assert.ok(document.getElementById('overlay').innerHTML.includes('2 soins faits sur 3'));
 ACTIONS['ss-guide-start']({routine:r.id});assert.equal(M.skinStudioGuide.ids.length,1);assert.equal(M.skinStudioGuide.ids[0],steps[0].id);
`);
test('a guide from yesterday cannot mark today and existing products stay in saved sessions',own+`
 const r=skinRoutine(),step=skinSteps(r)[0];ACTIONS['skin-replace-open']({routine:r.id,step:step.id});F['skin-product']({productName:'Mon gel'});
 ACTIONS['ss-guide-start']({routine:r.id});M.skinStudioGuide.date='2000-01-01';
 ACTIONS['ss-guide-next']({routine:r.id,step:step.id,index:0,done:'yes'});assert.equal(skinDone(r,step),false);
 ACTIONS['ss-guide-start']({routine:r.id});ACTIONS['ss-guide-next']({routine:r.id,step:step.id,index:0,done:'yes'});
 assert.equal(skinRecordedProduct(r,step).name,'Mon gel');
 ACTIONS['skin-replace-open']({routine:r.id,step:step.id});F['skin-product']({productName:'Autre gel'});assert.equal(skinRecordedProduct(r,step).name,'Mon gel');
`);
test('organizing reorders the same stable product and removal remains undoable',own+`
 const r=skinRoutine(),step=skinSteps(r)[1];ACTIONS['ss-organize-step']({routine:r.id,step:step.id});
 ACTIONS['ss-move']({routine:r.id,step:step.id,direction:'up'});assert.equal(skinSteps(r)[0].id,step.id);
 ACTIONS['skin-remove-step']({routine:r.id,step:step.id});assert.ok(!skinSteps(r).some(s=>s.id===step.id));
 ACTIONS['skin-undo-remove']();assert.equal(skinSteps(r)[0].id,step.id);
`);
test('empty routine creation chooses a placeholder product without adding a duplicate',`
 ACTIONS['skin-open-routine']({moment:'Soir'});ACTIONS['ss-create']({moment:'Soir'});
 const r=skinRoutine('Soir');assert.equal(skinSteps(r).length,2);assert.equal(M.skinProductPicker.step,skinSteps(r)[0].id);
`);
test('bilan uses saved demo scores, preserves the measured contract and rejects invalid measurements',analysis+`
 const r=report();ACTIONS['ss-tab']({value:'Bilan'});let html=V[route]();
 assert.ok(html.includes('Exemple de bilan'));assert.ok(html.includes('>78<'));assert.equal((html.match(/class="ss-metric"/g)||[]).length,3);
 r.skinScoreSource='vision/skin-v1';r.skin=clone(SKIN_SCORE_DEMO);r.skin.score=61;r.skin.metrics[0].score=53;
 html=V[route]();assert.ok(!html.includes('Exemple de bilan'));assert.ok(html.includes('>61<'));assert.ok(html.includes('>53<'));
 assert.equal((html.match(/class="ss-metric"/g)||[]).length,4);assert.ok(!html.includes('Grain de peau'));
 r.skin.score=null;assert.ok(V[route]().includes('Bilan incomplet'));assert.ok(!V[route]().includes('>78<'));
`);
test('older skin reports open on their dated bilan and keep one editable current routine',analysis+`
 const older=report();
 const morning=skinRoutine('Matin'),evening=skinRoutine('Soir'),routineCount=skinRoutines().length;
 ACTIONS['studio-analysis']({domain:'Peau'});M.draft.photo='portrait';M.draft.answers=canonicalEngineAnswers('Peau');ACTIONS['canonical-analyze-photo']();ACTIONS['finish-analysis']();
 assert.equal(skinRoutines().length,routineCount);assert.equal(skinRoutine('Matin').id,morning.id);assert.equal(skinRoutine('Soir').id,evening.id);
 ACTIONS['lg-history-report-open']({id:older.id,domain:'Peau'});assert.equal(M.canonicalReportStep,2);
 ACTIONS['ss-tab']({value:'Matin'});const html=V[route]();
 assert.ok(html.includes('Routine actuelle'));assert.ok(html.includes('Bilan du'));assert.ok(html.includes('data-act="skin-check-step"'));assert.ok(!html.includes('Routine de cette analyse'));
 assert.equal(skinRoutine('Matin').id,morning.id);
`);
test('rendered controls resolve on all three tabs and do not introduce middle dots',analysis+`
 for(const value of ['Matin','Soir','Bilan']){
  ACTIONS['ss-tab']({value});const html=V[route]();assert.ok(html.includes('ss-shell'));assert.ok(!/undefined|NaN|·/.test(html));
  for(const match of html.matchAll(/data-act="([^"]+)"/g))assert.equal(typeof ACTIONS[match[1]],'function',match[1]);
 }
`);
test('grouped navigation keeps the consulted bilan date across all three tabs',`
 const date='2026-07-08';
 for(const tab of ['Matin','Soir','Bilan']){
  const html=skinStudioShell(tab,'',{date});
  assert.ok(html.includes('datetime="'+date+'"'));assert.ok(html.includes('8 juil. 2026'));
  assert.ok(html.includes('Routine actuelle'));assert.ok(!html.includes('class="sb-date'));
  assert.equal((html.match(/role="tab"/g)||[]).length,3);
  assert.equal((html.match(/aria-selected="true"/g)||[]).length,1);
 }
 assert.ok(!skinStudioShell('Matin','',null).includes('NaN'));
`);
console.log(checks+' skin studio behavior checks passed.');
