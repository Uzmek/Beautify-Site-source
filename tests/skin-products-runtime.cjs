const fs=require('node:fs');
const prefix=fs.readFileSync('tests/flow-runtime.cjs','utf8').split('let checks = 0;')[0];
const runtime=new Function('require',prefix+'\nreturn runtime;')(require);
const own=`ACTIONS['skin-open-routine']({moment:'Matin'});ACTIONS['skin-own-routine']();`;
let checks=0;
async function test(name,source){try{await runtime().run(source);checks++;}catch(e){e.message=name+': '+e.message;throw e;}}
(async()=>{
await test('direct add, both moments and repeated selection do not duplicate products',own+`
 const r=skinRoutine(),before=skinSteps(r).length;ACTIONS['skin-add-open']({routine:r.id});
 assert.ok(document.getElementById('overlay').innerHTML.includes('sp-query'));
 assert.ok(!document.getElementById('overlay').innerHTML.includes('sc-add-types'));
 ACTIONS['skin-custom-open']();assert.ok(document.getElementById('overlay').innerHTML.includes('name="moment"'));
 assert.equal(F['sp-product']({productName:'Mon sérum',brand:'Ma marque',type:'serum',moment:'both',frequency:'daily'}),true);
 assert.equal(skinSteps(r).length,before+1);const evening=skinRoutine('Soir');assert.equal(skinSteps(evening).length,1);
 const product=skinSteps(evening)[0].product;ACTIONS['skin-add-open']({routine:r.id});spEdit(product);
 F['sp-product']({productName:product.name,brand:product.brand,type:product.type,moment:'both',frequency:'daily'});
 assert.equal(skinSteps(r).length,before+1);assert.equal(skinSteps(evening).length,1);
`);
await test('editing keeps the stable step and previously used product snapshot',own+`
 const r=skinRoutine(),step=skinSteps(r)[0];step.product={id:'my-cleanser',name:'Ancien nettoyant',type:'cleanse',brand:'A',example:false};
 M.skinCareProducts.push(clone(step.product));ACTIONS['skin-check-step']({routine:r.id,step:step.id});const id=step.id;
 ACTIONS['sp-edit']({routine:r.id,step:id});F['sp-product']({productName:'Nom corrigé',brand:'B',type:'cleanse',frequency:'daily'});
 assert.equal(step.id,id);assert.equal(step.product.name,'Nom corrigé');assert.equal(skinDone(r,step),true);
 assert.equal(skinRecordedProduct(r,step).name,'Ancien nettoyant');assert.equal(M.skinCareProducts.length,1);
`);
await test('frequency and protection validation leave invalid input uncommitted',own+`
 const r=skinRoutine(),before=skinSteps(r).length;ACTIONS['skin-add-open']({routine:r.id});ACTIONS['skin-custom-open']();
 assert.equal(F['sp-product']({productName:'Peeling',type:'exfoliate',moment:'both',frequency:'days'}),false);
 assert.equal(skinSteps(r).length,before);
 assert.equal(F['sp-product']({productName:'SPF',type:'protect',moment:'both',frequency:'daily'}),false);
 assert.equal(skinSteps(r).length,before);
 assert.equal(F['sp-product']({productName:'Peeling',type:'exfoliate',moment:'both',frequency:'days',day1:true,day4:'on'}),true);
 assert.deepEqual(skinSteps(r).find(s=>s.type==='exfoliate').days,[1,4]);
`);
await test('moving directly to a position and undo removal preserve the step',own+`
 const r=skinRoutine(),step=skinSteps(r)[0],id=step.id;ACTIONS['ss-organize-step']({routine:r.id,step:id});
 assert.equal(F['sp-position']({position:'2'}),true);assert.equal(skinSteps(r)[2].id,id);
 ACTIONS['skin-remove-step']({routine:r.id,step:id});ACTIONS['skin-undo-remove']();assert.equal(skinSteps(r)[2].id,id);
`);
await test('barcode validation rejects URLs and incomplete or mistyped numbers',`
 assert.equal(spBarcode('3337875597333'),'3337875597333');
 assert.equal(spBarcode('333 787 559 7333'),'3337875597333');
 for(const value of ['3337875597334','1234','https://example.com/3337875597333'])assert.equal(spBarcode(value),'');
 const p=spCatalogueProduct({code:'3337875597333',product_name:'<script>Gel</script>',brands:'Marque',categories_tags:['en:cleansers'],image_front_small_url:'https://evil.test/image.png'});
 assert.equal(p.type,'cleanse');assert.equal(p.image,'');assert.ok(spOption(p,'catalogue',0).includes('&lt;script&gt;'));
`);
await test('catalogue search returns a real selection path and obsolete requests are ignored',own+`
 (async()=>{ACTIONS['skin-add-open']({routine:skinRoutine().id});let release;
 spFetch=()=>new Promise(resolve=>release=resolve);const task=F['sp-search']({q:'gel'});
 release({products:[{code:'3337875597333',product_name:'Gel nettoyant',brands:'Marque',categories_tags:['en:cleansers']}]});await task;
 assert.equal(SP.results.length,1);ACTIONS['sp-select']({source:'catalogue',index:0});
 assert.ok(document.getElementById('overlay').innerHTML.includes('value="Gel nettoyant"'));
 ACTIONS['sp-browse']();const stale=F['sp-search']({q:'old'});ACTIONS['skin-custom-open']();const content=document.getElementById('overlay').innerHTML;
 release({products:[]});await stale;assert.equal(document.getElementById('overlay').innerHTML,content);
 })();
`);
await test('unknown scan and network failures preserve manual and personal choices',own+`
 (async()=>{ACTIONS['skin-add-open']({routine:skinRoutine().id});spFetch=async()=>({status:0});await spLookup('3337875597333');
 assert.ok(document.getElementById('sp-results').innerHTML.includes('pas encore renseigné'));
 ACTIONS['skin-custom-open']();assert.equal(SP.product.barcode,'3337875597333');
 ACTIONS['sp-browse']();M.skinCareProducts.push({id:'own',type:'cleanse',name:'Mon gel',brand:''});spFetch=async()=>{throw new Error('offline')};
 await F['sp-search']({q:'gel'});assert.ok(document.getElementById('sp-results').innerHTML.includes('Mon gel'));
 assert.ok(document.getElementById('sp-results').innerHTML.includes('Catalogue indisponible'));
 })();
`);
await test('camera is stopped when closed, including a late permission response',own+`
 (async()=>{let stopped=0,resolveCamera;const stream={getTracks:()=>[{stop:()=>stopped++}]};
 window.ZXingBrowser={BrowserMultiFormatOneDReader:function(){this.decodeFromStream=async()=>({stop:()=>stopped++})}};
 globalThis.navigator={mediaDevices:{getUserMedia:()=>new Promise(resolve=>resolveCamera=resolve)}};
 ACTIONS['skin-add-open']({routine:skinRoutine().id});const scan=ACTIONS['sp-scan']();await Promise.resolve();
 closeModal();resolveCamera(stream);await scan;assert.ok(stopped>0);assert.equal(SP_STREAM,null);
 globalThis.navigator.mediaDevices.getUserMedia=async()=>{throw new Error('NotAllowedError')};
 ACTIONS['skin-add-open']({routine:skinRoutine().id});await ACTIONS['sp-scan']();
 assert.ok(document.getElementById('sp-results').innerHTML.includes('refusée'));
 })();
`);
await test('local storage survives a fresh session and reset removes saved products',own+`
 const disk=new Map();globalThis.localStorage={getItem:k=>disk.get(k)||null,setItem:(k,v)=>disk.set(k,v)};
 const r=skinRoutine();ACTIONS['skin-add-open']({routine:r.id});spEdit({});
 F['sp-product']({productName:'Soin persistant',type:'serum',moment:'Matin',frequency:'daily'});persist();
 globalThis.sessionStorage={getItem:()=>null,setItem:()=>{}};M=readBeautifyState();migrate();
 assert.ok(M.skinCareProducts.some(p=>p.name==='Soin persistant'));assert.ok(skinSteps(skinRoutine()).some(s=>s.product?.name==='Soin persistant'));
 ACTIONS.reset();assert.equal((readBeautifyState().skinCareProducts||[]).length,0);
`);
await test('corrupt durable state falls back to existing session data',`
 const stored=initial();stored.profile.name='Session récupérée';sessionStorage.setItem(BEAUTIFY_STORAGE_KEY,JSON.stringify(stored));
 globalThis.localStorage={getItem:()=>'{broken',setItem:()=>{throw new Error('blocked')}};
 assert.equal(readBeautifyState().profile.name,'Session récupérée');
`);
console.log(checks+' product management, scan and durable storage checks passed.');
})().catch(e=>{console.error(e);process.exitCode=1;});
