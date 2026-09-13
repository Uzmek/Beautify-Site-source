'use strict';

// Product management is a single search surface followed by one editable sheet.
// Catalogue data is always confirmed by the user before it enters a routine.
let SP=null,SP_REQUEST=0,SP_STREAM=null,SP_CONTROLS=null,SP_DECODER=null;
const SP_CACHE=new Map(),SP_REQUEST_TIMES=[];
const SP_FIELDS='code,product_name,product_name_fr,brands,categories,categories_tags,image_front_small_url';
function spImage(product,type='care'){
  return product?.image&&/^https:\/\/images\.openbeautyfacts\.org\//.test(product.image)?`<img class="sp-photo" data-sp-type="${esc(type)}" src="${esc(product.image)}" alt="" loading="lazy" referrerpolicy="no-referrer">`:skinProductArt(type);
}
function spSource(product){return product?.source==='openbeautyfacts'?`<p class="sp-source">Fiche collaborative : <a href="https://world.openbeautyfacts.org/product/${esc(product.barcode)}" target="_blank" rel="noopener noreferrer">Open Beauty Facts</a>. Vérifiez le produit et sa variante.</p>`:'';}
function spSheet(title,body){const kind=body.includes('data-form="sp-product"')?' sp-editor-sheet':body.includes('data-form="sp-search"')?' sp-picker-sheet':'';skinSheet(title,`<div class="sp-sheet${kind}">${body}</div>`);}
function spOpen(data,mode='add'){
  const {r,step}=skinFind(data);if(!r||mode!=='add'&&!step)return;
  skinState();SP={routine:r.id,step:step?.id,mode,query:'',results:[],product:null};
  M.skinProductPicker={routine:r.id,...(step?{step:step.id}:{})};
  clearDrafts('sp-search');clearDrafts('sp-product');clearDrafts('skin-product');
  if(mode==='edit')spEdit(clone(skinProduct(step)));else spBrowse();
}
function spOwn(){return (M.skinCareProducts||[]).filter(p=>!p.example&&(!SP?.query||fold(p.name+' '+p.brand).includes(fold(SP.query))));}
function spBrowse(){
  if(!SP)return;
  const title=SP.mode==='replace'?'Remplacer le produit':'Ajouter un produit';
  spSheet(title,`<form data-form="sp-search" class="sp-search"><label class="sr-only" for="sp-query">Nom, marque ou code-barres</label><input id="sp-query" name="q" type="search" placeholder="Nom ou marque" value="${esc(SP.query)}" maxlength="100" enterkeyhint="search" autocomplete="off"><button type="submit" aria-label="Rechercher dans le catalogue">${icon('search')}</button></form><div class="sp-entry-actions">${skinStudioButton('Scanner','sp-scan',{},'glass','scan')}${skinStudioButton('Saisie libre','skin-custom-open',{},'glass','plus')}</div><div id="sp-results" aria-live="polite">${spLocalResults()}</div>`);
}
function spOption(p,source,index){return A(spImage(p,p.type)+`<span><strong>${esc(p.name)}</strong><small>${esc(p.brand||SKIN_TYPES[p.type]?.category||'Type à confirmer')}</small></span>`+icon('chev'),'sp-select',{source,index},'sp-result');}
function spLocalResults(){const own=spOwn();return own.length?`<div class="sp-results-heading"><h3>Mes produits${SP.query?' correspondants':''}</h3><span>${own.length}</span></div><div class="sp-result-group">${own.map((p,i)=>spOption(p,'own',i)).join('')}</div>`:`<p class="sp-empty">${SP.query?'Aucun produit enregistré avec ce nom. Lancez la recherche dans le catalogue.':'Retrouvez un produit par son nom, scannez son code-barres ou saisissez-le.'}</p>`;}
function spStatus(message){const el=document.getElementById('sp-results');if(el)el.innerHTML=`<p class="sp-empty" role="status">${esc(message)}</p>`;}
function spCatalogueProduct(p){
  const name=String(p.product_name_fr||p.product_name||'').trim().slice(0,100),barcode=String(p.code||'');
  if(!name||!/^\d{8,14}$/.test(barcode))return null;
  const words=fold(name+' '+(p.categories||'')+' '+(p.categories_tags||[]).join(' '));
  let type=/cleanser|cleansing|nettoy|reinig/.test(words)?'cleanse':/sunscreen|sun-protect|spf|solaire/.test(words)?'protect':/make-up-remov|demaquill|micella/.test(words)?'remove':/moistur|hydrat/.test(words)?'moisturize':/serum/.test(words)?'serum':/toner|tonique|essence/.test(words)?'toner':/eye-cream|contour.*yeux/.test(words)?'eye':/mask|masque/.test(words)?'mask':/exfolia/.test(words)?'exfoliate':'';
  return {id:'obf-'+barcode,name,brand:String(p.brands||'').slice(0,80),type,barcode,source:'openbeautyfacts',image:/^https:\/\/images\.openbeautyfacts\.org\//.test(p.image_front_small_url||'')?p.image_front_small_url:'',example:false};
}
async function spFetch(url){
  if(SP_CACHE.has(url))return SP_CACHE.get(url);
  const now=Date.now();while(SP_REQUEST_TIMES.length&&SP_REQUEST_TIMES[0]<now-60000)SP_REQUEST_TIMES.shift();if(SP_REQUEST_TIMES.length>=8)throw new Error('rate-limit');SP_REQUEST_TIMES.push(now);
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
  try{const res=await fetch(url+'&app_name=Beautify&app_version=1.0',{signal:controller.signal,credentials:'omit',referrerPolicy:'no-referrer'});if(res.status===404&&url.includes('/product/'))return {status:0};if(!res.ok)throw new Error('catalogue');const data=await res.json();SP_CACHE.set(url,data);return data;}finally{clearTimeout(timer);}
}
F['sp-search']=async data=>{
  if(!SP)return false;SP.query=String(data.q||'').trim().slice(0,100);
  if(/^\d[\d -]{6,18}\d$/.test(SP.query))return spLookup(SP.query);
  if(SP.query.length<2){spStatus('Saisissez au moins deux lettres.');return false;}
  // Search is submitted, never requested on every keystroke.
  const token=++SP_REQUEST;spStatus('Recherche dans le catalogue…');
  try{
    const url='https://world.openbeautyfacts.org/cgi/search.pl?search_simple=1&action=process&json=1&page_size=15&fields='+SP_FIELDS+'&search_terms='+encodeURIComponent(SP.query);
    const data=await spFetch(url);if(token!==SP_REQUEST||!SP)return;
    SP.results=(data.products||[]).map(spCatalogueProduct).filter(Boolean);
    const el=document.getElementById('sp-results');if(el)el.innerHTML=spLocalResults()+`<h3>Catalogue</h3>`+(SP.results.length?SP.results.map((p,i)=>spOption(p,'catalogue',i)).join(''):'<p class="sp-empty">Aucun résultat. Vous pouvez saisir votre produit.</p>');
  }catch(e){if(token===SP_REQUEST){const el=document.getElementById('sp-results');if(el)el.innerHTML=spLocalResults()+'<p class="sp-empty">Catalogue indisponible. Réessayez dans un instant ou saisissez votre produit.</p>'};}
  return false;
};
ACTIONS['sp-select']=data=>{if(!SP)return;const p=(data.source==='own'?spOwn():SP.results)[Number(data.index)];if(p)spEdit(clone(p));};
function spSelect(name,label,options,value,required=false){return `<label class="field"><span>${label}</span><select name="${name}" ${required?'required':''}>${options.map(([v,l])=>`<option value="${esc(v)}" ${v===value?'selected':''}>${esc(l)}</option>`).join('')}</select></label>`;}
function spEdit(product={}){
  if(!SP)return;SP.product=product;const {r,step}=skinFind({routine:SP.routine,step:SP.step});if(!r)return;
  const type=step?.type||product.type||'',frequency=step?.frequency||(SKIN_TYPES[type]?.occasional||type==='remove'?'needed':'daily');
  SP.type=type;SP.frequencyDirty=false;clearDrafts('sp-product');
  const moments=SP.mode!=='add'?[[r.moment,r.moment]]:[['Matin','Matin'],['Soir','Soir'],['both','Les deux']];
  const title=SP.mode==='edit'?'Modifier mon produit':SP.mode==='replace'?'Remplacer le produit':'Mon produit';
  const identity=`<div class="sp-identity">${field('productName','Nom du produit',product.name||'','text',true).replace('<input ','<input placeholder="Ex. Crème hydratante" ')}${field('brand','Marque',product.brand||'').replace('<input ','<input placeholder="Facultatif" ')}${spSelect('type','Type de soin',[['','Choisir un type'],...Object.entries(SKIN_TYPES).filter(([key])=>!step||key===step.type).map(([key,t])=>[key,t.category])],type,true)}</div>`;
  const schedule=`<div class="sp-schedule">${SP.mode==='edit'?'':`<fieldset class="sp-moments"><legend>Quand l’utiliser</legend>${moments.map(([v,l])=>`<label><input type="radio" name="moment" value="${v}" ${v===r.moment?'checked':''}><span>${v==='both'?icon('calendar'):skinStudioIcon(v)}${l}</span></label>`).join('')}</fieldset>`}${spSelect('frequency','Fréquence',[['daily','Chaque jour'],['days','Certains jours'],['needed','Au besoin']],frequency)}<fieldset class="sp-days" ${frequency!=='days'?'hidden':''}><legend>Choisir les jours</legend>${[1,2,3,4,5,6,0].map(day=>`<label><input type="checkbox" name="day${day}" ${(step?.days||[]).includes(day)?'checked':''}><span>${SKIN_DAYS[day]}</span></label>`).join('')}</fieldset></div>`;
  spSheet(title,`<form id="sp-product-form" data-form="sp-product" data-draft-key="${esc(draftKey('sp-product'))}" class="form-stack sp-product-form">${product.name?`<div class="sp-preview">${spImage(product,type)}<div><strong>${esc(product.name)}</strong><small>${esc(product.brand||'Mon soin')}</small></div></div>`:''}${identity}${schedule}${spSource(product)}<p class="form-feedback" role="alert" hidden></p></form><footer class="sp-editor-footer"><button type="submit" form="sp-product-form" class="ss-button ss-copper">${icon('check')}<span>${SP.mode==='edit'?'Enregistrer':SP.mode==='replace'?'Remplacer':'Ajouter à ma routine'}</span></button>${A(SP.mode==='edit'?'Retour au produit':'Retour à la recherche',SP.mode==='edit'?'sp-detail-back':'sp-browse',{},'sp-back')}</footer>`);
}
function spEnsureRoutine(moment){
  const existing=skinRoutine(moment);if(existing)return existing;
  const r={id:uid('skin-routine'),name:'Ma routine du '+moment.toLowerCase(),domain:'Peau',moment,frequency:'Chaque jour',steps:[],skinSteps:[],version:1,type:'Routine',skinManaged:true,image:moment==='Matin'?'morning':'evening'};
  M.routines.push(r);M.active.push(r.id);M.schedules[r.id]={start:DATE(),days:[0,1,2,3,4,5,6]};M.skinRoutineIds||={};M.skinRoutineIds[moment]=r.id;return r;
}
F['sp-product']=data=>{
  if(!SP)return false;
  const {r,step}=skinFind({routine:SP.routine,step:SP.step});if(!r||SP.step&&!step)return formError('Ce soin n’est plus disponible.');
  const name=String(data.productName||'').trim().slice(0,100),brand=String(data.brand||'').trim().slice(0,80),type=step?.type||data.type;
  if(!name||!SKIN_TYPES[type])return formError('Indiquez le nom et le type de votre soin.');
  const frequency=['daily','days','needed'].includes(data.frequency)?data.frequency:'daily',days=[0,1,2,3,4,5,6].filter(day=>data['day'+day]===true||data['day'+day]==='on');
  if(frequency==='days'&&!days.length)return formError('Choisissez au moins un jour.');
  const moment=SP.mode==='edit'?r.moment:data.moment;
  if(!['Matin','Soir','both'].includes(moment))return formError('Choisissez le moment de votre soin.');
  if(type==='protect'&&moment!=='Matin')return formError('Ajoutez la protection solaire à la routine du matin.');
  const base=SP.product||{};
  let product={...base,id:SP.mode==='edit'?(step.product?.id||uid('skin-product')):base.id||uid('skin-product'),name,brand,type,example:false};
  const identical=M.skinCareProducts.find(p=>p.type===type&&fold(p.name)===fold(name)&&fold(p.brand||'')===fold(brand));
  if(identical&&SP.mode!=='edit')product={...identical,...product,id:identical.id};
  const ownIndex=M.skinCareProducts.findIndex(p=>p.id===product.id);if(ownIndex>=0)M.skinCareProducts[ownIndex]=clone(product);else M.skinCareProducts.push(clone(product));
  const targets=moment==='both'?['Matin','Soir']:[moment];
  // Edits/replace keep stable step IDs, their order and already-recorded sessions.
  if(step){step.product=clone(product);step.frequency=frequency;step.days=days;r.version++;skinSyncToday(r);}
  for(const target of targets){
    if(step&&target===r.moment)continue;
    const targetRoutine=target===r.moment?r:spEnsureRoutine(target),steps=skinSteps(targetRoutine);
    const duplicate=steps.find(s=>s.product?.id===product.id);if(duplicate){duplicate.frequency=frequency;duplicate.days=days;targetRoutine.version++;skinSyncToday(targetRoutine);continue;}
    const entry={id:uid('skin-step'),type,title:SKIN_TYPES[type].title,instruction:SKIN_TYPES[type].instruction,product:clone(product),frequency,days};
    const index=steps.findIndex(s=>SKIN_TYPES[s.type].rank>SKIN_TYPES[type].rank);steps.splice(index<0?steps.length:index,0,entry);
    targetRoutine.steps=steps.map(s=>s.instruction);targetRoutine.version++;skinSyncToday(targetRoutine);
  }
  const edited=SP.mode==='edit',replaced=SP.mode==='replace';SP=null;M.skinProductPicker=null;clearDrafts('sp-product');closeModal(false);persist();render();toast(edited?'Produit modifié.':replaced?'Produit remplacé.':moment==='both'?'Produit ajouté au matin et au soir.':'Produit ajouté à votre routine.');return true;
};
ACTIONS['skin-add-open']=data=>spOpen(data);
ACTIONS['skin-replace-open']=data=>spOpen(data,'replace');
ACTIONS['sp-edit']=data=>spOpen(data,'edit');
const SP_LEGACY_CUSTOM=ACTIONS['skin-custom-open'];
ACTIONS['skin-custom-open']=()=>{if(SP)spEdit({name:SP.query&&!/^\d+$/.test(SP.query)?SP.query:'',type:SP.type||'',...(SP.product?.barcode&&!SP.product.name?{barcode:SP.product.barcode}:{})});else SP_LEGACY_CUSTOM();};
ACTIONS['sp-browse']=()=>{clearDrafts('sp-product');spBrowse();};
ACTIONS['sp-detail-back']=()=>{if(SP)skinStepDetail({routine:SP.routine,step:SP.step});};
skinStepDetail=function(data){
  const {r,step}=skinFind(data);if(!step)return;const p=skinProduct(step);
  spSheet(step.title,`<div class="sp-preview">${spImage(p,step.type)}<div><strong>${esc(p.name)}</strong><small>${esc(p.brand||(!step.product?'Produit à choisir':p.example?'Exemple de produit':'Mon produit'))}</small></div></div><p class="sp-frequency-label">${icon('calendar')}${esc(skinFrequencyLabel(step))}</p>`+
    skinStudioButton('Modifier le produit et la fréquence','sp-edit',data,'copper','settings')+
    skinStudioButton('Remplacer le produit','skin-replace-open',data,'glass','refresh')+
    `<details class="sp-instructions"><summary>Comment l’utiliser</summary><p>${esc(step.instruction||SKIN_TYPES[step.type].instruction)}</p></details>`+
    (skinDone(r,step)?'<p class="sp-source">Le soin déjà coché garde le produit utilisé à cette date.</p>':'')+spSource(p)+
    A('Retirer de cette routine','skin-remove-step',data,'sp-remove'));
};
ACTIONS['skin-step-detail']=skinStepDetail;
// Move directly to a chosen position instead of opening a sheet for every move.
ACTIONS['ss-organize-step']=data=>{
  const {r,step}=skinFind(data);if(!step)return;SP={routine:r.id,step:step.id,mode:'order'};
  const steps=skinSteps(r);spSheet('Position dans la routine',form('sp-position',spSelect('position','Placer ce soin',steps.map((s,i)=>[String(i),`${i+1}. ${skinProduct(s).name}`]),String(steps.indexOf(step))),'Déplacer')+skinStudioButton('Modifier ce produit','sp-edit',data,'glass','settings'));
};
F['sp-position']=data=>{const {r,step}=skinFind({routine:SP?.routine,step:SP?.step});if(!step)return false;const steps=skinSteps(r),position=Number(data.position);if(!Number.isInteger(position)||position<0||position>=steps.length)return false;steps.splice(steps.indexOf(step),1);steps.splice(position,0,step);r.steps=steps.map(s=>s.instruction);r.version++;skinSyncToday(r);closeModal(false);persist();render();return true;};

// Codes are decoded locally; only the resulting code is sent to the catalogue.
function spBarcode(raw){const code=String(raw||'').replace(/[ -]/g,'');if(!/^(\d{8}|\d{12}|\d{13}|\d{14})$/.test(code))return '';let sum=0;for(let i=code.length-2,n=0;i>=0;i--,n++)sum+=Number(code[i])*(n%2?1:3);return (10-sum%10)%10===Number(code.at(-1))?code:'';}
async function spLookup(raw){
  if(!SP)return;const code=spBarcode(raw);if(!code){spStatus('Code-barres illisible ou incomplet. Saisissez les chiffres sous les barres.');return false;}
  spStopScan();spSheet('Votre produit',`<div id="sp-results" role="status"><p class="sp-empty">Recherche du produit…</p></div>${skinStudioButton('Saisir le produit','skin-custom-open',{},'glass','plus')}${A('Retour à la recherche','sp-browse',{},'sp-back')}`);
  const token=++SP_REQUEST;
  try{const data=await spFetch('https://world.openbeautyfacts.org/api/v2/product/'+code+'.json?fields='+SP_FIELDS);if(token!==SP_REQUEST||!SP)return;
    const product=data.status===1&&data.product?spCatalogueProduct({...data.product,code}):null;
    if(product)spEdit(product);else{SP.product={barcode:code};spStatus('Ce produit n’est pas encore renseigné. Vous pouvez l’ajouter manuellement.');}
  }catch(e){if(token===SP_REQUEST)spStatus('Le catalogue ne répond pas. Vous pouvez saisir votre produit ou réessayer depuis la recherche.');}
}
function spLoadDecoder(){
  if(window.ZXingBrowser)return Promise.resolve(window.ZXingBrowser);
  if(!SP_DECODER)SP_DECODER=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='/vendor/zxing-browser-0.1.5.min.js';script.onload=()=>resolve(window.ZXingBrowser);script.onerror=()=>{SP_DECODER=null;reject(new Error('decoder'));};document.head.appendChild(script);});
  return SP_DECODER;
}
function spStopScan(){const controls=SP_CONTROLS,stream=SP_STREAM;SP_CONTROLS=null;SP_STREAM=null;try{controls?.stop();}catch{}if(stream)stream.getTracks().forEach(track=>track.stop());}
ACTIONS['sp-scan']=async()=>{
  if(!SP)return;
  spSheet('Scanner un code-barres',`<div class="sp-camera"><video id="sp-video" autoplay muted playsinline aria-label="Caméra de lecture du code-barres"></video></div><div id="sp-results" role="status"><p class="sp-empty">Placez les barres dans le cadre.</p></div><label class="sp-file">${icon('image')} Photographier le code-barres<input id="sp-barcode-photo" type="file" accept="image/*" capture="environment"></label>`+form('sp-barcode',`<label class="field"><span>Ou saisir les chiffres</span><input name="barcode" inputmode="numeric" pattern="[0-9 -]{8,20}" maxlength="20" required autocomplete="off"></label>`,'Rechercher')+A('Retour à la recherche','sp-browse',{},'sp-back'));
  const token=SP_REQUEST;
  try{
    const decoder=await spLoadDecoder();if(token!==SP_REQUEST)return;
    const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1280}},audio:false});
    if(token!==SP_REQUEST){stream.getTracks().forEach(t=>t.stop());return;}SP_STREAM=stream;
    const reader=new decoder.BrowserMultiFormatOneDReader();
    const controls=await reader.decodeFromStream(stream,document.getElementById('sp-video'),(result,error,control)=>{if(result&&token===SP_REQUEST){const code=spBarcode(result.getText());if(code){control.stop();spLookup(code);}}});
    if(token!==SP_REQUEST)controls.stop();else SP_CONTROLS=controls;
  }catch(e){if(token===SP_REQUEST){spStopScan();spStatus('Caméra indisponible ou refusée. Prenez une photo du code-barres ou saisissez ses chiffres.');}}
};
F['sp-barcode']=data=>{spLookup(data.barcode);return false;};
document.addEventListener('change',async event=>{
  const target=event.target,form=target.closest?.('form[data-form="sp-product"]');
  if(form&&target.name==='frequency'){SP.frequencyDirty=true;form.querySelector('.sp-days').hidden=target.value!=='days';}
  if(form&&target.name==='type'&&!SP.frequencyDirty){const freq=form.elements.namedItem('frequency');freq.value=SKIN_TYPES[target.value]?.occasional||target.value==='remove'?'needed':'daily';form.querySelector('.sp-days').hidden=true;}
  if(target.id!=='sp-barcode-photo'||!SP)return;const file=target.files?.[0];if(!file)return;
  if(!file.type.startsWith('image/')||file.size>12*1024*1024){spStatus('Choisissez une photo de moins de 12 Mo.');return;}
  spStopScan();const token=++SP_REQUEST,url=URL.createObjectURL(file);spStatus('Lecture du code-barres…');
  try{const decoder=await spLoadDecoder();if(token!==SP_REQUEST)return;const result=await new decoder.BrowserMultiFormatOneDReader().decodeFromImageUrl(url);if(token===SP_REQUEST)await spLookup(result.getText());}
  catch(e){if(token===SP_REQUEST)spStatus('Code non détecté. Photographiez-le de plus près ou saisissez ses chiffres.');}finally{URL.revokeObjectURL(url);}
});
document.addEventListener('input',event=>{if(event.target.id==='sp-query'&&SP){SP.query=event.target.value;SP_REQUEST++;const el=document.getElementById('sp-results');if(el)el.innerHTML=spLocalResults();}});
const SP_MODAL=modal,SP_CLOSE=closeModal;
modal=function(...args){SP_REQUEST++;spStopScan();return SP_MODAL(...args);};
closeModal=function(...args){SP_REQUEST++;spStopScan();return SP_CLOSE(...args);};
document.addEventListener('visibilitychange',()=>{if(document.hidden){SP_REQUEST++;spStopScan();}});
window.addEventListener('pagehide',spStopScan);

const SP_LEGACY_TYPE=ACTIONS['skin-add-type'];
ACTIONS['skin-add-type']=data=>{SP=null;SP_LEGACY_TYPE(data);};
document.addEventListener('error',event=>{const el=event.target;if(el?.classList?.contains('sp-photo')){el.outerHTML=skinProductArt(SKIN_TYPES[el.dataset.spType]?el.dataset.spType:'care');}},true);

// The routine uses the confirmed product photo whenever the catalogue supplied one.
const SP_STUDIO_STEP=skinStudioStep;
skinStudioStep=function(r,step,index){const p=skinRecordedProduct(r,step)||skinProduct(step);return SP_STUDIO_STEP(r,step,index).replace(skinProductArt(step.type),spImage(p,step.type));};
