// Keep the full 393 × 852 design space; resizing changes only its scale.
const previewStage=document.getElementById('preview-stage');
const phonePreview=document.getElementById('phone-preview');
function fitPhonePreview(){
  const {width,height}=previewStage.getBoundingClientRect();
  const scale=Math.max(0,Math.min(width/393,height/852,480/393));
  phonePreview.style.setProperty('--phone-scale',String(scale));
}
fitPhonePreview();
const previewObserver=new ResizeObserver(fitPhonePreview);
previewObserver.observe(previewStage);
boot();
