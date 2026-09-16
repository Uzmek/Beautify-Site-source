// A read-only visual fixture: render the production view in the test VM.
// It does not load application scripts or alter browser account/subscription data.
const fs = require('node:fs');
const prefix = fs.readFileSync('tests/flow-runtime.cjs','utf8').split('let checks = 0;')[0];
const runtime = new Function('require',prefix+'\nreturn runtime;')(require);
const r = runtime();
const status = process.argv[2] || 'active';
r.run(`M.subscription.status=${JSON.stringify(status)};go('PRF-01',{root:true});render();`);
const html = r.elements.get('app').innerHTML;
const styles = fs.readFileSync('dist/index.html','utf8').match(/<link rel="stylesheet"[^>]+>/g).join('\n');
fs.mkdirSync('docs/profile-reference',{recursive:true});
fs.writeFileSync(`docs/profile-reference/preview-${status}.html`,`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Profil ${status} — fixture visuelle</title>${styles}<style>#phone-stage,#phone-preview,#phone-surface{width:100%!important;height:100%!important;transform:none!important;position:absolute!important;inset:0!important;margin:0!important}body{padding:0!important}#app{width:100%!important;height:100%!important}</style></head><body><div id="phone-stage"><div id="phone-preview"><div id="phone-surface"><div id="app">${html}</div></div></div></div></body></html>`);
console.log(`Wrote docs/profile-reference/preview-${status}.html`);
