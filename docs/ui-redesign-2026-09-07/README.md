# Refonte Couleurs et bilan Peau

Huit maquettes originales ont été générées avec ImageGen, puis inspectées et reproduites en composants HTML/CSS interactifs. Les images de référence sont conservées dans `concepts/`. La surface logique reste 393 × 852 ; les captures sont celles de la preview mise à l’échelle.

## Écrans

| Maquette | Implémentation |
| --- | --- |
| color-intro.png | Introduction Couleurs, ANA-03 |
| color-photo.png | Caméra / galerie, ANA-04, confirmation ANA-06 et anciens alias |
| color-loading.png | Préparation ANA-08, minuterie et reprise conservées |
| color-preview.png | Aperçu verrouillé ANA-09, même moment du paywall |
| color-palette.png | Palette : 12 nuances et 5 neutres du rapport enregistré |
| color-applications.png | Vêtements, couleurs de cheveux, teintes maquillage et métaux |
| color-season.png | Saison, trois axes, contraste et exploration des 12 saisons |
| skin-bilan.png | Qualité de peau /100, trois critères, observations et routine |

Les routes secondaires COL-01 et COL-02 réutilisent les mêmes composants. Les vues Matin et Soir gardent leurs fonctions et partagent désormais le nouvel en-tête, les onglets et les actions de rapport.

## Assets et données

Trois assets originaux sans texte ni interface sont utilisés : portrait éditorial, éventail de tissus et atlas de quatre catégories. Les titres, boutons, valeurs, couleurs et navigation sont du vrai HTML. Les textes décoratifs superflus des maquettes ne sont pas repris.

Les 12 saisons utilisent les valeurs HEX et données déjà présentes dans `color-seasons.js`. L’exploration d’une autre saison ne modifie pas le résultat actif. Les détails d’un rapport utilisent son identifiant et sa saison, pas le dernier profil global. Les teintes maquillage sont des repères de palette ; aucun module de looks ou tutoriels n’est débloqué.

Le nouveau bilan est une démonstration explicite : score global 78, uniformité 82, grain de peau 74, éclat 78. Le contrat `demo/skin-quality-v1` est conservé séparément des quatre anciennes métriques `skin-v1`. Les résultats réellement étiquetés `vision/skin-v1` gardent leurs labels et valeurs ; ils ne sont pas convertis en nouveaux scores fictifs. Aucun moteur IA ni paiement réel n’a été ajouté.

Le chargement utilise l’illustration de palette, sans recadrer arbitrairement la photo importée en rond. Un rapport dont la photo est absente utilise un portrait éditorial ; il ne reprend jamais la photo d’un nouveau brouillon.

## Vérification

- 82 tests de parcours : historique, 12 saisons, photos, consentement, reprise, idempotence, droits et séparation des données de peau.
- 11 tests du retour direct après paiement.
- 725 combinaisons de vues et états vérifiées par le contrôle de source existant.
- Parcours navigateur : galerie → préparation → aperçu verrouillé → paywall → retour au rapport ; onglets et fiches de couleur ; saison → nuance → retour ; bilan → routine ; case de soin cochée et progression mise à jour.
- Captures des huit écrans principaux, plus Matin et Soir. Aux réglages standard du téléphone, Palette, Applications, Saison, Bilan, Matin et Soir ne débordent pas en hauteur ni en largeur. Les longues routines personnalisées gardent un défilement de secours.
- Fermeture des fiches replacée en haut à droite ; marges de sécurité au bas du parcours photo ; portraits arrondis ; effet élastique uniquement à la pression, pas au survol.

Limites : vérifications dans la preview et tests avec DOM simulé. Pas de validation caméra sur un iPhone physique ni d’analyse cosmétique réelle. Les valeurs du prototype restent illustratives.
