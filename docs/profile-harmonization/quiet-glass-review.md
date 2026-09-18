# Revue d’harmonie du profil — verre atténué

Le relief des anciennes capsules était trop fort par rapport au reste de l’écran. Les points blancs, les biseaux épais et les ombres portées se répétaient sur des commandes de niveaux différents. Le problème était particulièrement visible dans les formulaires de connexion : les fournisseurs, l’action principale, la récupération du mot de passe et l’annulation avaient presque la même importance visuelle.

La nouvelle [référence générée](quiet-glass-reference.png), obtenue avec le générateur intégré à partir du bouton fourni, est plus sobre. [Prompt exact](quiet-glass-prompt.md). La planche sert à comparer la matière ; les composants restent natifs.

## Revue des 13 écrans

| Écran | Constat et correction |
| --- | --- |
| Profil — PRF-01 | CTA et badges trop brillants à côté des cartes fines. Reflets et ombres réduits, badges plus légers. |
| Mon compte — PRF-02 | Quatre capsules bombées dominaient les deux panneaux. Matière commune plus douce et action principale légèrement teintée. |
| Rappels — PRF-05 | Même traitement du bouton d’enregistrement ; couleur cuivre commune pour les cases cochées. |
| Abonnement — PRF-06 | Cartes plates conservées ; badges harmonisés pour tous les états. Vérification visuelle du statut long à 320 px. |
| Photos et données — PRF-07 | Panneaux et lignes sans relief de capsule conservés ; actions de suppression gardent leurs confirmations. |
| Suppression — PRF-09 | Action sensible teintée rouge discret ; annulation sans coque brillante. |
| Aide — PRF-10 | Une surface par groupe ; lignes séparées, chevrons simples. Boutons des fenêtres alignés sur le nouveau matériau. |
| Informations — PRF-11 | Quatre onglets plus discrets ; état choisi conservé avec teinte et indicateur. |
| Choix de compte — ENT-05 | Fournisseurs secondaires allégés ; continuer sans compte redevient un lien. |
| Connexion — ENT-06 | Hiérarchie entre fournisseurs, connexion et liens. Mot de passe oublié/Annuler sans fond ni ombre. |
| Création par e-mail — ENT-07 | Action principale atténuée et matière raccordée aux champs. |
| Récupération — ENT-08 | Distinction entre envoi principal et retour secondaire. |
| Restauration — PRE-04 | Vérification principale, abonnement secondaire et changement de compte sous forme de lien. |

## Règles communes

- Aucun point de reflet blanc isolé ni épais bourrelet sur les contrôles.
- Fine lumière de bord et ombre courte commune ; transparence conservée.
- Primaire : teinte pêche légère ; secondaire : verre neutre proche des cartes ; tertiaire : texte sans coque.
- Réfraction réduite de 12 à 4, avec le même flou/saturation dans le repli CSS.
- Palette, illustrations partagées, textes, actions et composition conservés.
- La correction du changement de matière à l’arrivée reste en place : pas de fondu sur les parents du verre et préparation des filtres avant peinture.

## Vérifications

Revue dans le navigateur intégré, captures à 393 × 852 et 320 × 693. Connexion à 320 px sans débordement ; liens tertiaires avec zone d’action de 44 px. Navigation vers la récupération, quatre onglets d’information, ouverture/fermeture du contact vérifiées. Aucun envoi, achat ou effacement effectué.

Suites réussies : `profile-system`, `profile-glass`, `motion-check`, `profile-reference`, `account-flow`, `profile-access`, `profile-data`, `profile-information`. `git diff --check` propre.

Captures : `quiet-profile-393.png`, `quiet-account-393.png`, `quiet-login-393.png`, `quiet-login-320.png`, `quiet-access-393.png`, `quiet-cancelled-320.png`, `quiet-restore-393.png`, `quiet-reminders-393.png`, `quiet-information-393.png`, `quiet-help-393.png`, `quiet-contact-393.png`.
