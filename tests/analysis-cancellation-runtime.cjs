const fs=require('node:fs');
const assert=require('node:assert/strict');
const harness=fs.readFileSync('tests/flow-runtime.cjs','utf8').split('let checks = 0;')[0]
  .replace('listeners[type] = fn;', 'const previous= listeners[type]; listeners[type] = (...args) => { previous?.(...args); fn(...args); };')
  .replace('return { run, probes, inputs, revoked, elements, location, entries, history,','return { run, probes, inputs, revoked, elements, location, entries, history, timers, listeners,');
const runtime=new Function('require',harness+'\nreturn runtime;')(require);
let checks=0;
for(const domain of ['Cheveux','Peau','Colorimétrie']){
  for(const exit of ["go('ACC-01',{root:true})","ACTIONS.back()","ACTIONS['cancel-analysis']()","go('PRF-01')"]){
    const r=runtime();
    r.run(`ACTIONS['studio-analysis']({domain:${JSON.stringify(domain)}});M.draft.photo='portrait';ACTIONS['canonical-analyze-photo']();assert.equal(route,'ANA-08');`);
    const oldTimer=[...r.timers.values()].find(t=>t.delay===15000);assert(oldTimer);
    r.run(exit);
    assert.equal(r.pending(15000),0);
    r.run(`assert.equal(M.draft.photo,'');assert.equal(M.draft.consent,false);assert.equal(M.draft.status,'draft');assert.equal(canonicalAnalysisRun,null);assert.equal(experienceResume(),'');assert(!V['ANA-04']().includes('Reprendre mon analyse'));`);
    oldTimer.fn();r.run(`assert.equal(M.analyses.length,0);go('ANA-08');assert.equal(route,'ANA-04');`);
    r.run(`ACTIONS['studio-analysis']({domain:${JSON.stringify(domain)}});assert.equal(document.getElementById('overlay').innerHTML,'');M.draft.photo='portrait';ACTIONS['canonical-analyze-photo']();`);
    const fresh=[...r.timers.values()].find(t=>t.delay===15000);assert(fresh);assert.notEqual(fresh,oldTimer);
    oldTimer.fn();r.run(`assert.equal(route,'ANA-08');assert.equal(M.analyses.length,0);`);
    r.tick(14999);r.run(`assert.equal(M.analyses.length,0);`);
    r.tick(15000);r.run(`assert.equal(M.analyses.length,1);assert.equal(M.draft.status,'complete');go('ACC-01');assert.equal(M.analyses.length,1);assert.equal(M.draft.status,'complete');`);
    checks++;
  }
}
for(const lifecycle of ['pagehide','reload']){
  const r=runtime();r.run(`ACTIONS['studio-analysis']({domain:'Peau'});M.draft.photo='portrait';ACTIONS['canonical-analyze-photo']();`);
  if(lifecycle==='pagehide'){r.listeners.pagehide();r.listeners.pageshow();}
  else r.run(`canonicalAnalysisRun=null;render();`);
  r.run(`assert.equal(route,'ANA-04');assert.equal(M.draft.photo,'');assert.equal(M.analyses.length,0);`);
  assert.equal(r.pending(15000),0);checks++;
}
// Asynchronous photo loading still starts a fresh 15-second run.
{
 const r=runtime();r.run(`ACTIONS['studio-analysis']({domain:'Cheveux'});loadPhoto({type:'image/png',size:1024},'analysis');`);r.probes.at(-1).onload();
 assert.equal(r.pending(15000),1);r.run(`assert.equal(route,'ANA-08');go('ACC-01');`);r.tick(15000);r.run(`assert.equal(M.analyses.length,0);`);checks++;
}
console.log(`${checks} cancellation, stale timer, restart, lifecycle and completion checks passed`);
