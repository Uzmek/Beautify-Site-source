// Audit every registered view using the scripts actually loaded by index.html.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const prefix = fs.readFileSync('tests/flow-runtime.cjs', 'utf8').split('let checks = 0;')[0];
const runtime = new Function('require', prefix + '\nreturn runtime;')(require);
const ids = runtime().run('Object.keys(V)');
const wordmark = /class="(?:logo(?: |")|[^"\n]*wordmark)/;
let checks = 0;

for (const status of ['free', 'active']) {
  for (const id of ids) {
    const r = runtime();
    const html = r.run(`sample();migrate();M.subscription.status=${JSON.stringify(status)};route=${JSON.stringify(id)};V[route]();`);
    assert.equal(typeof html, 'string', id);
    if (id !== 'PRF-11') assert.doesNotMatch(html, /UZMEK/i, id + ': redundant attribution');
    if (!['ACC-01', 'ENT-02'].includes(id)) assert.doesNotMatch(html, wordmark, id + ': redundant logo');
    checks++;
  }
}

const r = runtime();
r.run(`
  route='PRF-01';assert.equal(lgBrand(),'');
  route='PRF-02';assert.match(lgBrand(),/data-act="back"/);
  route='ACC-01';assert.match(lgBrand(),/lg-wordmark/);
  assert.doesNotMatch(lgBrand(),/data-go="PRF-01"/);
  route='ENT-02';assert.match(lgBrand(),/lg-wordmark/);
  assert.doesNotMatch(lgBrand(),/UZMEK/);
  assert.match(beautyHeader(),/data-act="back"/);
  assert.doesNotMatch(beautyHeader(),/wordmark|beauty-brand-star/);
  for(const version of ['v1','v2']) {
    M.paywallVersion=version;route='PRE-01';
    const html=V[route]();assert.doesNotMatch(html,/UZMEK/);
    assert.match(html,/Beautify Plus/);assert.match(html,/data-act="premium-return"/);
  }
  for(const version of ['v1','v2']) {
    M.historyVersion=version;M.historyDomain='Cheveux';route='ANA-12';
    assert.doesNotMatch(V[route](),/UZMEK|wordmark/);
    assert.match(V[route](),/data-act="back"/);
  }
  M.documentTab='À propos';route='PRF-11';assert.match(V[route](),/Beautify by UZMEK/);
  go('PRF-01',{root:true});go('PRF-02');back();assert.equal(route,'PRF-01');
  assert.doesNotMatch(document.getElementById('app').innerHTML,/UZMEK|wordmark|class="logo/);
`);
console.log(`${checks} view checks passed; brand is limited to entry screens and attribution to About. Navigation and both paywall/history versions passed.`);
