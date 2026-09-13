// User-authorized crops of the supplied reference. No text is rasterized into
// the interactive UI: photo crops use CSS masks; button slices are text-free.
const sharp = require('sharp');
const path = require('node:path');
const fs = require('node:fs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist/assets/paywall-parts-v2');
const reference = path.join(root, 'dist/assets/paywall-reference-v2.png');
const decor = path.join(root, 'dist/assets/paywall-decor-v2.png');
const crops = [
  ['portrait',reference,442,0,410,522],
  ['hero-silk',reference,0,0,442,108],
  ['portrait-lower',reference,625,522,227,190],
  ['palette',reference,480,674,309,233],
  ['hair',reference,43,925,153,239],
  ['bun',reference,309,928,165,230],
  ['care',reference,566,941,155,208],
  ['cta-left',reference,46,1518,127,88],
  ['cta-right',reference,680,1518,128,88],
  ['cta-middle',reference,690,1518,8,88],
  ['annual-left',reference,44,1322,114,60],
  ['annual-right',reference,641,1308,166,74],
  ['hero-base',decor,0,0,852,714],
  ['satin',decor,0,1200,852,646],
];
(async()=>{
  fs.mkdirSync(output,{recursive:true});
  for(const [name,input,left,top,width,height] of crops){
    await sharp(input).extract({left,top,width,height}).png().toFile(path.join(output,name+'.png'));
  }
  console.log(`Prepared ${crops.length} reference parts.`);
})();
