// Isolated visual fixtures; no application scripts or live account writes.
const fs = require('node:fs');
const prefix = fs.readFileSync('tests/flow-runtime.cjs','utf8').split('let checks = 0;')[0];
const runtime = new Function('require',prefix+'\nreturn runtime;')(require);
const styles = fs.readFileSync('dist/index.html','utf8').match(/<link rel="stylesheet"[^>]+>/g).join('\n');
const directory = 'docs/profile-harmonization/fixtures';
fs.mkdirSync(directory,{recursive:true});
for (const status of ['free','active','cancelled','pending','failed','expired']) {
  for (const route of ['PRF-01','PRF-06']) {
    const r = runtime();
    r.run(`M.subscription.status=${JSON.stringify(status)};go(${JSON.stringify(route)},{root:true});render();`);
    write(`${route}-${status}`,r);
  }
}
for (const route of ['PRF-01','PRF-02']) {
  const r=runtime();
  r.run(`M.profile.connected=true;M.profile.name='Alexandrine de la Roche';M.profile.email='alexandrine.longue-adresse@example.com';M.profile.authProvider='email';go(${JSON.stringify(route)},{root:true});render();`);
  write(`${route}-connected`,r);
}
function write(name,r) {
  fs.writeFileSync(`${directory}/${name}.html`,`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name}</title>${styles}<style>body{padding:0!important}#phone-preview,#phone-surface{width:100%!important;height:100%!important;transform:none!important;position:absolute!important;inset:0!important;margin:0!important}#app{width:100%!important;height:100%!important}.profile-system{animation:none!important}</style></head><body><div id="phone-preview"><div id="phone-surface"><div id="app">${r.elements.get('app').innerHTML}</div></div></div></body></html>`);
}
console.log('Wrote 14 isolated profile fixtures.');
