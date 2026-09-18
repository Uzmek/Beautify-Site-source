const fs = require('node:fs');
const assert = require('node:assert/strict');
const prefix = fs.readFileSync('tests/flow-runtime.cjs','utf8').split('let checks = 0;')[0];
const runtime = new Function('require',prefix+'\nreturn runtime;')(require);
const r = runtime();

// Continuation screens retain the profile shell without changing their actions.
for (const route of ['PRF-01','PRF-02','PRF-05','PRF-06','PRF-07','PRF-09','PRF-10','PRF-11','ENT-05','ENT-06','ENT-07','ENT-08','PRE-04']) {
  assert.match(r.run(`V[${JSON.stringify(route)}]()`), /class="lg-page profile-system /, route);
}
for (const route of ['ACC-01','ANA-01','PRE-01']) {
  assert.doesNotMatch(r.run(`V[${JSON.stringify(route)}]()`), /class="lg-page profile-system /, route);
}
for (const state of ['free','active','cancelled','pending','failed','expired','unavailable']) {
  r.run(`M.subscription.status=${JSON.stringify(state)}`);
  const root = r.run('profileStatusBadge()');
  const access = r.run("profileStatusBadge('pa-status')");
  const normalize = html => html.replace('class="pf-status ','class="pa-status ').replace(/bi-\d+/g,'bi-shared');
  assert.equal(normalize(root),normalize(access),'same label, icon and state markup');
  assert.equal(r.run('M.subscription.status'),state,'presentation preserves entitlements');
}
r.run(`
  assert.equal(profileReferenceArt('crown').match(/src="([^"]+)/)[1],accessArt('crown').match(/src="([^"]+)/)[1]);
  assert.equal(accessArt('crown').match(/src="([^"]+)/)[1],helpReferenceArt('crown').match(/src="([^"]+)/)[1]);
  assert.equal(profileReferenceArt('photos').match(/src="([^"]+)/)[1],helpReferenceArt('photo').match(/src="([^"]+)/)[1]);
  M.profile.email='<script>unsafe</script>';
  assert.match(V['PRE-04'](),/&lt;script&gt;/);
  assert.doesNotMatch(V['PRE-04'](),/<script>/);
  assert.match(V['PRE-04'](),/data-act="restore-access"/);
  assert.match(V['PRE-04'](),/data-go="PRF-06"/);
  assert.match(V['PRE-04'](),/data-go="ENT-06"/);
`);
console.log('Profile system: all continuation screens, isolated scope, shared states/artwork, safe restoration content and actions passed.');
