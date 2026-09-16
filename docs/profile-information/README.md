# PRF-02 — reproduction de la référence

Écran « Mon profil / Vos informations. », implémenté dans le parcours existant, le 16 septembre 2026. La navigation part de Profil → Mon compte. La barre principale conserve son composant partagé.

## Composition

La référence mesure 852 × 1847. À 393 × 852, les coordonnées sont converties par le facteur 393/852. Carte identité : x 39, y 442, largeur 774, hauteur environ 557 dans le repère source. Carte sauvegarde : x 39, y 1017, largeur 774, hauteur environ 560. Bordure externe blanche 5 unités, liseré interne 2 unités, rayon 60 unités. Titre DM Serif Display, textes Roboto local. Les champs, libellés, boutons et icônes de contrôle restent en HTML/CSS/SVG.

Fichiers : `dist/profile-information.css`, vue PRF-02 et carte de sauvegarde dans `dist/account-flow.js`. Les styles sont limités à `.pi-page` et à la route PRF-02.

## Assets

Fond et sphère décorative réutilisés depuis `dist/assets/profile-reference/background.png`, déjà générés séparément et sans interface. Aucun morceau de capture n’est utilisé dans l’application.

Médaillon : `dist/assets/profile-information/shield.png`, 1254 × 1254, créé séparément avec l’outil ImageGen intégré. Le générateur a livré un fond damier RGB malgré la demande d’alpha et une seconde tentative. L’intégration utilise une découpe elliptique CSS précisément limitée au contour externe du médaillon : aucun damier n’est visible. Le cadrage et tous les pixels du médaillon sont préservés. Pas de réduction en petit extrait de la référence.

Prompt utilisé :

> Use case: stylized-concept. Asset type: isolated decorative shield medallion for an existing UI. Input image: strict STYLE and SHAPE REFERENCE only. Generate ONLY the small round glass shield medallion visible to the left of SAUVEGARDE, as a separate high-definition 1024x1024 PNG with genuine transparent background. Do not reproduce the interface. Center a single clear blush-peach glass bubble occupying 96% of square width (minimal 2% padding each side). Thin brilliant white double rim, soft white elongated specular highlight along upper-left edge, softly refracted peach glass interior, extremely subtle shadow. Inside the circle a single elegant shield, 44% of circle width and 52% circle height, shape matching reference exactly: top center upward pointed scalloped shoulders curving to high left/right corners, gently bowed sides tapering to a rounded bottom point. Delicate dark warm copper raised outline with a narrow white bevel, pale translucent peach interior. A simple dark brown copper check mark in center. Front-facing straight-on orthographic view. Colors cream white, peach, warm brown copper, no golden yellow. NO text, NO buttons, NO card, NO background rectangle, NO additional objects. Must be sharp at high definition, transparent outside circle. Keep the exact restrained thin-line geometry and clear glass material of the reference rather than thick metal or opaque material.

## Validation

Navigateur intégré à 393 × 852. Capture `iphone16-final.jpg`, comparaison `compare.html` (référence à gauche, application à droite), puis `compare-live.html` à 200 % avec l’application vivante dans une iframe. `comparison-final.jpg` et `comparison-zoom-live.jpg` conservent les inspections. Contrôle supplémentaire à 320 × 693 : aucun débordement horizontal ; la zone principale défile si la hauteur manque. À 393 × 852, tout le contenu tient sans défilement.

Interactions testées dans le navigateur : saisie et enregistrement, persistance après rechargement, nom vide, import d’une photo de test du dépôt, remplacement, enregistrement, retrait annulé puis confirmé, création de compte puis retour sans compte, connexion puis annulation, Retour, Accueil, Analyses et Profil. Aucun compte externe créé. Aucun déploiement.

Tests existants validés : `account-flow-runtime.cjs`, `profile-reference-runtime.cjs`, `profile-information-runtime.cjs`. Le test supplémentaire `navigation-audit-runtime.cjs` échoue dans son scénario ancien d’analyse cheveux (`clone(report())` reçoit undefined). Même échec reproduit avec la version HEAD de `account-flow.js` ; aucun lien avec cette modification visuelle.
