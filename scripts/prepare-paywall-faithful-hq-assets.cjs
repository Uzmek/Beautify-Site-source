// Re-encode the approved original artwork at its native resolution.
// Crops only remove the external card margin already trimmed in V140.
const fs=require('node:fs');
const path=require('node:path');
const sharp=require('sharp');
const root=path.resolve(__dirname,'..');
const masters=path.join(root,'docs/paywall-faithful-masters');
const output=path.join(root,'dist/assets/paywall-faithful-hq-v2');
const crops={'badge-base':{left:29,top:125,width:2113,height:433},cta:{left:21,top:181,width:2113,height:334},crown:{left:42,top:237,width:1166,height:780},hair:{left:6,top:58,width:1218,height:1160},bun:{left:16,top:59,width:1188,height:1185},care:{left:9,top:58,width:1200,height:1160},palette:{left:28,top:23,width:2118,height:662}};
(async()=>{
  fs.mkdirSync(output,{recursive:true});
  const manifest=[];
  for(const name of ['hair','bun','care','palette','hero','silk','badge-base','crown','cta']){
    let image=sharp(path.join(masters,name+'.png'));
    const source=await image.metadata();
    if(crops[name]) image=image.extract(crops[name]);
    const encoded=await image.webp({quality:99,alphaQuality:100,effort:6}).toFile(path.join(output,name+'.webp'));
    manifest.push({name,sourceWidth:source.width,sourceHeight:source.height,width:encoded.width,height:encoded.height,alpha:source.hasAlpha,source:'docs/paywall-faithful-masters/'+name+'.png',asset:'/assets/paywall-faithful-hq-v2/'+name+'.webp'});
  }
  fs.writeFileSync(path.join(masters,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  console.log(JSON.stringify(manifest,null,2));
})();
