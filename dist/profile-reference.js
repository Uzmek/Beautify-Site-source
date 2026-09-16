'use strict';

// Native profile controls over separate, text-free decorative artwork.
const profileReferenceArt = kind => `<img class="pf-medallion pf-medallion-${kind}" src="/assets/profile-reference/${kind}.png" width="1024" height="1024" alt="" aria-hidden="true" draggable="false">`;
const profileReferenceArrow = () => `<span class="pf-arrow" aria-hidden="true">${icon('chev')}</span>`;
const profileReferenceBadgeArt = kind => `<img class="pf-badge-art" src="/assets/profile-reference/badge-${kind}.png" width="1024" height="1024" alt="" aria-hidden="true">`;
function profileReferenceStatus() {
  const status = M.subscription.status;
  const labels = {active:'Actif',cancelled:'Renouvellement désactivé',free:'Découverte',pending:'Activation en attente',failed:'Activation non confirmée',expired:'Accès expiré'};
  return `<span class="pf-status${status==='active'?' is-active':''}">${status==='active'?`<span class="pf-check" aria-hidden="true">${icon('check')}</span>`:''}<span>${esc(labels[status]||'Statut indisponible')}</span></span>`;
}
V['PRF-01'] = () => {
  const name = M.profile.name || 'Invité';
  const accessAction = canonicalOwned()?'Gérer mon abonnement':M.subscription.status==='pending'?'Vérifier mon accès':'Découvrir Beautify Plus';
  const account = profileReferenceArt('account') + `<span class="pf-copy"><strong>Mon compte</strong><span class="pf-account-badges"><span class="pf-badge">${profileReferenceBadgeArt('user')}<span>${esc(name)}</span></span><span class="pf-badge">${profileReferenceBadgeArt('lock')}<span>${M.profile.connected?'Connecté':'Sans compte'}</span></span></span></span>` + profileReferenceArrow();
  const plus = profileReferenceArt('crown') + `<span class="pf-copy"><strong>Beautify Plus</strong>${profileReferenceStatus()}</span>` + profileReferenceArrow();
  const row = (kind,title,subtitle,route) => B(profileReferenceArt(kind)+`<span class="pf-copy"><strong>${title}</strong><span class="pf-subtitle">${subtitle}</span></span>`+profileReferenceArrow(),route,'pf-card pf-row');
  return `<div class="lg-page pf-page"><header class="pf-heading"><h1 tabindex="-1">Mon profil</h1><p>Votre compte et vos essentiels</p></header>` +
    B(account,'PRF-02','pf-card pf-account') +
    `<section class="pf-card pf-plus" aria-label="Beautify Plus">${B(plus,'PRF-06','pf-plus-summary')}${B(icon('credit')+`<span>${accessAction}</span>`+icon('chev'),'PRF-06','pf-manage')}</section>` +
    row('photos','Photos et données','Gérer mes fichiers','PRF-07') +
    row('help','Aide et contact','Obtenir de l’aide','PRF-10') +
    profileDocumentLinks() + `</div>`;
};
