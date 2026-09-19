const fs=require('node:fs');
const assert=require('node:assert/strict');
const prefix=fs.readFileSync('tests/flow-runtime.cjs','utf8').split('let checks = 0;')[0];
const runtime=new Function('require',prefix+'\nreturn runtime;')(require);
let checks=0;
function test(name,fn){try{fn(runtime());checks++;}catch(error){error.message=name+': '+error.message;throw error;}}
const complete=`ACTIONS['hair-start-analysis']();M.draft.photo='portrait';M.draft.answers=canonicalEngineAnswers('Cheveux');ACTIONS['canonical-analyze-photo']();ACTIONS['finish-analysis']();`;

test('first Hair visit has one clear analysis action',({run})=>run(`
  go('ANA-01');ACTIONS['studio-analysis']({domain:'Cheveux'});assert.equal(route,'HAI-01');const html=V['HAI-01']();
  assert.match(html,/Votre prochaine coupe commence ici/);
  assert.match(html,/Trouver mes coupes/);
  assert.doesNotMatch(html,/canonical-report-rail|hair-trials-grid|quota/);
`));

test('variant A shows real proof, three tokens and five locked alternatives',({run})=>run(complete+`
  assert.equal(route,'ANA-09');M.hairPrepayVariant='A';const html=V['ANA-09']();
  assert.match(html,/Une première coupe se révèle/);
  assert.equal((html.match(/hair-simple-tokens/g)||[]).length,1);
  assert.equal((html.match(/hair-prepay-locked-cut/g)||[]).length,5);
  assert.match(html,/Votre meilleure correspondance/);
  assert.match(html,/Voir les 6 coupes et essayer sur ma photo/);
  assert.doesNotMatch(html,/Consigne salon|Essayer sur ma photo/);
`));

test('variant B uses the analysis photo and keeps every look obscured',({run})=>run(complete+`
  M.hairPrepayVariant='B';const html=V['ANA-09']();
  assert.match(html,/6 coupes à comparer/);
  assert.match(html,/hair-prepay-user-photo/);
  assert.equal((html.match(/hair-prepay-mini"/g)||[]).length,5);
  assert.match(html,/Voir mes coupes et débloquer 10 essais/);
  assert.doesNotMatch(html,/Consigne salon|Pourquoi elle fonctionne/);
`));

test('Hair prepay opens the unchanged shared paywall and returns to the simple result',({run})=>run(complete+`
  const id=report().id;ACTIONS['hair-prepay-unlock']({id});assert.equal(route,'PRE-01');
  const paywall=V['PRE-01']();assert.match(paywall,/59,99/);assert.match(paywall,/9,99/);
  ACTIONS.subscribe();assert.equal(canonicalOwned(),true);assert.equal(report().id,id);
  const result=V[route]();assert.match(result,/Les coupes faites pour vous/);
  assert.equal((result.match(/class="hair-simple-recommendation(?: |")/g)||[]).length,3);
  assert.doesNotMatch(result,/canonical-report-rail|data-act="canonical-report-jump"|>À éviter<|>Essais|>Historique<|>Nouvelle analyse</);
`));

test('cut page gives a concrete result, upkeep and salon guidance',({run})=>run(complete+`
  uxActivatePremium();const id=report().id;ACTIONS['hair-simple-cut']({id:'lob-soft',analysis:id});
  assert.equal(route,'HAI-03');const html=V['HAI-03']();
  assert.match(html,/Sous les clavicules, facile à attacher/);assert.match(html,/Entretien/);
  assert.match(html,/À montrer au salon/);assert.match(html,/Essayer sur ma photo/);
  assert.match(html,/Changer le portrait de référence/);
  assert.match(html,/1 essai utilisé si le résultat aboutit/);
  assert.doesNotMatch(html,/Pourquoi elle fonctionne|Textures adaptées|Choisissez un mannequin|Voir une autre coupe/);
`));

test('existing analysis photo starts generation directly and result is the visual priority',({run,tick})=>{
  run(complete+`uxActivatePremium();const id=report().id;report().photo='photo-current';memoryPhotos['photo-current']='blob:current';ACTIONS['hair-simple-cut']({id:'lob-soft',analysis:id});ACTIONS['haircut-simulate']({id:'lob-soft',analysis:id});
    assert.equal(route,'ESS-02');assert.ok(M.haircutDraft);assert.equal(M.hairGenerations.used,0);
    const loader=V['ESS-02']();assert.match(loader,/Votre look se crée/);assert.doesNotMatch(loader,/Quitter|quota/);`);
  tick(1800);
  run(`assert.equal(route,'ESS-03');assert.equal(M.hairGenerations.used,1);assert.equal(M.simulations.length,1);
    const html=V['ESS-03']();assert.match(html,/À montrer au salon/);assert.match(html,/Aperçu catalogue · maquette/);assert.match(html,/Copier/);assert.match(html,/Partager/);assert.match(html,/Essayer une autre coupe/);
    assert.doesNotMatch(html,/Enregistré|essais restants|quota|Voir tous mes looks/);`);
});

test('generation failure consumes nothing and retry succeeds once',({run,tick})=>{
  run(complete+`uxActivatePremium();const id=report().id;report().photo='photo-current';memoryPhotos['photo-current']='blob:current';M.scenario='error';ACTIONS['hair-simple-cut']({id:'bob',analysis:id});ACTIONS['haircut-simulate']({id:'bob',analysis:id});
    assert.equal(route,'ESS-02');assert.equal(M.hairGenerations.used,0);assert.equal(M.simulations.length,0);
    const html=V['ESS-02']();assert.match(html,/Rien n’a été consommé/);assert.match(html,/Réessayer/);assert.match(html,/Retour à la coupe/);
    ACTIONS['hair-generation-retry']();assert.equal(M.scenario,'normal');`);
  tick(1800);
  run(`assert.equal(route,'ESS-03');assert.equal(M.hairGenerations.used,1);assert.equal(M.simulations.length,1);ACTIONS['finish-haircut']();assert.equal(M.hairGenerations.used,1);`);
});

test('Hair home exposes saved looks, including while another trial is in progress',({run})=>run(complete+`
  uxActivatePremium();const id=report().id;M.simulations=[{id:'look1',domain:'Cheveux',haircut:'bob',source:'portrait',date:DATE(),previewModel:'clara'},{id:'look2',domain:'Cheveux',haircut:'cascade',source:'portrait',date:DATE(),previewModel:'clara'}];
  M.haircutDraft={id:'draft',haircut:'bob',source:'portrait',analysis:id};go('HAI-01');const draftHome=V['HAI-01']();assert.match(draftHome,/Continuer mon essai/);assert.match(draftHome,/Mes looks/);assert.match(draftHome,/data-id="look1"/);
  M.haircutDraft=null;render();const home=V['HAI-01']();assert.match(home,/Ouvrir mon dernier look/);assert.match(home,/Looks précédents/);assert.match(home,/data-id="look1"/);
  ACTIONS['hair-simple-look']({id:'look1'});assert.equal(route,'ESS-03');assert.equal(M.context.simulation,'look1');
  ACTIONS['saved-hair-sims']();assert.equal(route,'HAI-01');assert.match(V['HAI-01'](),/Mes looks/);
`));

test('historical recommendations keep their saved answers when the current profile changes',({run})=>run(complete+`
  const old=report();old.hairProfile={texture:'Crépus',length:'Mi-long',shape:'Rond',change:'Visible',fringe:'Oui',care:'Modéré'};
  const before=hairSimpleCuts(old).map(c=>c.id).join(',');M.hairProfile={texture:'Raides',length:'Long',shape:'Ovale',change:'Discret',fringe:'Non',care:'Très simple'};
  assert.equal(hairSimpleCuts(old).map(c=>c.id).join(','),before);
  assert.notEqual(hairSimpleCuts({hairProfile:M.hairProfile}).map(c=>c.id).join(','),before);
`));

test('a saved trial stays accessible even if its analysis is no longer present',({run})=>run(`
  M.simulations=[{id:'orphan-look',domain:'Cheveux',haircut:'bob',source:'portrait',date:DATE()}];go('HAI-01');
  assert.match(V['HAI-01'](),/Mes looks/);ACTIONS['hair-simple-look']({id:'orphan-look'});assert.equal(route,'ESS-03');
`));

test('an expired temporary photo resumes on the chosen cut instead of looping',({run})=>run(complete+`
  uxActivatePremium();const id=report().id;M.haircutDraft={id:'draft',haircut:'cascade',source:'photo-expired',analysis:id};go('HAI-01');
  ACTIONS['hair-simple-resume']();assert.equal(route,'HAI-03');assert.equal(M.haircutSelected,'cascade');assert.equal(M.haircutDraft,null);
  const html=V['HAI-03']();assert.match(html,/Dégradé cascade/);assert.match(html,/Essayer sur ma photo/);
`));

test('home recommendations reuse the same three readable cards as the report',({run})=>run(complete+`
  uxActivatePremium();go('HAI-01');const html=V['HAI-01']();
  assert.match(html,/hair-simple-home hair-simple-result hair-home-ready/);
  assert.equal((html.match(/class="hair-simple-recommendation(?: |")/g)||[]).length,3);
  assert.match(html,/hair-result-action-art/);assert.doesNotMatch(html,/hair-home-suggestions/);
`));

test('cut controls preserve the expanded chooser and separate scrolling from the primary action',({run})=>run(complete+`
  uxActivatePremium();ACTIONS['hair-simple-cut']({id:'lob-soft',analysis:report().id});
  let html=V['HAI-03']();assert.match(html,/hair-cut-content/);assert.doesNotMatch(html,/hair-cut-model" open/);
  hairSimpleModelExpanded=true;ACTIONS['hair-simple-model']({id:'amina'});
  html=V['HAI-03']();assert.match(html,/hair-cut-model" open/);assert.match(html,/scissors-real.png/);
  assert.ok(html.includes('</details></div><div class="hair-cut-footer"><button'));assert.match(html,/hair-cut-try/);
  ACTIONS['hair-simple-cut']({id:'cascade',analysis:report().id});assert.equal(hairSimpleModelExpanded,false);
`));

test('catalogue is secondary, naturally scrollable and cards are fully clickable',({run})=>run(complete+`
  uxActivatePremium();ACTIONS['hair-simple-catalog']({analysis:report().id});assert.equal(route,'HAI-02');let html=V['HAI-02']();
  assert.match(html,/Toutes les coupes/);assert.equal((html.match(/hair-simple-catalogue-card/g)||[]).length,6);
  assert.doesNotMatch(html,/hair-carousel|Aperçu adapté automatiquement|data-act="hair-model"/);
  ACTIONS['hair-simple-filter']({value:'Toutes'});html=V['HAI-02']();assert.equal((html.match(/hair-simple-catalogue-card/g)||[]).length,12);
`));

test('global navigation and non-Hair modules keep their destinations',({run})=>run(`
  const navigation=nav();assert.match(navigation,/Accueil/);assert.match(navigation,/Analyses/);assert.match(navigation,/Profil/);
  assert.match(navigation,/data-go="ACC-01"/);assert.match(navigation,/data-go="ANA-01"/);assert.match(navigation,/data-go="PRF-01"/);
  assert.doesNotMatch(V['COL-01'](),/hair-simple-/);assert.doesNotMatch(V['PEA-01'](),/hair-simple-/);
  M.simulations=[{id:'generic-look',name:'Aperçu générique',source:'bun',image:'layers',look:'layers',type:'Simulation',domain:'Maquillage'}];M.context.simulation='generic-look';
  const genericResult=V['ESS-03']();assert.doesNotMatch(genericResult,/hair-look-result|hair-simple-home/);
`));

console.log(checks+' simplified Hair journey checks passed');
