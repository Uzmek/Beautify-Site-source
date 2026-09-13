'use strict';

// Mirrors Uzmek/Beautify's skin-v1 response: high = good for every metric.
// This static Site does not call the vision service. Its fixture is deliberately
// fixed, labelled and stored with each new demo result, never derived from a selfie.
const SKIN_SCORE_KEYS=['redness','evenness','shine','underEye'];
const SKIN_SCORE_COPY={
  redness:{label:'Rougeurs',detail:'Les variations de rouge visibles entre les zones du visage. Un score élevé indique des rougeurs peu marquées.'},
  evenness:{label:'Uniformité',detail:'Les variations visibles du teint. Un score élevé indique un teint plus uniforme sur cette photo.'},
  shine:{label:'Brillance',detail:'Les reflets visibles, surtout sur le front. Un score élevé indique peu de brillance. L’éclairage peut modifier ce résultat.'},
  underEye:{label:'Cernes',detail:'Le contraste entre le dessous des yeux et les joues. Un score élevé indique un contraste peu marqué.'}
};
const SKIN_SCORE_TYPES={normal:'Normale',dry:'Sèche',oily:'Grasse',combination:'Mixte',sensitive:'Sensible'};
const SKIN_SCORE_DEMO={
  score:68,apparentSkinAge:null,skinType:{declared:'unknown',observed:'combination',final:'combination'},
  summary:'Quelques variations du teint et des cernes visibles.',
  metrics:[
    {key:'redness',score:72,band:'good',source:'demo',summary:'Rougeurs discrètes.'},
    {key:'evenness',score:64,band:'attention',source:'demo',summary:'Quelques variations du teint.'},
    {key:'shine',score:81,band:'good',source:'demo',summary:'Brillance peu marquée.'},
    {key:'underEye',score:55,band:'attention',source:'demo',summary:'Cernes visibles.'}
  ]
};
function skinScoreValid(skin){
  const valid=value=>Number.isInteger(value)&&value>=0&&value<=100;
  return !!skin&&valid(skin.score)&&Array.isArray(skin.metrics)&&
    SKIN_SCORE_KEYS.every(key=>skin.metrics.filter(metric=>metric.key===key&&valid(metric.score)).length===1);
}
function skinScoreData(result){
  if(skinScoreValid(result?.skin))return {skin:result.skin,demo:result.skinScoreSource!=='vision/skin-v1'};
  return {skin:SKIN_SCORE_DEMO,demo:true};
}
function skinScorePrior(result){
  // Never backfill historical measurements with the fixture to invent progress.
  if(!skinScoreValid(result?.skin)||!result.skinScoreSource)return null;
  const position=M.analyses.findIndex(record=>record.id===result.id);
  return M.analyses.slice(0,Math.max(0,position)).filter(record=>record.domain==='Peau'&&
    record.skinScoreSource===result.skinScoreSource&&skinScoreValid(record.skin)).at(-1)||null;
}
function skinScoreDelta(current,previous){const delta=current-previous;return (delta>0?'+':'')+delta+' pt'+(Math.abs(delta)>1?'s':'');}
function skinScoreBand(score,key){return score>=70?({redness:'Discrètes',shine:'Faible',underEye:'Discrets'}[key]||'Favorable'):score>=45?'À observer':({redness:'Marquées',shine:'Marquée',underEye:'Marqués'}[key]||'Plus marqué');}
function skinScorePanel(result){
  const {skin,demo}=skinScoreData(result),prior=skinScorePrior(result);
  const type=SKIN_SCORE_TYPES[skin.skinType?.final];
  return `<div class="sc-score-bilan">
    <header class="sc-score-heading"><h1 tabindex="-1">Bilan de peau</h1>${demo?'<span class="sc-score-demo-badge">Exemple</span>':''}</header>
    <section class="sc-score-hero" aria-label="Score global ${skin.score} sur 100">
      <div class="sc-score-ring" style="--score:${skin.score}%" aria-hidden="true"><span><strong>${skin.score}</strong><small>/100</small></span></div>
      <div class="sc-score-overview"><span class="eyebrow">Aspect de la peau</span>${type?`<h2>Peau ${esc(type.toLowerCase())}</h2>`:''}<p>${esc(skin.summary||'Les quatre indicateurs détaillent votre résultat.')}</p>${prior?`<span class="sc-score-change">${skinScoreDelta(skin.score,prior.skin.score)} depuis la précédente</span>`:''}</div>
    </section>
    <p class="sc-score-scale">Plus le score est élevé, moins le signe est marqué.</p>
    <div class="sc-score-grid">${SKIN_SCORE_KEYS.map(key=>{
      const metric=skin.metrics.find(entry=>entry.key===key),previous=prior?.skin.metrics.find(entry=>entry.key===key);
      const label=SKIN_SCORE_COPY[key].label;
      return A(`<span class="sc-score-metric-top"><strong>${esc(label)}</strong>${icon('chev')}</span><span class="sc-score-metric-value"><b>${metric.score}</b><small>/100</small>${previous?`<em>${skinScoreDelta(metric.score,previous.score)}</em>`:''}</span><span class="sc-score-track" aria-hidden="true"><i style="width:${metric.score}%"></i></span><span class="sc-score-band">${key==='evenness'?(metric.score>=70?'Teint uniforme':metric.score>=45?'Quelques variations':'Variations marquées'):skinScoreBand(metric.score,key)}</span>`,'skin-score-detail',{id:result.id,key,label:label+' : '+metric.score+' sur 100. Voir le détail'},'sc-score-metric');
    }).join('')}</div>
    ${A('<span>Ma routine</span><span>Matin & soir '+icon('chev')+'</span>','canonical-report-jump',{step:0},'sc-score-routine')}
    <p class="sc-score-note">${demo?'Scores illustratifs, votre photo n’a pas été analysée.':'Estimation de l’apparence sur cette photo.'}<br>Observation cosmétique, pas un diagnostic médical.</p>
  </div>`;
}
ACTIONS['skin-score-detail']=data=>{
  if(!canonicalOwned()){go('PRE-01');return;}
  const result=M.analyses.find(record=>record.id===data.id&&record.domain==='Peau');
  if(!result||!SKIN_SCORE_KEYS.includes(data.key))return;
  const {skin,demo}=skinScoreData(result),metric=skin.metrics.find(entry=>entry.key===data.key),copy=SKIN_SCORE_COPY[data.key];
  modal(esc(copy.label),`<div class="sc-score-detail"><p class="sc-score-detail-value">${metric.score}<span> /100</span></p>${metric.summary?'<p><strong>'+esc(metric.summary)+'</strong></p>':''}<p>${esc(copy.detail)}</p><p class="sc-score-note">${demo?'Exemple de démonstration, sans analyse de votre photo.':'Estimation de l’apparence, sensible aux conditions de prise de vue.'}</p></div>`+A('Revenir au bilan','close',{},'secondary mt'));
};
