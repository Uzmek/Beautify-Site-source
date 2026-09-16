// Exercise information navigation with the same scripts as the application.
const fs = require('node:fs');
const prefix = fs.readFileSync('tests/flow-runtime.cjs', 'utf8').split('let checks = 0;')[0];
const runtime = new Function('require', prefix + '\nreturn runtime;')(require);
const r = runtime();
r.run(`
  go('PRF-01', {root:true});
  for (const document of ['À propos','Données','Abonnement','Crédits']) {
    go('PRF-11', {document});
    const html = V[route]();
    assert.equal(route, 'PRF-11');
    assert.equal((html.match(/aria-expanded="true"/g)||[]).length, 1);
    assert.ok(html.includes('data-document="'+document+'" aria-expanded="true"'));
    back();
    assert.equal(route, 'PRF-01');
  }
  go('PRF-11', {document:'À propos'});
  ACTIONS['profile-document-toggle']({document:'Données'});
  assert.equal(route, 'PRF-11');
  assert.equal(M.documentTab, 'Données');
  assert.equal((V[route]().match(/aria-expanded="true"/g)||[]).length, 1);
  ACTIONS['profile-document-toggle']({document:'Données'});
  assert.doesNotMatch(V[route](), /aria-expanded="true"/);
  render();
  assert.doesNotMatch(document.getElementById('app').innerHTML, /aria-expanded="true"/);
  ACTIONS['profile-document-toggle']({document:'Crédits'});
  assert.equal(M.documentTab, 'Crédits');
  ACTIONS['profile-document-toggle']({document:'constructor'});
  assert.equal(M.documentTab, 'Crédits');
  assert.match(V[route](), /data-act="profile-contact-open"/);
  back();
  assert.equal(route, 'PRF-01');
`);
console.log('Profile information: direct links, exclusive expansion, collapse, rerender, invalid selection and back navigation passed.');
