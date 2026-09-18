'use strict';

// Canonical artwork and controls shared by every page of the profile journey.
const PROFILE_ART = {
  account:'/assets/profile-reference/account.png',
  crown:'/assets/profile-reference/crown.png',
  photos:'/assets/profile-reference/photos.png',
  help:'/assets/profile-reference/help.png',
  shield:'/assets/profile-information/shield.png',
  mail:'/assets/profile-help/mail.png',
  analysis:'/assets/profile-help/analysis.png',
  lock:'/assets/profile-help/lock.png',
  credit:'/assets/profile-access/credit.png',
  bag:'/assets/profile-access/bag.png',
  information:'/assets/profile-access/information.png',
  scissors:'/assets/profile-access/scissors-real.png',
  export:'/assets/profile-data/export.png',
  delete:'/assets/profile-data/delete.png'
};
function profileArt(kind,extra='') {
  const name=kind==='photo'?'photos':kind;
  return `<span class="profile-art profile-art-${name} ${extra}" aria-hidden="true"><img src="${PROFILE_ART[name]||PROFILE_ART.help}" width="1254" height="1254" alt="" draggable="false"></span>`;
}
const profileArrow = extra => `<span class="profile-arrow ${extra||''}" aria-hidden="true">${icon('chev')}</span>`;
const profileRowCopy = (title,subtitle) => `<span class="ph-copy"><strong>${esc(title)}</strong><span>${esc(subtitle)}</span></span>`;
function profileStatusBadge(className='pf-status') {
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
  return `<span class="${className} is-${state} profile-status"><span class="pf-check" aria-hidden="true">${glyph}</span><span>${esc(labels[state]||'Statut indisponible')}</span></span>`;
}
