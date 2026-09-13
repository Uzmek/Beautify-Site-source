// Regression checks for the independently reviewed paths; simulated browser APIs.
const fs = require('node:fs');
const harness = fs.readFileSync('tests/flow-runtime.cjs', 'utf8').split('let checks = 0;')[0];
eval(harness + '\nglobalThis.auditRuntime = runtime;');
let checks = 0;
function test(name, check) {
  try { check(auditRuntime()); checks++; }
  catch (e) { e.message = name + ': ' + e.message; throw e; }
}
for (const domain of ['Cheveux', 'Colorimétrie', 'Peau']) {
  test(domain + ': browser Back then a new photo creates a distinct report', ({ run, probes, tick }) => {
    run(`go('SAV-01',{root:true});go('ANA-01');ACTIONS['studio-analysis']({domain:${JSON.stringify(domain)}});F.consent({consent:true});loadPhoto({type:'image/png',size:10},'analysis');`);
    probes.at(-1).onload(); tick(2300);
    run(`const firstReport=clone(report()),firstDraft=M.draft.id;history.back();assert.equal(route,'ANA-04');loadPhoto({type:'image/png',size:10},'analysis');`);
    probes.at(-1).onload();
    run(`assert.equal(route,'ANA-08');assert.notEqual(M.draft.id,firstDraft);assert.equal(M.draft.status,'processing');assert.notEqual(M.draft.photo,firstReport.photo);`);
    tick(2300);
    run(`assert.equal(M.analyses.length,2);assert.equal(M.draft.status,'complete');assert.notEqual(report().id,firstReport.id);assert.equal(report().photo,M.draft.photo);assert.equal(JSON.stringify(M.analyses[0]),JSON.stringify(firstReport));`);
  });
}
test('an untouched consent step does not block changing domain or claim work in progress', ({ run }) => {
  run(`go('ANA-01');ACTIONS['studio-analysis']({domain:'Cheveux'});F.consent({consent:true});back();back();assert.equal(route,'ANA-01');assert.equal(experiencePending(),false);ACTIONS['studio-analysis']({domain:'Colorimétrie'});assert.equal(route,'ANA-03');assert.equal(M.draft.domain,'Colorimétrie');assert.equal(document.getElementById('overlay').innerHTML,'');`);
});
test('deleted data cannot return through native history or a saved edit snapshot', ({ run, history }) => {
  run(`go('PRF-01',{root:true});M.profile.name='Ancien profil';go('PRF-02');const deletedSnapshot=snapshot();go('PRF-07');go('PRF-09');F['delete-account']({confirmation:'SUPPRIMER'});assert.equal(route,'ENT-02');assert.equal(trail.length,0);`);
  history.back(); history.back(); history.back();
  run(`restoreState(deletedSnapshot);assert.equal(route,'ENT-02');assert.equal(M.profile.name,'');assert.equal(M.profileEdit,null);assert.equal(Object.keys(M.formDrafts).length,0);assert.equal(trail.length,0);`);
});
test('scoped profile deletion invalidates old edit state while keeping the other data', ({ run, history }) => {
  run(`go('PRF-01',{root:true});M.profile.name='À retirer';go('PRF-02');const scopedSnapshot=snapshot();M.observations=[{id:'keep',note:'Ma note'}];go('PRF-08');M.dataOperation={type:'Retirer',categories:['Profil']};ACTIONS['execute-data']();assert.equal(route,'PRF-08');assert.equal(M.observations.length,1);assert.equal(M.profile.name,'');`);
  history.back();
  run(`restoreState(scopedSnapshot);assert.equal(M.profileEdit,null);assert.equal(M.profile.name,'');assert.equal(M.observations[0].note,'Ma note');assert.equal(route,'ACC-01');`);
});
test('reset invalidates an old profile editor without replaying its form draft', ({ run }) => {
  run(`go('PRF-01',{root:true});M.profile.name='Avant';go('PRF-02');const resetSnapshot=snapshot();M.formDrafts.profile={name:'Avant'};ACTIONS.reset();restoreState(resetSnapshot);assert.equal(route,'ENT-02');assert.equal(M.profileEdit,null);assert.equal(Object.keys(M.formDrafts).length,0);`);
});
test('same-screen controls keep focus after their markup is replaced', ({ run }) => {
  run(`go('ACC-01',{root:true});let focusCalls=0;const activeControl={dataset:{act:'skin-home-moment',value:'Soir'},closest:()=>true,matches:()=>true};document.activeElement=activeControl;const replacementControl={dataset:{act:'skin-home-moment',value:'Soir'},focus:o=>{assert.equal(o.preventScroll,true);focusCalls++;}};const originalQuery=document.querySelectorAll;document.querySelectorAll=selector=>selector==='#app button[data-act],#app button[data-go]'?[replacementControl]:[];ACTIONS['skin-home-moment']({value:'Soir'});assert.equal(focusCalls,1);document.querySelectorAll=originalQuery;`);
});
test('skin reveal shows an illustrative observation and checkout keeps the Plus name', ({ run }) => {
  run(`ACTIONS['studio-analysis']({domain:'Peau'});F.consent({consent:true});M.draft.photo='portrait';M.draft.answers=canonicalEngineAnswers('Peau');ACTIONS['canonical-analyze-photo']();ACTIONS['finish-analysis']();assert.equal(canonicalTeaser(report()).value,report().skinProfile.traits[0]);assert.match(V['ANA-09'](),/Aperçu de démonstration/);assert.match(V['PRE-01'](),/Beautify Plus/);assert.equal(V['PRE-02'],undefined);assert.equal(resolveRoute('PRE-02'),'PRE-01');`);
});
test('hair colour names no longer receive unrelated clothing swatches', ({ run }) => {
  run(`M.subscription.status='active';M.colorProfile={season:'deep_winter'};ACTIONS['studio-analysis']({domain:'Cheveux'});F.consent({consent:true});M.draft.photo='portrait';M.draft.answers=canonicalEngineAnswers('Cheveux');ACTIONS['canonical-analyze-photo']();ACTIONS['finish-analysis']();const hairColours=canonicalHairPanel('Couleur',report());assert.match(hairColours,/Noir naturel/);assert.doesNotMatch(hairColours,/#8f1f34|#a42b70/);`);
});
console.log(JSON.stringify({ checks, errors: [], scope: 'Navigation, history, copy and focus with runtime doubles' }, null, 2));
