// Runs the scripts loaded by index.html with small DOM/history/file/timer doubles.
// This verifies application behavior, not browser layout or real device APIs.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
function runtime() {
  const noop = () => {}, timers = new Map(), probes = [], inputs = [], revoked = [], listeners = {}, storage = new Map();
  let counter = 0, cursor = -1;
  const entries = [], location = { hash: '' }, elements = new Map();
  const node = () => ({ innerHTML: '', classList: { add: noop, remove: noop }, style: {}, dataset: {},
    focus: noop, querySelector: () => null, querySelectorAll: () => [], appendChild: noop, setAttribute: noop,
    addEventListener(type, fn) { this['on' + type] = fn; }, click() { this.clicked = true; } });
  const history = {
    pushState(state, _, url) { entries.splice(++cursor); entries.push({ state, url }); location.hash = url; },
    replaceState(state, _, url) { if (cursor < 0) cursor = 0; entries[cursor] = { state, url }; location.hash = url; },
    back() { if (cursor > 0) { cursor--; location.hash = entries[cursor].url; listeners.popstate?.({ state: entries[cursor].state }); } }
  };
  const document = { documentElement: {}, getElementById(id) { if (!elements.has(id)) elements.set(id, node()); return elements.get(id); },
    querySelector: () => null, querySelectorAll: () => [], createElement(tag) { const el = node(); if (tag === 'input') inputs.push(el); return el; },
    body: node(), addEventListener: noop };
  const context = { assert, console, Date, Math, JSON, Set, Map, Intl, Number, String, Array, Object, Boolean, Blob, FormData,
    document, location, history, window: { scrollTo: noop, addEventListener(type, fn) { listeners[type] = fn; } },
    URL: { createObjectURL: () => 'blob:photo-' + (++counter), revokeObjectURL: url => revoked.push(url) },
    Image: function () { probes.push(this); }, sessionStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    setTimeout(fn, delay) { const id = ++counter; timers.set(id, { fn, delay }); return id; }, clearTimeout(id) { timers.delete(id); } };
  vm.createContext(context);
  const index = fs.readFileSync('dist/index.html', 'utf8');
  const scripts = [...index.matchAll(/<script src="\/([^"?]+)(?:\?[^" ]*)?"><\/script>/g)].map(x => x[1]).filter(x => x !== 'start.js');
  scripts.forEach(file => vm.runInContext(fs.readFileSync('dist/' + file, 'utf8'), context, { filename: file }));
  const run = source => vm.runInContext(source, context);
  run('boot()');
  return { run, probes, inputs, revoked, elements, location, entries, history,
    tick(delay) { const batch = [...timers].filter(([, t]) => t.delay === delay); for (const [id, t] of batch) if (timers.delete(id)) t.fn(); },
    pending(delay) { return [...timers.values()].filter(t => t.delay === delay).length; } };
}

let checks = 0;
function test(name, callback) {
  try { callback(runtime()); checks++; }
  catch (error) { error.message = name + ': ' + error.message; throw error; }
}
const start = domain => `ACTIONS['studio-analysis']({domain:${JSON.stringify(domain)}});`;
const complete = domain => start(domain) + `M.draft.photo='portrait';M.draft.answers=canonicalEngineAnswers(M.draft.domain);ACTIONS['canonical-analyze-photo']();ACTIONS['finish-analysis']();`;

for (const domain of ['Cheveux', 'Colorimétrie', 'Peau']) {
  test(domain + ' free reveal, guarded routes, checkout and return', ({ run, location }) => {
    run(complete(domain));
    run(`assert.equal(route,'ANA-09');assert.equal(M.analyses.length,1);assert.equal(M.draft.status,'complete');
      assert.match(V[route](),/Voir mon rapport complet/);ACTIONS['finish-analysis']();assert.equal(M.analyses.length,1);
      go('ANA-10');assert.equal(route,'ANA-09');assert.equal(location.hash,'#ANA-09');
      const locked=snapshot();locked.route='ANA-10';restoreState(locked);assert.equal(route,'ANA-09');assert.equal(location.hash,'#ANA-09');
      ACTIONS['result-open']({domain:M.draft.domain});assert.equal(route,'ANA-09');ACTIONS['lg-history-report-open']({domain:M.draft.domain,id:M.analyses[0].id});assert.equal(route,'ANA-09');
      go('PRE-01');assert.match(V['PRE-01'](),/data-act="premium-return"/);
      go('PRE-02');ACTIONS.subscribe();assert.equal(route,'ANA-09');assert.equal(M.subscription.status,'active');
      assert.equal(M.premiumReturnState,null);assert.match(V[route](),/canonical-report-panel/);
      assert.equal(M.hairGenerations.limit,10);ACTIONS['result-open']({domain:M.draft.domain});assert.notEqual(route,'ANA-09');`);
    assert.ok(location.hash);
  });
}

for(const domain of ['Cheveux','Colorimétrie','Peau']){
  test(domain+' starts at photo capture and returns directly to the analysis choice',({run})=>{
    run(`go('SAV-01',{root:true});go('ANA-01');ACTIONS['studio-analysis']({domain:${JSON.stringify(domain)}});
      assert.equal(route,'ANA-04');assert.equal(M.draft.phase,'ANA-04');
      assert.match(V[route](),/data-source="camera"/);assert.match(V[route](),/data-source="gallery"/);
      assert.doesNotMatch(V[route](),/data-form="consent"/);
      back();assert.equal(route,'ANA-01');back();assert.equal(route,'SAV-01');
      assert.equal(M.draft.domain,${JSON.stringify(domain)});assert.equal(M.draft.consent,false);
      go('ANA-03');assert.equal(route,'ANA-04');assert.equal(location.hash,'#ANA-04');
      back();assert.equal(route,'ANA-01');`);
  });
}

for(const domain of ['Cheveux','Colorimétrie','Peau']){
  test(domain+' Results category has an explicit empty state and a reversible scoped start',({run})=>{
    run(`go('SAV-01',{root:true});ACTIONS['lg-results-domain']({domain:${JSON.stringify(domain)}});
      assert.equal(route,'ANA-12');assert.equal(M.historyDomain,${JSON.stringify(domain)});
      assert.match(V['ANA-12'](),/Pas encore d’analyse/);assert.equal(M.analyses.length,0);
      ACTIONS['studio-analysis']({domain:${JSON.stringify(domain)}});assert.equal(route,'ANA-04');
      assert.equal(M.draft.domain,${JSON.stringify(domain)});back();assert.equal(route,'ANA-12');
      assert.equal(M.historyDomain,${JSON.stringify(domain)});back();assert.equal(route,'SAV-01');`);
  });
}
test('category history sorts by date, separates domains, and opens the selected snapshot',({run})=>{
  run(`M.subscription.status='active';M.colorProfile={season:'deep_winter'};
    M.analyses=[
      {id:'color-later',domain:'Colorimétrie',status:'complete',date:'2026-09-06',season:'deep_winter'},
      {id:'hair-only',domain:'Cheveux',status:'complete',date:'2026-09-07',faceShape:'Ovale'},
      {id:'color-earlier',domain:'Colorimétrie',status:'complete',date:'2026-09-01',season:'light_spring'},
      {id:'color-same-day',domain:'Colorimétrie',status:'complete',date:'2026-09-06',season:'cool_summer'},
      {id:'not-ready',domain:'Colorimétrie',status:'pending',date:'2026-09-07'}
    ];
    go('SAV-01',{root:true});ACTIONS['lg-history-domain']({domain:'Colorimétrie'});
    const html=V['ANA-12']();assert.ok(!html.includes('hair-only'));assert.ok(!html.includes('not-ready'));
    assert.ok(html.indexOf('data-id="color-same-day"')<html.indexOf('data-id="color-later"'));
    assert.ok(html.indexOf('data-id="color-later"')<html.indexOf('data-id="color-earlier"'));
    ACTIONS['lg-history-report-open']({domain:'Colorimétrie',id:'color-earlier'});
    assert.equal(route,'ANA-10');assert.equal(report().id,'color-earlier');
    assert.ok(V['ANA-10']().includes(COLOR12_SEASONS.light_spring.name));
    assert.equal(M.colorProfile.season,'deep_winter');M.historyDomain='Peau';back();
    assert.equal(route,'ANA-12');assert.equal(M.historyDomain,'Colorimétrie');
    const count=M.analyses.length;ACTIONS['studio-analysis']({domain:'Colorimétrie'});
    assert.equal(M.analyses.length,count);assert.equal(M.draft.domain,'Colorimétrie');`);
});
test('opening a saved analysis preserves the free reveal and rejects mismatched records',({run})=>{
  run(complete('Cheveux'));
  run(`const id=M.analyses[0].id;go('SAV-01',{root:true});ACTIONS['lg-history-domain']({domain:'Cheveux'});
    ACTIONS['lg-history-report-open']({domain:'Peau',id});assert.equal(route,'ANA-12');
    ACTIONS['lg-history-report-open']({domain:'Cheveux',id});assert.equal(route,'ANA-09');
    assert.equal(report().id,id);assert.match(V['ANA-09'](),/Voir mon rapport complet/);
    assert.equal(canonicalOwned(),false);back();assert.equal(route,'ANA-12');`);
});

test('camera and gallery stay distinct; upload completes only once', ({ run, inputs, probes, tick }) => {
  run(start('Cheveux'));
  run(`ACTIONS['file-pick']({purpose:'analysis',source:'camera'});ACTIONS['file-pick']({purpose:'analysis',source:'gallery'});`);
  run(`assert.equal(M.draft.consent,false);assert.equal(M.analyses.length,0);`);
  assert.equal(inputs[0].capture, 'user'); assert.equal(inputs[1].capture, undefined);
  assert.ok(inputs.every(x => x.clicked && x.accept === 'image/*'));
  run(`loadPhoto({type:'image/png',size:1024},'analysis')`); probes.at(-1).onload();
  run(`assert.equal(route,'ANA-08');assert.equal(M.draft.status,'processing');assert.equal(M.draft.consent,true);`);
  tick(2300); run(`assert.equal(route,'ANA-09');assert.equal(M.analyses.length,1);`);
  tick(2300); run(`assert.equal(M.analyses.length,1);`);
});
test('stale photo callbacks cannot overwrite a new draft or reopen a screen', ({ run, probes, revoked }) => {
  run(start('Cheveux')); run(`loadPhoto({type:'image/png',size:1024},'analysis');go('ACC-01')`);
  probes.at(-1).onload(); run(`assert.equal(route,'ACC-01');assert.equal(M.draft.photo,'');`); assert.equal(revoked.length, 1);
  run(`go('ANA-04');loadPhoto({type:'image/png',size:1024},'analysis');ACTIONS['canonical-new-analysis']({domain:'Peau'})`);
  probes.at(-1).onload(); run(`assert.equal(M.draft.domain,'Peau');assert.equal(M.draft.photo,'');assert.equal(route,'ANA-04');assert.equal(M.draft.consent,false);`);
});
test('leaving analysis cancels timer and resuming preserves draft', ({ run, tick, pending }) => {
  run(start('Peau')); run(`M.draft.photo='portrait';ACTIONS['canonical-analyze-photo']();go('ACC-01');`);
  assert.equal(pending(2300), 0); tick(2300); run(`assert.equal(M.analyses.length,0);`);
  run(`const savedDraft=M.draft;ACTIONS['studio-analysis']({domain:'Cheveux'});assert.equal(M.draft,savedDraft);
    assert.match(document.getElementById('overlay').innerHTML,/Reprendre mon analyse/);
    ACTIONS['canonical-resume-analysis']();assert.equal(route,'ANA-08');assert.equal(M.draft.domain,'Peau');`);
  tick(2300); run(`assert.equal(M.analyses.length,1);assert.equal(route,'ANA-09');`);
});
test('refresh with missing blob never spins forever; completed analysis never regenerates', ({ run, pending }) => {
  run(start('Cheveux')); run(`M.draft.photo='photo-gone';go('ANA-08');assert.equal(route,'ANA-04');assert.equal(location.hash,'#ANA-04');`);
  assert.equal(pending(2300), 0);
  run(`M.draft.photo='portrait';ACTIONS['canonical-analyze-photo']();ACTIONS['finish-analysis']();go('ANA-08');
    assert.equal(route,'ANA-09');assert.equal(M.analyses.length,1);`); assert.equal(pending(2300), 0);
});
for (const scenario of ['error', 'offline', 'pending', 'refused', 'unavailable']) {
  test(scenario + ' cannot silently complete an analysis', ({ run, pending }) => {
    run(start('Colorimétrie'));run(`M.draft.photo='portrait';M.scenario='${scenario}';ACTIONS['canonical-analyze-photo']();ACTIONS['finish-analysis']();assert.equal(M.analyses.length,0);`);
    assert.equal(pending(2300), 0);
    run(`ACTIONS['canonical-retry-analysis']();assert.equal(M.scenario,'normal');ACTIONS['finish-analysis']();assert.equal(route,'ANA-09');`);
  });
}
test('purchase failure, pending check and restoring do not grant extra credits', ({ run }) => {
  run(`go('PRE-01');go('PRE-02');M.scenario='offline';ACTIONS.subscribe();assert.equal(M.subscription.status,'failed');
    M.scenario='pending';ACTIONS.subscribe();assert.equal(M.subscription.status,'pending');
    M.scenario='offline';ACTIONS['subscription-check']();assert.equal(M.subscription.status,'pending');
    M.scenario='normal';ACTIONS['subscription-check']();assert.equal(M.subscription.status,'active');
    M.hairGenerations.used=7;const reset=M.hairGenerations.reset;
    ACTIONS['restore-access']();assert.equal(M.hairGenerations.used,7);assert.equal(M.hairGenerations.reset,reset);
    ACTIONS.subscribe();assert.equal(M.hairGenerations.used,7);
    M.subscription.status='cancelled';ACTIONS['restore-access']();assert.equal(M.subscription.status,'active');assert.equal(M.hairGenerations.used,7);
    M.scenario='error';ACTIONS['restore-access']();assert.equal(M.hairGenerations.used,7);`);
});
test('closing paywall returns to original result even after reviewing offers', ({ run }) => {
  run(complete('Cheveux'));
  run(`go('PRE-01');go('PRE-02');go('PRE-01');ACTIONS['premium-return']();assert.equal(route,'ANA-09');assert.equal(M.subscription.status,'free');assert.equal(M.premiumReturnState,null);`);
});
test('historical results keep their own photo, shape, ranking and season', ({ run }) => {
  run(complete('Cheveux'));
  run(`M.subscription.status='active';const old=report();old.hairProfile={shape:'Carré',texture:'Bouclés',length:'Courte'};old.faceShape='Carré';
    old.photo='photo-old';memoryPhotos['photo-old']='blob:old-photo';const first=canonicalHairPanel('Coupes',old);
    M.hairProfile={shape:'Rond',texture:'Lisses',length:'Longue'};M.draft.photo='photo-new';memoryPhotos['photo-new']='blob:new-photo';
    assert.equal(canonicalHairPanel('Coupes',old),first);assert.match(canonicalHairPanel('Visage',old),/blob:old-photo/);
    assert.doesNotMatch(canonicalHairPanel('Visage',old),/blob:new-photo/);
    M.colorProfile={season:'deep_winter'};assert.equal(canonicalReportTabs('Cheveux',old).includes('Couleur'),false);
    old.colorProfile={season:'light_spring'};assert.equal(canonicalReportTabs('Cheveux',old).includes('Couleur'),true);
    const before=canonicalHairPanel('Couleur',old);M.colorProfile={season:'deep_autumn'};assert.equal(canonicalHairPanel('Couleur',old),before);
    const oldColor={id:'old-color',domain:'Colorimétrie',season:'light_spring'};
    assert.equal(canonicalColorProfile(oldColor).season,'light_spring');assert.equal(canonicalColorProfile({domain:'Colorimétrie'}),null);
    assert.match(canonicalColorPanel('Saison',oldColor),new RegExp(COLOR12_SEASONS.light_spring.colors[0][1]));
    M.analyses.push(oldColor);ACTIONS['color-report-open']({id:'old-color'});assert.equal(M.colorProfile.season,'deep_autumn');assert.equal(report().id,'old-color');`);
});
test('missing report stays empty, not a fabricated result', ({ run }) => {
  run(`M.context.analysis='missing';go('ANA-09');assert.match(V['ANA-09'](),/Aucun rapport/);assert.doesNotMatch(V['ANA-09'](),/Votre analyse est prête/);`);
});
test('adopting skin plan schedules routines and preserves customization on later adoption', ({ run }) => {
  run(complete('Peau'));
  run(`M.subscription.status='active';ACTIONS['skin-apply-plan']();
    const routine=skinRoutine('Matin');assert.ok(M.active.includes(routine.id));
    assert.ok(dailyActions().some(a=>a.ref===routine.id));routine.steps=['Mon geste personnalisé'];routine.version=4;routine.frequency='Chaque semaine';
    M.active=M.active.filter(id=>id!==routine.id);const schedule=clone(M.schedules[routine.id]);
    M.skinPlan.morning=['Nouveau conseil'];ACTIONS['skin-apply-plan']();
    assert.deepEqual(routine.steps,['Mon geste personnalisé']);assert.equal(routine.version,4);assert.equal(routine.frequency,'Chaque semaine');
    assert.equal(JSON.stringify(M.schedules[routine.id]),JSON.stringify(schedule));assert.equal(M.active.includes(routine.id),false);
    assert.equal(M.routines.filter(r=>r.generatedSkinPlan).length,2);
    M.sessions=[{id:'session-test',kind:'routine',ref:routine.id,date:DATE(),confirmed:true,steps:['skipped']}];
    assert.ok(V['PRO-01']().includes('<strong>0 / 7</strong>'));M.sessions[0].steps=['done'];assert.ok(V['PRO-01']().includes('<strong>1 / 7</strong>'));`);
});
test('catalog, palettes, simulations and domain history remain findable', ({ run }) => {
  run(complete('Cheveux'));
  run(`M.subscription.status='active';ACTIONS['hair-more']();assert.equal(route,'HAI-02');assert.match(V['HAI-02'](),/Toutes/);
    M.previewSeason='light_spring';go('COL-01');assert.match(V['COL-01'](),/Revenir à mon profil couleur/);
    ACTIONS['lg-color-close']();assert.equal(M.previewSeason,null);
    M.simulations.push({id:'sim-saved',haircut:'lob-soft',image:'layers',type:'Simulation',domain:'Cheveux',date:DATE(),name:'Ma coupe'});
    ACTIONS['saved-hair-sims']();assert.equal(route,'ESS-04');assert.match(V['ESS-04'](),/sim-saved/);
    ACTIONS['lg-history-domain']({domain:'Peau'});assert.equal(route,'ANA-12');assert.equal(M.historyDomain,'Peau');`);
});
test('hair generation is idempotent, failures cost nothing and quota cannot be bypassed', ({ run }) => {
  run(complete('Cheveux'));
  run(`uxActivatePremium();M.simulationPhoto='portrait';ACTIONS['haircut-generate-confirm']({id:'lob-soft'});
    const id=M.haircutDraft.id;ACTIONS['haircut-generate-confirm']({id:'lob-soft'});assert.equal(M.haircutDraft.id,id);
    M.scenario='pending';ACTIONS['finish-haircut']();assert.equal(M.simulations.length,0);assert.equal(M.hairGenerations.used,0);
    ACTIONS['canonical-retry-haircut']();assert.equal(route,'ESS-03');assert.equal(M.simulations.length,1);assert.equal(M.hairGenerations.used,1);
    ACTIONS['finish-haircut']();assert.equal(route,'ESS-03');assert.equal(M.simulations.length,1);assert.equal(M.hairGenerations.used,1);
    M.hairGenerations.used=10;ACTIONS['haircut-generate-confirm']({id:'lob-soft'});assert.equal(M.haircutDraft,null);assert.equal(M.hairGenerations.used,10);
    M.hairGenerations.used=0;M.simulationPhoto='photo-gone';ACTIONS['haircut-generate-confirm']({id:'lob-soft'});assert.equal(M.haircutDraft,null);
    go('ESS-02');assert.notEqual(route,'ESS-02');`);
});
test('discarded simulation picker does not reopen a dismissed sheet', ({ run, probes, revoked }) => {
  run(complete('Cheveux'));
  run(`uxActivatePremium();ACTIONS['haircut-simulate']({id:'lob-soft'});loadPhoto({type:'image/png',size:1024},'simulation');closeModal(false);`);
  probes.at(-1).onload();run(`assert.equal(document.getElementById('overlay').innerHTML,'');assert.ok(!M.simulationPhoto);`);assert.equal(revoked.length,1);
});
test('browser back does not revive processing or bypass the free preview', ({ run, tick }) => {
  run(start('Cheveux'));
  run(`M.draft.photo='portrait';ACTIONS['canonical-analyze-photo']();go('ACC-01');back();assert.equal(route,'ANA-08');`);
  tick(2300);
  run(`assert.equal(route,'ANA-09');go('PRE-01');back();assert.equal(route,'ANA-09');assert.equal(location.hash,'#ANA-09');assert.equal(M.analyses.length,1);`);
});
test('history comparisons open analyses, reject mismatched domains and keep old detail links consistent', ({ run }) => {
  run(complete('Cheveux'));run(complete('Peau'));
  run(`ACTIONS['canonical-compare-analyses']();assert.equal(M.compareMode,'Analyses');assert.equal(route,'PRO-02');
    assert.equal(F.compare({first:M.analyses[0].id,second:M.analyses[1].id}),false);
    assert.ok(!M.comparison);M.subscription.status='active';go('ANA-11',{context:{analysis:M.analyses[0].id}});
    assert.match(V['ANA-11'](),/canonical-report-panel/);assert.doesNotMatch(V['ANA-12'](),/Maquillage|Garde-robe/);`);
});
test('every analysis step has an in-app exit and retains the selected photo', ({ run, pending }) => {
  run(start('Cheveux'));run(`M.draft.photo='portrait';ACTIONS['canonical-analyze-photo']();ACTIONS.back();
    assert.equal(route,'ANA-06');assert.equal(M.draft.photo,'portrait');assert.match(document.getElementById('app').innerHTML,/flow-exit/);
    ACTIONS.back();assert.equal(route,'ANA-04');assert.match(V['ANA-04'](),/Reprendre mon analyse/);
    assert.match(V['ANA-04'](),/Votre photo sélectionnée/);ACTIONS.back();assert.equal(route,'ANA-01');assert.equal(M.draft.photo,'portrait');`);
  assert.equal(pending(2300),0);
});
test('UI back is safe when embedded browser history does nothing', ({ run, history, tick }) => {
  history.back=()=>{};
  run(`go('PRF-01');go('PRF-04');ACTIONS.back();assert.equal(route,'PRF-04');`);
  tick(180);run(`assert.equal(route,'PRF-01');assert.equal(location.hash,'#PRF-01');`);
  run(`go('PRF-04');ACTIONS.back();go('ACC-01');`);tick(180);run(`assert.equal(route,'ACC-01');`);
});
test('a deep-linked page never returns to itself or requires external history', ({ run }) => {
  run(`for(const id of ['ANA-03','ANA-04','ANA-06','ANA-08','PRE-01','PRE-02','PRE-03','PRF-04','PRO-03','ROU-04','COL-02']){
    M=initial();migrate();M.draft.consent=true;M.draft.photo='portrait';trail=[];route=id;paintedSnapshot=null;
    render();const from=route;ACTIONS.back();assert.notEqual(route,from,id+' is trapped');assert.ok(V[route]);
  }`);
});
test('Back first exits a modal or a nested report view without losing the report', ({ run }) => {
  run(complete('Cheveux'));run(`M.subscription.status='active';go('HAI-01');M.hairTab='Toutes';ACTIONS.back();
    assert.equal(route,'HAI-01');assert.equal(M.hairTab,'Pour moi');
    modal('Test',A('Fermer','close'));ACTIONS.back();assert.equal(route,'HAI-01');assert.equal(document.getElementById('overlay').innerHTML,'');
    go('COL-01');M.lgColorApplications=true;M.previewSeason='light_spring';ACTIONS.back();assert.equal(route,'COL-01');assert.equal(M.previewSeason,null);
    go('PRO-01');M.lgJournal=true;ACTIONS.back();assert.equal(route,'COL-01');
    go('PEA-01');M.skinTab='Matin';ACTIONS.back();assert.equal(route,'PEA-01');assert.equal(M.skinTab,'Rapport');`);
});
test('exiting a report skips completed processing and checkout history', ({ run, tick }) => {
  run(complete('Cheveux'));run(`go('PRE-01');go('PRE-02');ACTIONS.subscribe();ACTIONS.back();`);
  tick(180);run(`assert.ok(!/^PRE-|^ANA-0[3-9]$|^ANA-1[01]$/.test(route));assert.equal(M.analyses.length,1);`);
});
test('legacy history cannot loop a free preview through a now-locked full report', ({ run, tick }) => {
  run(complete('Cheveux'));
  run(`const old=snapshot();old.route='HAI-01';trail=[old];ACTIONS.back();`);tick(180);
  run(`assert.equal(route,'SAV-01');assert.equal(M.analyses.length,1);`);
});

// Daily skincare exercises persisted products, optional steps and dated sessions.
const ownRoutine = `go('ACC-01',{root:true});ACTIONS['skin-open-routine']({moment:'Matin'});ACTIONS['skin-own-routine']();`;
test('routine has an empty state and supports own products without inventing an analysis',({run})=>{
  run(`go('ACC-01',{root:true});assert.match(V['ACC-01'](),/data-act="skin-home-create"/);
    ACTIONS['skin-open-routine']({moment:'Matin'});assert.equal(route,'ROU-01');assert.match(V[route](),/Avec mes produits/);
    ACTIONS['skin-own-routine']();const morning=skinRoutine('Matin');assert.equal(morning.steps.length,3);
    assert.equal(M.analyses.length,0);assert.equal(canonicalOwned(),false);
    ACTIONS['skin-moment']({value:'Soir'});assert.match(V[route](),/Votre routine du soir/);
    ACTIONS['skin-own-routine']();assert.equal(skinRoutine('Soir').steps.length,2);
    ACTIONS['skin-moment']({value:'Matin'});assert.equal(skinRoutine().id,morning.id);
    ACTIONS.back();assert.equal(route,'ACC-01');`);
});
test('every care category accepts a named product and brand; choosing a template is optional',({run})=>{
  run(ownRoutine);
  run(`const r=skinRoutine('Matin');for(const type of Object.keys(SKIN_TYPES)){
    ACTIONS['skin-add-type']({routine:r.id,type});ACTIONS['skin-custom-open']();
    assert.match(document.getElementById('overlay').innerHTML,/Nom du produit/);
    assert.equal(F['skin-product']({productName:'Mon '+type,brand:'Ma marque'}),true);
    const step=skinSteps(r).find(step=>step.product?.name==='Mon '+type);assert.ok(step,type);
    assert.equal(step.product.type,type);assert.equal(step.product.brand,'Ma marque');
    assert.equal(step.product.example,false);assert.equal(document.getElementById('overlay').innerHTML,'');
    assert.ok(V['ROU-01']().includes('Mon '+type));
  }assert.equal(M.skinCareProducts.length,Object.keys(SKIN_TYPES).length);
  assert.equal(skinSteps(r).find(step=>step.type==='patch').frequency,'needed');
  assert.equal(skinSteps(r).find(step=>step.type==='mask').frequency,'needed');
  assert.equal(skinSteps(r).find(step=>step.type==='exfoliate').frequency,'needed');`);
});
test('product picker filters by type, validates blank input and preserves names across reload',({run})=>{
  run(ownRoutine);
  run(`const r=skinRoutine(),step=skinSteps(r).find(s=>s.type==='moisturize');
    ACTIONS['skin-replace-open']({routine:r.id,step:step.id});
    ACTIONS['skin-product-select']({id:'skin-example-fluide-spf'});assert.equal(step.product,null);
    ACTIONS['skin-custom-open']();assert.equal(F['skin-product']({productName:'   '}),false);
    assert.equal(M.skinCareProducts.length,0);F['skin-product']({productName:'Crème <douce> & moi',brand:'Ma marque'});
    assert.equal(step.product.name,'Crème <douce> & moi');assert.match(V['ROU-01'](),/Crème &lt;douce&gt; &amp; moi/);
    const productId=step.product.id,routineId=r.id,stepId=step.id;
    M=JSON.parse(JSON.stringify(M));migrate();assert.equal(skinSteps(skinRoutine()).find(s=>s.id===stepId).product.id,productId);
    ACTIONS['skin-replace-open']({routine:routineId,step:stepId});ACTIONS['skin-custom-open']();
    F['skin-product']({productName:'  Crème <douce> & moi ',brand:'Ma marque'});assert.equal(M.skinCareProducts.length,1);
    assert.equal(skinSteps(skinRoutine()).find(s=>s.id===stepId).product.id,productId);`);
});
test('patches and other optional care are not silently marked used by Complete all',({run})=>{
  run(ownRoutine);
  run(`const r=skinRoutine();ACTIONS['skin-add-type']({routine:r.id,type:'patch'});
    ACTIONS['skin-product-select']({id:'skin-example-patchs-yeux'});const patch=skinSteps(r).find(s=>s.type==='patch');
    ACTIONS['skin-check-all']({routine:r.id});assert.equal(skinDone(r,patch),false);
    assert.equal(skinSession(r).steps.length,3);assert.equal(sessionComplete(skinSession(r)),true);
    assert.equal(dailyActions().find(action=>action.ref===r.id).done,true);
    ACTIONS['skin-check-step']({routine:r.id,step:patch.id});assert.equal(skinDone(r,patch),true);
    assert.equal(skinSession(r).steps.length,4);
    ACTIONS['skin-check-step']({routine:r.id,step:patch.id});assert.equal(skinSession(r).steps.length,3);
    ACTIONS['skin-step-frequency']({routine:r.id,step:patch.id,value:'daily'});
    assert.equal(sessionComplete(skinSession(r)),false);assert.equal(skinSession(r).steps.length,4);`);
});
test('replacing a used product preserves today and past days until an explicit correction',({run})=>{
  run(ownRoutine);
  run(`const r=skinRoutine(),step=skinSteps(r).find(s=>s.type==='moisturize');
    ACTIONS['skin-check-all']({routine:r.id});const past=clone(skinSession(r));past.id='past-session';past.date='2026-01-01';M.sessions.push(past);
    const before=JSON.stringify(past);ACTIONS['skin-replace-open']({routine:r.id,step:step.id});
    ACTIONS['skin-product-select']({id:'skin-example-fluide-leger'});
    assert.equal(skinDone(r,step),true);assert.equal(skinSession(r).steps.filter(s=>s==='done').length,3);
    assert.equal(skinRecordedProduct(r,step).name,'Crème hydratante');
    assert.equal(JSON.stringify(past),before);ACTIONS['skin-check-step']({routine:r.id,step:step.id});ACTIONS['skin-check-step']({routine:r.id,step:step.id});
    assert.equal(skinSession(r).skinEntries.find(s=>s.id===step.id).product.name,'Fluide hydratant léger');
    assert.equal(sessionComplete(skinSession(r)),true);assert.equal(JSON.stringify(past),before);`);
});
test('products with the same instruction retain their identities when reordered, removed and restored',({run})=>{
  run(ownRoutine);
  run(`const r=skinRoutine();for(const name of ['Sérum A','Sérum B']){ACTIONS['skin-add-type']({routine:r.id,type:'serum'});F['skin-product']({productName:name});}
    const before=skinSteps(r).filter(s=>s.type==='serum').map(s=>({id:s.id,name:s.product.name}));
    ACTIONS['skin-move-step']({routine:r.id,step:before[1].id,direction:'up'});
    assert.deepEqual(skinSteps(r).filter(s=>s.type==='serum').map(s=>s.product.name),['Sérum B','Sérum A']);
    ACTIONS['skin-check-step']({routine:r.id,step:before[1].id});
    ACTIONS['skin-remove-step']({routine:r.id,step:before[1].id});assert.ok(!skinSteps(r).some(s=>s.id===before[1].id));
    ACTIONS['skin-undo-remove']();const restored=skinSteps(r).find(s=>s.id===before[1].id);
    assert.equal(restored.product.name,'Sérum B');assert.equal(skinDone(r,restored),true);
    assert.equal(skinSteps(r).filter(s=>s.type==='serum').length,2);`);
});
test('morning and evening checks are independent, and a new day starts unchecked',({run})=>{
  run(ownRoutine);
  run(`const am=skinRoutine();ACTIONS['skin-check-all']({routine:am.id});
    ACTIONS['skin-moment']({value:'Soir'});ACTIONS['skin-own-routine']();const pm=skinRoutine();
    assert.equal(skinSession(pm),undefined);ACTIONS['skin-check-step']({routine:pm.id,step:skinSteps(pm)[0].id});
    assert.equal(sessionComplete(skinSession(am)),true);assert.equal(sessionComplete(skinSession(pm)),false);
    const before=JSON.stringify(M.sessions),NativeDate=Date;
    Date=class extends NativeDate{constructor(...args){super(...(args.length?args:[NativeDate.now()+86400000]));}static now(){return NativeDate.now()+86400000;}};
    assert.equal(skinSession(am),undefined);assert.equal(skinSession(pm),undefined);
    ACTIONS['skin-check-all']({routine:am.id});assert.equal(M.sessions.length,3);
    assert.equal(JSON.stringify(M.sessions.slice(0,2)),before);`);
});
test('product sheets are escapable; cancelling never inserts an unwanted step',({run})=>{
  run(ownRoutine);
  run(`const r=skinRoutine(),count=r.steps.length;ACTIONS['skin-add-open']({routine:r.id});
    ACTIONS['skin-add-type']({routine:r.id,type:'toner'});ACTIONS['skin-custom-open']();
    ACTIONS['skin-picker-show']();assert.match(document.getElementById('overlay').innerHTML,/Choisir mon produit/);
    ACTIONS.back();assert.equal(route,'ROU-01');assert.equal(r.steps.length,count);
    assert.equal(document.getElementById('overlay').innerHTML,'');
    go('ROU-02',{context:{routine:r.id}});ACTIONS['skin-moment']({value:'Soir'});
    assert.equal(route,'ROU-01');assert.equal(M.skinRoutineMoment,'Soir');`);
});
test('the selected saved skin plan is adopted; invalid ids cannot adopt a different plan',({run})=>{
  run(`M.subscription.status='active';const original={morning:['Nettoyer avec un produit toléré.'],evening:['Appliquer un hydratant.']};
    M.analyses=[{id:'old-skin',domain:'Peau',status:'complete',date:'2026-01-01',skinPlan:clone(original)}];
    M.skinPlan={morning:['Nouveau conseil'],evening:['Autre conseil']};
    const count=M.routines.length;ACTIONS['skin-apply-plan']({id:'missing'});assert.equal(M.routines.length,count);
    ACTIONS['skin-apply-plan']({id:'old-skin',moment:'Soir'});assert.equal(route,'ROU-01');assert.equal(M.skinRoutineMoment,'Soir');
    assert.equal(JSON.stringify(skinRoutine('Matin').steps),JSON.stringify(original.morning));assert.equal(JSON.stringify(skinRoutine('Soir').steps),JSON.stringify(original.evening));
    assert.equal(JSON.stringify(M.analyses[0].skinPlan),JSON.stringify(original));`);
});
test('opening routine from report preserves the user routine, and paid analysis stays gated',({run})=>{
  run(ownRoutine);
  run(`const r=skinRoutine();M.skinPlan=uxSkinPlan({});M.skinProfile={goal:'Confort'};
    ACTIONS['skin-plan-enter']({moment:'Matin'});assert.equal(skinRoutine().id,r.id);assert.equal(M.routines.filter(r=>r.generatedSkinPlan).length,0);
    ACTIONS['skin-apply-plan']();assert.equal(route,'PRE-01');assert.equal(M.routines.filter(r=>r.generatedSkinPlan).length,0);
    M.subscription.status='active';ACTIONS['skin-apply-plan']();assert.equal(skinRoutine('Matin').id,r.id);assert.equal(M.routines.filter(r=>r.generatedSkinPlan).length,0);
    M.skinTab='Matin';go('PEA-01');ACTIONS['skin-moment']({value:'Soir'});assert.equal(M.skinRoutineMoment,'Soir');assert.equal(M.skinTab,'Soir');`);
});
test('skin advice is preserved as advice and not converted into an extra product',({run})=>{
  run(`M.subscription.status='active';M.skinPlan=uxSkinPlan({sensitivity:'Souvent'});const plan=JSON.stringify(M.skinPlan);
    ACTIONS['skin-apply-plan']({moment:'Soir'});const r=skinRoutine();assert.equal(r.skinAdvice.length,1);
    assert.equal(skinSteps(r).length,3);assert.ok(skinSteps(r).every(s=>s.type!=='care'));
    ACTIONS['skin-routine-options']({routine:r.id});assert.match(document.getElementById('overlay').innerHTML,/Précautions/);closeModal(false);assert.equal(JSON.stringify(M.skinPlan),plan);
    for(const step of [...skinSteps(r)])ACTIONS['skin-remove-step']({routine:r.id,step:step.id});
    assert.equal(r.steps.length,0);assert.match(V['ROU-01'](),/Ajoutez votre premier soin/);
    assert.ok(!V['ROU-01']().includes('NaN'));assert.ok(!sessionComplete(skinSession(r)));`);
});
test('all product sheets have working actions, fields, icons and escaped product text',({run})=>{
  run(ownRoutine);
  run(`const r=skinRoutine();for(const type of Object.keys(SKIN_TYPES)){
    ACTIONS['skin-add-type']({routine:r.id,type});const html=document.getElementById('overlay').innerHTML;
    assert.ok(!/undefined|NaN|data-icon-missing/.test(html),type);
    for(const match of html.matchAll(/data-act="([^"]+)"/g))assert.equal(typeof ACTIONS[match[1]],'function');
    ACTIONS['skin-custom-open']();assert.match(document.getElementById('overlay').innerHTML,/data-form="skin-product"/);
  }`);
});
test('navigation tabs reset the application trail and never stack the same root',({run})=>{
  run(`go('SAV-01',{root:true});go('ANA-01');go('PRF-01',{root:true});
    assert.equal(trail.length,0);go('PRF-01',{root:true});assert.equal(trail.length,0);
    go('PRF-04');assert.equal(trail.length,1);back();assert.equal(route,'PRF-01');
    assert.equal(trail.length,0);assert.match(V['PRF-01'](),/data-go="PRF-04"/);
    assert.doesNotMatch(V['PRF-01'](),/Langue et région|Compte et synchronisation/);`);
});
test('obsolete entry links converge on the same chooser, photo and result routes',({run})=>{
  run(`for(const id of ['ENT-03','ENT-04','ANA-02','DEC-01']){
    go(id);assert.equal(route,'ANA-01');assert.equal(location.hash,'#ANA-01');
    assert.match(V[route](),/Choisissez votre analyse/);
  }
  assert.equal(resolveRoute('ANA-05'),'ANA-04');assert.equal(resolveRoute('ANA-07'),'ANA-06');
  assert.equal(resolveRoute('ANA-11'),'ANA-10');assert.equal(resolveRoute('ENT-01'),'ACC-01');`);
});
test('paused analyses have a visible resume on both roots and disappear only when complete',({run})=>{
  run(`assert.equal(experiencePending(),false);assert.doesNotMatch(V['ACC-01'](),/canonical-resume-analysis/);`);
  run(start('Peau'));
  run(`M.draft.photo='portrait';go('ACC-01',{root:true});assert.match(V['ACC-01'](),/canonical-resume-analysis/);
    assert.match(V['SAV-01'](),/Analyse de peau en cours/);ACTIONS['canonical-resume-analysis']();
    assert.equal(M.draft.domain,'Peau');assert.equal(route,'ANA-04');
    M.draft.photo='portrait';ACTIONS['canonical-analyze-photo']();ACTIONS['finish-analysis']();
    assert.equal(experiencePending(),false);assert.doesNotMatch(V['SAV-01'](),/canonical-resume-analysis/);`);
});
test('empty and populated try-on history use one destination and preserve the catalogue behind sheets',({run})=>{
  run(`go('SAV-01',{root:true});ACTIONS['saved-hair-sims']();assert.equal(route,'ESS-04');
    assert.match(V[route](),/Votre premier essai/);ACTIONS['hair-more']();assert.equal(route,'HAI-02');
    ACTIONS.choice({key:'hairLengthFilter',value:'Court'});ACTIONS['haircut-open']({id:'lob-soft'});
    assert.doesNotMatch(document.getElementById('overlay').innerHTML,/Pourquoi elle vous va|Votre correspondance/);
    ACTIONS.back();assert.equal(route,'HAI-02');assert.equal(M.hairLengthFilter,'Court');
    assert.equal(document.getElementById('overlay').innerHTML,'');
    back();assert.equal(route,'ESS-04');back();assert.equal(route,'SAV-01');
    M.simulations.push({id:'my-tryon',haircut:'lob-soft',image:'layers',type:'Simulation',domain:'Cheveux',date:DATE(),name:'Mon essai'});
    ACTIONS['saved-hair-sims']();assert.equal(route,'ESS-04');assert.match(V[route](),/my-tryon/);
    trail=[];back();assert.equal(route,'SAV-01');`);
});
test('named report sections and the selected section survive a catalogue detour',({run})=>{
  run(complete('Cheveux'));
  run(`M.subscription.status='active';go('ANA-10');ACTIONS['canonical-report-jump']({step:'0'});
    assert.equal(M.canonicalReportStep,0);const html=V['ANA-10']();
    for(const label of ['Visage','Coupes','À éviter'])assert.ok(html.includes('Ouvrir '+label));
    assert.match(html,/Explorer toutes les coupes/);ACTIONS['hair-more']();M.canonicalReportStep=1;
    back();assert.equal(route,'ANA-10');assert.equal(M.canonicalReportStep,0);
    assert.doesNotThrow(()=>studioHairList(true,report().id));`);
});
test('colour applications use the selected saved season without rewriting the latest one',({run})=>{
  run(`M.colorProfile={season:'deep_winter'};const old={domain:'Colorimétrie',season:'light_spring'};
    const before=canonicalColorPanel('Applications',old);assert.match(before,/Hauts & accessoires|Bases & pantalons/);
    assert.ok(before.includes(COLOR12_SEASONS.light_spring.colors[0][1]));
    assert.ok(canonicalReportTabs('Colorimétrie',old).includes('Applications'));
    M.colorProfile.season='deep_autumn';assert.equal(canonicalColorPanel('Applications',old),before);
    for(const invalid of ['Bientôt','undefined','[object Object]'])assert.ok(!before.includes(invalid));`);
});
test('comparison choices exclude other analysis domains and clear old selections when changed',({run})=>{
  run(`M.subscription.status='active';M.analyses=[
    {id:'hair-a',domain:'Cheveux',status:'complete',date:'2026-01-01'},
    {id:'hair-b',domain:'Cheveux',status:'complete',date:'2026-02-01'},
    {id:'skin-a',domain:'Peau',status:'complete',date:'2026-02-02'}];
    ACTIONS['canonical-compare-analyses']({domain:'Cheveux'});const html=V['PRO-02']();
    assert.match(html,/value="hair-a"/);assert.match(html,/value="hair-b"/);assert.doesNotMatch(html,/value="skin-a"/);
    F.compare({first:'hair-a',second:'hair-b'});assert.ok(M.comparison);
    ACTIONS.choice({key:'compareDomain',value:'Peau'});assert.equal(M.comparison,null);
    assert.equal(M.compareFirst,null);assert.match(V['PRO-02'](),/Encore un peu tôt/);`);
});
test('morning and evening tracking stays separated, including after the source routine is removed',({run})=>{
  run(ownRoutine);
  run(`const am=skinRoutine();ACTIONS['skin-check-all']({routine:am.id});
    ACTIONS['skin-moment']({value:'Soir'});ACTIONS['skin-own-routine']();const pm=skinRoutine();
    ACTIONS['skin-view-progress']();assert.equal(M.progressMoment,'Soir');assert.equal(route,'PRO-01');
    assert.ok(V['PRO-01']().includes('<strong>0 / 7</strong>'));
    ACTIONS['skin-check-all']({routine:pm.id});assert.equal(skinSession(pm).skinMoment,'Soir');
    M.routines=M.routines.filter(r=>r.id!==pm.id);assert.ok(V['PRO-01']().includes('<strong>1 / 7</strong>'));
    M.sessions.push({ref:'empty',date:DATE(),confirmed:true,steps:[]});
    assert.equal(goalCount({routine:'empty',date:DATE()}),0);`);
});
test('journal editing keeps the selected note and saving returns to the journal tab',({run})=>{
  run(`go('ACC-01',{root:true});go('PRO-01');ACTIONS.choice({key:'experienceProgressTab',value:'Journal'});ACTIONS['journal-new']();
    F.observation({date:DATE(),feeling:'Confortable',note:'Première note'});assert.equal(route,'PRO-01');assert.equal(M.lgJournal,true);
    const id=M.observations[0].id;ACTIONS['journal-open']({id});assert.equal(M.observationEdit.id,id);
    F.observation({date:DATE(),feeling:'Confortable',note:'Note corrigée'});assert.equal(M.observations.length,1);
    assert.match(V['PRO-01'](),/Note corrigée/);ACTIONS.back();assert.equal(route,'ACC-01');`);
});
test('removing reports removes derived results while keeping custom products and routine checks',({run})=>{
  run(ownRoutine);
  run(`const r=skinRoutine();ACTIONS['skin-replace-open']({routine:r.id,step:skinSteps(r)[0].id});
    F['skin-product']({productName:'Mon nettoyant'});ACTIONS['skin-check-all']({routine:r.id});
    M.hairProfile={shape:'Ovale'};M.colorProfile={season:'deep_winter'};M.skinPlan=uxSkinPlan({});M.skinProfile={goal:'Confort'};
    const products=JSON.stringify(M.skinCareProducts),sessions=JSON.stringify(M.sessions);
    go('PRF-08');M.dataOperation={type:'Retirer',categories:['Rapports']};ACTIONS['execute-data']();
    assert.equal(M.hairProfile,null);assert.equal(M.colorProfile,null);assert.equal(M.skinPlan,null);assert.equal(M.skinProfile,null);
    assert.equal(M.analyses.length,0);assert.equal(JSON.stringify(M.skinCareProducts),products);
    assert.equal(JSON.stringify(M.sessions),sessions);assert.ok(skinRoutine('Matin'));`);
});
test('removing routines and products does not silently readopt the saved skin plan',({run})=>{
  run(ownRoutine);
  run(`M.subscription.status='active';M.skinPlan=uxSkinPlan({});go('PRF-08');
    M.dataOperation={type:'Retirer',categories:['Routines']};ACTIONS['execute-data']();
    assert.equal(M.routines.length,0);assert.equal(M.skinCareProducts.length,0);
    ACTIONS['skin-open-routine']({moment:'Matin'});assert.equal(M.routines.length,0);
    assert.match(V['ROU-01'](),/Utiliser ma routine conseillée/);assert.ok(M.skinPlan);`);
});
test('deleting try-ons removes the gallery records without refunding spent generations',({run})=>{
  run(`M.subscription.status='active';M.hairGenerations.used=4;
    M.simulations=[{id:'old-tryon',date:DATE(),type:'Simulation',haircut:'lob-soft',name:'Essai'}];
    M.context.simulation='old-tryon';go('PRF-08');F.data({operation:'Retirer',dataEssais:true});
    assert.equal(M.simulations.length,1);ACTIONS['execute-data']();assert.equal(M.simulations.length,0);
    assert.equal(M.context.simulation,null);assert.equal(M.hairGenerations.used,4);
    ACTIONS['saved-hair-sims']();assert.match(V[route](),/Votre premier essai/);`);
});
test('analysis comparison never exposes full report findings before the existing paywall',({run})=>{
  run(`M.compareMode='Analyses';M.analyses=[
    {id:'a',domain:'Cheveux',date:DATE(),faceShape:'Ovale',findings:['Rapport réservé']},
    {id:'b',domain:'Cheveux',date:DATE(),faceShape:'Rond',findings:['Rapport réservé']}];
    M.comparison=['a','b'];assert.doesNotMatch(comparisonContent(M.analyses),/Rapport réservé/);
    assert.match(comparisonContent(M.analyses),/Voir mon aperçu/);M.subscription.status='active';
    assert.match(comparisonContent(M.analyses),/Rapport réservé/);`);
});
test('a category opens its latest result directly; History and a new analysis return to that report',({run})=>{
  run(complete('Cheveux'));
  run(`M.subscription.status='active';const first=M.analyses[0].id;go('SAV-01',{root:true});
    ACTIONS['lg-results-domain']({domain:'Cheveux'});assert.equal(route,'ANA-10');assert.equal(report().id,first);
    assert.equal(canonicalReportTabs('Cheveux',report())[0],'Coupes');
    assert.match(V[route](),/Vos meilleures coupes/);assert.doesNotMatch(V[route](),/canonical-report-nav|Suivant ·/);
    ACTIONS['lg-history-domain']({domain:'Cheveux'});assert.equal(route,'ANA-12');back();assert.equal(route,'ANA-10');
    ACTIONS['studio-analysis']({domain:'Cheveux'});assert.equal(route,'ANA-04');back();
    assert.equal(route,'ANA-10');assert.equal(report().id,first);back();assert.equal(route,'SAV-01');`);
});
test('the first visit presents analysis before care, and Home checks update the selected routine only',({run})=>{
  run(`const emptyHome=V['ACC-01']();assert.ok(emptyHome.indexOf('Votre première analyse')<emptyHome.indexOf('Mes soins'));
    ACTIONS['skin-home-create']({moment:'Matin'});const am=skinRoutine('Matin');
    go('ACC-01',{root:true});ACTIONS['skin-home-moment']({value:'Matin'});
    const html=V['ACC-01']();assert.match(html,/skin-check-step/);assert.match(html,/Gérer/);
    assert.ok(html.indexOf('Mes soins')<html.indexOf('Votre première analyse'));
    ACTIONS['skin-check-step']({routine:am.id,step:skinSteps(am)[0].id});assert.equal(route,'ACC-01');
    assert.equal(skinDone(am,skinSteps(am)[0]),true);
    ACTIONS['skin-home-moment']({value:'Soir'});assert.equal(route,'ACC-01');assert.match(V[route](),/Ajouter mes produits/);
    assert.equal(skinRoutine('Soir'),undefined);assert.equal(skinDone(am,skinSteps(am)[0]),true);`);
});
test('simplified report tabs retain colour advice, neutral colours and skin priorities',({run})=>{
  run(complete('Colorimétrie'));
  run(`const color=report();assert.deepEqual(canonicalReportTabs('Colorimétrie',color),['Palette','Applications','Saison']);
    const use=canonicalColorPanel('Applications',color);assert.match(use,/Les couleurs à nuancer|Mes repères pour une coloration/);
    assert.ok(use.includes(COLOR12_SEASONS[color.season].neutrals[0][1]));`);
  run(complete('Peau'));
  run(`const skin=report();assert.deepEqual(canonicalReportTabs('Peau',skin),['Matin','Soir','Bilan']);
    assert.equal(skinRoutines().length,0);uxActivatePremium();assert.match(canonicalSkinPanel('Matin',skin),/skin-check-step/);
    const bilan=canonicalSkinPanel('Bilan',skin);for(const label of ['Qualité','Uniformité du teint','Grain de peau','Éclat du teint','Mes priorités'])assert.ok(bilan.includes(label));
    for(const score of [78,82,74])assert.ok(bilan.includes(score+'/100')||bilan.includes('>'+score+'<'));
    assert.ok(!bilan.includes('<details'));assert.match(bilan,/pas un diagnostic médical/);assert.match(bilan,/Scores illustratifs/);`);
});
test('skin scores belong to the saved report and never invent a previous measurement',({run,elements})=>{
  run(complete('Peau'));
  run(`const first=report();assert.equal(first.skin.score,68);assert.equal(first.skinScoreSource,'demo/skin-v1');
    assert.equal(skinScorePrior(first),null);assert.notEqual(first.skin,SKIN_SCORE_DEMO);
    assert.equal(Math.round(first.skin.metrics.reduce((sum,m)=>sum+m.score*({redness:.3,evenness:.3,shine:.2,underEye:.2}[m.key]),0)),first.skin.score);
    const legacy={id:'legacy',domain:'Peau',skinProfile:first.skinProfile,skinPlan:first.skinPlan};
    M.analyses.unshift(legacy);assert.equal(skinScorePrior(first),null);assert.equal(skinScoreData(legacy).demo,true);
    M.subscription.status='active';ACTIONS['skin-score-detail']({id:first.id,key:'redness'});`);
  assert.match(elements.get('overlay').innerHTML,/72/);
  assert.match(elements.get('overlay').innerHTML,/Revenir au bilan/);
  run(`closeModal();assert.equal(document.getElementById('app').inert,false);`);
  run(complete('Peau'));
  run(`const second=report();assert.equal(skinScorePrior(second).skin.score,68);assert.equal(skinScoreDelta(68,68),'0 pt');
    assert.equal(skinScoreDelta(55,68),'-13 pts');assert.match(BEAUTY_OLD.skin(second),/0 pt depuis/);
    M.subscription.status='expired';ACTIONS['skin-score-detail']({id:second.id,key:'redness'});assert.equal(route,'PRE-01');
    assert.equal(document.getElementById('overlay').innerHTML,'');`);
});

// The redesigned reports must continue to render the saved analysis snapshot.
for(const season of ['bright_spring','warm_spring','light_spring','light_summer','cool_summer','soft_summer','soft_autumn','warm_autumn','deep_autumn','deep_winter','cool_winter','bright_winter']){
  test(season+' saved report retains every palette and neutral HEX independently of the latest profile',({run})=>{
    run(`const sid=${JSON.stringify(season)},latest=sid==='deep_winter'?'light_spring':'deep_winter';
      M.subscription.status='active';M.colorProfile={season:latest};
      M.analyses=[{id:'saved-color',domain:'Colorimétrie',status:'complete',date:'2026-01-01',season:sid},
        {id:'latest-color',domain:'Colorimétrie',status:'complete',date:'2026-09-07',season:latest}];
      const saved=JSON.stringify(M.analyses[0]),s=COLOR12_SEASONS[sid];
      go('SAV-01',{root:true});ACTIONS['lg-history-domain']({domain:'Colorimétrie'});
      ACTIONS['lg-history-report-open']({domain:'Colorimétrie',id:'saved-color'});
      assert.equal(route,'ANA-10');assert.equal(report().id,'saved-color');
      const palette=V[route]();
      assert.deepEqual([...palette.matchAll(/style="--swatch:([^"]+)"/g)].map(match=>match[1]),[...s.colors,...s.neutrals].map(pair=>pair[1]));
      for(const [name] of [...s.colors,...s.neutrals])assert.ok(palette.includes('data-name="'+esc(name)+'"'));
      assert.equal((palette.match(/data-act="beauty-swatch"/g)||[]).length,s.colors.length+s.neutrals.length);
      ACTIONS['canonical-report-jump']({step:1});const applications=V[route]();
      assert.ok(applications.includes(esc(s.hair.best[0])));for(const name of s.metals)assert.ok(applications.includes(esc(name)));
      const makeupPreview=applications.match(/<button[^>]*data-kind="makeup"[^>]*>(.*?)<[/]button>/s)[1];
      const previewShades=[...makeupPreview.matchAll(/title="([^"]+)"/g)].map(match=>match[1]);
      assert.ok(previewShades.length>0,'Every season must offer a makeup shade');
      ACTIONS['beauty-color-detail']({id:'saved-color',kind:'makeup'});
      const makeupDetail=document.getElementById('overlay').innerHTML;
      assert.deepEqual(previewShades,[...makeupDetail.matchAll(/data-name="([^"]+)"/g)].map(match=>match[1]));
      if(sid==='deep_winter')assert.deepEqual(previewShades,['Rouge profond','Magenta','Rose glacé']);
      closeModal(false);
      for(const name of ['hair','makeup','metals','clothes','avoid'])assert.ok(applications.includes('data-kind="'+name+'"'));
      assert.ok(applications.includes('data-id="saved-color" data-season="'+sid+'"'));
      ACTIONS['canonical-report-jump']({step:2});const profile=V[route]();
      for(const axis of s.axes)assert.ok(profile.includes(esc(axis)));
      assert.ok(profile.includes(s.colors[0][1]));assert.equal(M.colorProfile.season,latest);
      assert.equal(JSON.stringify(M.analyses[0]),saved);`);
  });
}
test('color detail actions honor the report season, validate IDs, and require entitlement',({run})=>{
  run(`M.subscription.status='active';M.colorProfile={season:'deep_winter'};
    M.analyses=[{id:'spring-report',domain:'Colorimétrie',status:'complete',date:DATE(),season:'light_spring'},
      {id:'not-color',domain:'Peau',status:'complete',date:DATE()}];
    go('ANA-10',{context:{analysis:'spring-report'}});const s=COLOR12_SEASONS.light_spring;
    ACTIONS['beauty-swatch']({id:'spring-report',season:'deep_winter',name:s.colors[0][0]});
    assert.ok(document.getElementById('overlay').innerHTML.includes(s.colors[0][1].toUpperCase()));
    assert.match(document.getElementById('overlay').innerHTML,/Light Spring/);closeModal(false);
    for(const kind of ['clothes','hair','makeup','metals','avoid']){
      ACTIONS['beauty-color-detail']({id:'spring-report',season:'deep_winter',kind});const html=document.getElementById('overlay').innerHTML;
      assert.match(html,/Revenir au rapport/);
      if(kind==='clothes'){for(const [,color] of [...s.colors,...s.neutrals])assert.ok(html.includes(color));}
      if(kind==='hair'){for(const name of [...s.hair.best,...s.hair.avoid])assert.ok(html.includes(esc(name)));}
      if(kind==='metals'){for(const name of s.metals)assert.ok(html.includes(esc(name)));}
      if(kind==='avoid'){for(const pair of s.avoid)assert.ok(html.includes(pair[0][1])&&html.includes(pair[1][1]));}
      if(kind==='makeup')assert.ok(html.includes('data-id="spring-report" data-season="light_spring"'));
      closeModal(false);
    }
    const current=report().id,profile=JSON.stringify(M.colorProfile);
    ACTIONS['beauty-season-preview']({season:'warm_autumn'});assert.match(document.getElementById('overlay').innerHTML,/profil reste inchangé/);
    closeModal(false);ACTIONS['beauty-swatch']({season:'warm_autumn',name:COLOR12_SEASONS.warm_autumn.colors[0][0]});
    assert.match(document.getElementById('overlay').innerHTML,/Warm Autumn/);closeModal(false);
    assert.equal(report().id,current);assert.equal(JSON.stringify(M.colorProfile),profile);
    for(const id of ['missing','not-color']){
      ACTIONS['beauty-swatch']({id,season:'light_spring',name:s.colors[0][0]});
      ACTIONS['beauty-color-detail']({id,season:'light_spring',kind:'clothes'});assert.equal(document.getElementById('overlay').innerHTML,'');
    }
    ACTIONS['beauty-swatch']({id:'spring-report',name:'Unknown shade'});assert.equal(document.getElementById('overlay').innerHTML,'');
    for(const status of ['free','expired','pending']){
      M.subscription.status=status;
      ACTIONS['beauty-swatch']({id:'spring-report',name:s.colors[0][0]});
      ACTIONS['beauty-color-detail']({id:'spring-report',kind:'hair'});
      assert.equal(document.getElementById('overlay').innerHTML,'');assert.equal(M.subscription.status,status);
      ACTIONS['beauty-season-preview']({season:'warm_autumn'});assert.match(document.getElementById('overlay').innerHTML,/profil reste inchangé/);closeModal(false);
      assert.equal(report().id,current);assert.equal(JSON.stringify(M.colorProfile),profile);
    }
    M.subscription.status='cancelled';ACTIONS['beauty-color-detail']({id:'spring-report',kind:'hair'});
    assert.match(document.getElementById('overlay').innerHTML,/Conseils coloration/);`);
});
test('new skin quality demo is persisted separately from the original four skin-v1 scores',({run})=>{
  run(complete('Peau'));
  run(`const first=report();assert.equal(first.skinVisualReport.source,'demo/skin-quality-v1');
    assert.equal(first.skinVisualReport.score,78);
    assert.equal(JSON.stringify(first.skinVisualReport.metrics.map(m=>[m.key,m.label,m.score])),JSON.stringify([
      ['tone','Uniformité du teint',82],['texture','Grain de peau',74],['radiance','Éclat du teint',78]]));
    assert.notEqual(first.skinVisualReport,BEAUTY_SKIN_DEMO);assert.notEqual(first.skinVisualReport.metrics,BEAUTY_SKIN_DEMO.metrics);
    assert.equal(first.skin.score,68);assert.equal(first.skinScoreSource,'demo/skin-v1');
    assert.equal(JSON.stringify(first.skin.metrics.map(m=>[m.key,m.score])),JSON.stringify([['redness',72],['evenness',64],['shine',81],['underEye',55]]));
    assert.deepEqual(JSON.parse(sessionStorage.getItem('beautify-mockup-v2')).analyses.find(r=>r.id===first.id).skinVisualReport,first.skinVisualReport);
    const stored=JSON.stringify(first);ACTIONS['finish-analysis']();assert.equal(M.analyses.length,1);assert.equal(JSON.stringify(first),stored);
    first.skinVisualReport.score=63;first.skinVisualReport.metrics[0].score=61;
    assert.equal(BEAUTY_SKIN_DEMO.score,78);assert.equal(BEAUTY_SKIN_DEMO.metrics[0].score,82);`);
  run(complete('Peau'));
  run(`const second=report();assert.equal(second.skinVisualReport.score,78);assert.equal(second.skinVisualReport.metrics[0].score,82);
    M.subscription.status='active';ACTIONS['lg-history-report-open']({domain:'Peau',id:M.analyses[0].id});
    ACTIONS['canonical-report-jump']({step:2});const html=V[route]();
    assert.match(html,/Qualité/);assert.ok(html.includes('>63</strong>'));assert.match(html,/Uniformité du teint : 61 sur 100/);
    ACTIONS['beauty-skin-detail']({id:M.analyses[0].id,key:'tone'});
    assert.ok(document.getElementById('overlay').innerHTML.includes('61<span> /100'));closeModal(false);
    M.subscription.status='expired';ACTIONS['beauty-skin-detail']({id:M.analyses[0].id,key:'tone'});
    assert.equal(route,'PRE-01');assert.equal(document.getElementById('overlay').innerHTML,'');`);
});
test('real skin-v1 results retain original labels and scores instead of being reinterpreted as demo quality',({run})=>{
  run(`const real={id:'real-skin',domain:'Peau',status:'complete',date:DATE(),skinScoreSource:'vision/skin-v1',
      skin:clone(SKIN_SCORE_DEMO),skinPlan:uxSkinPlan({}),skinProfile:{goal:'Confort',traits:[]}};
    real.skin.score=42;real.skin.metrics.forEach((metric,i)=>{metric.score=31+i;metric.source='vision';});
    M.analyses=[real];M.subscription.status='active';M.draft={...clone(initial().draft),domain:'Peau',reportId:real.id,status:'complete'};
    go('ANA-10',{context:{analysis:real.id}});ACTIONS['canonical-report-jump']({step:2});
    const before=JSON.stringify(real),html=V[route]();
    assert.match(html,/Score global 42 sur 100/);for(const key of SKIN_SCORE_KEYS)assert.ok(html.includes(SKIN_SCORE_COPY[key].label));
    assert.doesNotMatch(html,/beauty-skin-metric|Uniformité du teint|Grain de peau|Éclat du teint|Scores illustratifs/);
    assert.equal(skinScoreData(real).demo,false);assert.equal(skinScoreData(real).skin,real.skin);
    ACTIONS['finish-analysis']();assert.equal(real.skinVisualReport,undefined);assert.equal(JSON.stringify(real),before);
    ACTIONS['skin-score-detail']({id:real.id,key:'redness'});assert.ok(document.getElementById('overlay').innerHTML.includes('31<span> /100'));
    assert.doesNotMatch(document.getElementById('overlay').innerHTML,/Exemple de démonstration/);closeModal(false);
    ACTIONS['beauty-skin-detail']({id:real.id,key:'tone'});assert.equal(document.getElementById('overlay').innerHTML,'');`);
});
test('redesigned color loading uses illustration while keeping timer cancellation, resume and idempotency',({run,probes,tick,pending})=>{
  run(start('Colorimétrie'));
  run(`loadPhoto({type:'image/png',size:1024},'analysis');`);probes.at(-1).onload();
  run(`const selected=M.draft.photo,blob=memoryPhotos[selected],html=V['ANA-08']();
    assert.equal(route,'ANA-08');assert.match(html,/beauty-color-loading/);assert.match(html,/color-fan.png/);
    assert.ok(!html.includes(blob));assert.equal(M.draft.photo,selected);assert.equal(M.analyses.length,0);
    go('ACC-01');`);
  assert.equal(pending(2300),0);tick(2300);run(`assert.equal(M.analyses.length,0);ACTIONS['canonical-resume-analysis']();`);
  assert.equal(pending(2300),1);tick(2300);
  run(`assert.equal(route,'ANA-09');assert.equal(M.analyses.length,1);assert.equal(report().photo,selected);
    assert.equal(report().skinVisualReport,undefined);assert.match(V[route](),/beauty-color-reveal/);
    assert.ok(V[route]().includes(blob));const saved=JSON.stringify(report());
    ACTIONS['finish-analysis']();go('ANA-08');assert.equal(route,'ANA-09');assert.equal(M.analyses.length,1);assert.equal(JSON.stringify(report()),saved);`);
  assert.equal(pending(2300),0);
});
test('capture requires a photo and an explicit photo action before saving a report',({run,pending})=>{
  run(`ACTIONS['studio-analysis']({domain:'Colorimétrie'});ACTIONS['finish-analysis']();
    assert.equal(route,'ANA-04');assert.equal(M.analyses.length,0);assert.equal(M.draft.status,'draft');
    M.draft.photo='portrait';go('ANA-08');assert.equal(route,'ANA-04');
    ACTIONS['finish-analysis']();assert.equal(route,'ANA-04');assert.equal(M.analyses.length,0);
    assert.equal(M.draft.consent,false);ACTIONS['canonical-analyze-photo']();assert.equal(route,'ANA-08');
    assert.equal(M.draft.consent,true);ACTIONS['finish-analysis']();assert.equal(M.analyses.length,1);`);
  assert.equal(pending(2300),0);
});
test('saved report illustration never borrows a newer draft photo',({run})=>{
  run(`M.draft.photo='new-draft';memoryPhotos['new-draft']='blob:new-draft';memoryPhotos['old-photo']='blob:old-photo';
    assert.match(beautyPortrait(null),/blob:new-draft/);
    assert.match(beautyPortrait({photo:'old-photo'}),/blob:old-photo/);
    assert.doesNotMatch(beautyPortrait({photo:'removed'}),/blob:new-draft/);
    assert.doesNotMatch(beautyPortrait({}),/blob:new-draft/);
    assert.match(beautyPortrait({}),/Portrait d’illustration/);`);
});
console.log(JSON.stringify({ checks, errors: [], scope: 'Actual application handlers with simulated DOM, history, file loading and timers; no browser visual test' }, null, 2));
