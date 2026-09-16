const fs = require('node:fs');
const assert = require('node:assert/strict');
const prefix = fs.readFileSync('tests/flow-runtime.cjs','utf8').split('let checks = 0;')[0];
const runtime = new Function('require',prefix+'\nreturn runtime;')(require);
// User explicitly confirmed the supplied Mon compte / Sans compte reference copy.
const r = runtime();
for (const [status,label,cta] of [
  ['free','Découverte','Découvrir Beautify Plus'],
  ['active','Actif','Gérer mon abonnement'],
  ['cancelled','Renouvellement désactivé','Gérer mon abonnement'],
  ['pending','Activation en attente','Vérifier mon accès'],
  ['failed','Activation non confirmée','Découvrir Beautify Plus'],
  ['expired','Accès expiré','Découvrir Beautify Plus']
]) {
  r.run(`M.subscription.status=${JSON.stringify(status)};`);
  const html = r.run(`V['PRF-01']()`);
  assert.ok(html.includes(label),status);
  assert.ok(html.includes(cta),status);
  assert.equal(html.includes('pf-status is-active'),status==='active');
  assert.equal(r.run('M.subscription.status'),status,'render must not grant access');
}
r.run(`
  M.profile.name='<script>alert(1)</script>';M.profile.connected=true;
  assert.match(V['PRF-01'](),/&lt;script&gt;/);assert.doesNotMatch(V['PRF-01'](),/<script>/);
  assert.match(V['PRF-01'](),/Connecté/);
  M.profile.name='';M.profile.connected=false;
  assert.match(V['PRF-01'](),/Invité/);assert.match(V['PRF-01'](),/Sans compte/);
  go('PRF-01',{root:true});
  for(const target of ['PRF-02','PRF-06','PRF-07','PRF-10']) {
    assert.ok(V['PRF-01']().includes('data-go="'+target+'"'));
    go(target);assert.equal(route,target);back();assert.equal(route,'PRF-01');
  }
`);
console.log('Profile reference: six entitlement states, real account data, escaped names, unchanged destinations and return navigation passed.');
