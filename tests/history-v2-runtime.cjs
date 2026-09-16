const fs = require('node:fs');
const prefix = fs.readFileSync('tests/flow-runtime.cjs', 'utf8').split('let checks = 0;')[0];
const runtime = new Function('require', prefix + '\nreturn runtime;')(require);
const r = runtime();
r.run(`
  M.historyDomain='Cheveux';
  assert.match(V['ANA-12'](), /hv2-page/);
  assert.match(V['ANA-12'](), /Votre historique commence ici/);
  assert.equal(M.analyses.length,0);
  assert.match(V['ANA-12'](), /data-act="studio-analysis" data-domain="Cheveux"/);
  ACTIONS['history-version']({value:'v1'});
  assert.match(V['ANA-12'](), /compact-history/);
  assert.doesNotMatch(V['ANA-12'](), /hv2-page/);
  ACTIONS['history-version']({value:'invalid'});
  assert.equal(M.historyVersion,'v1');
  ACTIONS['history-version']({value:'v2'});
  M.analyses=[
    {id:'old',domain:'Cheveux',status:'complete',date:'2026-08-01',faceShape:'Rond'},
    {id:'new',domain:'Cheveux',status:'partial',date:'2026-09-16',faceShape:'Ovale',photo:'photo-expired'},
    {id:'pending',domain:'Cheveux',status:'pending',date:'2026-09-17'},
    {id:'skin',domain:'Peau',status:'complete',date:'2026-09-16'},
    {id:'undated',domain:'Cheveux',status:'complete',date:'invalid',faceShape:'<script>alert(1)</script>'}
  ];
  const html=V['ANA-12']();
  assert.ok(html.indexOf('data-id="new"')<html.indexOf('data-id="old"'));
  assert.doesNotMatch(html,/data-id="pending"|data-id="skin"/);
  assert.match(html,/septembre 2026/);assert.match(html,/août 2026/);
  assert.match(html,/Sans date/);assert.match(html,/Aperçu partiel/);
  assert.match(html,/Photo à sélectionner à nouveau/);
  assert.doesNotMatch(html,/<script>/);
  assert.equal((html.match(/class="hv2-latest"/g)||[]).length,1);
  const before=clone(M.analyses),subscription=M.subscription.status;
  hv2LoadExample();hv2LoadExample();
  assert.equal(M.analyses.length,before.length+4);
  assert.equal(JSON.stringify(M.analyses.slice(0,before.length)),JSON.stringify(before));
  assert.equal(M.subscription.status,subscription);
  M.subscription.status='active';
  for(const record of M.analyses.filter(record=>record.historyArtwork)) {
    M.historyDomain='Cheveux';go('ANA-12');
    ACTIONS['history-report-open']({domain:'Cheveux',id:record.id});
    assert.equal(route,'ANA-10');assert.equal(report().id,record.id);
  }
  M.historyDomain='Tous';assert.doesNotMatch(V['ANA-12'](),/hv2-page/);
  for(const domain of ['Peau','Colorimétrie']) {
    M.historyDomain=domain;
    assert.match(V['ANA-12'](),/hv2-page/);
    assert.ok(V['ANA-12']().includes('data-domain="'+domain+'"'));
  }
  M.historyDomain='Cheveux';go('ANA-12');M.subscription.status='active';
  ACTIONS['history-report-open']({domain:'Cheveux',id:'old'});
  assert.equal(route,'ANA-10');assert.equal(report().id,'old');
  back();assert.equal(route,'ANA-12');assert.equal(M.historyDomain,'Cheveux');
  assert.match(V['ANA-12'](),/hv2-page/);
  ACTIONS['studio-analysis']({domain:'Cheveux'});assert.equal(route,'ANA-04');
  back();assert.equal(route,'ANA-12');
  M.subscription.status='free';
  ACTIONS['history-report-open']({domain:'Cheveux',id:'old'});
  assert.equal(route,'PRE-01');assert.equal(M.context.analysis,'old');
  ACTIONS['premium-return']();assert.equal(route,'ANA-12');
  assert.equal(M.historyDomain,'Cheveux');
  ACTIONS['history-report-open']({domain:'Cheveux',id:'old'});
  ACTIONS.subscribe();assert.equal(route,'ANA-10');assert.equal(report().id,'old');
`);
console.log('History V2: versions, empty state, grouping, scope, partial/missing photos, escaping, additive fixtures, report access and return passed.');
