// Isolated fixtures exercise destructive actions without touching browser data.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const prefix = fs.readFileSync('tests/flow-runtime.cjs','utf8').split('let checks = 0;')[0];
const runtime = new Function('require',prefix+'\nreturn runtime;')(require);

(async () => {
  const r = runtime();
  r.run(`
    go('PRF-01',{root:true});go('PRF-07');
    assert.match(V[route](),/<button disabled [^>]*data-act="profile-remove-photos"/);
    ACTIONS['profile-remove-photos']();assert.ok(!M.dataOperation);
    memoryPhotos['photo-fixture']='blob:fixture';
    M.profile.name='Fixture';M.profile.avatar='photo-fixture';
    M.analyses=[{id:'analysis-fixture',domain:'Peau',photo:'photo-fixture',findings:['Texte à conserver']}];
    M.observations=[{id:'observation-fixture',photo:'photo-fixture',note:'Note à conserver'}];
    M.simulations=[{id:'simulation-fixture',source:'photo-fixture',result:'Résultat à conserver'}];
    assert.match(V[route](),/1 photo ajoutée, analyses conservées/);
    assert.doesNotMatch(V[route](),/<button disabled /);
    let exportBlob;
    URL.createObjectURL=blob=>{exportBlob=blob;return 'blob:export-fixture';};
    ACTIONS['profile-export']();
    assert.equal(route,'PRF-07');assert.equal(memoryPhotos['photo-fixture'],'blob:fixture');
  `);
  const exported = JSON.parse(await r.run('exportBlob').text());
  assert.equal(exported.profile.name,'Fixture');
  assert.equal(exported.analyses[0].findings[0],'Texte à conserver');
  assert.equal(exported.observations[0].note,'Note à conserver');
  assert.ok(!Object.hasOwn(exported,'photos'),'export must not embed imported images');
  r.run(`
    ACTIONS['profile-remove-photos']();
    assert.equal(memoryPhotos['photo-fixture'],'blob:fixture','opening confirmation must not delete');
    assert.match(document.getElementById('overlay').innerHTML,/Supprimer les photos importées/);
    closeModal();assert.equal(memoryPhotos['photo-fixture'],'blob:fixture','cancelling must retain photos');
    ACTIONS['profile-remove-photos']();ACTIONS['execute-data']();
    assert.equal(Object.keys(memoryPhotos).length,0);
    assert.equal(M.profile.avatar,'');assert.equal(M.analyses[0].photo,'');
    assert.equal(M.profile.name,'Fixture');
    assert.equal(M.analyses[0].findings[0],'Texte à conserver');
    assert.equal(M.observations[0].note,'Note à conserver');
    assert.equal(M.simulations[0].result,'Résultat à conserver');
    assert.equal(route,'PRF-07');
    assert.match(V[route](),/<button disabled [^>]*data-act="profile-remove-photos"/);
    ACTIONS['profile-delete-open']();assert.equal(route,'PRF-09');
    back();assert.equal(route,'PRF-07');assert.equal(M.profile.name,'Fixture');
    go('PRF-11',{document:'Données'});assert.equal(M.documentTab,'Données');
    back();assert.equal(route,'PRF-07');
    back();assert.equal(route,'PRF-01');
  `);
  console.log('Profile data: empty/imported states, JSON export, confirmation/cancel, photo removal preserving reports and notes, and navigation passed.');
})().catch(error=>{console.error(error);process.exitCode=1;});
