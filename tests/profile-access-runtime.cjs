const fs = require('node:fs');
const assert = require('node:assert/strict');
const prefix = fs.readFileSync('tests/flow-runtime.cjs','utf8').split('let checks = 0;')[0];
const runtime = new Function('require',prefix+'\nreturn runtime;')(require);
const r = runtime();
for (const [status,label,action] of [
  ['active','Actif','manage-subscription'],['cancelled','Renouvellement désactivé','manage-subscription'],
  ['free','Découverte','PRE-01'],['pending','Activation en attente','subscription-check'],
  ['failed','Activation non confirmée','PRE-01'],['expired','Accès expiré','PRE-01']
]) {
  r.run(`M.subscription.status=${JSON.stringify(status)};studioEnsure();`);
  const before = r.run('JSON.stringify(M.subscription)');
  const html = r.run(`V['PRF-06']()`);
  assert.ok(html.includes(label),status);
  assert.ok(html.includes(`="${action}"`),status);
  assert.equal(html.includes('pa-status is-active'),status==='active');
  assert.equal(r.run('JSON.stringify(M.subscription)'),before,'render preserves entitlement');
}
r.run(`
  M.subscription.status='active';studioEnsure();M.hairGenerations.used=5;
  go('PRF-01',{root:true});go('PRF-06');
  assert.match(V[route](),/aria-valuenow="5"/);
  assert.match(V[route](),/aria-valuemax="10"/);
  assert.equal((V[route]().match(/class="is-filled"/g)||[]).length,5);
  assert.equal((V[route]().match(/data-act="manage-subscription"/g)||[]).length,1);
  ACTIONS['manage-subscription']();
  assert.match(document.getElementById('overlay').innerHTML,/Désactiver le renouvellement/);
  closeModal();assert.equal(route,'PRF-06');
  go('PRE-04');assert.equal(route,'PRE-04');back();assert.equal(route,'PRF-06');
  go('PRF-11',{document:'Abonnement'});assert.equal(M.documentTab,'Abonnement');
  back();assert.equal(route,'PRF-06');back();assert.equal(route,'PRF-01');
  go('PRF-06');ACTIONS['subscription-status']({status:'cancelled'});
  assert.match(V[route](),/Renouvellement désactivé/);
  assert.match(V[route](),/aria-valuenow="5"/);
  M.hairGenerations.used=10;assert.match(V[route](),/aria-valuenow="0"/);
  assert.equal((V[route]().match(/class="is-filled"/g)||[]).length,0);
  M.hairGenerations.used=0;assert.match(V[route](),/aria-valuenow="10"/);
  M.subscription.status='pending';M.scenario='offline';ACTIONS['subscription-check']();
  assert.equal(M.subscription.status,'pending');
  M.scenario='normal';ACTIONS['subscription-check']();assert.equal(M.subscription.status,'active');
`);
console.log('Access: six entitlement states, live 0/5/10 quota, manage dialog, cancellation, restoration destination, information topic, pending check and back navigation passed.');
