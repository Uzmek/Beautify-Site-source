// Isolated visual fixtures: production view and CSS, no browser account state.
const fs = require('node:fs');
const prefix = fs.readFileSync('tests/flow-runtime.cjs','utf8').split('let checks = 0;')[0];
const runtime = new Function('require',prefix+'\nreturn runtime;')(require);
const styles=fs.readFileSync('dist/index.html','utf8').match(/<link rel="stylesheet"[^>]+>/g).join('\n');
for(const status of ['active','cancelled','free','pending','failed','expired']) {
  const r=runtime();
  r.run(`M.subscription.status=${JSON.stringify(status)};studioEnsure();M.hairGenerations.used=${['active','cancelled'].includes(status)?5:0};go('PRF-06',{root:true});render();`);
  // A root fixture still displays the production back affordance.
  const html=r.elements.get('app').innerHTML;
  fs.mkdirSync('docs/profile-access',{recursive:true});
  fs.writeFileSync(`docs/profile-access/preview-${status}.html`,`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mon accès — ${status}</title>${styles}<style>body{padding:0!important}#preview-stage,#phone-preview,#phone-surface,#app{position:absolute!important;inset:0!important;transform:none!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;margin:0!important}</style></head><body><div id="preview-stage"><div id="phone-preview"><div id="phone-surface"><div id="app">${html}</div></div></div></div></body></html>`);
}
console.log('Six read-only production-view fixtures saved.');
