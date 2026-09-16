# Rework mobile — version actuelle

La demande suivante remplace la contrainte de reproduction stricte par une intégration cohérente avec l’application. `history-v2.css` a été réécrit : plus de coordonnées proportionnelles à la capture, de polices propres au paywall, de navigation dupliquée ou de réduction de tout l’écran sur mobile.

- Réutilisation de `lgBrand`, `lgTitle`, `icon`, de la navigation `nav()` commune, et des variables de typographie, de couleur et de verre existantes.
- Titre adaptatif 28–31 px, bouton Nouvelle analyse pleine largeur de 54 px, titres des cartes 16–17 px, métadonnées 12–14 px. Textes longs autorisés à revenir à la ligne.
- Cartes de 92 px minimum (112 px pour la dernière analyse). Les quatre exemples sont entièrement visibles à 393 × 852. Aucun espacement artificiel pour remplir les grands écrans.
- Largeur et hauteur réelles du mobile, selon le mécanisme déjà utilisé pour Profil. Le cadre mis à l’échelle reste réservé au bureau. Zones sûres prises en compte, navigation commune toujours accessible.
- Liste défilante sur les écrans ordinaires ; toute la page défile sur les mobiles courts pour éviter de coincer la liste sous un grand en-tête. Retour du rapport/paywall avec position conservée sur petit écran.
- Options DEV repliées dans un menu, sans superposition permanente au titre.
- Vérifications navigateur à 320 × 568, 375 × 667, 393 × 852 et 430 × 932 : pas de débordement horizontal, largeur mobile réelle et barre de navigation accessible. V1/V2, nouvelle analyse/retour et dernière carte après défilement vérifiés.
- Tests existants `history-v2-runtime.cjs`, `branding-runtime.cjs` (156 contrôles), `simplified-analysis-flow-runtime.cjs` réussis ; syntaxe et `git diff --check` valides.
- Capture actuelle : `mobile-rework-393.png`. Aucun déploiement.

Audit typographique complémentaire : les titres Accueil, Analyses et Profil mesurent environ 28–30 px à 393 px de large, tous alignés à gauche. Historique est désormais à 29,5 px au même format ; les chiffres de date passent à 26 px pour ne pas rivaliser avec le titre. Le Retour réutilise une zone de 44 × 44 px, contre 54 px de haut pour l’action principale.

Les notes et captures ci-dessous décrivent la première réalisation, avant ce rework.

---

# Historique V2 — référence et contrôle visuel

Implémentation dans `dist/history-v2.js` et `dist/history-v2.css`, chargée après le paywall V2. Le sélecteur DEV V1/V2 reprend celui du paywall. Les modifications déjà présentes dans les écrans profil, peau et accueil sont conservées.

## Référence stricte

Image fournie : 852 × 1846. Contrôle à 393 × 852 CSS pixels (iPhone 16), puis comparaison agrandie. Le navigateur disponible est le navigateur intégré local de Codex, pas un navigateur cloud.

| Bloc | Mesures sur la référence |
| --- | --- |
| Retour | x45, y93, disque 88 × 88 |
| Capsule CHEVEUX | x339, y114, 174 × 46 |
| Titre | centré, haut visuel vers y188, sérif noir contrasté |
| Nouvelle analyse | x249, y278, 354 × 76, contour blanc, cuivre translucide |
| Frise | axe x47, premier repère vers y475 |
| Première carte | x69, y517, 741 × 272 |
| Grande photographie | x213, y532, 225 × 242 |
| Deuxième carte | x69, y806, 741 × 176 |
| Août | titre vers y1039, cartes vers y1090 et y1278 |
| Petites photographies | x213, environ 155 × 152 |
| Navigation | x33, y1623, 783 × 161 ; pastille active environ 265 × 140 |

Les dimensions suivent la largeur du cadre de téléphone existant. Les titres, dates, mois, badges, boutons, frise et effets de verre sont du DOM/CSS/SVG natif. La liste défile pour les historiques longs. Les couleurs principales sont le noir, le cuivre `#b63c20`, le rose perlé et des reflets blancs translucides. Les polices sans sérif sont les fichiers Roboto déjà présents ; le titre utilise Times New Roman, ajusté visuellement à la référence. Les contours, espacements, taille de la première date et transparence des cartes ont été corrigés après comparaison côte à côte.

## Assets

Les cinq images de `dist/assets/history-v2/` ont été produites séparément avec l’outil intégré ImageGen. Les quatre photos sont des images indépendantes en haute définition (1209 × 1300 ou 1254 × 1254), sans texte ni interface. Aucun fragment de la capture n’est utilisé dans le rendu. Le fond conserve le ruban et la perle ; les photos conservent leur fond bokeh, comme la référence. Les prompts exacts sont dans `prompts.json`. Les régénérations photographiques sont fidèles aux poses et cadrages, mais ne sont pas des copies pixel pour pixel des sujets de la référence.

## Données et interactions

- V2 par défaut, V1 accessible sans changer les analyses.
- `?history=v2&history-demo=1#ANA-12` ajoute explicitement quatre exemples, sans supprimer ni remplacer les analyses existantes. Le bouton DEV Exemple est idempotent. Sans cette option, l’écran utilise uniquement les analyses présentes.
- Les dates et groupes sont calculés à partir des analyses ; les domaines sont filtrés, les analyses en cours exclues, les résultats partiels et photos indisponibles identifiés.
- Une carte ouvre son rapport par le mécanisme existant. Les droits d’accès restent inchangés. Fermer le paywall ouvert depuis la V2 restaure cet historique.
- Nouvelle analyse, Retour, Accueil, Résultats et Profil utilisent les parcours existants.

## Vérifications

- Comparaison côte à côte à 393 × 852 et agrandie via `compare.html`, puis capture finale `comparison-393.png` et `iphone16-final.png`.
- Contrôle du cadre existant à 320 × 568 : pas de débordement ; son mécanisme de mise à l’échelle est conservé.
- Dans le navigateur : V1/V2, Exemple sans doublon, les quatre cartes, fermeture du paywall et retour, Nouvelle analyse et retour, entrée Historique depuis Cheveux, Retour, Accueil, Résultats et Profil.
- Les quatre photographies HD sont chargées, aucun bouton ne dépasse, aucune erreur console observée.
- `node tests/history-v2-runtime.cjs` : états vides, tri, domaines, accès, exemples additifs, échappement, quatre rapports, retours et achat simulé.
- `node tests/paywall-native-runtime.cjs` et `node tests/simplified-analysis-flow-runtime.cjs` passent. Les doubles DOM de test ont été complétés avec `style.setProperty`, requis par le code de profil déjà présent.
- L’ancienne suite `paywall-return-runtime.cjs` échoue sur son attente du bouton V1 `data-act="subscribe"`, alors que le paywall courant est V2 (`pv2-subscribe`). Ce test hérité n’a pas été réécrit dans ce travail.
- Vérification de syntaxe JavaScript et `git diff --check` réussies. Aucune publication effectuée.
