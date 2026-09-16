'use strict';

// Editorial artwork describes the experience; personal findings stay in the report.
const REVEAL_COPY={
  Cheveux:{title:'Votre prochain<br>look<br>commence ici.',subtitle:'Découvrez ce qui vous<br>met en valeur.',tiles:[['Vos coupes','hair'],['Votre visage','face'],['À éviter','avoid']]},
  'Colorimétrie':{title:'Vos couleurs,<br>votre<br>signature.',subtitle:'Découvrez les nuances<br>qui vous correspondent.',tiles:[['Vos nuances','palette'],['Vos accords','makeup'],['À éviter','avoid']]},
  Peau:{title:'Votre peau,<br>vos nouveaux<br>rituels.',subtitle:'Découvrez vos priorités<br>et vos gestes de soin.',tiles:[['Votre bilan','skin'],['Le matin','morning'],['Le soir','evening']]}
};
V['ANA-09']=()=>{
  const r=report();
  if(!r)return canonicalLockedResult();
  if(canonicalOwned())return canonicalReport();
  const copy=REVEAL_COPY[r.domain];if(!copy)return canonicalLockedResult();
  const partial=r.status==='partial'||(r.domain==='Colorimétrie'&&!r.season);
  return `<div class="lg-page lg-funnel result-reveal reveal-${r.domain==='Cheveux'?'hair':r.domain==='Peau'?'skin':'color'}">`+
    `<header class="reveal-brand">${A(icon('back'),'back',{label:'Retour'},'reveal-back')}</header>`+
    `<section class="reveal-scene"><div class="reveal-heading"><h1 tabindex="-1">${partial?'Votre premier<br>aperçu<br>vous attend.':copy.title}</h1><p>${partial?'Explorez les premiers éléments<br>de votre analyse.':copy.subtitle}</p></div><span class="reveal-inspiration">${icon('sparkles')}Inspiration</span></section>`+
    `<section class="reveal-tiles" aria-label="À découvrir dans votre rapport">${copy.tiles.map(([label,kind])=>B(`<span class="reveal-tile-art reveal-art-${kind}" aria-hidden="true"></span><span class="reveal-tile-label">${label}</span>`,'PRE-01','reveal-tile',{label:'Découvrir : '+label})).join('')}</section>`+
    `<footer class="reveal-actions">${B(icon('lock')+'<span class="reveal-cta-copy"><strong>Voir mon rapport complet</strong><small>Accès avec Beautify Plus</small></span>'+icon('chev'),'PRE-01','reveal-unlock')}${B('Plus tard','ANA-01','reveal-later')}<small class="reveal-demo">Démo : résultats illustratifs</small></footer></div>`;
};
