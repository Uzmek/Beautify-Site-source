# Mon accès Beautify — reproduction de PRF-06

Référence utilisateur : image 876 × 1796. Cible : iPhone 16, 393 × 852 points CSS.

Mesures au format source :
- Statut système : hauteur 110 ; retour x63/y125, diamètre 96.
- Titre : x76/y247, corps 80, interligne 76, deux lignes ; sous-titre corps 32.
- Couronne : bulle principale environ x542/y234, diamètre 252 ; deux bulles satellites.
- Carte Plus : x56/y509, largeur 764, hauteur 328, rayon 53.
- Quota : x80/y676, largeur 712, hauteur 147 ; 10 segments issus de l’état réel.
- Trois actions : x56/y865, y1031 et y1197 ; hauteur 138, espacement 28.
- Fond : pêche clair, rubans de verre lumineux ; contours blanc translucide et ombres cuivrées.
- Police : DM Serif Display pour titre et deux premières actions ; Roboto pour sous-titre, état et information.
- Navigation basse partagée conservée comme autorisé. La hauteur supplémentaire du viewport iPhone reste sous les cartes.

Code : `dist/profile-access.js` et `dist/profile-access.css`, inclus après les autres écrans. Aucun autre parcours remplacé. Illustrations indépendantes sans texte ; aucun fragment recadré de la référence. Les icônes sont générées en 1254 × 1254 ; le fond en 876 × 1796. Les ciseaux ont été corrigés après inspection. Les zones extérieures des médaillons sont masquées en CSS, car les sorties PNG ne comportent pas de canal alpha. Prompts complets et provenance Imagegen intégré : `asset-prompts.json`. Assets finaux : `dist/assets/profile-access/`.

Les fixtures `preview-*.html` sont des rendus isolés de la vue de production, sans écriture dans le compte du navigateur. Elles servent à comparer tous les états visuels.

Tests : `node tests/profile-access-runtime.cjs` couvre les six statuts, quotas 0/5/10, gestion, désactivation, restauration, informations, vérification normale/hors ligne et navigation retour. Les tests profil et compte existants passent. Deux anciens tests plus larges échouent sur des attentes extérieures à cette modification (ancienne action du paywall et fixture de navigation absente) ; ils n’ont pas été modifiés.

## Ajustements de lisibilité demandés

- Deux sections sémantiques : Beautify Plus avec le quota, puis gestion de l’abonnement et des achats.
- Écart de 22,4 px entre ces deux sections à 393 px de large ; trois actions espacées de 12,6 px.
- Contours blancs renforcés, surfaces moins transparentes et quota visuellement inclus dans la carte Plus.
- Les trois actions utilisent la même police Roboto à 15,7 px ; le titre et Beautify Plus restent en DM Serif Display.
- Correction d’un conflit avec les styles communs du profil : le bouton retour est circulaire et positionné au-dessus du titre, au lieu d’occuper toute la largeur.
- À la demande suivante de l’utilisateur, le symbole à quatre boucles a été remplacé par de vrais ciseaux de coiffure : deux anneaux, deux lames et une charnière. Asset final `dist/assets/profile-access/scissors-real.png`, prompt Imagegen intégré dans `scissors-real-prompt.json`.

## Vérification finale

Navigateur intégré de Codex : comparaison visuelle à 393 × 852 (iPhone 16), contrôle des six états et contrôle à 320 × 693. Aucun débordement horizontal détecté dans les cartes, libellés, badges ou compteur. Images inspectées en haute définition ; ciseaux revérifiés à leur taille dans la page. Cohérence visuelle comparée avec l’écran Mon profil.

Tests navigateur sur une fixture interactive en mémoire (aucune écriture du compte pour l’état actif) : ouverture/fermeture de la gestion depuis la carte et la ligne, restauration avec maintien de 5 essais, informations avec onglet Abonnement sélectionné, retour vers l’accès puis le profil, onglets Profil/Analyses/Accueil. Sur l’application réelle en découverte : ouverture du paywall et fermeture avec retour vers Mon accès. Tests automatisés de l’accès, du profil, du compte et des informations passants.

Captures : `iphone16-active-final.png`, `iphone16-live-final.png`, `mobile-320-final.png`, et états individuels. Aucune publication effectuée.
