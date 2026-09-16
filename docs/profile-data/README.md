# Photos et données — adaptation PRF-07

L’écran reprend les composants, proportions, typographies, surfaces en verre et navigation de PRF-10. Les deux actions de gestion sont regroupées dans une carte plus courte. Les textes et commandes restent des éléments HTML natifs. Les actions existantes sont conservées.

Trois visuels indépendants ont été générés : fond avec photographie en verre, médaillon d’export et médaillon de suppression. Les autres médaillons sont partagés avec l’aide. Les prompts et sources figurent dans `assets-prompts.md`. Le contour extérieur des nouveaux médaillons est détouré par un masque CSS elliptique.

## Vérifications

- Comparaison visuelle côte à côte avec l’aide à 393 × 852 et à 200 % : `comparison-393.png`, `comparison-zoom-top.png`, `comparison-zoom-bottom.png`.
- Capture finale : `iphone16-final.png`. Vérification supplémentaire à 320 × 693 : `mobile-320.png`. Aucun débordement horizontal ; toutes les images sont chargées.
- Navigateur intégré : export et message de confirmation, ouverture puis annulation de la suppression totale, confidentialité, retour au profil et accès depuis le profil.
- Le navigateur intégré n’a pas exposé d’événement de téléchargement. Le contenu exact du JSON exporté a été vérifié dans le test isolé.
- `node tests/profile-data-runtime.cjs` : états vide/importé, export JSON, confirmation et annulation, suppression des photos conservant analyses et notes, navigation. Les suppressions utilisent uniquement des données fictives isolées.
- Régressions : `node tests/profile-reference-runtime.cjs` et `node tests/profile-information-runtime.cjs` réussis.

Validation effectuée dans le navigateur intégré local. Aucune publication.
