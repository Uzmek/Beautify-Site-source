'use strict';

// PRF-10: decorative artwork is separate from the existing native actions.
const helpReferenceArt = kind => `<span class="ph-medallion ph-medallion-${kind}" aria-hidden="true"><img src="/assets/profile-help/${kind}.png?v=3" width="1254" height="1254" alt="" draggable="false"></span>`;
const helpReferenceArrow = () => `<span class="ph-arrow" aria-hidden="true">${icon('chev')}</span>`;
const helpReferenceCopy = (title,subtitle) => `<span class="ph-copy"><strong>${esc(title)}</strong><span>${esc(subtitle)}</span></span>`;
V['PRF-10'] = () => {
  const subtitles = {photo:'Solutions et conseils.',analyse:'Que faire ?',acces:'Vérifiez votre compte.'};
  const artwork = {photo:'photo',analyse:'analysis',acces:'crown'};
  return lgPage(
    `<header class="ph-heading"><h1 tabindex="-1">Aide et contact</h1><p>On est là pour vous aider.<br>Une question ? On vous répond.</p></header>` +
    A(helpReferenceArt('mail')+helpReferenceCopy('Nous contacter','Notre équipe vous répond rapidement.')+helpReferenceArrow(),'profile-contact-open',{},'ph-card ph-contact') +
    `<section class="ph-problems" aria-labelledby="ph-problems-title"><header class="ph-section-heading"><h2 id="ph-problems-title">Un problème ?</h2><p>Trouvez une réponse rapidement.</p></header><div class="ph-card ph-topics">` +
    Object.entries(PROFILE_HELP_TOPICS).map(([id,topic])=>A(helpReferenceArt(artwork[id])+helpReferenceCopy(topic.title,subtitles[id])+helpReferenceArrow(),'profile-help-open',{id,label:topic.title},'ph-topic')).join('') +
    `</div></section>` +
    B(helpReferenceArt('lock')+helpReferenceCopy('Informations et confidentialité','Vos données sont en sécurité.')+helpReferenceArrow(),'PRF-11','ph-card ph-privacy',{document:'Données'}),
    'ph-page');
};
