// Exercise the shipped decoder on an actual EAN-13 raster, without a camera.
const assert=require('node:assert/strict');
const {BrowserMultiFormatOneDReader}=require('../dist/vendor/zxing-browser-0.1.5.min.js');
const L=['0001101','0011001','0010011','0111101','0100011','0110001','0101111','0111011','0110111','0001011'];
const G=['0100111','0110011','0011011','0100001','0011101','0111001','0000101','0010001','0001001','0010111'];
const parity=['LLLLLL','LLGLGG','LLGGLG','LLGGGL','LGLLGG','LGGLLG','LGGGLL','LGLGLG','LGLGGL','LGGLGL'];
const code='3337875597333',left=code.slice(1,7).split('').map((v,i)=>(parity[+code[0]][i]==='L'?L:G)[+v]).join('');
const right=code.slice(7).split('').map(v=>L[+v].replace(/[01]/g,b=>b==='0'?'1':'0')).join('');
const bits='0'.repeat(12)+'101'+left+'01010'+right+'101'+'0'.repeat(12);
for(const scale of [2,4]){
  const width=bits.length*scale,height=120,data=new Uint8ClampedArray(width*height*4);
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){const i=(y*width+x)*4,value=bits[Math.floor(x/scale)]==='1'?0:255;data[i]=data[i+1]=data[i+2]=value;data[i+3]=255;}
  const canvas={width,height,getContext:()=>({getImageData:()=>({data})})};
  assert.equal(new BrowserMultiFormatOneDReader().decodeFromCanvas(canvas).getText(),code);
}
console.log('Shipped barcode decoder reads EAN-13 at two resolutions.');
