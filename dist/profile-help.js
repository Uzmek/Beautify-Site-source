'use strict';

// PRF-10: decorative artwork is separate from the existing native actions.
const helpReferenceArt = kind => profileArt(kind,'ph-medallion');
const helpReferenceArrow = () => profileArrow('ph-arrow');
const helpReferenceCopy = profileRowCopy;
V['PRF-10'] = () => {
  const subtitles = {photo:'Solutions et conseils.',analyse:'Que faire ?',acces:'Vérifiez votre compte.'};
  const artwork = {photo:'photo',analyse:'analysis',acces:'crown'};
  return lgPage(
    `<header class="ph-heading"><h1 tabindex="-1">Aide et contact</h1></header>` +
    A(helpReferenceArt('mail')+helpReferenceCopy('Nous contacter','Notre équipe vous répond rapidement.')+helpReferenceArrow(),'profile-contact-open',{},'ph-card ph-contact') +
    `<section class="ph-problems" aria-labelledby="ph-problems-title"><header class="ph-section-heading"><h2 id="ph-problems-title">Un problème ?</h2></header><div class="ph-card ph-topics">` +
    Object.entries(PROFILE_HELP_TOPICS).map(([id,topic])=>A(helpReferenceArt(artwork[id])+helpReferenceCopy(topic.title,subtitles[id])+helpReferenceArrow(),'profile-help-open',{id,label:topic.title},'ph-topic')).join('') +
    `</div></section>` +
    B(helpReferenceArt('lock')+helpReferenceCopy('Informations et confidentialité','Vos données sont en sécurité.')+helpReferenceArrow(),'PRF-11','ph-card ph-privacy',{document:'Données'}),
    'ph-page');
};
