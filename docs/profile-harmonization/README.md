**Harmonisation du profil — 16 septembre 2026**

Le point de retour demandé a été créé et poussé sur `origin/master` avant toute correction : **f2eb72b**, « Save profile screens and design audit before harmonization ». Les corrections ci-dessous sont conservées dans le répertoire de travail, séparément de cette sauvegarde.

Le profil et ses continuations partagent maintenant le fond du profil, la barre système, les marges, les titres et les surfaces en verre. Cela comprend Compte, Accès, Photos et données, Aide, Informations, la confirmation de suppression, les formulaires de connexion et la restauration. Les fenêtres conservent le même matériau et la même typographie que leur section.

- Un seul composant de badge pour les six états d’abonnement, avec les mêmes pictogrammes, couleurs et reliefs dans Profil et Accès.
- Une bibliothèque d’illustrations commune : les couronnes, photos, cadenas et moyens de paiement ne changent plus de dessin à chaque page.
- Titres de sous-page à 34 px ; texte courant de 14 à 16 px ; libellés auxiliaires à partir de 12 px. Les contenus longs passent à la ligne et défilent.
- Boutons Retour de 48 × 48 px, avec la même flèche et la même position.
- Cartes, champs, boutons et flèches partagés ; bouton de suppression identifié par une variante destructive.
- Navigation Accueil / Analyses / Profil conservée. Le paywall conserve sa composition.

Implémentation : [composants partagés](/Users/ka/Documents/ChatGPT/beautify/dist/profile-ui.js), [styles communs](/Users/ka/Documents/ChatGPT/beautify/dist/profile-system.css), [application du cadre aux parcours](/Users/ka/Documents/ChatGPT/beautify/dist/profile-system.js). Quatre feuilles de style spécifiques aux anciennes compositions ne sont plus chargées par l’application ; elles restent disponibles pour les anciens documents de comparaison.

**Validation**

Comparaison visuelle dans le navigateur intégré à 393 × 852 et 320 × 693 px. Contrôle des branches Compte/Connexion, Accès/Restauration/Paywall, Données/Suppression/Annulation, Aide/Contact et des quatre onglets d’information. Les variantes d’abonnement et de compte connecté ont été rendues dans des fixtures isolées, sans modifier les données du navigateur. Aucun achat, envoi de message ou effacement réel n’a été effectué.

Les contrôles DOM enregistrés dans [verification.json](/Users/ka/Documents/ChatGPT/beautify/docs/profile-harmonization/verification.json) vérifient les dimensions des retours, la police des titres, l’identité du fond et les débordements. Aucun débordement horizontal n’a été détecté dans ces vues. La lecture des pages longues repose sur le défilement natif.

Huit suites passent : `profile-system`, `profile-reference`, `profile-access`, `profile-data`, `profile-information`, `account-flow`, `branding` (156 vérifications de vues) et `history-v2`. La syntaxe des nouveaux scripts et `git diff --check` ont également été vérifiés.

Deux suites générales anciennes restent en échec : `navigation-audit-runtime.cjs` essaie de cloner un rapport indéfini ; `paywall-return-runtime.cjs` attend l’ancien libellé « Débloquer Beautify Plus ». Les mêmes échecs ont été reproduits dans une extraction indépendante du commit **f2eb72b**, avant les corrections. Ils ne sont donc pas attribués à cette harmonisation.

Captures finales : [Profil](/Users/ka/Documents/ChatGPT/beautify/docs/profile-harmonization/profil-final-393.png), [Données](/Users/ka/Documents/ChatGPT/beautify/docs/profile-harmonization/donnees-final-393.png), [Informations](/Users/ka/Documents/ChatGPT/beautify/docs/profile-harmonization/informations-final-393.png), [Accès](/Users/ka/Documents/ChatGPT/beautify/docs/profile-harmonization/acces-final-393.png), [Aide](/Users/ka/Documents/ChatGPT/beautify/docs/profile-harmonization/aide-393.png), [fenêtre d’aide](/Users/ka/Documents/ChatGPT/beautify/docs/profile-harmonization/aide-fenetre-393.png), [statut long à 320 px](/Users/ka/Documents/ChatGPT/beautify/docs/profile-harmonization/acces-renouvellement-320.png).

Les fixtures peuvent être régénérées avec `node scripts/profile-system-preview.cjs`. Elles utilisent les vues réelles du projet mais ne chargent pas les scripts de l’application dans le navigateur.

**Matière claire et réfraction — dernière révision**

Le remplissage nacré et les doubles anneaux des boutons ont été remplacés par une surface beaucoup plus transparente, un contour spéculaire fin et des ombres de bord. Les variantes principales et sélectionnées restent teintées cuivre. Le flou hérité des anciennes cartes est explicitement annulé et déplacé sur leur couche décorative : les boutons imbriqués peuvent ainsi échantillonner le fond. Champs, retours, flèches, boutons et fenêtres conservent leur contenu natif.

`dist/profile-glass.js` ajoute une réfraction réelle du fond aux bords des contrôles dans Chromium. Une carte de déplacement procédurale, adaptée aux dimensions et à l’arrondi de chaque forme, laisse le centre et le texte intacts. Les cartes sont partagées entre formes identiques puis libérées avec les observateurs après navigation. Aucun asset de bouton ni texte rasterisé. Safari et Firefox conservent la matière CSS claire, le flou et les reflets ; cette réalisation web ne prétend pas utiliser le moteur Liquid Glass natif d’Apple. Cette distinction suit la [documentation backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter) et la [limitation WebKit sur les filtres SVG](https://bugs.webkit.org/show_bug.cgi?id=245510).

Validation supplémentaire : test `profile-glass-runtime.cjs` (centre neutre, déplacement des quatre bords, mutualisation, nettoyage, repli Safari), puis les huit suites de profil et navigation précédemment listées. Les quatre onglets d’information, la création de compte et l’ouverture/fermeture d’aide ont été contrôlés dans le navigateur intégré. Les 12 parcours mesurés à 320 px n’ont ni débordement horizontal ni bouton inférieur à 44 px. Les captures à 393 et 320 px montrent la nouvelle matière : `informations-clear-glass-393.png`, `informations-clear-glass-320.png`, `profil-clear-glass-393.png`, `compte-clear-glass-393.png`, `aide-modal-clear-glass-393.png`. Mesures : `clear-glass-verification.json`.

**Capsule conforme à la nouvelle référence fournie**

La référence `codex-clipboard-1b0e4987-dd68-47e8-812f-d62fe3880c8e.png` remplace le verre discret de la révision précédente pour les contrôles. Les variables partagées reproduisent maintenant la teinte pêche, le bourrelet blanc continu, le creux rose du biseau, les reflets blancs aux quatre extrémités et l’ombre diffuse sous la capsule. Le filtre de réfraction reste en place. La géométrie et les libellés des parcours restent inchangés.

Comparaison dans le navigateur à 393 et 320 px, contrôle du bouton Créer un compte et des quatre onglets d’information. Les boutons du compte restent à 44 px minimum sans débordement horizontal à 320 px. Tests `profile-glass`, `profile-system`, `profile-information` et `account-flow` réussis ; `git diff --check` propre. Captures : `compte-reference-capsule-393.png` et `compte-reference-capsule-320.png`.

**Stabilité à l’ouverture et hiérarchie des matériaux**

L’entrée du profil et de ses fenêtres ne fait plus varier l’opacité des parents du verre. Cette animation créait temporairement une nouvelle racine de backdrop, et la matière pouvait changer brutalement à la fin du fondu. Les translations sont conservées. Les filtres des capsules sont désormais préparés directement lors des mutations et du redimensionnement, avant peinture, sans report à une nouvelle frame ; le flou de repli et celui du filtre utilisent les mêmes paramètres. Les tests `motion-check.cjs` couvrent ces transitions, l’ouverture/remplacement/fermeture des fenêtres, le mouvement réduit et l’absence de Web Animations. `profile-glass-runtime.cjs` vérifie aussi l’affectation immédiate des filtres à la création et au changement de page.

À la demande de l’utilisateur, une [planche générée](glass-harmony-reference.png) précède les nouvelles déclinaisons. Elle utilise le bouton fourni comme référence, avec le générateur intégré et ce [prompt exact](glass-harmony-prompt.md). Convention à conserver pour les prochaines familles : partir de cette référence, générer la déclinaison visuelle avant de l’intégrer, puis reproduire sa matière avec des composants natifs.

Trois usages distincts partagent maintenant la même palette : capsule bombée pour les actions, feuille de verre fine pour les grandes cartes, lignes intégrées à un panneau commun pour les listes. Les lignes Aide/Données n’ont plus chacune une coque de bouton brillante, et les chevrons n’ont plus de bouton décoratif autour d’eux. Les illustrations partagées et les parcours sont conservés. Captures : `profil-harmony-393.png`, `aide-harmony-393.png`, `donnees-harmony-393.png`, `aide-harmony-320.png`.

**Dernière direction : verre atténué**

La capsule bombée est remplacée par une finition plus sobre sur les 13 écrans du profil et de ses continuations. Les contrôles n’ont plus de points blancs brillants ni d’ombres lourdes ; les liens tertiaires sont sans coque et les badges moins saillants. Voir la [revue complète](quiet-glass-review.md), la [nouvelle référence générée](quiet-glass-reference.png) et son [prompt](quiet-glass-prompt.md). Cette direction remplace les recommandations antérieures de capsules très bombées, à la suite du retour de l’utilisateur sur le manque d’harmonie.

**Boutons ajustés à la référence approuvée**

L’image fournie `codex-clipboard-45300cf6-398a-406f-8c75-4b1b0b06e7c2.png` est désormais la référence explicite des contrôles. Le primaire a une teinte pêche rosée, une fine lèvre blanche et une ombre diffuse ; le secondaire reste plus transparent. Les flèches décoratives automatiques des boutons de formulaire sont masquées pour centrer le libellé seul. Icône et libellé des fournisseurs sont centrés ensemble, comme le bouton Apple de l’image. Les liens conservent leur rendu sans coque et les grandes cartes restent distinctes.

Contrôle visuel à 393 et 320 px, aucun débordement ; commandes du formulaire et fournisseurs à 44 px minimum. Navigation vers la récupération et retour testés. Suites account-flow, profile-glass, profile-system et motion-check réussies. Captures : `approved-buttons-393.png`, `approved-buttons-320.png`.

**Grille des bénéfices de création de compte**

Le bloc « Retrouvez vos analyses / Conservez vos routines / Gardez le contrôle » est une liste composée de trois lignes de même hauteur, avec une colonne fixe pour les icônes et une colonne de texte commune. Les icônes sont alignées en haut avec leur titre ; les descriptions sur plusieurs lignes ne déplacent plus les pictogrammes. Espacement titre/description de 4 px, espacement entre lignes de 12 px (10 px sur petit écran), icônes de 36 px (32 px sur petit écran). Titres à 14 px et descriptions à 13 px, y compris sur écran court. Le bas de la page conserve 28 px de dégagement et défile au besoin.

Mesures à 393 et 320 px : trois lignes de 59,29 px, mêmes abscisses de texte et mêmes ordonnées titre/icône ; aucun débordement horizontal. Parcours « Créer avec mon e-mail », retour et « Continuer sans compte » vérifiés. Tests account-flow et profile-system réussis. Captures `benefits-grid-393.png`, `benefits-grid-320.png`, mesures `benefits-grid-verification.json`.
