**Audit du parcours Profil — 16 septembre 2026**

Le profil possède une identité reconnaissable : rose poudré, cuivre, verre, cartes arrondies et navigation commune. En revanche, il ne repose pas encore sur un système de composants suffisamment unifié. Les pages reproduites individuellement sont proches dans leur ambiance, mais leurs titres, badges, illustrations et surfaces divergent. Les écrans secondaires rendent cette différence particulièrement visible.

Audit visuel dans le navigateur intégré, à 393 × 852 px puis contrôles ciblés à 320 × 693 px. Aucun changement du design effectué pendant cet audit. Les captures représentent la version locale observée ; d’autres modifications étaient déjà présentes dans le dépôt.

**Parcours inspecté**

| Branche | Écrans et états ouverts |
|---|---|
| Profil | Mon profil, état Invité / Sans compte / Découverte |
| Compte | Mon compte, création de compte, inscription par e-mail, connexion, mot de passe oublié |
| Accès | Mon accès Beautify, restauration, paywall |
| Données | Photos et données, confirmation Tout supprimer, annulation |
| Aide | Aide et contact, trois fiches de problèmes, formulaire de contact, fermeture |
| Informations | À propos, Données, Abonnement, Crédits |

Les navigations, retours, ouvertures/fermetures et changements d’onglets observés fonctionnent. Aucune création de compte, demande de contact, restauration effective, transaction ou suppression n’a été exécutée. Les variantes connecté et abonnement actif n’ont pas été validées visuellement dans cette session ; leur structure a été consultée dans le code. L’audit ne constitue pas une validation d’accessibilité complète ni un test sur appareil iOS physique.

**Constats, par priorité**

| Priorité | Constat | Harmonisation proposée |
|---|---|---|
| Haute | Le texte devient trop petit sur les petits écrans. À 320 px, le pied de page du profil est à **9,4 px**, les badges de compte à **10,1 px**, les descriptions de l’aide à **9,8 px** et les intitulés de ses sujets à **11,7 px**. | Fixer des tailles minimales lisibles ; adapter les espacements et autoriser les retours à la ligne avant de réduire le texte. Exploiter l’espace vertical disponible. |
| Haute | Les titres changent de famille et de taille entre pages de même niveau. « Mon compte » utilise une serif à **46,1 px** ; « Informations » une sans-serif à **30 px**. La création de compte passe à **32 px en DM Sans**. | Un composant de titre avec des variantes explicites : accueil du profil, sous-page et fenêtre. Garder le corps de texte en sans-serif pour la lecture. |
| Haute | Le même statut « Découverte » est un badge lumineux avec pictogramme dans le profil, puis une simple pastille dans Mon accès Beautify. Le titre « Beautify Plus » change aussi de police. | Réutiliser un composant de statut et un bloc Beautify Plus communs. Les états actif, attente, renouvellement désactivé, erreur et expiré doivent provenir de la même définition. |
| Moyenne | Plusieurs représentations du même symbole coexistent : couronne sculptée dans le profil, autre couronne dans l’accès, couronne au trait dans l’aide ; carte bancaire au trait dans le profil, illustration en relief dans l’accès. | Une bibliothèque commune par signification. Prévoir deux usages explicites — illustration de rubrique et petite icône de commande — avec des tailles, couleurs et épaisseurs constantes. |
| Moyenne | Le cadre du téléphone et la barre système changent : îlot noir dans Profil/Compte, absent dans Accès/Aide/Données ; heure, batterie et marges différentes. | Un seul habillage de prévisualisation et une même gestion des zones réservées au système. Cette variation ne doit pas dépendre de la page. |
| Moyenne | Cartes et boutons ont des rayons, bordures et reliefs redéfinis écran par écran. À 393 px, le rayon des cartes principales va d’environ **21 à 28 px**. Les actions principales et secondaires du compte se ressemblent beaucoup. | Quelques variantes communes de carte et de bouton, avec une distinction plus nette entre action principale, secondaire et destructive. |
| Moyenne | « Supprimer définitivement » reprend le bouton principal rose ordinaire, avec une flèche vers la droite. | Créer une variante destructive reconnaissable, conservant la confirmation explicite existante. |

Preuves visuelles : [Profil](/Users/ka/Documents/ChatGPT/beautify/docs/profile-design-audit/01-profil.png), [Compte](/Users/ka/Documents/ChatGPT/beautify/docs/profile-design-audit/02-compte.png), [Création de compte](/Users/ka/Documents/ChatGPT/beautify/docs/profile-design-audit/03-creer-compte.png), [Accès](/Users/ka/Documents/ChatGPT/beautify/docs/profile-design-audit/07-acces.png), [Restauration](/Users/ka/Documents/ChatGPT/beautify/docs/profile-design-audit/08-restaurer.png), [Suppression](/Users/ka/Documents/ChatGPT/beautify/docs/profile-design-audit/11-suppression.png), [Aide](/Users/ka/Documents/ChatGPT/beautify/docs/profile-design-audit/12-aide.png), [Informations](/Users/ka/Documents/ChatGPT/beautify/docs/profile-design-audit/17-informations-donnees.png), [Aide à 320 px](/Users/ka/Documents/ChatGPT/beautify/docs/profile-design-audit/22-aide-320.png).

**Hiérarchie et alignements mesurés à 393 px**

| Page | Titre principal | Taille | Position horizontale du titre | Bouton Retour |
|---|---|---:|---:|---|
| Mon profil | DM Serif Display | 45,7 px | 30 px | — |
| Mon compte | DM Serif Display | 46,1 px | 26 px | 46 × 46 px |
| Mon accès Beautify | DM Serif Display, deux lignes | 35,9 px | 34 px | 44 × 44 px |
| Photos et données | DM Serif Display | 28,6 px | 32 px | 44 × 44 px |
| Aide et contact | DM Serif Display | 33,7 px | 32 px | 44 × 44 px |
| Informations / Tout supprimer | DM Sans | 30 px | 20 px | 44 × 44 px |
| Création / Connexion | DM Sans | 32 px | 20 px | 44 × 44 px |

Les titres sont déjà alignés à gauche. Je conserverais cet alignement pour les sous-pages et formulaires : il facilite le passage du titre aux champs et aux cartes. Le besoin principal est une échelle typographique commune, plutôt qu’un centrage généralisé. Un titre long peut passer sur deux lignes sans recevoir une taille arbitrairement plus petite.

Les boutons Retour ont une surface tactile suffisante dans les vues mesurées, y compris à 320 px. Leur position et la taille du disque visible varient encore. À 320 px, certains conteneurs de retour mesurent 34–35 px alors que le bouton reste à 44 px : ce n’est pas un débordement visible de la page, mais c’est une géométrie à simplifier.

Pas de débordement horizontal visible constaté dans les vues contrôlées. Les lectures longues défilent et les onglets Informations passent correctement sur deux rangées à 320 px. L’absence de débordement ne résout toutefois pas la petite taille des textes.

**Ce qui est déjà bien réutilisé**

- La barre Accueil / Analyses / Profil reste identique dans les pages principales du profil.
- Aide et Photos et données partagent réellement leurs cartes, descriptions, flèches et plusieurs illustrations. Ce partage est visible dans leur rendu et dans le code.
- Les fiches d’aide et le contact passent par une même fenêtre. Les quatre documents utilisent le même sélecteur et la même carte de lecture.
- Les flèches reposent sur le même pictogramme SVG. Les libellés restent du texte natif et les lignes sont de vrais boutons.
- L’état désactivé « Supprimer mes photos » est distingué visuellement et fonctionnellement lorsqu’aucune photo n’est présente.

**Réutilisation à mettre en place**

| Composant partagé | Responsabilité |
|---|---|
| Cadre de page Profil | Fond, marges, zones système, défilement, emplacement du retour et navigation |
| En-tête | Police, taille, interligne, titre sur une ou deux lignes, sous-titre facultatif |
| Carte et ligne de menu | Bordure, transparence, ombre, espacements, illustration, textes et flèche |
| Bouton | Variantes principale, secondaire, discrète, destructive, icône seule ; états focus et désactivé |
| Badge de statut | Libellé, couleur, pictogramme et relief communs à tous les écrans |
| Médaillon / icône | Assets canoniques, dimensions optiques, épaisseur du trait et cadrage |
| Champ et fenêtre | Labels, saisie, aide, erreurs, fermeture et actions |

Ces composants peuvent rester de simples fonctions HTML et classes CSS dans l’architecture actuelle. Il n’est pas nécessaire de changer de framework. Les pages doivent fournir leur contenu et leurs actions, plutôt que redéfinir chacune le verre, les flèches ou la typographie.

La cause technique principale est la coexistence de familles `pf-*`, `pi-*`, `pa-*`, `ph-*` et `lg-*`, souvent dimensionnées par réduction d’une maquette de 851, 852 ou 876 px de large. Le partage Aide/Données va dans le bon sens, mais les fonctions génériques y sont encore nommées et hébergées comme des éléments spécifiques à l’aide.

Points d’entrée : [statuts du profil](/Users/ka/Documents/ChatGPT/beautify/dist/profile-reference.js:7), [statuts de l’accès](/Users/ka/Documents/ChatGPT/beautify/dist/profile-access.js:15), [tailles et barre système du profil](/Users/ka/Documents/ChatGPT/beautify/dist/profile-reference.css:7), [typographie du compte](/Users/ka/Documents/ChatGPT/beautify/dist/profile-information.css:19), [titres de connexion](/Users/ka/Documents/ChatGPT/beautify/dist/account-flow.css:33), [composants de l’aide](/Users/ka/Documents/ChatGPT/beautify/dist/profile-help.js:4), [réutilisation dans les données](/Users/ka/Documents/ChatGPT/beautify/dist/profile-data.js:8), [documents](/Users/ka/Documents/ChatGPT/beautify/dist/experience.css:138).

Ordre conseillé : corriger les tailles minimales, partager le badge de statut, unifier les en-têtes et le cadre, puis mutualiser cartes, boutons et icônes. Cela préservera l’identité premium actuelle tout en rendant les passages entre pages prévisibles.

Les 26 captures et les [mesures détaillées](/Users/ka/Documents/ChatGPT/beautify/docs/profile-design-audit/mesures.json) sont conservées avec ce rapport. Les mesures de position prises pendant une transition ont été reprises pour la connexion ; les constats ci-dessus utilisent les vues stabilisées.
