// Mechanical web export only: no repainting, background removal or alpha changes.
const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
const manifest=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const output=path.resolve(__dirname,'../dist/assets/icons');
fs.mkdirSync(output,{recursive:true});
(async()=>{
  let bytes=0;
  for(const asset of manifest.assets){
    if(!/^[a-z-]+$/.test(asset.name))throw Error('Invalid asset name');
    const target=path.join(output,asset.name+'.webp');
    const source=await sharp(asset.path).metadata();
    if(!source.hasAlpha)throw Error('Missing transparency: '+asset.name);
    await sharp(asset.path).resize(256,256,{fit:'contain',background:'#00000000'}).webp({lossless:true,effort:6}).toFile(target);
    const meta=await sharp(target).metadata();
    if(!meta.hasAlpha||meta.width!==256||meta.height!==256)throw Error('Invalid export: '+asset.name);
    bytes+=fs.statSync(target).size;
  }
  console.log(JSON.stringify({icons:manifest.assets.length,totalBytes:bytes,alphaPreserved:true}));
})().catch(error=>{console.error(error);process.exitCode=1});
