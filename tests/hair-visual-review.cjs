// Isolated visual fixtures. Never reads or changes the user's browser storage.
// Run: node tests/hair-visual-review.cjs, then open http://127.0.0.1:5174.
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const prefix=fs.readFileSync('tests/flow-runtime.cjs','utf8').split('let checks = 0;')[0];
const runtime=new Function('require',prefix+'\nreturn runtime;')(require);
const root=path.resolve('dist');
const head=fs.readFileSync('dist/index.html','utf8').split('<head>')[1].split('</head>')[0];
const complete=`ACTIONS['hair-start-analysis']();M.draft.photo='portrait';M.draft.answers=canonicalEngineAnswers('Cheveux');ACTIONS['canonical-analyze-photo']();ACTIONS['finish-analysis']();`;
const paid=complete+'uxActivatePremium();';
const look=`M.simulations=[{id:'visual-look',domain:'Cheveux',haircut:'lob-soft',source:'portrait',date:DATE(),previewModel:'clara'}];M.context.simulation='visual-look';`;
const cases={
  empty:`go('HAI-01');`,
  capture:`ACTIONS['hair-start-analysis']();`,
  prepayA:complete+`M.hairPrepayVariant='A';go('ANA-09');`,
  prepayB:complete+`M.hairPrepayVariant='B';go('ANA-09');`,
  report:paid+`go('ANA-10');`,
  ready:paid+`go('HAI-01');`,
  resume:paid+`M.haircutDraft={haircut:'cascade',source:'portrait',analysis:report().id};go('HAI-01');`,
  home:paid+look+`go('HAI-01');`,
  catalogue:paid+`M.hairSimpleCatalogFilter='Toutes';go('HAI-02');`,
  cut:paid+`ACTIONS['hair-simple-cut']({id:'lob-soft',analysis:report().id});`,
  longCut:paid+`ACTIONS['hair-simple-cut']({id:'long-waves',analysis:report().id});`,
  look:paid+look+`go('ESS-03');`,
  loading:paid+`M.haircutDraft={haircut:'bob',source:'portrait',analysis:report().id};go('ESS-02');`,
  error:paid+`M.haircutDraft={haircut:'bob',source:'portrait',analysis:report().id};M.scenario='error';go('ESS-02');`
};
http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/'){
    const name=Object.hasOwn(cases,url.searchParams.get('screen'))?url.searchParams.get('screen'):'report';
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.end(`<!doctype html><html lang="fr"><head><title>Hair · visual review</title><style>body{margin:20px;background:#d9c5b9;color:#351e15;font:14px system-ui}nav{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}a{color:inherit;padding:8px 12px;border-radius:12px;background:#fff8}main{display:flex;gap:20px;align-items:start}iframe{border:0;border-radius:24px;box-shadow:0 8px 25px #51302222}h2{font-size:15px}</style></head><body><nav>${Object.keys(cases).map(key=>`<a href="/?screen=${key}" ${key===name?'aria-current="page"':''}>${key}</a>`).join('')}</nav><main>${[[320,568],[393,852],[430,932]].map(([w,h])=>`<section><h2>${name} · ${w} × ${h}</h2><iframe title="${name} ${w}" src="/screen?name=${name}" width="${w}" height="${h}"></iframe></section>`).join('')}</main></body></html>`);
    return;
  }
  if(url.pathname==='/screen'){
    const fixture=runtime();fixture.run(cases[url.searchParams.get('name')]||cases.report);
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.end(`<!doctype html><html lang="fr"><head>${head}<style>*,*:before,*:after{animation:none!important;transition:none!important}#phone-preview{--phone-scale:1}#app>.mock-screen{opacity:1!important;transform:none!important}</style></head><body><div id="preview-stage"><div id="phone-preview"><div id="phone-surface"><div id="app">${fixture.elements.get('app').innerHTML}</div><div id="overlay"></div><div id="toast"></div></div></div></div></body></html>`);
    return;
  }
  const file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
  const types={'.css':'text/css','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.ttf':'font/ttf','.woff2':'font/woff2'};
  res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
  fs.createReadStream(file).pipe(res);
}).listen(5174,'127.0.0.1',()=>console.log('Isolated Hair visual fixtures: http://127.0.0.1:5174'));
