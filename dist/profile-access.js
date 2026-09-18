'use strict';
// PRF-06: native controls and live quota, with separate text-free artwork.
const accessArt = kind => profileArt(kind,'pa-art');
const accessArrow = () => profileArrow('pa-arrow');
V['PRF-06'] = () => {
  studioEnsure();
  const owned = canonicalOwned(), status = M.subscription.status;
  const remaining = studioRemaining(), limit = M.hairGenerations.limit;
  const manageLabel = owned ? 'Gérer mon abonnement' : status === 'pending' ? 'Vérifier mon accès' : 'Découvrir Beautify Plus';
  const control = (body,css) => owned ? A(body,'manage-subscription',{label:manageLabel},css) : status === 'pending' ? A(body,'subscription-check',{label:manageLabel},css) : B(body,'PRE-01',css,{label:manageLabel});
  const row = (kind,label) => accessArt(kind)+`<span class="pa-row-label">${label}</span>`+accessArrow();
  return lgPage(`<header class="pa-heading"><h1 tabindex="-1">Mon accès Beautify</h1><p>Tout pour révéler votre beauté.</p></header>`+
    `<section class="pa-card pa-plus" aria-label="Beautify Plus">`+
      `<div class="pa-plus-summary">${accessArt('crown')}<span class="pa-plus-copy"><strong>Beautify Plus</strong>${profileStatusBadge('pa-status')}</span></div>`+
      `<div class="pa-quota">${accessArt('scissors')}<div class="pa-quota-copy"><span>Essais coiffure</span><div class="pa-meter" role="meter" aria-label="Essais coiffure disponibles" aria-valuemin="0" aria-valuemax="${limit}" aria-valuenow="${remaining}" aria-valuetext="${remaining} sur ${limit} disponibles">${Array.from({length:limit},(_,i)=>`<span class="${i<remaining?'is-filled':''}"></span>`).join('')}</div></div><div class="pa-count"><span><strong>${remaining}</strong> / ${limit}</span><small>disponibles</small></div></div></section>`+
    `<section class="pa-actions" aria-label="Gestion de l’abonnement et des achats">`+
    control(row('credit',manageLabel),'pa-card pa-row')+
    B(row('bag','Restaurer mes achats'),'PRE-04','pa-card pa-row',{label:'Restaurer mes achats'})+
    B(row('information','Informations sur l’abonnement'),'PRF-11','pa-card pa-row pa-information',{document:'Abonnement',label:'Informations sur l’abonnement'})+`</section>`,'pa-page ux-profile-screen ux-profile-access-screen');
};
