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
    assert.equal((html.match(/aria-pressed="true"/g)||[]).length, 1);
    assert.ok(html.includes('<h2>'+document+'</h2>'));
    back();
    assert.equal(route, 'PRF-01');
  }
  go('PRF-11', {document:'À propos'});
  ACTIONS.choice({key:'documentTab',value:'Données'});
  assert.equal(route, 'PRF-11');
  assert.equal(M.documentTab, 'Données');
  render();
  assert.ok(document.getElementById('app').innerHTML.includes('<h2>Données</h2>'));
  ACTIONS.choice({key:'documentTab',value:'Données'});
  assert.ok(V[route]().includes('<h2>Données</h2>'));
  ACTIONS.choice({key:'documentTab',value:'Crédits'});
  assert.equal(M.documentTab, 'Crédits');
  assert.doesNotMatch(V[route](), /data-go="PRF-10"/);
  ACTIONS.choice({key:'documentTab',value:'Abonnement'});
  assert.match(V[route](), /data-go="PRF-10"/);
  back();
  assert.equal(route, 'PRF-01');
`);
console.log('Profile information: direct links, topic selection, repeated selection, rerender, contact destination and back navigation passed.');
