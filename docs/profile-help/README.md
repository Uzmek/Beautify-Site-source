# Aide et contact — référence du 16 septembre 2026

## Portée

Vue PRF-10 uniquement. Les cinq cartes restent des boutons natifs et utilisent les actions existantes. Le formulaire de contact, les fiches d’aide, la restauration d’accès, les informations de confidentialité et la navigation conservent leur comportement. Aucun texte ni bouton n’est intégré à une image. Les modifications antérieures présentes dans le projet ont été conservées.

## Relevé

Référence : 851 × 1849 ; viewport iPhone 16 : 393 × 852 CSS px. Échelle horizontale 393/851. Le panneau central commence à x49 ; titre x70/y~268 ; contact y455/h176 ; titre secondaire y~683 ; groupe de trois sujets y784/h495 ; confidentialité y1319/h167. Les copies des cartes commencent à x229. Médaillons 110–123 unités, chevrons 72–78, bordures de verre 1,8–2,5 et rayons 42–45. Fond rose, texte principal brun très foncé, texte secondaire #7b5c50, liserés blancs et ombres roses. Typographies locales DM Serif Display et Roboto. Le titre principal a été ajusté à 73 unités après comparaison. La barre Accueil/Analyses/Profil reste partagée, conformément à l’exception demandée.

## Implémentation

`dist/profile-help.js` définit uniquement la vue. `dist/profile-help.css` isole le style via `.ph-page` et PRF-10. `dist/index.html` charge ces deux fichiers en fin de cascade, avant le démarrage pour la vue. Les boutons réutilisent les fonctions A/B et les gestionnaires existants.

## Validation

Comparaisons vivantes : `compare.html` à 100 %, `compare-zoom.html` à 200 %. La référence complète est conservée uniquement dans ce dossier de documentation, jamais utilisée comme rendu de l’application.

Tests existants : profile-reference-runtime, profile-information-runtime, profile-access-runtime et account-flow-runtime passent. Tests navigateur : formulaire vide refusé, saisie/enregistrement local confirmé, trois rubriques, deux liens Signaler le problème, contact depuis la rubrique Plus, lien Restaurer mon accès, retour depuis restauration, confidentialité ouverte sur Données, retour depuis les documents, accès depuis Profil, Retour, Accueil, Analyses, Profil.

## Assets retenus

Six images distinctes générées par ImageGen intégré : fond sans interface (851 × 1848), enveloppe, photo, graphique, couronne, cadenas (1254 × 1254 chacun). Fichiers finaux dans `dist/assets/profile-help/`. Prompts initiaux et demandes de correction dans `prompts.json` et `prompts-v2.json`. Après comparaison à leur taille d’affichage réelle, le premier jeu de symboles a été retenu pour son contraste plus proche de la référence ; les variantes plus fines devenaient trop pâles. Ajustement CSS de contraste/saturation et ombre externe. Le générateur a simulé le damier sur certaines images malgré les demandes d’alpha : une découpe elliptique CSS exclut ces pixels, sans extraire de morceaux de la référence. Le fond et les médaillons restent des illustrations régénérées, pas des copies exactes pixel par pixel.

La fermeture par Échap et la conservation du brouillon ont également été vérifiées. Contrôles à 393 × 852 et 320 × 693 : aucune largeur de contenu supérieure au viewport, aucun débordement de texte, contenu principal sans défilement à ces proportions. Quatre suites de tests du profil/compte passent.

Navigateur utilisé : navigateur intégré disponible dans cet environnement. Le navigateur cloud demandé n’était pas disponible. Aucune publication. Les captures et comparaisons sont conservées ici ; l’aperçu vivant reste disponible localement.

Un changement parallèle a mis à jour les fiches d’aide pendant la vérification : ces mises à jour ont été conservées et leurs liens vers Nous contacter / Restaurer mes achats ont été retestés. Les sept textes de présentation de PRF-10 ont été rétablis conformément à la référence stricte, puis réécrits une seconde fois par la modification parallèle. Une question a été posée à l’utilisateur pour déterminer la version qui fait foi. La conformité finale des textes à la référence reste en attente ; aucune publication.

Décision finale : en l’absence d’une nouvelle consigne, les textes exacts de l’image ont été retenus conformément à la demande explicite. Les contenus détaillés des fiches d’aide modifiés en parallèle sont conservés.
