const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const noop = () => {};
const timers = new Map();
let timerId = 0;
const element = () => ({innerHTML:'',classList:{add:noop,remove:noop},style:{},dataset:{},focus:noop,querySelector:()=>null,querySelectorAll:()=>[],appendChild:noop,setAttribute:noop,addEventListener:noop,click:noop});
const elements = new Map();
const location = {hash:''};
const context = {
  assert,console,Date,Math,JSON,Set,Map,Intl,Number,String,Array,Object,Boolean,Blob,FormData,
  document:{documentElement:{style:{setProperty:noop}},getElementById(id){if(!elements.has(id))elements.set(id,element());return elements.get(id);},querySelector:()=>null,querySelectorAll:()=>[],createElement:element,body:element(),addEventListener:noop},
  location,history:{pushState(_s,_t,url){location.hash=url;},replaceState(_s,_t,url){location.hash=url;},back:noop},
  window:{scrollTo:noop,addEventListener:noop},URL:{createObjectURL:()=>'/photo',revokeObjectURL:noop},Image:function(){},
  sessionStorage:{getItem:()=>null,setItem:noop},setTimeout(fn,delay){const id=++timerId;timers.set(id,{fn,delay});return id;},clearTimeout(id){timers.delete(id);}
};
vm.createContext(context);
const index = fs.readFileSync('dist/index.html','utf8');
const paywallV2Css = fs.readFileSync('dist/paywall-v2.css','utf8');
assert.match(paywallV2Css,/data-route="PRE-01"[^}]+\.app-header/);
const scripts = [...index.matchAll(/<script src="\/([^"?]+)(?:\?[^" ]*)?"><\/script>/g)].map(match=>match[1]).filter(file=>file!=='start.js');
scripts.forEach(file=>vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),context,{filename:file}));
const run = source => vm.runInContext(source,context);
run('boot()');

run(`ACTIONS['studio-analysis']({domain:'Cheveux'});M.draft.photo='portrait';M.draft.answers=canonicalEngineAnswers('Cheveux');ACTIONS['canonical-analyze-photo']();
  assert.doesNotMatch(V['ANA-08'](),/Quitter l’analyse/);
  ACTIONS['finish-analysis']();assert.equal(route,'PRE-01');assert.equal(M.analyses.length,1);
  assert.match(V['ANA-09'](),/Voir mon rapport complet/);
  ACTIONS.subscribe();assert.equal(route,'ANA-10');assert.equal(M.subscription.status,'active');`);

run(`M.analyses.push({id:'hair-2',domain:'Cheveux',status:'complete',date:'2026-09-13'});M.historyDomain='Cheveux';go('ANA-12');
  const historyHtml=V['ANA-12']();assert.doesNotMatch(historyHtml,/Comparer deux analyses|canonical-compare-analyses/);
  ACTIONS['canonical-compare-analyses']();assert.equal(route,'ANA-12');
  M.compareMode='Analyses';go('PRO-02');const compareHtml=V['PRO-02']();assert.equal(M.compareMode,'Observations');assert.doesNotMatch(compareHtml,/>Analyses</);`);

console.log('5 simplified analysis flow checks passed.');

run(`M.subscription.status='free';M.paywallVersion='v1';assert.match(V['PRE-01'](),/pw-editorial/);
  M.paywallVersion='v2';M.subscription.offer='yearly';assert.match(V['PRE-01'](),/pv2-brand/);
  assert.doesNotMatch(V['PRE-01'](),/paywall-reference-v2|pv2-hit|pv2-sr/);
  assert.match(V['PRE-01'](),/<h1[^>]*>Tes couleurs/);
  assert.match(V['PRE-01'](),/pv2-discount/);
  assert.match(V['PRE-01'](),/paywall-dev-switch/);
  ACTIONS['pv2-offer']({value:'monthly'});assert.match(V['PRE-01'](),/pv2-monthly/);
  ACTIONS['pv2-offer']({value:'yearly'});assert.doesNotMatch(V['PRE-01'](),/pv2-page pv2-monthly/);
  assert.match(V['PRE-01'](),/data-act="pv2-subscribe"/);
  assert.match(V['PRE-01'](),/aria-pressed="true"[^>]*>V2/);
  assert.doesNotMatch(V['PRE-01'](),/>V2A<|>V2B</);
  `);
console.log('Paywall V1 preservation and V2 offer controls passed.');
