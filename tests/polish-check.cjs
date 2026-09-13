// Source-level UI regression checks. These are not browser/layout assertions.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const index=fs.readFileSync('dist/index.html','utf8');
const scriptFiles=[...index.matchAll(/<script src="\/([^"?]+)(?:\?[^" ]*)?"><\/script>/g)].map(x=>x[1]).filter(x=>x!=='start.js');
const noop=()=>{};
const element={innerHTML:'',classList:{add:noop,remove:noop},style:{},focus:noop,querySelector:()=>null,querySelectorAll:()=>[],appendChild:noop,setAttribute:noop};
const context={console,Date,Math,JSON,Set,Map,Intl,Number,String,Array,Object,Boolean,Blob,FormData,URL:{createObjectURL:()=>'/photo',revokeObjectURL:noop},Image:function(){},sessionStorage:{getItem:()=>null,setItem:noop},location:{hash:''},history:{pushState:noop,replaceState:noop,back:noop},window:{scrollTo:noop,addEventListener:noop},document:{documentElement:{},getElementById:()=>element,querySelector:()=>null,querySelectorAll:()=>[],createElement:()=>({...element,click:noop}),body:element,addEventListener:noop},setTimeout:()=>1,clearTimeout:noop};
vm.createContext(context);
scriptFiles.forEach(file=>vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),context,{filename:file}));
const result=vm.runInContext(String.raw`(()=>{
  const errors=[],assets=new Set(),scenarios=['normal','empty','error','partial','pending','offline','unavailable','refused'];
  let checked=0;
  function inspect(id){
    try{
      route=id;migrate();const html=V[id]();checked++;
      if(!html||/undefined|NaN/.test(html))errors.push(id+' invalid output');
      if(/data-icon-missing="true"/.test(html))errors.push(id+' missing custom icon');
      for(const hit of html.matchAll(/data-go="([^"]+)"/g))if(!V[hit[1]])errors.push(id+' missing route '+hit[1]);
      for(const hit of html.matchAll(/data-act="([^"]+)"/g))if(!ACTIONS[hit[1]])errors.push(id+' missing action '+hit[1]);
      for(const hit of html.matchAll(/data-form="([^"]+)"/g))if(!F[hit[1]])errors.push(id+' missing form '+hit[1]);
      for(const hit of html.matchAll(/(?:src|href)="(\/assets\/[^"?]+)"/g))assets.add(hit[1]);
      for(const hit of html.matchAll(/<button([^>]*)>([\s\S]*?)<\/button>/g))if(!plain(hit[2])&&!/aria-label=/.test(hit[1]))errors.push(id+' unnamed button');
      if(/<\/button>\s*,\s*<button/.test(html))errors.push(id+' stray comma between buttons');
    }catch(error){errors.push(id+': '+error.message);}
  }
  for(const page of FLOW_INDEX){
    M=initial();inspect(page.id);sample();migrate();
    for(const scenario of scenarios){M.scenario=scenario;inspect(page.id);}
  }
  // Populated reports and boundary fixtures exercise the revised compositions.
  M=initial();sample();migrate();
  M.hairProfile={shape:'Ovale',texture:'Ondulés',length:'Mi-longue'};
  M.skinProfile={goal:'Routine essentielle',traits:['Hydratation','Confort','Éclat']};
  M.skinPlan={morning:['Nettoyer','Hydrater','Soin personnalisé','Protéger'],evening:['Nettoyer','Hydrater']};
  M.profile.name='Éléonore — un prénom composé';
  ['ACC-01','HAI-01','COL-01','PEA-01','SAV-01','PRF-01'].forEach(inspect);
  for(const domain of ['Cheveux','Colorimétrie','Peau']){
    M.draft.domain=domain;inspect('ANA-03');
    const html=V['ANA-03']();
    if(!html.includes('data-source="camera"')||!html.includes('data-source="gallery"'))errors.push(domain+' retired introduction does not open photo capture');
    if(html.includes('data-form="consent"'))errors.push(domain+' still exposes the retired introduction');
  }
  M.hairProfile={};inspect('HAI-01');
  M.hairProfile={shape:'Ovale'};
  M.analyses=[{id:'polish-hair',status:'complete',domain:'Cheveux',date:DATE(),faceShape:'Ovale',hairProfile:M.hairProfile}];
  M.context.analysis='polish-hair';M.subscription.status='active';
  for(let step=0;step<4;step++){M.canonicalReportStep=step;inspect('ANA-10');}
  let dialog='';modal=(title,body)=>{dialog=body;};
  ACTIONS['haircut-open']({id:'lob-soft'});
  if(!dialog.includes('hair-reference large')||!dialog.includes('haircut-simulate'))errors.push('Hair sheet lost its photo or action');
  // Retired events must not reappear through an old session or a deep link.
  if(FLOW_INDEX.some(page=>page.id.startsWith('EVE-'))||Object.keys(V).some(id=>id.startsWith('EVE-')))errors.push('Event route still registered');
  if(ACTIONS['new-event']||ACTIONS['event-select']||F.event||F['event-note'])errors.push('Event action still registered');
  M.events=[{id:'legacy-event',name:'Legacy event marker',date:DATE(),needs:['Cheveux'],look:{},tasks:{}}];
  M.messages.push({id:'legacy-event-message',text:'Legacy event marker',route:'EVE-03',objectKey:'event',objectId:'legacy-event'});
  M.prefs.interests.push('Événements');
  M.context.selection={kind:'event',eventId:'legacy-event',back:'EVE-04'};
  M.context.eventTutorial='legacy-event';
  go('EVE-03');
  if(route!=='ACC-01'||M.context.selection||M.context.eventTutorial)errors.push('Legacy event navigation not cleared');
  if(M.events.length!==1)errors.push('Historical event data was deleted');
  for(const id of ['events','EVE-01','EVE-02','EVE-03','EVE-04','EVE-05'])if(resolveRoute(id)!=='ACC-01')errors.push('Bad retired route '+id);
  for(const id of ['ACC-01','ACC-02','ACC-03','ACC-04','PRF-03','PRF-05','PRF-07','PRF-08','PRF-09']){
    inspect(id);const html=V[id]();
    if(/EVE-|Legacy event marker|data-act="(?:new-event|event-)|data-value="Événements"|name="(?:events|eventTime|dataÉvénements)"/.test(html))errors.push(id+' exposes events');
  }
  return {checked,errors,assets:[...assets]};
})()`,context);
assert.equal(result.errors.length,0,result.errors.join('\n'));
for(const asset of result.assets)assert.ok(fs.existsSync('dist'+asset),'Missing '+asset);
assert.match(index,/<div id="phone-surface">\s*<div id="app"><\/div>\s*<div id="overlay"><\/div>\s*<div id="toast"/);
const css=fs.readFileSync('dist/liquid.css','utf8');
assert.match(css,/#phone-surface>#app\s*\{\s*transform:none/);
assert.match(css,/#app>\.mock-screen\[data-route="PRE-01"\]\s*\{\s*overflow-y:auto/);
assert.match(css,/#overlay \.modal>\.hair-reference\.large/);
assert.match(css,/\.lg-routine-steps:has\(li:nth-child\(4\)\)/);
assert.match(css,/#app \.canonical-report-rail button\s*\{[^}]*min-height:44px/);
assert.match(css,/#app:not\(:has\(\.lg-page\)\)>\.app-header:has\(\.flow-exit\)\s*\{\s*display:grid!important/,
  'Visible back headers must not duplicate the branded page header');
assert.match(css,/#phone-surface #app h1[^}]*font-weight:700/);
assert.match(css,/#phone-surface #app :is\(p[^}]*font-weight:500/);
const artwork=vm.runInContext('[...new Set(Object.values(BEAUTIFY_ICON_ART))]',context);
assert.equal(artwork.length,10);
for(const name of artwork){const data=fs.readFileSync('dist/assets/icons/'+name+'.webp');assert.equal(data.toString('ascii',8,12),'WEBP');}
assert.ok(vm.runInContext('Object.keys(BEAUTIFY_SYMBOLS).length',context)>=60);
console.log(JSON.stringify({viewsAndStates:result.checked,localImages:result.assets.length,errors:result.errors,scope:'Source and model checks; browser screenshots verified separately'},null,2));
