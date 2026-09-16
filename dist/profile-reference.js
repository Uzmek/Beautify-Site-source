'use strict';

// Native profile controls over separate, text-free decorative artwork.
const profileReferenceArt = kind => `<img class="pf-medallion pf-medallion-${kind}" src="/assets/profile-reference/${kind}.png" width="1024" height="1024" alt="" aria-hidden="true" draggable="false">`;
const profileReferenceArrow = () => `<span class="pf-arrow" aria-hidden="true">${icon('chev')}</span>`;
const profileReferenceBadgeArt = kind => `<img class="pf-badge-art" src="/assets/profile-reference/badge-${kind}.png" width="1024" height="1024" alt="" aria-hidden="true">`;
function profileReferenceStatus() {
  const status = M.subscription.status;
  const labels = {active:'Actif',cancelled:'Renouvellement désactivé',free:'Découverte',pending:'Activation en attente',failed:'Activation non confirmée',expired:'Accès expiré'};
  const state = Object.hasOwn(labels,status)?status:'unknown';
  const glyphs = {
    free:'<path d="M12 4c1.1 4.7 3.3 6.9 8 8-4.7 1.1-6.9 3.3-8 8-1.1-4.7-3.3-6.9-8-8 4.7-1.1 6.9-3.3 8-8Z"/>',
    cancelled:'<path d="M9 7v10m6-10v10"/>',
    pending:'<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>',
    failed:'<path d="M12 6v7m0 4v.1"/>',
    expired:'<path d="M7 4h10M7 20h10M8 4v4l4 4-4 4v4m8-16v4l-4 4 4 4v4"/>',
    unknown:'<path d="M12 11v6m0-10v.1"/>'
  };
  const glyph = state==='active'?icon('check'):`<svg class="icon pf-status-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${glyphs[state]}</svg>`;
  return `<span class="pf-status is-${state}"><span class="pf-check" aria-hidden="true">${glyph}</span><span>${esc(labels[state]||'Statut indisponible')}</span></span>`;
}
V['PRF-01'] = () => {
  const name = M.profile.name || 'Invité';
  const accessAction = canonicalOwned()?'Gérer mon abonnement':M.subscription.status==='pending'?'Vérifier mon accès':'Découvrir Beautify Plus';
  const account = profileReferenceArt('account') + `<span class="pf-copy"><strong>Mon compte</strong><span class="pf-account-badges"><span class="pf-badge">${profileReferenceBadgeArt('user')}<span>${esc(name)}</span></span><span class="pf-badge">${profileReferenceBadgeArt('lock')}<span>${M.profile.connected?'Connecté':'Sans compte'}</span></span></span></span>` + profileReferenceArrow();
  const plus = profileReferenceArt('crown') + `<span class="pf-copy"><strong>Beautify Plus</strong>${profileReferenceStatus()}</span>`;
  const row = (kind,title,subtitle,route) => B(profileReferenceArt(kind)+`<span class="pf-copy"><strong>${title}</strong><span class="pf-subtitle">${subtitle}</span></span>`+profileReferenceArrow(),route,'pf-card pf-row');
  return `<div class="lg-page pf-page"><header class="pf-heading"><h1 tabindex="-1">Mon profil</h1><p>Votre compte et vos essentiels</p></header>` +
    B(account,'PRF-02','pf-card pf-account') +
    `<section class="pf-card pf-plus" aria-label="Beautify Plus"><div class="pf-plus-summary">${plus}</div>${B(icon('credit')+`<span>${accessAction}</span>`+icon('chev'),'PRF-06','pf-manage')}</section>` +
    row('photos','Photos et données','Gérer mes fichiers','PRF-07') +
    row('help','Aide et contact','Obtenir de l’aide','PRF-10') +
    profileDocumentLinks() + `</div>`;
};
