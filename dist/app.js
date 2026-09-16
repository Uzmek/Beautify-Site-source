'use strict';
const V={},F={},ACTIONS={};
const ALIASES={welcome:'ENT-02',upload:'ANA-04',scanning:'ANA-08',reveal:'ANA-09',premium:'PRE-01',results:'ANA-10',today:'ACC-01',profile:'PRF-01',analyze:'ANA-01',progress:'PRO-01',hair:'HAI-01',color:'COL-01',makeup:'MAQ-01',skin:'PEA-01',wardrobe:'GAR-01',events:'ACC-01',saved:'SAV-01'};
const ROOTS=['ACC-01','ANA-01','PRF-01'];
// Old entry URLs stay valid, but there is only one screen for each task.
const ROUTE_REDIRECTS={'SAV-01':'ANA-01','ENT-01':'ACC-01','ENT-03':'ANA-01','ENT-04':'ANA-01','ANA-02':'ANA-01','ANA-03':'ANA-04','ANA-05':'ANA-04','ANA-07':'ANA-06','ANA-11':'ANA-10','DEC-01':'ANA-01','PRE-02':'PRE-01'};
const isRetiredRoute=id=>id==='events'||String(id||'').startsWith('EVE-');
const resolveRoute=id=>{const target=isRetiredRoute(id)?'ACC-01':ALIASES[id]||id;return ROUTE_REDIRECTS[target]||target;};
let route=resolveRoute(ALIASES[location.hash.slice(1)]||location.hash.slice(1)||(M.started?'ENT-01':'ENT-02')),trail=[],timer=null,lastFocus=null,toastTimer=null,paintedSnapshot=null;
let navigationEpoch=M.navigationEpoch||uid('nav');
M.navigationEpoch=navigationEpoch;
const clone=x=>JSON.parse(JSON.stringify(x));
const fold=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr').trim();
const attr=o=>Object.entries(o||{}).filter(([k,v])=>!['label','pressed'].includes(k)&&v!==undefined).map(([k,v])=>`data-${k}="${esc(v)}"`).join(' ');
const plain=s=>String(s).replace(/<svg[\s\S]*?<\/svg>/g,'').replace(/<[^>]*>/g,'').trim();
const ACTION_LABELS={back:'Revenir à la page précédente',close:'Fermer',home:'Accueil',save:'Enregistrer ce contenu',menu:'Ouvrir le menu',scenarios:'Ouvrir les outils de revue',explorer:'Explorer les parcours',task:'Modifier la réalisation de cette action','task-open':'Ouvrir cette action','task-options':'Options de cette action','routine-check':'Marquer cette étape faite ou à faire','routine-remove':'Retirer cette étape','event-task':'Modifier la réalisation de cette préparation','delete-clothing-request':'Retirer cette pièce','calendar-prev':'Mois précédent','calendar-next':'Mois suivant'};
const B=(t,p,c='primary',o={})=>`<button type="button" class="${c}" data-go="${p}" ${attr(o)} ${!plain(t)?`aria-label="${esc(o.label||FLOW_INDEX.find(x=>x.id===p)?.title.split(' / ')[0]||'Ouvrir')}"`:''}>${t}</button>`;
const A=(t,a,o={},c='primary')=>`<button type="button" class="${c}" data-act="${a}" ${attr(o)} ${!plain(t)||o.label?`aria-label="${esc(o.label||ACTION_LABELS[a]||'Ouvrir les options')}"`:''} ${o.pressed!==undefined?`aria-pressed="${!!o.pressed}"`:''}>${t}</button>`;
const P=t=>`<p class="body-copy">${t}</p>`;
const note=t=>`<p class="mock-note">${t}</p>`;
const panel=(t,c='')=>`<section class="glass panel ${c}">${t}</section>`;
const head=(t,s='')=>`<div class="page-heading"><h1 tabindex="-1">${t}</h1>${s?P(s):''}</div>`;
const sec=(t,p='',label='Tout voir')=>`<div class="section-head serif-head"><h2>${t}</h2>${p?B(label+' '+icon('chev'),p,'text-button'):''}</div>`;
const empty=(t,s,p,l='Découvrir')=>panel(`<div class="empty-state">${icon('spark','glow-icon')}<h2>${t}</h2>${P(s)}${p?B(l,p):''}</div>`);
const progress=(n,total)=>`<div class="mini-step"><span>${n} / ${total}</span><div class="bar" role="progressbar" aria-label="Progression" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${n}"><span style="width:${Math.min(100,100*n/Math.max(1,total))}%"></span></div></div>`;
const tag=t=>`<span class="tag">${t}</span>`;
function imageFor(key,cls='',alt='Illustration d’inspiration'){
  if(String(key).startsWith('photo-')&&!memoryPhotos[key])return `<div class="photo-unavailable ${cls}">${icon('image')}<span>Photo à sélectionner à nouveau</span></div>`;
  const url=memoryPhotos[key]||(String(key).startsWith('/assets/')?key:null);
  return url?`<img class="${cls}" src="${esc(url)}" alt="${esc(alt)}">`:photo(key||'bun',cls,esc(alt));
}
function row(t,s,p,i='chev',o={}){return B(`<span class="row-label">${icon(i,'accent')}<span><strong>${t}</strong>${s?`<small>${s}</small>`:''}</span></span>${icon('chev')}`,p,'glass list-row',o);}
function field(name,label,value='',type='text',required=false){return `<label class="field"><span>${label}</span><input name="${name}" type="${type}" value="${esc(value??'')}" ${required?'required':''} ${type==='number'?'min="1" max="999"':''} ${name==='code'?'inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="one-time-code"':type==='text'?'maxlength="160"':''}></label>`;}
function area(name,label,value=''){return `<label class="field"><span>${label}</span><textarea name="${name}" rows="3" maxlength="1200">${esc(value)}</textarea></label>`;}
function select(name,label,options,value){return `<label class="field"><span>${label}</span><select name="${name}">${options.map(x=>{const v=typeof x==='object'?x.value:x,t=typeof x==='object'?x.label:x;return `<option value="${esc(v)}" ${v===value?'selected':''}>${esc(t)}</option>`;}).join('')}</select></label>`;}
const check=(name,t,on=false)=>`<label class="check-field"><input type="checkbox" name="${name}" ${on?'checked':''}><span>${t}</span></label>`;
function draftKey(id){const keys={event:M.eventEdit?.id||'new',routine:M.routineEdit?.id||'new',clothing:M.clothingEdit?.id||'new',outfit:M.outfitEdit?.id||'new',collection:M.collectionEdit?M.context.collection:'new',goal:M.goalEdit?.id||'new',observation:M.observationEdit?.id||'new','day-note':M.day||DATE(),'event-note':M.context.event,'routine-finish':(M.context.routine||'')+':'+(M.context.sessionDate||DATE()),'analysis-answers':M.draft.id||'current','save-content':M.context.saved,product:M.context.product};return keys[id]!==undefined?id+':'+keys[id]:id;}
function clearDrafts(id){Object.keys(M.formDrafts).filter(k=>k===id||k.startsWith(id+':')).forEach(k=>delete M.formDrafts[k]);}
function form(id,body,label='Enregistrer',extra=''){return `<form data-form="${id}" data-draft-key="${esc(draftKey(id))}" class="form-stack">${body}<p class="form-feedback" role="alert" hidden></p><button class="primary" type="submit">${label}${icon('arrow')}</button>${extra}</form>`;}
const draftVal=(id,name,fallback='')=>M.formDrafts[draftKey(id)]?.[name]??fallback;
function chips(values,key,current){return `<div class="choice-chips" role="group" aria-label="${esc(({hairTab:'Type de coiffure',makeupTab:'Style de maquillage',wardrobeTab:'Occasion',interests:'Centres d’intérêt'})[key]||'Choix')}">${values.map(v=>{const selected=Array.isArray(current)?current.includes(v):current===v;return A(esc(v),'choice',{key,value:v,pressed:selected},'choice-chip '+(selected?'selected':''));}).join('')}</div>`;}
function hero(title,desc,img='bun',button='',label='Inspiration'){return `<section class="glass image-hero mock-hero">${imageFor(img)}<div class="hero-copy">${tag(label)}<h2>${title}</h2>${P(desc)}${button}</div></section>`;}
function card(x){if(!x)return '';const saved=M.saved.includes(x.id);return `<article class="content-card"><button type="button" data-open="${esc(x.id)}">${imageFor(x.image||'bun','',x.name)}<span class="card-type">${esc(x.type||'Routine')}, ${esc(x.domain||'Personnel')}</span><h3>${esc(x.name)}</h3>${x.minutes?`<p>${x.minutes} min${x.budget?', '+esc(x.budget):''}</p>`:''}</button>${A(icon(saved?'check':'bookmark'),'save',{id:x.id,pressed:saved,label:(saved?'Retirer':'Enregistrer')+' '+x.name},'heart-save')}</article>`;}
const grid=xs=>`<div class="grid2 content-grid">${xs.map(card).join('')}</div>`;
function selectedBanner(){const s=M.context.selection;if(!s)return '';const e=M.events.find(x=>x.id===s.eventId);return `<section class="selection-banner" role="status"><span>${icon('calendar')}<strong>${s.kind==='event'?esc(s.domain)+', '+esc(e?.name||'Mon événement'):'Ajouter à ma collection'}</strong></span>${A('Annuler','cancel-selection',{},'text-button')}</section>`;}
function statusBanner(){const labels={empty:['Aucun élément pour le moment','Choisissez une inspiration ou créez votre premier élément.'],error:['Cette étape n’a pas abouti','Vos choix sont conservés. Réessayez lorsque vous êtes prête.'],offline:['Connexion interrompue','Votre saisie reste disponible dans cet onglet.'],unavailable:['Ce contenu est indisponible','Revenez à la sélection pour choisir une autre proposition.'],partial:['Résultat partiel','Certains domaines restent sans conclusion.'],pending:['En attente','La confirmation n’est pas encore disponible.'],refused:['Autorisation refusée','Vous pouvez choisir une autre option.']};const d=labels[M.scenario];return d?`<div class="state-banner" role="status"><strong>${d[0]}</strong><p>${d[1]}</p>${A('Réessayer','normal',{},'text-button')} ${A('Retour','back',{},'text-button')}</div>`:'';}
function homeFor(id){const g=id.split('-')[0];return ['ACC','ROU','EVE','PRO'].includes(g)?'ACC-01':['PRF','PRE','ENT'].includes(g)?'PRF-01':'ANA-01';}
function nav(){const active=homeFor(route);return `<nav class="bottom-nav" aria-label="Navigation principale">${[['ACC-01','Accueil','home'],['ANA-01','Analyses','bars'],['PRF-01','Profil','user']].map(([p,t,i])=>`<button type="button" data-go="${p}" data-root="true" class="${p===active?'active':''}" ${p===active?'aria-current="page"':''}>${icon(i)}<span>${t}</span></button>`).join('')}</nav>`;}
function snapshot(){return {route,epoch:navigationEpoch,context:clone(M.context),filters:clone(M.filters),root:M.navRoot||homeFor(route),viewState:viewStateFor(route),scroll:document.querySelector('#app > .mock-screen')?.scrollTop||0};}
function controlFocusKey(){
  const active=document.activeElement;
  if(!active?.closest?.('#app')||!active.matches?.('button[data-act],button[data-go]'))return null;
  return Object.fromEntries(Object.entries(active.dataset).filter(([key])=>key!=='label'));
}
function restoreControlFocus(key){
  if(!key)return;
  const target=[...document.querySelectorAll('#app button[data-act],#app button[data-go]')].find(el=>Object.entries(key).every(([name,value])=>el.dataset[name]===value));
  (target||document.querySelector('#app h1'))?.focus({preventScroll:true});
}
function render(options={}){
  const normalized=resolveRoute(route);if(normalized!==route){route=normalized;history.replaceState(null,'','#'+route);}if(!V[route])route='ACC-01';migrate();if(typeof canonicalRouteGuard==='function')route=canonicalRouteGuard(route);if(M.context.selection?.kind==='event')M.context.selection=null;delete M.context.eventTutorial;delete M.context.eventTutorialDate;delete M.context.eventTutorialDomain;const screen=document.querySelector('#app > .mock-screen');const same=paintedSnapshot?.route===route;
  const scroll=options.scroll??(same?screen?.scrollTop||0:0);const focus=options.focus??!same;const control=!focus&&same?controlFocusKey():null;
  document.documentElement.lang='fr';document.title=(FLOW_INDEX.find(x=>x.id===route)?.title.split(' / ')[0]||'Beautify')+', Beautify';clearTimeout(timer);
  const welcome=route==='ENT-02';const root=ROOTS.includes(route);
  document.getElementById('app').innerHTML=`<div class="statusbar" aria-hidden="true"><span>9:41</span><div class="island"></div><span class="status-icons">${icon('signal')}${icon('wifi')}${icon('battery')}</span></div>${!welcome?`<header class="app-header">${!root?A(icon('back')+'<span>Retour</span>','back',{label:'Revenir à l’écran précédent'},'flow-exit'):route==='ACC-01'?A(logo(),'home',{},'brand-button'):''}<span></span><div>${route.startsWith('ACH')?B(icon('bag')+(M.cart.length?`<b class="cart-count">${M.cart.reduce((n,c)=>n+c.qty,0)}</b>`:''),'ACH-02','icon-button',{label:'Panier, '+M.cart.reduce((n,c)=>n+c.qty,0)+' articles'}):B(icon('settings'),'PRF-04','icon-button',{label:'Paramètres'})}</div></header>`:''}<main data-route="${route}" class="screen mock-screen ${welcome?'welcome':'has-nav'}">${statusBanner()}${M.scenario==='unavailable'&&!/^ANA-0[3-8]$/.test(route)?empty('Cette inspiration n’est plus disponible','Vos autres contenus sont conservés.','DEC-01','Trouver une autre idée'):V[route]()}${selectionControl()}</main>${!welcome?nav():''}<div class="home-indicator"></div>`;
  restoreDrafts();const next=document.querySelector('#app > .mock-screen');if(next)next.scrollTop=scroll;
  if(focus)document.querySelector('#app h1')?.focus({preventScroll:true});else restoreControlFocus(control);renderDock();paintedSnapshot=snapshot();persist();
}
function renderDock(){let el=document.getElementById('mock-dock');if(!el){el=document.createElement('aside');el.id='mock-dock';document.body.appendChild(el);}el.innerHTML=`${logo()}<p>Votre beauté, à votre rythme.</p><div class="dock-rule"></div><span class="eyebrow">Preview iPhone 16</span><p>393 × 852, taille adaptée</p>${A(icon('menu')+' Revoir les parcours','explorer',{},'secondary')}${A(icon('spark')+' Outils de revue','scenarios',{},'secondary')}${A('Charger le profil d’exemple','sample',{},'text-button')}${note('Prototype interactif. Comptes, analyses et achats simulés.')}`;let tools=document.getElementById('review-tools');if(!tools){tools=document.createElement('div');tools.id='review-tools';document.body.appendChild(tools);}tools.innerHTML=`<span>Prototype, données fictives</span>${A('Mode revue','scenarios',{},'text-button')}`;}
function go(id,o={}){
  cancelBackFallback();id=resolveRoute(id);if(!V[id]){toast('Cette destination n’est pas disponible.');return;}
  if(o.reset){
    navigationEpoch=uid('nav');M.navigationEpoch=navigationEpoch;trail=[];paintedSnapshot=null;
    M.formDrafts={};M.accountReturnState=null;M.accountReturn=null;M.premiumReturnState=null;M.premiumCompletedState=null;M.premiumIntent=null;M.pendingProfile=null;M.profileEdit=null;M.preferenceEdit=null;
    o={...o,replace:true};
  }else if(!o.skipCapture)captureDrafts();
  const rootSwitch=ROOTS.includes(id)&&o.root;
  if(rootSwitch){trail=[];o={...o,replace:true};}
  if(id===route&&ROOTS.includes(id)){closeModal(false);render({focus:true,scroll:0});history.replaceState({beautify:snapshot(),depth:trail.length},'','#'+route);return;}
  const previous=paintedSnapshot?.route===route?{...clone(paintedSnapshot),scroll:document.querySelector('#app > .mock-screen')?.scrollTop||0}:snapshot();
  if(!o.replace){trail.push(previous);history.replaceState({beautify:previous,depth:trail.length-1},'',`#${route}`);}
  if(ROOTS.includes(id)||o.root){M.navRoot=id;M.context.selection=null;M.started=true;}else M.navRoot=M.navRoot||homeFor(route);
  if(o.context)Object.assign(M.context,o.context);if(o.key)M.context[o.key]=o.value;if(o.selection)M.context.selection=o.selection;
  if(id==='ROU-04'&&!o.context?.sessionDate)M.context.sessionDate=DATE();
  if(id==='PRO-03'&&route!=='PRO-03'&&o.context?.observationPhoto===undefined)M.observationEdit=null;
  if(id==='DEC-02'&&!o.keepFilters&&!M.context.selection)M.filters=defaultFilters();
  if(['ENT-05','ENT-06'].includes(id)&&!route.startsWith('ENT-')){M.accountReturn=route;M.accountReturnState=previous;}
  if(id==='PRE-01'&&!route.startsWith('PRE-')){M.premiumReturnState=previous;M.context.returnTo=route;}
  if(id==='PRF-03'&&route!=='PRF-03'){M.preferenceEdit=clone(M.prefs);clearDrafts('preferences');}
  if(id==='PRF-02'&&route!=='PRF-02'){M.profileEdit=clone(M.profile);clearDrafts('profile');}
  if(id==='PRF-11'&&o.document)M.documentTab=o.document;
  if(/^ANA-0[2-8]$/.test(id))M.draft.phase=id;
  closeModal(false);route=id;render({focus:true,scroll:o.scroll||0});
  const state={beautify:snapshot(),depth:trail.length};if(o.replace)history.replaceState(state,'',`#${route}`);else history.pushState(state,'',`#${route}`);
}
function restoreState(s){cancelBackFallback();if(s.epoch!==navigationEpoch){trail=[];go(M.started?'ACC-01':'ENT-02',{replace:true,skipCapture:true});return;}route=resolveRoute(s.route);M.context=clone(s.context);M.filters=clone(s.filters);M.navRoot=isRetiredRoute(s.route)?'ACC-01':s.root;if(s.viewState)Object.assign(M,clone(s.viewState));closeModal(false);render({focus:true,scroll:s.scroll||0});if(route!==s.route)history.replaceState({beautify:snapshot(),depth:trail.length},'',`#${route}`);}
let backFallbackTimer=null;
function cancelBackFallback(){if(backFallbackTimer!==null){clearTimeout(backFallbackTimer);backFallbackTimer=null;}}
function back(){
  captureDrafts();cancelBackFallback();
  if(document.getElementById('overlay').innerHTML){closeModal();return;}
  if(route==='PRE-01'||route==='PRE-03'){ACTIONS['premium-return']();return;}
  if(route==='COL-01'&&(M.lgColorApplications||M.previewSeason)){ACTIONS['lg-color-close']();return;}
  if(route==='HAI-01'&&['Toutes','Couleurs'].includes(M.hairTab)){M.hairTab='Pour moi';render({focus:true,scroll:0});return;}
  if(route==='PEA-01'&&['Matin','Soir','Suivi'].includes(M.skinTab)){M.skinTab='Rapport';render({focus:true,scroll:0});return;}
  const funnel={'ANA-04':'ANA-01','ANA-05':'ANA-04','ANA-06':'ANA-04','ANA-07':'ANA-04','ANA-08':'ANA-06'};
  const entry=route==='ANA-04'?M.draft.entryState:null;
  const stepParent=entry?.route||funnel[route];
  if(stepParent&&!trail.some(state=>state&&resolveRoute(state.route)===stepParent)){
    if(entry)returnToState(entry);else go(stepParent,{replace:true});
    return;
  }
  const isResult=['ANA-09','ANA-10','ANA-11'].includes(route);
  let index=trail.length-1;
  while(index>=0){
    const state=trail[index],id=state&&resolveRoute(state.route);
    const blockedReport=isResult&&!canonicalOwned()&&/^(HAI|COL|PEA)-/.test(id||'');
    if(id&&V[id]&&id!==route&&(!stepParent||id===stepParent)&&!blockedReport&&!(isResult&&(/^(PRE-|ANA-0[2-9]$|ANA-1[01]$)/.test(id))))break;
    index--;
  }
  if(index>=0){
    const target=clone(trail[index]),from=route,distance=trail.length-index;
    const fallback=()=>{if(route!==from)return;trail=trail.slice(0,index);returnToState(target);};
    // Browser history can be missing after a reload or suppressed in an embed.
    // The app stack remains a synchronous, bounded fallback in either case.
    if(typeof history.go==='function')history.go(-distance);
    else if(distance===1&&typeof history.back==='function')history.back();
    else {fallback();return;}
    if(route===from)backFallbackTimer=setTimeout(fallback,180);
    return;
  }
  const group=route.split('-')[0];
  const parent=isResult||['ANA-01','DEC-01','ESS-04'].includes(route)?'SAV-01':({ANA:'ANA-01',HAI:'SAV-01',COL:'SAV-01',PEA:'SAV-01',ESS:'ESS-04',PRE:'PRF-01',PRF:'PRF-01',ENT:'PRF-01',ROU:'ROU-01',PRO:'PRO-01',SAV:'SAV-01',DEC:'DEC-01',MAQ:'DEC-01',GAR:'DEC-01',ACH:'ACC-01'})[group]||'ACC-01';
  go(resolveRoute(parent)===route?'ACC-01':parent,{replace:true});
}
function returnToState(s,fallback='ACC-01'){if(s){restoreState(s);history.replaceState({beautify:snapshot(),depth:trail.length},'',`#${route}`);}else go(fallback);}
function openItem(id){const x=item(id);if(!x){toast('Ce contenu n’est plus disponible.');return;}const c={saved:id};let target='DEC-03';if(x.type==='Produit'){c.product=id;target='DEC-06';}else if(x.type==='Palette'){c.palette=id;target='COL-01';}else if(x.type==='Routine'){c.routine=id;target='ROU-02';}else if(x.type==='Conseil')target='DEC-05';else if(x.type==='Tutoriel'){startTutorial(x.source);return;}else if(x.type==='Simulation'){c.simulation=id;c.look=x.look;target='ESS-03';}else c.look=id;go(target,{context:c});}
function toast(t,action){clearTimeout(toastTimer);const el=document.getElementById('toast');el.innerHTML=`<span>${esc(t)}</span>${action?A(action.label,action.action,action.data||{},'text-button'):''}`;el.classList.add('show');toastTimer=setTimeout(()=>el.classList.remove('show'),action?6500:3500);}
function modal(t,body){lastFocus=document.activeElement;document.getElementById('overlay').innerHTML=`<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="dialog-title">${A(icon('x'),'close',{},'icon-button close')}<h2 id="dialog-title">${t}</h2>${body}</section></div>`;document.getElementById('app').inert=true;document.querySelector('.modal .close')?.focus();restoreDrafts();}
function closeModal(restore=true){const overlay=document.getElementById('overlay');const wasOpen=!!overlay.innerHTML;overlay.innerHTML='';document.getElementById('app').inert=false;if(wasOpen&&restore){if(lastFocus?.isConnected)lastFocus.focus({preventScroll:true});else document.querySelector('#app h1')?.focus({preventScroll:true});}}
function confirmAction(t,body,a,o={}){modal(t,P(body)+A('Confirmer',a,o)+A('Annuler','close',{},'secondary mt'));}
function captureDrafts(){document.querySelectorAll('form[data-form]').forEach(f=>{const values={};new FormData(f).forEach((v,k)=>{if(typeof v==='string'&&!['password','code'].includes(k))values[k]=v;});f.querySelectorAll('input[type="checkbox"]').forEach(el=>values[el.name]=el.checked);M.formDrafts[f.dataset.draftKey||draftKey(f.dataset.form)]=values;});}
function restoreDrafts(){document.querySelectorAll('form[data-form]').forEach(f=>{const values=M.formDrafts[f.dataset.draftKey||draftKey(f.dataset.form)];if(!values)return;Object.entries(values).forEach(([k,v])=>{const el=f.elements.namedItem(k);if(!el||['file','password'].includes(el.type))return;if(el.type==='checkbox')el.checked=!!v;else el.value=v??'';});});}
function formError(message){const el=document.querySelector('.modal form[data-form] .form-feedback')||document.querySelector('form[data-form] .form-feedback');if(el){el.textContent=message;el.hidden=false;}else toast(message);return false;}
function loadPhoto(file,purpose){if(!file)return;if(!file.type.startsWith('image/')||file.size>15*1024*1024){toast('Choisissez une image de moins de 15 Mo.');return;}const key=uid('photo'),url=URL.createObjectURL(file),probe=new Image();probe.onload=()=>{captureDrafts();memoryPhotos[key]=url;if(purpose==='profile'){M.profileEdit||=clone(M.profile);M.profileEdit.avatar=key;}else if(purpose==='clothing')M.context.clothingPhoto=key;else if(purpose==='observation')M.context.observationPhoto=key;else if(purpose==='simulation')M.simulationPhoto=key;else{M.draft.photo=key;M.draft.withoutPhoto=false;}if(purpose==='analysis'){M.draft.phase='ANA-06';go('ANA-06');}else{render();toast('Photo sélectionnée.');}};probe.onerror=()=>{URL.revokeObjectURL(url);toast('Cette image ne peut pas être ouverte.');};probe.src=url;}
function addPlan(x,date=DATE()){if(!x)return;const kind=M.routines.some(r=>r.id===x.id)?'routine':'look';if(!M.actions.some(a=>a.ref===x.id&&a.date===date))M.actions.push({id:uid('action'),name:x.name,date,kind,ref:x.id,done:false});}
function selectionControl(){const s=M.context.selection;if(!s)return '';const id=({'DEC-03':M.context.look,'DEC-06':M.context.product,'COL-01':M.context.palette||'palette','ROU-02':M.context.routine,'DEC-05':'article-colors','ESS-03':M.context.simulation})[route];return id&&canSelect(item(id),s)?`<div class="selection-footer">${A(s.kind==='event'?'Choisir pour '+esc(M.events.find(e=>e.id===s.eventId)?.name||'cet événement'):'Ajouter à la collection','choose-content',{id})}</div>`:'';}
function boot(){
  document.addEventListener('click',e=>{if(e.target.classList.contains('modal-backdrop')){closeModal();return;}const b=e.target.closest('button');if(!b||b.disabled)return;const d=b.dataset;if(d.go){go(d.go,{key:d.key,value:d.value,root:d.root==='true',document:d.document,keepFilters:d.keepFilters==='true'});return;}if(d.open){openItem(d.open);return;}if(d.act){ACTIONS[d.act]?.(d);persist();}});
  document.addEventListener('submit',e=>{const id=e.target.dataset.form;if(!id)return;e.preventDefault();const key=e.target.dataset.draftKey||draftKey(id);const data=Object.fromEntries(new FormData(e.target));e.target.querySelectorAll('input[type="checkbox"]').forEach(el=>data[el.name]=el.checked);if(['error','offline'].includes(M.scenario)){captureDrafts();formError('Cette étape a échoué. Vos réponses sont conservées.');return;}const result=F[id]?.(data,e.target);if(result!==false)delete M.formDrafts[key];persist();});
  document.addEventListener('input',e=>{if(e.target.closest('form[data-form]'))captureDrafts();if(e.target.classList.contains('explorer-search')){const q=fold(e.target.value);document.querySelectorAll('.flow-link').forEach(x=>x.hidden=!fold(x.textContent).includes(q));}if(e.target.id==='saved-search'){M.savedQuery=e.target.value;const results=document.getElementById('saved-results');if(results)results.innerHTML=savedContents();persist();}if(e.target.id==='catalog-search'){M.filters.q=e.target.value;const results=document.getElementById('catalog-results');if(results)results.innerHTML=catalogResults();persist();}});
  window.addEventListener('popstate',e=>{captureDrafts();if(e.state?.beautify){trail.length=Math.max(0,e.state.depth||0);restoreState(e.state.beautify);}else{route=ALIASES[location.hash.slice(1)]||location.hash.slice(1)||'ACC-01';M.navRoot=homeFor(route);M.context.selection=null;closeModal(false);render({focus:true});}});
  document.addEventListener('keydown',e=>{const m=document.querySelector('.modal');if(!m)return;if(e.key==='Escape')closeModal();if(e.key==='Tab'){const a=[...m.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),summary,a[href]')].filter(x=>!x.hidden&&x.getClientRects().length);if(e.shiftKey&&document.activeElement===a[0]){e.preventDefault();a.at(-1)?.focus();}else if(!e.shiftKey&&document.activeElement===a.at(-1)){e.preventDefault();a[0]?.focus();}}});
  render();history.replaceState({beautify:snapshot(),depth:0},'',`#${route}`);
}

Object.assign(ACTIONS,{
 close:()=>closeModal(),back,home:()=>go('ACC-01',{root:true}),
 explorer:()=>modal('Les parcours',`<input class="explorer-search" type="search" placeholder="Rechercher une page…" aria-label="Rechercher un parcours"><div class="flow-explorer">${[...new Set(FLOW_INDEX.map(x=>x.id.split('-')[0]))].map(g=>`<details><summary>${({ENT:'Bienvenue & compte',ACC:'Aujourd’hui',ANA:'Analyse',DEC:'Découvrir',HAI:'Cheveux',COL:'Couleurs',MAQ:'Maquillage',PEA:'Peau',GAR:'Dressing',ROU:'Routines',EVE:'Événements',SAV:'Enregistrés',PRO:'Mon suivi',PRF:'Profil & données',PRE:'Premium',ESS:'Simulation',ACH:'Achats'})[g]}</summary>${FLOW_INDEX.filter(x=>x.id.startsWith(g)).map(x=>B(`<small>${x.id}</small><span>${esc(x.title.split(' / ')[0])}</span>`,x.id,'flow-link '+(x.id===route?'selected':''))).join('')}</details>`).join('')}</div>`),
 scenarios:()=>modal('Mode revue',P('Testez les états du prototype. Ces commandes sont réservées à la revue.')+chips(['normal','empty','error','partial','pending','offline','unavailable','refused'],'scenario',M.scenario)+A('Voir les parcours','explorer',{},'secondary')+A('Charger le profil d’exemple','sample',{},'secondary mt')+A('Repartir sans données','reset-request',{},'text-button mt')),
 scenario:d=>{captureDrafts();if(d.value==='empty'&&!M._scenarioBackup){const old=M;M=initial();M._scenarioBackup=old;}else if(d.value!=='empty'&&M._scenarioBackup)M=M._scenarioBackup;M.scenario=d.value;closeModal();render();},
 choice:d=>{captureDrafts();if(d.key==='scenario'){ACTIONS.scenario(d);return;}if(d.key==='paletteMood'){M.context.palette=({Chaudes:'palette',Fraîches:'palette-cool',Neutres:'palette-neutral'})[d.value];}else if(d.key==='interests'){const prefs=route==='PRF-03'?(M.preferenceEdit||=clone(M.prefs)):M.prefs;const a=prefs.interests;a.includes(d.value)?a.splice(a.indexOf(d.value),1):a.push(d.value);}else if(d.key.startsWith('filter:'))M.filters[d.key.slice(7)]=d.value;else if(d.key==='domain')M.draft.domain=d.value;else M[d.key]=d.value;render();},
 sample:()=>{sample();migrate();M.scenario='normal';go('ACC-01',{root:true});toast('Profil d’exemple chargé.');},
 'reset-request':()=>confirmAction('Recommencer le prototype ?','Vos essais enregistrés sur cet appareil seront retirés.','reset'),
 reset:()=>{Object.values(memoryPhotos).forEach(URL.revokeObjectURL);Object.keys(memoryPhotos).forEach(k=>delete memoryPhotos[k]);M=initial();go('ENT-02',{reset:true});},
 save:d=>{const id=d.id||M.context.look,x=item(id);if(!x)return;if(M.saved.includes(id)){const collections=M.collections.filter(c=>c.items.includes(id)).map(c=>c.id);M.saved=M.saved.filter(v=>v!==id);M.collections.forEach(c=>c.items=c.items.filter(v=>v!==id));M.undoSave={id,collections};render();toast('Retiré des enregistrés',{label:'Annuler',action:'undo-save'});}else{M.saved.push(id);render();toast('Enregistré',{label:'Classer',action:'classify',data:{id}});}},
 'undo-save':()=>{const u=M.undoSave;if(!u||!item(u.id))return;if(!M.saved.includes(u.id))M.saved.push(u.id);u.collections.forEach(id=>{const c=M.collections.find(c=>c.id===id);if(c&&!c.items.includes(u.id))c.items.push(u.id);});M.undoSave=null;render();toast('Enregistrement rétabli.');},
 classify:d=>{M.saveReturnState=snapshot();go('SAV-03',{context:{saved:d.id||M.context.saved}});},
 'cancel-selection':()=>{const s=M.context.selection;M.context.selection=null;if(s?.returnState)returnToState({...s.returnState,context:{...s.returnState.context,selection:null}});else go(s?.back||'DEC-01');},
 'choose-content':d=>{const s=M.context.selection,x=item(d.id);if(!s||!canSelect(x,s)){toast('Choisissez un contenu adapté à cette sélection.');return;}if(s.kind==='event'){const e=M.events.find(e=>e.id===s.eventId);if(!e){toast('Cet événement a été retiré.');return;}e.look[s.domain]=d.id;delete e.tasks[s.domain];}else if(s.kind==='collection'){const c=M.collections.find(c=>c.id===s.collectionId);if(c&&!c.items.includes(d.id))c.items.push(d.id);if(!M.saved.includes(d.id))M.saved.push(d.id);}M.context.selection=null;go(s.back,{context:{event:s.eventId||M.context.event,collection:s.collectionId||M.context.collection}});toast(s.kind==='event'?'Choix ajouté à votre événement.':'Ajouté à la collection.');},
 'new-analysis':()=>{if(M.draft.status!=='complete'&&(M.draft.photo||Object.keys(M.draft.answers||{}).length)){modal('Reprendre votre analyse ?',P('Votre photo et vos réponses sont conservées.')+B('Reprendre',M.draft.phase)+A('Remplacer ce brouillon','replace-analysis',{},'secondary mt'));return;}ACTIONS['replace-analysis']();},
 'replace-analysis':()=>{clearDrafts('analysis-answers');M.draft={id:uid('draft'),domain:M.context.domain||'Cheveux',photo:'',phase:'ANA-02',answers:{},consent:false,status:'draft',withoutPhoto:false};go('ANA-02');},
 'sample-photo':()=>{M.draft.photo='bun';M.draft.withoutPhoto=false;go('ANA-06');},
 'file-pick':d=>{const i=document.createElement('input');i.type='file';i.accept='image/*';i.addEventListener('change',()=>loadPhoto(i.files?.[0],d.purpose||'analysis'));i.click();},
 'load-error':()=>{M.scenario='error';render();},
 normal:()=>{M.scenario='normal';closeModal();render();},
 catalog:d=>{M.filters={...defaultFilters(),domain:d.domain||'Tous',type:d.type||'Tous',occasion:d.occasion||'Toutes',time:d.time||'Tous',budget:d.budget||'Tous'};go('DEC-02',{keepFilters:true});},
 'catalog-filters':()=>modal('Affiner les inspirations',form('catalog-filters',select('domain','Univers',['Tous',...DOMAINS.map(d=>d[0])],M.filters.domain)+select('type','Contenu',['Tous','Look','Tutoriel','Conseil','Produit','Palette','Routine'],M.filters.type)+select('occasion','Occasion',['Toutes','Quotidien','Travail','Rendez-vous','Événement'],M.filters.occasion)+select('time','Temps disponible',['Tous','5 minutes','15 minutes'],M.filters.time)+select('budget','Budget',['Tous','Sans achat','Moins de 30 €'],M.filters.budget),'Afficher les résultats')),
 'selection-source':d=>{M.selectionSource=d.value;render();},
 'journal-open':d=>{const o=M.observations.find(o=>o.id===d.id);if(o){M.observationEdit=clone(o);clearDrafts('observation');go('PRO-03',{context:{observationPhoto:o.photo||''}});}},
 'journal-new':()=>{M.observationEdit=null;clearDrafts('observation');go('PRO-03',{context:{observationPhoto:''}});}
});
function canSelect(x,s){if(!x)return false;if(s.kind!=='event')return true;return x.type==='Look'&&(x.domain===s.domain||(s.domain==='Garde-robe'&&x.pieces));}
F['catalog-filters']=d=>{M.filters={...M.filters,...d};closeModal();render();};
