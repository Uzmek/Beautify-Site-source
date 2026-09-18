'use strict';

// A single page shell follows the profile into its forms and information pages.
// These wrappers only decorate views; account, purchase and data actions stay shared.
const PROFILE_SYSTEM_ROUTES = ['PRF-01','PRF-02','PRF-05','PRF-06','PRF-07','PRF-09','PRF-10','PRF-11','ENT-05','ENT-06','ENT-07','ENT-08','PRE-04'];

V['PRE-04'] = () => lgPage(lgTitle('Retrouver mon accès','Aucun nouvel achat')+
  lgCard(`<h2>${esc(M.profile.email||'Mon compte')}</h2>${P(M.restoreStatus||'Vérifiez si un accès Premium est associé à ce compte.')}`)+
  A('Vérifier mon accès','restore-access',{},'primary')+
  B('Mon abonnement','PRF-06','secondary')+
  B('Changer de compte','ENT-06','text-button'),'profile-restore');

for (const id of PROFILE_SYSTEM_ROUTES) {
  const view = V[id];
  V[id] = () => view().replace('class="lg-page ',`class="lg-page profile-system ${id==='PRF-01'?'profile-root':'profile-subpage'} `);
}
