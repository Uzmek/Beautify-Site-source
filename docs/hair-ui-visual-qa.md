# Hair — revue UI du 19 septembre 2026

## Périmètre

Harmonisation du module Hair avec les matières verre rosé, la typographie et les illustrations déjà utilisées dans Beautify. Navigation globale, abonnement, quotas et autres modules inchangés. Les portraits et résultats restent ceux du mockup.

## Corrections

- Titres, hauteurs de ligne, espacements, rayons et cartes harmonisés.
- Accueil avec analyse : mêmes trois cartes lisibles que le résultat, plus de colonnes étroites.
- Catalogue : cadrage stable, titres sur une hauteur commune, filtres de 44 px et grille défilante.
- Fiche coupe : portrait flexible, explication pleine largeur puis deux repères, consigne salon illustrée et bouton d’essai hors du contenu défilant.
- Sélecteur de portrait : chevron, zone tactile de 44 px, défilement vers les options et conservation de l’ouverture après sélection.
- Reprise : portrait au-dessus du texte, suppression du grand espace vide.
- Premier accueil : image adaptable pour garder l’action visible sur petit écran.
- Résultat d’essai : boutons Copier / Partager de 44 px, carte salon cohérente.
- Aperçus gratuits : noms des coupes non tronqués, vouvoiement cohérent, défilement de secours.
- Chargement : illustration adaptée à la hauteur disponible ; erreur lisible sur petit écran.

## Vérifications effectuées

`node tests/hair-simple-runtime.cjs` : **13 tests passants**, incluant le parcours, les quotas, le retour du paywall, les erreurs/reprises et les nouvelles structures.

Revue visuelle dans le navigateur sur des fixtures isolées, sans lire ni remplacer les données de la session utilisateur :

- Formats : 320 × 568, 393 × 852, 430 × 932.
- États : premier accueil, aperçus gratuits A/B, recommandations, accueil avec analyse, reprise, accueil avec looks, catalogue complet, fiche courte, fiche longue, résultat d’essai, chargement, erreur.
- **39 combinaisons** contrôlées : aucun débordement horizontal de page ni dépassement de plus de 2 px dans les boutons, paragraphes, titres et libellés inspectés.
- Le résultat premium tient intégralement dans les 635 px de contenu disponibles au format 393 × 852.
- Sur 320 × 568, vérification du défilement jusqu’aux deux actions du résultat.
- Capture photo également observée aux trois formats (écran partagé existant, non modifié).

Dans l’application interactive : ouverture de coupes, filtre Court, changement Amina / Clara, maintien du sélecteur ouvert, panneau « Comprendre mon analyse », ouverture et fermeture de l’ajout de photo. Aucun avertissement ni erreur dans les logs du navigateur inspectés.

## Reproduire la revue

Depuis la racine du dépôt : `node tests/hair-visual-review.cjs`, puis ouvrir `http://127.0.0.1:5174`. Les liens affichent chaque état simultanément aux trois tailles. Le serveur ne modifie pas le stockage du navigateur et ne fait pas partie du site publié.

Ces contrôles valident le mockup, pas une génération IA réelle, un paiement réel ou tous les navigateurs et appareils physiques.
