const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync('dist/profile-glass.js', 'utf8');
function runtime(userAgent='Chrome/130') {
  const frames=[], maps=[], nodes=[], watched=new Set();
  let mutate;
  function element(tag) {
    const attrs={}, children=[];
    const values=new Map();
    const el={tag,attrs,children,style:{setProperty:(k,v)=>values.set(k,v),getPropertyValue:k=>values.get(k)||''},
      setAttribute:(k,v)=>attrs[k]=v,append:(...items)=>children.push(...items),remove:()=>el.removed=true};
    nodes.push(el); return el;
  }
  const body=element('body'), app=element('app'), overlay=element('overlay');
  const controls=[element('button'),element('button')];
  for(const el of controls) { el.offsetWidth=172;el.offsetHeight=48; }
  let live=controls;
  const document={body,querySelectorAll:()=>live,getElementById:id=>id==='app'?app:id==='overlay'?overlay:nodes.find(n=>!n.removed&&n.attrs.id===id),
    createElementNS:(_,tag)=>element(tag),createElement:()=>({getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData:map=>maps.push(map.data)}),toDataURL:()=> 'data:image/png;base64,lens'})};
  const context={navigator:{userAgent},CSS:{supports:()=>true},document,getComputedStyle:()=>({borderTopLeftRadius:'999px'}),requestAnimationFrame:fn=>(frames.push(fn),frames.length),
    ResizeObserver:class {observe(el){watched.add(el)} unobserve(el){watched.delete(el)}},MutationObserver:class {constructor(fn){mutate=fn} observe(){} }};
  vm.runInNewContext(source,context);
  const flush=()=>{while(frames.length)frames.shift()()};
  assert.equal(frames.length,0,'initial glass is prepared synchronously before paint');
  flush();
  return {maps,nodes,controls,watched,replaceControls(){ const el=element('button'); el.offsetWidth=280; el.offsetHeight=44; live=[el]; mutate(); assert.match(el.style.getPropertyValue('--profile-control-filter'),/profile-lens/,'navigation prepares the new control during the mutation callback'); assert.equal(frames.length,0,'navigation does not defer material to another frame'); },removeControls(){live=[];mutate();flush()}};
}
const r=runtime();
assert.equal(r.maps.length,1,'equal-sized controls share one displacement map');
assert.equal(r.watched.size,2);
const pixel=(x,y,c)=>r.maps[0][(y*172+x)*4+c];
assert.equal(pixel(86,24,0),128,'the middle stays undeformed');
assert.equal(pixel(86,24,1),128);
assert.ok(pixel(4,24,0)<128,'left edge samples outwards');
assert.ok(pixel(167,24,0)>128,'right edge samples outwards');
assert.ok(pixel(86,4,1)<128,'top edge samples outwards');
assert.ok(pixel(86,43,1)>128,'bottom edge samples outwards');
assert.equal(r.controls[0].style.getPropertyValue('--profile-control-filter'),r.controls[1].style.getPropertyValue('--profile-control-filter'));
r.replaceControls();
r.removeControls();
assert.equal(r.watched.size,0,'detached controls release resize observers');
assert.equal(r.nodes.filter(n=>n.tag==='filter'&&!n.removed).length,0,'unused lens maps are released');
assert.equal(runtime('Version/18 Safari/605').maps.length,0,'Safari keeps the CSS fallback');
console.log('Profile glass: clear center, curved edge displacement, shared maps, observer cleanup and Safari fallback passed.');
