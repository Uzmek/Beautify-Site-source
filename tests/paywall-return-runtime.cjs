// Checkout continuation through the actual UI handlers, with DOM/history doubles.
const fs=require('node:fs');
const prefix=fs.readFileSync('tests/flow-runtime.cjs','utf8').split('let checks = 0;')[0];
const runtime=new Function('require',prefix+'\nreturn runtime;')(require);
let checks=0;
function test(name,source){try{runtime().run(source);checks++;}catch(error){error.message=name+': '+error.message;throw error;}}
const complete=domain=>`ACTIONS['studio-analysis']({domain:'${domain}'});F.consent({consent:true});M.draft.photo='portrait';M.draft.answers=canonicalEngineAnswers(M.draft.domain);ACTIONS['canonical-analyze-photo']();ACTIONS['finish-analysis']();`;
test('paywall unlocks the selected offer without a confirmation page',complete('Cheveux')+`
  const id=report().id;go('PRE-01');ACTIONS.offer({value:'monthly'});
  assert.equal(M.subscription.offer,'monthly');
  const html=V['PRE-01']();assert.match(html,/<button[^>]+data-act="subscribe"[^>]*aria-label="Débloquer Beautify Plus"/);
  assert.ok(!html.includes('data-go="PRE-02"'));assert.ok(html.includes('aucun débit réel'));
  ACTIONS.subscribe();assert.equal(route,'ANA-09');assert.equal(report().id,id);assert.equal(M.subscription.offer,'monthly');
`);
test('obsolete confirmation links return to the offers without activating access',complete('Cheveux')+`
  go('PRE-01');const origin=M.premiumReturnState.route;go('PRE-02');
  assert.equal(route,'PRE-01');assert.equal(canonicalOwned(),false);assert.equal(M.premiumReturnState.route,origin);
  assert.equal(V['PRE-02'],undefined);assert.ok(!FLOW_INDEX.some(page=>page.id==='PRE-02'));
  assert.ok(!V[route]().includes('Confirmer mon choix'));ACTIONS['premium-return']();assert.equal(route,origin);
`);
for(const domain of ['Cheveux','Colorimétrie','Peau'])test(domain+' payment returns immediately to the same report',complete(domain)+`
  const originalId=report().id;M.canonicalReportStep=1;render();go('PRE-01');
  const oldCheckout=snapshot();ACTIONS.subscribe();
  assert.equal(route,'ANA-09');assert.equal(report().id,originalId);assert.equal(M.canonicalReportStep,1);
  assert.ok(V[route]().includes('canonical-report-panel'));assert.ok(!V[route]().includes('Gérer mon accès'));
  assert.equal(M.premiumReturnState,null);assert.ok(trail.every(state=>!state.route.startsWith('PRE-')));
  const stateAfter=JSON.stringify(snapshot());ACTIONS.subscribe();assert.equal(JSON.stringify(snapshot()),stateAfter);
  restoreState(oldCheckout);assert.equal(route,'ANA-09');assert.equal(report().id,originalId);assert.ok(!V[route]().includes('Confirmer mon choix'));
`);
test('pending purchase resumes only after confirmation succeeds',complete('Peau')+`
  const id=report().id;go('PRE-01');M.scenario='pending';ACTIONS.subscribe();
  assert.equal(route,'PRE-03');assert.equal(skinRoutines().length,0);assert.equal(canonicalOwned(),false);
  assert.ok(!V[route]().includes('Gérer mon accès'));M.scenario='offline';ACTIONS['subscription-check']();assert.equal(route,'PRE-03');
  M.scenario='normal';ACTIONS['subscription-check']();assert.equal(route,'ANA-09');assert.equal(report().id,id);
  assert.equal(skinRoutines().length,2);assert.ok(V[route]().includes('skin-check-step'));
`);
test('failed purchase keeps the original destination when retrying',complete('Colorimétrie')+`
  const id=report().id;go('PRE-01');M.scenario='error';ACTIONS.subscribe();
  assert.equal(route,'PRE-03');assert.equal(canonicalOwned(),false);assert.ok(!V[route]().includes('Gérer mon accès'));
  go('PRE-01');M.scenario='normal';ACTIONS.subscribe();assert.equal(route,'ANA-09');assert.equal(report().id,id);
`);
const blockedCut=`go('SAV-01',{root:true});ACTIONS['hair-more']();M.hairGenerations={tier:'free',used:1,limit:1,reset:'2099-01-01'};M.simulationPhoto='photo-selected';memoryPhotos['photo-selected']='blob:my-selected-photo';ACTIONS['haircut-simulate']({id:'curly-shag'});`;
test('quota upgrade reopens the chosen haircut with its photo without spending a generation',blockedCut+`
  assert.equal(route,'PRE-01');assert.equal(M.premiumIntent.id,'curly-shag');ACTIONS.subscribe();
  assert.equal(route,'HAI-02');assert.equal(M.haircutSelected,'curly-shag');assert.equal(M.simulationPhoto,'photo-selected');
  const html=document.getElementById('overlay').innerHTML;
  assert.ok(html.includes('Préparer mon essai'));assert.ok(html.includes('blob:my-selected-photo'));assert.ok(html.includes('data-id="curly-shag"'));
  assert.equal(M.hairGenerations.used,0);assert.equal(M.hairGenerations.limit,10);assert.equal(M.simulations.length,0);assert.equal(M.premiumIntent,null);
`);
test('a photo removed during checkout is requested again, without substitution',blockedCut+`
  delete memoryPhotos['photo-selected'];ACTIONS.subscribe();assert.equal(route,'HAI-02');
  const html=document.getElementById('overlay').innerHTML;assert.ok(html.includes('Choisir ma photo'));assert.ok(!html.includes('Générer cette coupe'));
  assert.equal(M.hairGenerations.used,0);assert.equal(M.haircutSelected,'curly-shag');
`);
test('closing a quota paywall cannot leak the haircut into a later profile purchase',blockedCut+`
  ACTIONS['premium-return']();assert.equal(route,'HAI-02');assert.equal(M.premiumIntent,null);
  go('PRF-06');go('PRE-01');ACTIONS.subscribe();assert.equal(route,'PRF-06');assert.equal(document.getElementById('overlay').innerHTML,'');
`);
test('opening an obsolete success URL while subscribed resumes the last activity',complete('Cheveux')+`
  go('PRE-01');ACTIONS.subscribe();const id=report().id;go('PRE-03');
  assert.equal(route,'ANA-09');assert.equal(report().id,id);assert.ok(!V[route]().includes('Gérer mon accès'));
`);
console.log(checks+' direct payment continuation checks passed.');
