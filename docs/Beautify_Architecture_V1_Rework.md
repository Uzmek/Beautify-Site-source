# Beautify — architecture V1 retravaillée

## Décision produit

La V1 n’est pas un catalogue d’inspirations. Elle répond à trois questions personnelles :

1. Quelles coupes pourraient me convenir ?
2. Quelles couleurs me mettent en valeur ?
3. Quelle routine simple correspond aux besoins déclarés de ma peau ?

Chaque question produit un résultat personnel, réutilisable et facile à retrouver. Le reste ne doit pas concurrencer ces trois bénéfices.

## Navigation visible

| Destination | Question résolue | Contenu |
|---|---|---|
| Accueil | Que puis-je faire maintenant ? | Reprise en cours, prochain geste, état des trois espaces. |
| Analyser | Par quoi commencer ? | Coupe, couleurs, peau ; modules futurs montrés une seule fois. |
| Résultats | Où sont mes réponses ? | Trois rapports et simulations de coupes. |
| Profil | Comment gérer mon espace ? | Préférences, synchronisation facultative, Premium, données et aide. |

« Découvrir » est supprimé de la navigation : sans catalogue V1 suffisamment riche et utilisable, cet onglet créait une promesse vide. « Studios » et « Analyser » n’existent plus comme destinations concurrentes.

## Parcours principal

Accueil ou onboarding → choix d’un domaine → consentement court → photo prise en direct ou choisie dans la galerie → questions une par une → analyse → rapport du domaine → Résultats.

La photo est une étape nécessaire. Pour le parcours Cheveux, un seul appel vision analyse la forme du visage, les cheveux visibles et la longueur, puis renvoie directement les coupes classées : aucun questionnaire et aucun filtre de préférence n’interviennent dans la recommandation. Pour les autres parcours qui nécessitent encore une information déclarative, chaque question occupe son propre écran.

Le compte n’est jamais requis pour comprendre la valeur. Il est proposé ensuite pour la synchronisation. Le paywall intervient au moment d’une simulation de coupe supplémentaire, pas avant le premier résultat utile.

## Rôle de chaque studio

### Cheveux

- Forme du visage déterminée par le moteur Beautify à partir de la photo.
- Texture et longueur observées sur la photo, sans les redemander.
- Top 4 déterminé uniquement par l’analyse visuelle ; si une frange est pertinente, Beautify la recommande directement.
- Une meilleure recommandation et trois alternatives nettement séparées.
- Douze références accessibles pour choisir soi-même.
- Fiche de coupe avec justification et note à montrer au salon.
- Une simulation découverte, puis dix simulations mensuelles avec Premium.

### Couleurs

- Profil complet parmi douze saisons, regroupées en quatre familles.
- Rapport séparé en Profil, Palette et Cheveux.
- Couleurs principales, neutres et teintes à comparer.
- Vérificateur de couleur et exploration libre des douze saisons.
- Aucun pourcentage de précision inventé.

### Peau

- Bilan fondé sur les ressentis et réponses, sans diagnostic médical.
- Priorité visible en premier.
- Plan matin et soir résumé avant ajout.
- Routines modifiables et suivi volontaire.
- Aucun score de beauté, de pores ou d’âge.

## Fonctionnalités en préparation

Maquillage, Garde-robe et Tutoriels sont visibles une seule fois au bas de la page Analyser. Ils sont volontairement passifs : icône, verrou et statut « Bientôt », sans faux bouton ni fausse fiche exploitable.

Les routes détaillées restent dans l’explorateur du mockup pour documenter la vision produit, mais elles ne polluent pas le parcours normal de la V1.

## Principes de contenu

- Un écran porte une seule intention dominante.
- Le premier écran utile doit être compris sans lire de paragraphe.
- Les explications longues sont placées derrière une ouverture volontaire.
- Les libellés décrivent le résultat attendu, pas le nom interne du module.
- Une donnée personnelle est retrouvée dans Résultats, sans action de favori.
- Les fonctions indisponibles ne sont ni recherchables, ni cliquables, ni présentées comme incluses dans Premium.
- Chaque refus, manque de photo ou résultat incomplet garde une sortie claire.

## Critères de validation

- Une nouvelle utilisatrice peut nommer les trois bénéfices après le premier écran.
- Elle atteint le consentement d’une analyse en un appui depuis Analyser.
- Elle sait où retrouver un rapport sans passer par un favori.
- Elle distingue immédiatement une fonctionnalité disponible d’une fonctionnalité future.
- La navigation normale ne contient ni doublon, ni onglet vide, ni catalogue générique.
- La surface du téléphone reste exactement à 393 × 852, le ratio logique de l’iPhone 16.
