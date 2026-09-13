const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');

const files=['icons','ui','flow-index','model','app','views','journeys','account','commerce','product','content','studios','v1','color-seasons','ux-fixes','visual-calm','rework','canonical','liquid'];
const noop=()=>{};
const element={innerHTML:'',classList:{add:noop,remove:noop},style:{},focus:noop,querySelector:()=>null,querySelectorAll:()=>[],appendChild:noop,setAttribute:noop};
const context={
  console,Date,Math,JSON,Set,Map,Intl,Number,String,Array,Object,Boolean,Blob,FormData,
  URL:{createObjectURL:()=>'/photo',revokeObjectURL:noop},
  Image:function(){},
  sessionStorage:{getItem:()=>null,setItem:noop},
  location:{hash:''},
  history:{pushState:noop,replaceState:noop,back:noop},
  window:{scrollTo:noop,addEventListener:noop},
  document:{documentElement:{},getElementById:()=>element,querySelector:()=>null,querySelectorAll:()=>[],createElement:()=>({...element,click:noop}),body:element,addEventListener:noop},
  setTimeout:()=>1,clearTimeout:noop
};

vm.createContext(context);
files.forEach(file=>vm.runInContext(fs.readFileSync('dist/'+file+'.js','utf8'),context,{filename:file+'.js'}));

const result=vm.runInContext(String.raw`(()=>{
  const errors=[];
  const inspect=(id)=>{
    route=id;
    const html=V[id]();
    if(!html||/undefined|NaN/.test(html))errors.push(id+' invalid html');
    for(const hit of html.matchAll(/data-go="([^"]+)"/g))if(!V[hit[1]])errors.push(id+' missing route '+hit[1]);
    for(const hit of html.matchAll(/data-act="([^"]+)"/g))if(!ACTIONS[hit[1]])errors.push(id+' missing action '+hit[1]);
    for(const hit of html.matchAll(/data-form="([^"]+)"/g))if(!F[hit[1]])errors.push(id+' missing form '+hit[1]);
    return html;
  };
  M=initial();migrate();
  const home=inspect('ACC-01');
  const chooser=inspect('ANA-01');
  ACTIONS['studio-analysis']({domain:'Cheveux'});
  const start=inspect('ANA-03');
  const capture=inspect('ANA-04');
  M.draft.photo='portrait';M.draft.answers={shape:'Ovale',texture:'Ondulés',length:'Mi-longue'};
  const analyzing=inspect('ANA-08');
  M.analyses=[{id:'hair-result',date:DATE(),domain:'Cheveux',status:'complete',photo:'portrait',faceShape:'Ovale',hairProfile:{shape:'Ovale',texture:'Ondulés',length:'Mi-longue'}}];
  M.context.analysis='hair-result';
  M.draft.reportId='hair-result';
  const locked=inspect('ANA-09');
  const paywall=inspect('PRE-01');
  M.subscription.status='active';
  const reportHtml=inspect('ANA-09');
  for(const id of ['ENT-02','ACC-01','ANA-04','ANA-09','PRE-01','SAV-01','PRF-01','HAI-01','COL-01','MAQ-01','PEA-01','GAR-01','PRO-01'])inspect(id);
  sample();migrate();
  M.hairProfile={shape:'Ovale',texture:'Ondulés',length:'Mi-longue'};
  M.skinProfile={goal:'Routine essentielle',traits:['Hydratation','Confort','Éclat']};
  M.skinPlan={morning:['Nettoyer','Hydrater','Protéger'],evening:['Nettoyer','Hydrater']};
  for(const id of ['ACC-01','SAV-01','PRF-01','HAI-01','COL-01','MAQ-01','PEA-01','GAR-01','PRO-01'])inspect(id);
  const hair=inspect('HAI-01'),color=inspect('COL-01'),skin=inspect('PEA-01');
  const progress=inspect('PRO-01');
  const makeup=inspect('MAQ-01'),wardrobe=inspect('GAR-01');
  ACTIONS['lg-color-apps']();inspect('COL-01');ACTIONS['lg-color-close']();
  M.skinTab='Matin';inspect('PEA-01');M.skinTab='Analyse';
  ACTIONS['lg-journal-open']();inspect('PRO-01');ACTIONS['lg-journal-close']();
  route='HAI-01';const hairNav=nav();
  M.subscription.status='free';ACTIONS.offer({value:'monthly'});
  const monthly=inspect('PRE-01');
  return {
    errors,
    checks:{
      home:home.includes('lg-page'),
      chooser:['Colorimétrie','Peau','Cheveux'].every(x=>chooser.includes(x)),
      start:start.includes('canonical-start')&&start.includes('data-form="consent"'),
      capture:capture.includes('source="camera"')&&capture.includes('source="gallery"'),
      analyzing:analyzing.includes('canonical-analyzing'),
      locked:locked.includes('lg-lock-row')&&locked.includes('PRE-01'),
      paywall:paywall.includes('lg-plan')&&paywall.includes('yearly')&&paywall.includes('monthly'),
      report:reportHtml.includes('canonical-report')&&reportHtml.includes('canonical-report-panel'),
      glassComposition:home.includes('lg-home-routine')&&home.includes('lg-home-result')&&home.includes('lg-action-icon'),
      rankedHair:hair.includes('lg-hair-main')&&(hair.match(/class="lg-hair-alternative"/g)||[]).length===3,
      actualPalette:color.includes('lg-season-card')&&(color.match(/class="lg-swatch"/g)||[]).length>=12,
      separateRituals:(skin.match(/class="lg-routine-steps"/g)||[]).length===2,
      eventsRemoved:!Object.keys(V).some(id=>id.startsWith('EVE-'))&&!home.includes('EVE-'),
      genuineProgress:(progress.match(/routine terminée|non terminée/g)||[]).length===7,
      distinctUpcoming:makeup.includes('lg-coming-makeup')&&wardrobe.includes('lg-coming-wardrobe')&&wardrobe.includes('aria-disabled="true"'),
      reportTabActive:hairNav.includes('class="active" aria-current="page"')&&hairNav.includes('data-go="SAV-01"'),
      planSelection:monthly.includes('data-value="monthly"')&&monthly.includes('aria-pressed="true"')&&M.subscription.offer==='monthly'
    }
  };
})()`,context);

assert.equal(result.errors.length,0,result.errors.join('\n'));
Object.entries(result.checks).forEach(([name,ok])=>assert.equal(ok,true,name));
console.log(JSON.stringify(result,null,2));
