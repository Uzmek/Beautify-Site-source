const fs=require('node:fs');
const prefix=fs.readFileSync('tests/flow-runtime.cjs','utf8').split('let checks = 0;')[0];
const runtime=new Function('require',prefix+'\nreturn runtime;')(require);
const own=`ACTIONS['skin-open-routine']({moment:'Matin'});ACTIONS['skin-own-routine']();`;
let checks=0;
function test(name,fn){try{fn(runtime());checks++;}catch(e){e.message=name+': '+e.message;throw e;}}
const rowFixture=`
function fakeRow(id,top){
 const classes=new Set(),content={style:{}},actions={inert:true,setAttribute(k,v){this[k]=v}};
 return {dataset:{routineId:'routine',stepId:id},offsetWidth:300,style:{setProperty(){}},
 classList:{add(...v){v.forEach(x=>classes.add(x))},remove(...v){v.forEach(x=>classes.delete(x))},contains(v){return classes.has(v)},toggle(v,b){b?classes.add(v):classes.delete(v)}},
 getBoundingClientRect:()=>({top,height:70,width:300}),closest:()=>list,
 querySelector:s=>s==='.mg-row-content'?content:actions};
}
const list={scrollTop:0,querySelectorAll:()=>rows,getBoundingClientRect:()=>({top:0,bottom:400})};
const rows=[fakeRow('a',0),fakeRow('b',70),fakeRow('c',140)];
const target={closest:s=>s.startsWith('.ss-product-row')?rows[0]:s==='.ss-product-main'?target:null};
let prevented=0;const event={cancelable:true,preventDefault(){prevented++}};
`;
test('reorder and undo retain checked identity and recorded product',({run})=>run(own+`
 const r=skinRoutine(),steps=skinSteps(r),first=steps[0],last=steps.at(-1),original=steps.map(s=>s.id);
 first.product={id:'original',name:'Mon nettoyant',type:'cleanse',example:false};
 ACTIONS['skin-check-step']({routine:r.id,step:first.id});const recorded=JSON.stringify(skinRecordedProduct(r,first));
 assert.equal(mgMoveProduct(r.id,first.id,null,last.id),true);
 assert.equal(skinSteps(r).at(-1).id,first.id);assert.equal(skinDone(r,first),true);
 assert.equal(JSON.stringify(skinRecordedProduct(r,first)),recorded);
 ACTIONS['mg-undo-order']();assert.deepEqual(skinSteps(r).map(s=>s.id),original);assert.equal(skinDone(r,first),true);
`));
test('invalid drop does not change order and old undo cannot overwrite later edits',({run})=>run(own+`
 const r=skinRoutine(),steps=skinSteps(r),first=steps[0],last=steps.at(-1),original=steps.map(s=>s.id);
 assert.equal(mgMoveProduct(r.id,first.id,'missing'),false);assert.deepEqual(skinSteps(r).map(s=>s.id),original);
 mgMoveProduct(r.id,first.id,null,last.id);r.skinSteps.reverse();r.steps=r.skinSteps.map(s=>s.instruction);const changed=r.skinSteps.map(s=>s.id);
 ACTIONS['mg-undo-order']();assert.deepEqual(skinSteps(r).map(s=>s.id),changed);
`));
test('ordinary vertical scroll cancels the hold without blocking scrolling',({run,tick})=>{
 run(rowFixture+`mgStart(target,150,35);mgMove(151,70,event);assert.equal(MG,null);assert.equal(prevented,0);`);
 tick(420);run(`assert.equal(MG,null);assert.equal(rows[0].classList.contains('mg-dragging'),false);`);
});
test('hold selects a stable drop target and cancellation clears drag state',({run,tick})=>{
 run(rowFixture+`mgStart(target,150,35);`);tick(420);
 run(`assert.equal(MG.mode,'drag');mgMove(151,195,event);assert.equal(MG.after,'c');assert.equal(prevented,1);
 assert.ok(rows[2].classList.contains('mg-drop-after'));mgCancel();
 assert.equal(MG,null);assert.equal(rows[0].style.transform,'');assert.equal(rows[2].classList.contains('mg-drop-after'),false);`);
});
test('horizontal swipe exposes actions, reverse swipe closes, cancel restores',({run})=>run(rowFixture+`
 mgStart(target,150,35);mgMove(75,36,event);mgEnd();
 assert.equal(rows[0].classList.contains('mg-revealed'),true);assert.equal(rows[0].querySelector('.mg-swipe-actions').inert,false);
 mgStart(target,150,35);mgMove(215,36,event);mgEnd();assert.equal(rows[0].classList.contains('mg-revealed'),false);
 mgStart(target,150,35);mgMove(75,36,event);mgCancel();
 assert.equal(rows[0].classList.contains('mg-swiping'),false);assert.equal(rows[0].querySelector('.mg-swipe-actions').inert,true);
`));
test('short and vertical tab gestures keep the current tab and edges clamp',({run})=>run(`
 assert.equal(mgTab('Matin',-80),'Soir');assert.equal(mgTab('Soir',-80),'Bilan');
 assert.equal(mgTab('Bilan',-80),'Bilan');assert.equal(mgTab('Matin',80),'Matin');assert.equal(mgTab('Soir',-30),'Soir');
 MG={kind:'tabs',mode:'pending',startX:0,startY:0,x:0,y:0,current:'Soir'};
 mgMove(3,50,{cancelable:true,preventDefault(){throw Error('blocked native scroll')}});assert.equal(MG,null);
`));
test('sheet dismissal requires deliberate downward travel',({run})=>run(`
 let closed=0,captured=0;closeModal=()=>closed++;captureDrafts=()=>captured++;
 const sheet={style:{}};
 MG={kind:'sheet',mode:'pending',sheet,startX:0,startY:0,x:0,y:0};
 mgMove(2,35,{cancelable:true,preventDefault(){}});mgEnd();assert.equal(closed,0);assert.equal(sheet.style.transform,'');
 MG={kind:'sheet',mode:'pending',sheet,startX:0,startY:0,x:0,y:0};
 mgMove(2,110,{cancelable:true,preventDefault(){}});mgEnd();assert.equal(closed,1);assert.equal(captured,1);
`));
console.log(checks+' mobile gesture and routine integrity checks passed.');
