// Same progressive V1/V2 integration as the paywall. Existing report actions own
// navigation and entitlement checks; this layer only presents the history.
const historyV1 = V['ANA-12'];
const historyVersion = () => M.historyVersion === 'v1' ? 'v1' : 'v2';
const historyDomains = ['Cheveux', 'Colorimétrie', 'Peau'];

// Reuse the application's icon system and review controls.
function hv2Icon(name) { return icon(name, 'hv2-icon'); }

function historyDevSwitcher() {
  const version = historyVersion();
  return `<details class="history-dev-switch"><summary aria-label="Outils développeur de l’historique">DEV</summary><div class="history-dev-panel"><div role="group" aria-label="Version de l’historique">${['v1', 'v2'].map(value => A(value.toUpperCase(), 'history-version', {value, pressed: version === value}, version === value ? 'is-active' : '')).join('')}</div>${A('Charger l’exemple', 'history-example', {label: 'Charger les quatre analyses d’exemple de la maquette'}, 'hv2-demo')}</div></details>`;
}

function hv2Summary(record) {
  // Historical snapshots retain their own title, never today's profile.
  return record.historyTitle || lgHistorySummary(record);
}

function hv2Photo(record) {
  const artwork = ['cascade', 'curls', 'straight', 'volume'].includes(record.historyArtwork) ? record.historyArtwork : null;
  if (artwork) return `<span class="hv2-photo"><img src="/assets/history-v2/${artwork}.png" alt="" width="${artwork === 'cascade' ? 1209 : 1254}" height="${artwork === 'cascade' ? 1300 : 1254}" draggable="false"></span>`;
  if (record.photo) return `<span class="hv2-photo">${imageFor(record.photo, '', 'Photo de cette analyse')}</span>`;
  return `<span class="hv2-photo hv2-photo-placeholder" aria-hidden="true">${icon(record.domain === 'Peau' ? 'spark' : record.domain === 'Colorimétrie' ? 'palette' : 'hair')}</span>`;
}

function historyV2() {
  const domain = M.historyDomain;
  const title = domain === 'Colorimétrie' ? 'Couleurs' : domain;
  const timestamp = record => Date.parse(record.createdAt || record.date || '') || 0;
  const records = lgDomainAnalyses(domain).slice().sort((a, b) => timestamp(b) - timestamp(a)), groups = new Map();
  records.forEach(record => {
    const date = lgHistoryDate(record);
    if (!groups.has(date.group)) groups.set(date.group, []);
    groups.get(date.group).push({record, date});
  });
  const months = [...groups].map(([month, entries]) => `<section class="hv2-month"><h2>${esc(month)}</h2><ul>${entries.map(({record, date}) => {
    const latest = record === records[0];
    const monthLabel = date.month ? date.month.toUpperCase() + (date.month === 'sept' ? '.' : '') : '';
    return `<li>${A(`<span class="hv2-date" aria-hidden="true"><strong>${esc(date.day)}</strong><small>${esc(monthLabel)}</small></span>${hv2Photo(record)}<span class="hv2-copy"><strong>${esc(hv2Summary(record))}</strong>${latest ? '<span class="hv2-latest">Dernière analyse</span>' : ''}${record.status === 'partial' ? '<span class="hv2-partial">Aperçu partiel</span>' : ''}</span>${hv2Icon('chev')}`, 'history-report-open', {id: record.id, domain, label: `${hv2Summary(record)} — ${date.label}${date.time ? ' à ' + date.time : ''}${latest ? ', dernière analyse' : ''}${record.status === 'partial' ? ', aperçu partiel' : ''}`}, `hv2-entry${latest ? ' is-latest' : ''}`)}</li>`;
  }).join('')}</ul></section>`).join('');
  const routine = domain === 'Peau' && (skinRoutine('Matin') || skinRoutine('Soir')) ? A('Routine actuelle ' + hv2Icon('chev'), 'skin-open-routine', {moment: skinRoutine('Matin') ? 'Matin' : 'Soir'}, 'hv2-routine') : '';
  return `<div class="lg-page hv2-page" aria-label="Historique ${esc(title)}, version 2">
    <header class="hv2-header">
      <div class="hv2-topbar">${lgBrand()}<span class="hv2-category">${esc(title)}</span>${historyDevSwitcher()}</div>
      ${lgTitle('Historique')}
      ${A(hv2Icon('plus') + '<span>Nouvelle analyse</span>' + icon('chev'), 'studio-analysis', {domain}, 'primary hv2-new')}
    </header>
    <div class="hv2-records${records.length ? '' : ' is-empty'}" tabindex="0" role="region" aria-label="Historique ${esc(title)}">${routine}${records.length ? months : '<section class="hv2-empty">' + lgModuleArt(domain) + '<h2>Votre historique commence ici</h2><p>Vos analyses apparaîtront ici après votre premier résultat.</p></section>'}</div>
  </div>`;
}

V['ANA-12'] = () => {
  if (!historyDomains.includes(M.historyDomain)) return historyV1();
  return historyVersion() === 'v1' ? historyV1() + historyDevSwitcher() : historyV2();
};
ACTIONS['history-report-open'] = data => {
  const origin = snapshot();
  ACTIONS['lg-history-report-open'](data);
  // A saved report is revisited from History: closing its paywall returns here.
  if (route === 'PRE-01' && origin.route === 'ANA-12') {
    M.premiumReturnState = origin;
    M.context.returnTo = 'ANA-12';
    persist();
  }
};
ACTIONS['history-version'] = data => {
  if (!['v1', 'v2'].includes(data.value)) return;
  M.historyVersion = data.value;
  render({focus: false, scroll: 0});
};

// Explicit, additive developer fixture. Never replaces an existing analysis,
// changes subscription status, or runs just because someone opens History.
function hv2LoadExample() {
  const examples = [
    ['14', '09', 'Visage ovale', 'cascade', 'Ondulés'],
    ['03', '09', 'Boucles', 'curls', 'Bouclés'],
    ['28', '08', 'Lisses', 'straight', 'Lisses'],
    ['12', '08', 'Volume', 'volume', 'Ondulés']
  ];
  for (const [day, month, title, artwork, texture] of examples) {
    const id = `history-example-2026-${month}-${day}`;
    if (M.analyses.some(record => record.id === id)) continue;
    M.analyses.push({id, date: `2026-${month}-${day}`, domain: 'Cheveux', status: 'complete', source: 'Exemple de démonstration', photo: 'waves', faceShape: 'Ovale', historyTitle: title, historyArtwork: artwork, hairProfile: {shape: 'Ovale', texture, length: 'Longs', density: 'Moyenne', basis: 'Démonstration'}, findings: [title], answers: {}, prefs: clone(M.prefs)});
  }
  M.historyDomain = 'Cheveux';
}
ACTIONS['history-example'] = () => {
  hv2LoadExample();
  render({focus: true, scroll: 0});
  toast('Quatre analyses de démonstration ajoutées.');
};
if (typeof location.search === 'string') {
  const params = new URLSearchParams(location.search);
  if (['v1', 'v2'].includes(params.get('history'))) M.historyVersion = params.get('history');
  if (params.get('history-demo') === '1') hv2LoadExample();
}
