'use strict';

// The data screen shares the help screen's glass components and existing actions.
const profileDataArt = kind => profileArt(kind,'ph-medallion');
V['PRF-07'] = () => {
  const count = Object.keys(memoryPhotos).length;
  const photoSummary = count ? `${count} photo${count>1?'s':''} ajoutée${count>1?'s':''}, analyses conservées.` : 'Aucune photo ajoutée.';
  const photos = A(helpReferenceArt('photo')+helpReferenceCopy('Supprimer mes photos',photoSummary)+helpReferenceArrow(),'profile-remove-photos',{label:'Supprimer mes photos'},'ph-topic pd-photos');
  return lgPage(
    `<header class="ph-heading"><h1 tabindex="-1">Photos et données</h1></header>` +
    A(profileDataArt('export')+helpReferenceCopy('Exporter mes données','Fichier JSON, sans les images.')+helpReferenceArrow(),'profile-export',{label:'Exporter mes données'},'ph-card ph-contact') +
    `<section class="ph-problems" aria-labelledby="pd-files-title"><header class="ph-section-heading"><h2 id="pd-files-title">Gérer mes fichiers</h2></header><div class="ph-card ph-topics pd-topics">` +
    (count?photos:photos.replace('<button ','<button disabled ')) +
    A(profileDataArt('delete')+helpReferenceCopy('Tout supprimer','Données et profil.')+helpReferenceArrow(),'profile-delete-open',{label:'Tout supprimer'},'ph-topic pd-delete') +
    `</div></section>` +
    B(helpReferenceArt('lock')+helpReferenceCopy('Informations et confidentialité','Comprendre la gestion des données.')+helpReferenceArrow(),'PRF-11','ph-card ph-privacy',{document:'Données'}),
    'ph-page pd-page');
};
