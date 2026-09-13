# Vérification visuelle — 7 septembre 2026

Captures réelles du navigateur sur l’aperçu supervisé. Écran logique : 393 × 852, affiché à l’échelle du viewport. Aucune photo personnelle ni transaction réelle : le parcours après analyse utilise le profil d’exemple.

## Défauts constatés et corrigés

| Écran | Défaut visible | Correction |
| --- | --- | --- |
| Paywall | Raccord horizontal, bandes latérales rectangulaires, défilement de quelques pixels | Une composition continue pour les visuels du haut ; offres, fermeture et achat restent des contrôles natifs. L’écran tient sur 852 px. |
| Introduction Cheveux / Couleurs | Coins et côtés carrés des images | Recadrage arrondi cohérent avec les cartes en verre. |
| Nouvelle analyse | Contours doublés et raccords visibles dans les illustrations | Un seul contour, extrémités des assets fondues dans leur carte. |
| Profil | « Mes préférences » partiellement masqué par la navigation | Espacement et carte d’identité plus compacts, lien entièrement visible. |
| Rapport Couleurs | Boutons Historique / Nouvelle analyse partiellement coupés en bas | Marges de la palette et padding des boutons ajustés ; libellés conservés et cibles tactiles de 46 px minimum. |
| Aperçu ordinateur | Barre des outils de revue superposée au bas du téléphone | Les outils restent dans la colonne latérale à cette largeur. |

## Contrôles réalisés

- Captures : bienvenue, accueil, choix d’analyse, résultats, profil, introductions Cheveux / Couleurs / Peau, choix de photo, aperçu du résultat couleurs, rapport couleurs et paywall.
- Relecture avant/après des écrans modifiés, absence de débordement horizontal observé.
- Paywall : sélection mensuelle, fermeture vers l’écran précédent, confirmation de démonstration depuis l’analyse couleurs et retour direct au rapport.
- Rapport couleurs : aucune image manquante et aucun défilement de la page extérieure dans le viewport testé.
- Vérifications automatisées : syntaxe JavaScript ; 10 retours après paiement ; 734 états de vues, 37 images locales, aucune erreur.

Le contrôle visuel porte sur les captures présentes dans ce dossier. Les 734 états sont des vérifications de source et de modèle, pas 734 captures navigateur. Les offres et les tarifs de démonstration sont inchangés. Les gestes tactiles sur appareil physique n’ont pas été vérifiés.

Les fichiers `*-before.jpg` et `*-after.jpg` documentent les modifications ; les fichiers `*-reviewed.jpg` documentent les autres écrans inspectés. `color-history-reviewed.jpg` montre l’aperçu du résultat verrouillé du profil d’exemple.

## Reproduire l’aperçu

`npm run dev -- --port 4173` sert les fichiers statiques existants avec Vite. La publication continue d’utiliser directement le dossier `dist` défini dans `.openai/hosting.json` ; aucune compilation de production n’est ajoutée.
