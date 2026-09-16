// Desktop preview scales the iPhone 16 frame. On mobile, responsive.css uses
// the actual visual viewport without scaling text or controls.
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
