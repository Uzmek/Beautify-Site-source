// V1 remains unchanged in liquid.js and paywall.css.
const paywallV1 = V['PRE-01'];
// This build is a mockup/review build: developer controls are enabled by default.
const paywallDevMode=()=>true;
function normalizedPaywallVersion(value){
  return value==='v1'?'v1':'v2';
}
function paywallDevSwitcher(){
  if(!paywallDevMode())return '';
  const current=normalizedPaywallVersion(M.paywallVersion);
  return `<aside class="paywall-dev-switch" aria-label="Outils développeur du paywall">
    <span>DEV</span>
    <div role="group" aria-label="Version du paywall">
      ${A('V1','paywall-version',{value:'v1',pressed:current==='v1'},current==='v1'?'is-active':'')}
      ${A('V2','paywall-version',{value:'v2',pressed:current==='v2'},current==='v2'?'is-active':'')}
    </div>
  </aside>`;
}
function withPaywallDevSwitcher(html){
  return paywallDevMode()?html+paywallDevSwitcher():html;
}
function paywallV2(){
  const monthly=M.subscription.offer==='monthly';
  const benefits=[['hair','Tes rapports<br>complets','Cheveux, couleur, peau'],['bun','Ta coupe<br>avant le salon','Jusqu’à 10 essais / mois'],['care','Routine matin<br>& soir','Adaptée à toi']];
  return `<div class="pv2-page ${monthly?'pv2-monthly ':''}pv2-version-2" aria-label="Beautify Plus, paywall V2">
    <header class="pv2-hero">
      <div class="pv2-portrait" aria-hidden="true"><span class="pv2-portrait-top"></span><span class="pv2-portrait-lower"></span></div>
      ${A('<svg class="pv2-close-mark" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>','premium-return',{label:'Fermer le paywall'},'pv2-close')}
      <div class="pv2-brand">Beautify Plus</div><p class="pv2-byline">BY UZMEK</p>
      <h1 tabindex="-1">Tes couleurs.<br>Ta coupe.<br>Ta routine.</h1>
      <p class="pv2-tagline">Sans te tromper. Chaque jour.</p>
      <section class="pv2-social pv2-glass" aria-label="Avis illustratif de la maquette">
        <div class="pv2-rating"><strong>4,8</strong><span class="pv2-stars" aria-label="5 étoiles">${Array.from({length:5},()=>icon('star')).join('')}</span><span class="pv2-users">${icon('user')} + 12 000 utilisateurs</span></div>
        <div class="pv2-review-line"><blockquote>« Enfin des couleurs qui me vont vraiment. »</blockquote><p>— Léa, 26 ans</p></div>
      </section>
    </header>
    <section class="pv2-benefits" aria-label="Inclus dans Beautify Plus">
      <article class="pv2-palette pv2-glass">${pv2Art('palette')}<h2>Palette 12 saisons</h2><p>Personnalisée pour toi</p></article>
      <div class="pv2-benefit-grid">
        ${benefits.map(([kind,title,detail])=>`<article class="pv2-mini pv2-glass">${pv2Art(kind)}<div class="pv2-mini-copy"><h3>${title}</h3><p>${detail}</p></div></article>`).join('')}
      </div>
    </section>
    <section class="pv2-plans" aria-label="Choisir un abonnement">
      ${A(`<span class="pv2-best"><span class="pv2-best-art" aria-hidden="true"></span><span class="pv2-crown-ref" aria-hidden="true"></span>Meilleure offre</span><span class="pv2-discount"><span>−50%</span></span><span class="pv2-radio" aria-hidden="true"></span><span class="pv2-plan-copy"><strong>Annuel</strong><span class="pv2-price"><b>59,99 €</b><small>par an</small></span></span><span class="pv2-equivalent"><span>soit <b>4,99 €</b></span><small>/ mois</small></span>`,'pv2-offer',{value:'yearly',pressed:!monthly,label:'Annuel, 59,99 euros par an, soit 4,99 euros par mois'},'pv2-plan pv2-year pv2-glass')}
      ${A(`<span class="pv2-radio" aria-hidden="true"></span><span class="pv2-plan-copy"><strong>Mensuel</strong><span class="pv2-price"><b>9,99 €</b><small>par mois</small></span></span>`,'pv2-offer',{value:'monthly',pressed:monthly,label:'Mensuel, 9,99 euros par mois'},'pv2-plan pv2-month pv2-glass')}
    </section>
    ${A('<span>Commencer mes 3 jours offerts</span>'+icon('arrow'),'pv2-subscribe',{},'pv2-cta')}
    <p class="pv2-renewal-note" aria-live="polite">${pv2RenewalText(monthly?'monthly':'yearly')}</p>
    <section class="pv2-trust" aria-label="Votre abonnement"><div>${icon('check')}<strong>Annulable</strong></div><div><span class="pv2-infinity" aria-hidden="true">∞</span><strong>Accès complet</strong></div><div>${icon('shield')}<strong>Paiement sécurisé</strong></div></section>
    <footer class="pv2-legal"><div class="pv2-footer-links">${B('Conditions','PRF-11','pv2-text-link',{document:'Abonnement'})}${B('Confidentialité','PRF-11','pv2-text-link',{document:'Données'})}${B('Restaurer mes achats','PRE-04','pv2-text-link')}</div><div class="pv2-meta"><small>Maquette : avis et offres illustratifs. Aucun débit réel.</small></div></footer>
  </div>`;
}
// Retouched reference artwork contains photography and glass glyphs only.
// Titles, descriptions, prices and every control remain live accessible DOM.
function pv2Icon(name){
  const paths={
    calendar:'<rect x="3" y="5" width="18" height="17" rx="2"/><path d="M7 2v6M17 2v6M3 11h18M12 14v5M9.5 16.5h5"/>',
    palette:'<path d="M12 3a9 9 0 1 0 0 18h1a1.7 1.7 0 0 0 1.2-2.9 1.5 1.5 0 0 1 1.1-2.6H17A5.5 5.5 0 0 0 22 10C22 6 17 3 12 3Z"/><circle cx="7.5" cy="8.5" r=".8" fill="currentColor"/><circle cx="12" cy="6.5" r=".8" fill="currentColor"/><circle cx="16.5" cy="8.2" r=".8" fill="currentColor"/><circle cx="6" cy="13" r=".8" fill="currentColor"/>',
    waves:'<path d="M2 9c6 7 10-12 18-5M2 13c7 7 11-12 20-5M4 17c7 6 11-12 18-5M8 20c6 2 9-9 13-8"/>'
  };
  return paths[name]?`<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`:icon(name);
}
function pv2Art(kind){
  const source=`/assets/paywall-faithful-hq-v2/${kind}.webp`;
  return `<span class="pv2-art pv2-art-${kind}" aria-hidden="true"><img src="${source}" alt="" draggable="false"></span>`;
}
function pv2RenewalText(offer){
  return `Puis ${offer==='monthly'?'9,99 € par mois':'59,99 € par an'}. Annulable à tout moment.`;
}
// Preserve the live DOM on selection so glass filling and radio transitions run.
ACTIONS['pv2-offer']=d=>{
  if(!['yearly','monthly'].includes(d.value))return;
  M.subscription.offer=d.value;
  const page=document.querySelector('.pv2-page');
  if(page){
    page.classList.toggle('pv2-monthly',d.value==='monthly');
    page.querySelectorAll('[data-act="pv2-offer"]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.value===d.value)));
    const renewal=page.querySelector?.('.pv2-renewal-note');
    if(renewal)renewal.textContent=pv2RenewalText(d.value);
  }
  persist();
};
// A short, cancellable release lets the pill finish its press before navigation.
ACTIONS['pv2-subscribe']=()=>{
  const button=document.querySelector('.pv2-cta');
  if(!button){ACTIONS.subscribe();return;}
  if(button.disabled)return;
  button.disabled=true;
  button.setAttribute('aria-busy','true');
  button.classList.add('pv2-confirming');
  const finish=()=>{
    if(button.isConnected&&route==='PRE-01')ACTIONS.subscribe();
    if(button.isConnected){button.disabled=false;button.removeAttribute('aria-busy');button.classList.remove('pv2-confirming');}
  };
  if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)finish();
  else setTimeout(finish,260);
};
V['PRE-01']=()=>{
  const version=normalizedPaywallVersion(M.paywallVersion);
  return withPaywallDevSwitcher(version==='v1'?paywallV1():paywallV2());
};
ACTIONS['paywall-version']=d=>{
  if(!paywallDevMode())return;
  if(!['v1','v2'].includes(d.value))return;
  M.paywallVersion=d.value;
  render({focus:false,scroll:0});
};
// Explicit mockup links: ?paywall=v1#PRE-01 / ?paywall=v2#PRE-01.
if(typeof location.search==='string'){
  const version=new URLSearchParams(location.search).get('paywall');
  if(version==='v1')M.paywallVersion='v1';
  else if(['v2','v2a','v2b'].includes(version))M.paywallVersion='v2';
}
