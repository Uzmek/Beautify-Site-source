// User-supplied detail references. The badge strips contain its decorative crown
// and blank copper only; MEILLEURE OFFRE is always rendered as native text.
const sharp=require('sharp');
const fs=require('node:fs');
const path=require('node:path');
const out=path.resolve(__dirname,'../dist/assets/paywall-refined-v2');
const input=process.argv[2];
if(!input)throw new Error('Pass the directory containing the supplied detail references.');
fs.mkdirSync(out,{recursive:true});
const badge=path.join(input,'43f9abe7-bc47-481f-850c-96c7c595f212.png');
const palette=path.join(input,'c307505f-d589-40c2-a86f-ef18a0b92dfc.png');
const pieces=[
  ['best-left',badge,{left:18,top:12,width:160,height:114}],
  ['best-middle',badge,{left:169,top:12,width:15,height:114}],
  ['best-right',badge,{left:572,top:12,width:58,height:114}],
  ['palette-detail',palette,{left:438,top:10,width:318,height:239}],
];
Promise.all(pieces.map(([name,file,box])=>sharp(file).extract(box).png().toFile(path.join(out,name+'.png')))).then(()=>console.log('Prepared four text-free detail assets.'));
