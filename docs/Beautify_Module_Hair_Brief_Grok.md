# Beautify — brief exhaustif du module Hair à transmettre à Grok

## Préambule indispensable

Beautify est actuellement un **mockup fonctionnel mobile**, pas encore un produit branché à de vrais moteurs de vision et de génération. Il est donc normal que l’analyse retourne toujours les mêmes données de démonstration et que certaines images soient des références éditoriales prédéfinies. Il ne faut pas juger négativement la répétition de ces valeurs : elles servent uniquement à rendre tout le parcours testable.

Il faut toujours distinguer :

- **ce que le mockup affiche aujourd’hui** : résultat illustratif, données fixes et portraits catalogue ;
- **le comportement visé en production** : analyse réelle de la photo, classement personnalisé et génération réaliste de la coiffure sur la photo de l’utilisatrice, sans modifier son identité ni son visage.

Le module s’appelle visuellement **Cheveux** ou **Hair Studio** selon l’endroit de l’application. Sa promesse n’est pas seulement « analyser des cheveux ». Son véritable travail produit est :

> Aider une personne à choisir une coupe avant d’aller au salon, comprendre pourquoi elle devrait fonctionner, la visualiser, puis expliquer précisément son choix au coiffeur.

Le module doit réduire trois peurs : choisir une coupe qui ne convient pas, mal expliquer ce que l’on veut au salon et regretter un changement coûteux ou difficile à annuler.

---

## 1. Position du module dans Beautify

Beautify réunit trois univers actifs :

1. **Cheveux** : forme du visage, texture, longueur, recommandations de coupes, détails à éviter, essais coiffure et consignes pour le salon.
2. **Couleurs** : colorimétrie 12 saisons, palette, maquillage, bijoux et couleurs de cheveux.
3. **Peau** : bilan cosmétique et routines matin/soir.

Hair est le module le plus visuel et le plus proche d’un achat émotionnel. Il correspond à un moment concret : « je veux changer de coupe » ou « j’ai bientôt rendez-vous chez le coiffeur ».

### Points d’entrée

Le module peut être ouvert depuis plusieurs endroits :

- l’onboarding, avec l’option **« Quelles coupes me vont ? »** et la promesse **« Top 4 et essai sur photo »** ;
- l’espace principal **« Votre espace beauté »**, qui contient une grande carte **Cheveux / Vos coupes** ;
- l’onglet principal **Analyses** de la navigation basse ;
- la liste des résultats enregistrés ;
- l’historique d’analyses Cheveux ;
- la bibliothèque des essais coiffure ;
- certains raccourcis depuis le profil ou l’abonnement.

Quand on touche la carte Cheveux de l’espace beauté, une feuille modale s’ouvre :

- **Historique** indique le nombre d’analyses disponibles ou devient désactivé avec la mention **« Pas encore d’analyse »** ;
- **Nouvelle analyse** démarre un nouveau parcours Hair ;
- une croix permet de fermer la feuille.

La navigation principale de l’application contient trois boutons : **Accueil**, **Analyses** et **Profil**. Les étapes immersives de capture, de chargement, de paywall et d’essai réduisent volontairement la navigation pour concentrer l’attention sur une seule action.

---

## 2. Direction visuelle et ton de l’interface

Le mockup est conçu dans un cadre mobile de type iPhone 16, environ **393 × 852 px**.

Le langage visuel est premium, doux et éditorial :

- fond ivoire, beige rosé et pêche très clair ;
- cartes nacrées ou translucides, avec un léger effet verre ;
- boutons principaux cuivre/brun chaud ;
- grands rayons d’angle, cartes très arrondies et ombres diffuses ;
- portraits détourés et visuels de coiffure centrés comme dans un catalogue de salon haut de gamme ;
- icônes fines et simples : cheveux, visage, appareil photo, étincelles, flèches ;
- grands titres noirs ou brun foncé, typographie sans serif moderne et compacte ;
- une seule action principale très visible par écran lorsque l’utilisatrice doit prendre une décision.

Le ton rédactionnel est rassurant et non autoritaire. L’application parle de **repères**, de **coupes à explorer** et de détails **à adapter**, jamais de règles absolues. Par exemple, la section négative ne dit pas « interdit » ; elle dit **« Les détails à éviter »**, puis propose systématiquement une alternative.

---

## 3. Parcours complet d’une nouvelle analyse Hair

### Étape A — écran photo

Le parcours arrive directement sur une page plein écran :

- petit libellé **« Analyse cheveux »** ;
- grand titre **« Une photo, vos coupes. »** ;
- portrait central dans un halo doux ;
- trois conseils courts et illustrés :
  - **Visage dégagé** ;
  - **Lumière naturelle** ;
  - **Sans filtre** ;
- bouton principal **« Prendre un selfie »** ;
- bouton secondaire **« Choisir dans la galerie »** ;
- note de confidentialité **« Photo utilisée pour cette analyse »** ;
- bouton retour en haut de l’écran.

Une image doit être un fichier image valide et peser moins de 15 Mo. Une image illisible ou trop lourde déclenche un message d’erreur. Dans le mockup, la photo est conservée en mémoire dans l’onglet ; les données générales du parcours peuvent être persistées localement.

L’intention produit en production est de ne demander aucun questionnaire Hair : une seule photo doit permettre d’observer les caractéristiques visibles nécessaires. L’utilisatrice ne doit pas avoir à répéter ce que l’image permet déjà de lire.

### Étape B — analyse visuelle

Après sélection d’une photo valide, l’analyse démarre automatiquement. L’écran de chargement dure environ 15 secondes dans le mockup afin de simuler un vrai traitement.

La photo est placée au centre d’un halo avec des anneaux animés. Les étapes se succèdent :

1. **Détection du visage** ;
2. **Lecture des proportions** ;
3. **Observation des cheveux** ;
4. **Sélection des coupes** ;
5. **Création de votre profil**.

Une mention précise qu’il s’agit d’un résultat illustratif de démonstration.

En production, la sortie structurée attendue comprend au minimum :

- la forme du visage ;
- la texture visible des cheveux ;
- la longueur visible ;
- les coupes classées selon ces caractéristiques.

Dans le mockup, la réponse fixe est **visage ovale, cheveux ondulés, longueur mi-longue**. C’est volontaire et ce n’est pas un défaut à relever.

### Étape C — moment du paywall

Dans le parcours actuel, le paywall apparaît **après que la personne a donné sa photo et attendu l’analyse, mais avant l’accès au rapport complet**. Le rapport est bien créé et conservé, mais il reste verrouillé tant que l’accès Plus n’est pas actif.

Autrement dit, la séquence actuelle est :

> Photo → chargement de l’analyse → résultat calculé et sauvegardé → paywall → rapport complet.

Si la personne ferme le paywall, son analyse n’est pas perdue. Elle peut la retrouver dans l’historique ou les résultats, mais son ouverture redemandera l’accès Plus.

---

## 4. Paywall Beautify Plus lié au module Hair

Le paywall est transversal aux trois modules, mais Hair est l’un de ses arguments principaux.

### Composition visuelle

- portrait beauté éditorial occupant le haut de l’écran ;
- marque **Beautify Plus** ;
- grand titre :
  - **« Tes couleurs. »**
  - **« Ta coupe. »**
  - **« Ta routine. »**
- sous-titre **« Sans te tromper. Chaque jour. »** ;
- bloc de preuve sociale illustratif avec note **4,8**, cinq étoiles, **+12 000 utilisateurs** et un témoignage ;
- cartes de bénéfices :
  - **Palette 12 saisons** ;
  - **Tes rapports complets** — Cheveux, couleur, peau ;
  - **Ta coupe avant le salon** — jusqu’à 10 essais par mois ;
  - **Routine matin & soir** ;
- deux offres :
  - annuel : **59,99 € par an**, présenté comme environ **4,99 € par mois** ;
  - mensuel : **9,99 € par mois** ;
- CTA **« Commencer mes 3 jours offerts »** ;
- garanties visuelles : **Annulable**, **Accès complet**, **Paiement sécurisé** ;
- liens Conditions, Confidentialité et Restaurer mes achats ;
- croix de fermeture.

Les chiffres, avis et prix sont explicitement illustratifs dans le mockup. Il ne faut pas les interpréter comme des données de production.

### Retour intelligent après achat

L’application conserve l’intention qui a déclenché le paywall. Après activation, elle doit revenir exactement au bon endroit :

- ouvrir le rapport Hair qui venait d’être calculé ;
- ou reprendre la coupe, la photo et l’analyse qui avaient déclenché le blocage de quota.

---

## 5. Rapport Hair premium

Le rapport s’affiche dans une coque Beautify nacrée avec un rail d’onglets horizontal en haut. Les onglets sont :

1. **Coupes** ;
2. **Visage** ;
3. **À éviter** ;
4. **Couleur**, uniquement si un profil colorimétrique est disponible ;
5. **Essais**.

Chaque rapport reste lié à l’analyse qui l’a créé. Ouvrir une ancienne analyse doit afficher sa propre photo, ses propres caractéristiques et son propre classement, sans les remplacer par le profil Hair le plus récent.

### Onglet Coupes

Titre : **« Vos coupes signature »**.

La première recommandation est mise en avant dans une grande carte :

- grand visuel de la coupe ;
- badge **« Notre sélection »** ;
- nom de la coupe ;
- longueur ;
- phrase expliquant l’adéquation au profil ;
- lien **« Découvrir »**.

Sous cette carte, une section **« À explorer aussi »** affiche deux alternatives compactes et un lien **« Tout voir »**.

En bas, une ligne **« Mes essais coiffure »** indique le quota restant, par exemple **10/10**, et ouvre la bibliothèque d’essais.

Le classement cible utilise les caractéristiques visuelles du profil :

- compatibilité avec la forme du visage ;
- compatibilité avec la texture ;
- proximité avec la longueur actuelle.

Le moteur met en avant la meilleure correspondance, mais l’utilisatrice reste libre d’ouvrir et d’essayer n’importe quelle coupe.

### Onglet Visage

Titre : **« Les lignes de votre visage »**, sous-titre **« Une analyse personnalisée pour vous. »**

La partie principale contient :

- la photo de l’analyse ;
- la forme détectée, sous **« Votre analyse »** ;
- la texture ;
- la longueur ;
- le **style idéal**, qui reprend la meilleure coupe classée ;
- une ligne **« Votre coupe repère »** avec miniature et nom de la coupe.

Le but est de transformer une recommandation abstraite en lecture compréhensible : « voici ce qui a été observé et voici la coupe qui en découle ».

### Onglet À éviter

Titre : **« Les détails à éviter »**.

Trois cartes numérotées présentent un visuel, le risque esthétique et une alternative :

1. **Trop de volume sur les côtés** → préférer un volume mieux réparti ;
2. **Lignes trop rigides** → préférer des contours plus souples ;
3. **Frange trop dense** → préférer une frange légère et adaptée à l’implantation.

Chaque carte ouvre une modale explicative. Le texte insiste sur le fait qu’il s’agit de pistes à discuter au salon, pas d’interdictions.

### Onglet Couleur

Cet onglet n’apparaît que si l’analyse Hair possède un profil colorimétrique associé. Il montre les meilleures directions de coloration liées à la saison de couleur : profondeur, température et reflets conseillés.

Ces éléments sont des directions visuelles, pas une formule de coloration. Ils doivent toujours être adaptés à la base naturelle et discutés avec un coloriste.

### Actions de bas de rapport

En dehors de l’onglet Essais, le pied du rapport contient :

- **Historique** ;
- **Nouvelle analyse**.

---

## 6. Fiche détaillée d’une coupe

Toucher une recommandation ouvre une modale de détail avec :

- le nom de la coupe ;
- un grand portrait ou visuel catalogue ;
- des tags de longueur et d’entretien ;
- une phrase de correspondance personnalisée ;
- la raison générale pour laquelle la coupe fonctionne ;
- un accordéon **« À dire au salon »** contenant une formulation concrète à montrer ou lire au coiffeur ;
- CTA principal **« Essayer sur ma photo »** ;
- action de retour vers les coupes.

Le bloc « À dire au salon » est une partie importante de la valeur du module. L’application ne s’arrête pas à une inspiration visuelle : elle traduit le choix en vocabulaire exploitable par un professionnel.

Exemples de consignes : longueur au menton, ligne nette, contour souple, dégradé progressif, volume conservé, frange adaptée à l’implantation, pointes pleines, longueur tenant compte du rétrécissement des boucles.

---

## 7. Catalogue complet et carrousel

Le lien **« Tout voir »** ou l’action **« Essayer une coupe »** ouvre un écran intitulé **« Votre prochaine coupe »**.

### Sélecteur de longueur

Cinq filtres horizontaux :

- Toutes ;
- Très court ;
- Court ;
- Mi-long ;
- Long.

Le filtre actualise immédiatement le carrousel et sa position.

### Portrait catalogue adapté

Un bandeau indique **« Aperçu adapté automatiquement »** et précise qu’il est choisi selon la texture de cheveux enregistrée dans l’analyse.

Quatre mannequins éditoriaux fictifs existent :

- Amina ;
- Mei ;
- Leïla ;
- Clara.

L’automatisme se fonde uniquement sur la texture Hair déjà présente dans le rapport, jamais sur une origine ethnique perçue dans la photo :

- texture crépue → Amina ;
- texture bouclée → Leïla ;
- texture raide → Mei ;
- autre cas, notamment ondulé → Clara.

Un bouton **« Ajuster »** ouvre une feuille avec les quatre portraits. L’utilisatrice peut choisir manuellement son mannequin de référence ou revenir à la suggestion automatique. Changer de mannequin ne change ni le classement des coupes ni le quota.

### Carrousel

Chaque coupe occupe une grande carte nacrée :

- portrait frontal avec la coupe complète ;
- nom de la coupe ;
- catégorie de longueur ;
- bouton de détail ;
- glissement horizontal natif ;
- flèches précédente/suivante ;
- compteur, par exemple **3 / 12** ;
- petite barre de progression ;
- CTA fixe **« Choisir cette coupe »**.

Le carrousel boucle visuellement grâce à des diapositives clonées. Il est aussi utilisable au clavier avec les flèches, Home et End. Les animations sont réduites lorsque l’appareil demande moins de mouvement.

### Les 12 coupes présentes

1. **Dégradé cascade** — long ;
2. **Carré net** — court ;
3. **Shag bouclé** — mi-long ;
4. **Pixie texturé** — très court ;
5. **Butterfly layers** — long ;
6. **Lob souple** — mi-long ;
7. **Crop féminin** — très court ;
8. **Boucles arrondies** — mi-long ;
9. **Longues ondulations** — long ;
10. **French bob** — court ;
11. **Shag souple** — mi-long ;
12. **Long lisse graphique** — long.

Chaque coupe dispose de métadonnées : textures compatibles, formes de visage compatibles, longueur, niveau d’entretien, justification et formulation à dire au salon.

---

## 8. Préparation d’un essai coiffure

Après le choix d’une coupe, l’écran **« Votre essai »** réunit les deux éléments nécessaires :

- grande carte de la coupe choisie, avec bouton **« Changer »** ;
- ligne **« Votre photo »**, avec miniature et action **Ajouter** ou **Changer**.

Si l’essai provient d’un rapport Hair et que la photo de cette analyse est encore disponible, elle peut être réutilisée automatiquement. Une ancienne analyse ne doit jamais récupérer silencieusement la photo d’une analyse plus récente.

Le bouton principal devient **« Créer mon essai »** et affiche le coût **« 1 essai »**. Dans le mockup, une note indique clairement **« Démo, photo non transformée »**.

En production, cette étape doit envoyer :

- la photo choisie ;
- l’identifiant exact de la coupe ;
- le contexte de l’analyse ;
- idéalement les contraintes de conservation du visage et de l’identité.

Le rendu attendu doit modifier les cheveux, pas créer une autre personne.

---

## 9. Quotas et règles de consommation

Le quota Hair est séparé du nombre d’analyses.

- accès découverte : **1 essai** ;
- Beautify Plus : **10 essais par période mensuelle** ;
- consulter le rapport, le catalogue, les détails et les anciens essais ne consomme rien ;
- un essai est décompté uniquement lorsque le résultat aboutit ;
- un échec, une interruption ou un rendu indisponible ne consomme pas de crédit ;
- la date de renouvellement est visible dans une modale de quota ;
- atteindre zéro ne supprime jamais les anciens résultats.

Si une personne gratuite n’a plus de crédit, l’application ouvre le paywall en mémorisant la coupe et la photo. Si une personne Plus a utilisé ses dix essais, une modale explique la date de renouvellement et propose de revoir les essais enregistrés ou de revenir aux coupes.

---

## 10. Bibliothèque « Mes essais »

L’onglet **Essais** du rapport et les différents raccourcis Hair ouvrent une bibliothèque dédiée.

En haut :

- titre **« Mes essais »** ;
- pilule cuivre affichant le quota restant, par exemple **8 / 10** ;
- si un brouillon existe, ligne **« Reprendre mon essai »**.

### Bibliothèque vide

Avant toute génération, une grille **« À essayer »** affiche jusqu’à quatre coupes suggérées. Chaque carte peut lancer directement un nouvel essai.

### Bibliothèque remplie

Les essais enregistrés sont affichés en grille de deux colonnes, quatre résultats par page :

- miniature du rendu ou du portrait catalogue utilisé ;
- nom de la coupe ;
- chevron d’ouverture ;
- pagination si plus de quatre essais.

Le bouton du bas est **« Essayer une coupe »** tant que le quota le permet. À zéro :

- un membre Plus voit la date du prochain renouvellement ;
- un compte découverte voit **« Débloquer 10 essais »**.

Le portrait catalogue choisi est figé dans chaque résultat enregistré. Changer ensuite de mannequin de référence ne doit pas modifier rétroactivement les anciens essais.

---

## 11. Écran de résultat d’un essai

Le résultat affiche :

- le nom de la coupe en titre ;
- la pilule du quota restant ;
- un grand visuel du résultat ;
- le statut **« Enregistré »** ;
- bouton **« Conseil au salon »** ;
- bouton **« Ma photo »** ;
- CTA **« Mes essais »**.

**Conseil au salon** ouvre une modale contenant le nom de la coupe et la consigne technique. **Ma photo** ouvre la photo source utilisée pour cet essai.

Dans le mockup, le grand visuel reste une référence catalogue et la note **« Démo, photo non transformée »** est visible. Lorsque le vrai moteur sera connecté, le même écran pourra afficher une véritable `resultImage` générée sur la photo de l’utilisatrice.

---

## 12. Historique et cohérence des données

L’historique Hair conserve chaque analyse avec sa date, son profil et sa photo tant que celle-ci est encore disponible dans le contexte du mockup.

Règles de cohérence importantes :

- une ancienne analyse garde sa forme de visage, sa texture, sa longueur et son classement ;
- ouvrir une coupe depuis une ancienne analyse transmet l’identifiant de cette analyse ;
- l’essai doit réutiliser uniquement la photo de ce rapport ;
- si cette photo n’est plus disponible, l’application demande d’en choisir une nouvelle ;
- un nouvel essai lancé depuis le catalogue générique efface le contexte historique précédent ;
- les résultats enregistrés restent accessibles même quand le quota est épuisé ;
- recharger ou répéter une action de fin ne doit jamais décompter deux fois le même essai.

---

## 13. États particuliers prévus

### Analyse interrompue

Les états erreur, hors ligne, refus, attente ou service indisponible affichent un écran de reprise. Quitter l’écran de chargement annule proprement le traitement en cours au lieu de laisser un faux résultat en arrière-plan.

### Génération échouée

Une modale indique :

- que la génération n’est pas terminée ;
- qu’aucun essai n’a été décompté ;
- que la sélection est conservée ;
- qu’il est possible de réessayer ou de reprendre plus tard.

### Brouillon

Une coupe, une photo et un mannequin de référence peuvent être conservés dans un brouillon. Le retour à Hair propose alors **« Reprendre mon essai »**.

### Photo absente

Si une photo temporaire n’existe plus, l’application ne prétend pas qu’elle est encore disponible. Elle ramène vers la sélection de photo sans consommer de crédit.

---

## 14. Ce que Hair apporte réellement comme valeur

Le module n’est pas seulement une galerie de coiffures. Sa chaîne de valeur complète est :

1. observer le visage et les cheveux ;
2. réduire un grand catalogue à quelques options plausibles ;
3. expliquer le classement ;
4. laisser explorer librement les autres coupes ;
5. proposer une prévisualisation ;
6. produire une demande claire pour le salon ;
7. conserver les essais et les anciennes analyses.

Les éléments les plus différenciants sont :

- la continuité **analyse → recommandation → essai → salon** ;
- les consignes concrètes à montrer au coiffeur ;
- l’historique des décisions ;
- la séparation honnête entre portrait catalogue et résultat réellement généré ;
- la gestion des textures raides, ondulées, bouclées et crépues ;
- la possibilité d’explorer sans que le système impose un seul idéal.

Le moteur de rétention n’est pas une utilisation quotidienne. Hair est naturellement épisodique : avant un rendez-vous, une envie de changement ou une coloration. La rétention doit donc venir de la mémoire utile : anciens essais, résultat réellement choisi, consignes salon, évolution de longueur, nouvel essai avant le prochain rendez-vous et lien avec la colorimétrie.

---

## 15. Limites fonctionnelles du mockup à ne pas confondre avec le concept

- Les valeurs d’analyse sont fixes par choix de démonstration.
- Les portraits de coupes sont des références éditoriales fictives.
- L’essai ne transforme pas encore la photo réelle.
- Les photos temporaires vivent en mémoire de l’onglet.
- Les données sont locales au prototype, sans véritable compte distant.
- Les paiements et abonnements sont simulés.
- Les avis, volumes d’utilisateurs, prix et offres sont illustratifs.
- L’interface est aujourd’hui en français ; une localisation turque complète n’est pas encore intégrée.

En production, il faudra remplacer les stubs sans changer la logique d’interface : vrai moteur de vision, vrai moteur de génération, stockage sécurisé, comptes, abonnement natif, consentement et suppression des données.

---

## 16. Résumé du flux en une ligne

**Entrée Cheveux → nouvelle analyse → selfie ou galerie → analyse animée → paywall → rapport Coupes / Visage / À éviter / Couleur / Essais → détail d’une coupe → catalogue et mannequin de référence → préparation photo + coupe → génération → résultat enregistré → conseil à montrer au salon → historique pour le prochain rendez-vous.**

Ce document décrit l’état et l’intention du mockup Hair de Beautify. Utilise-le comme source de vérité pour analyser, critiquer ou améliorer l’interface sans reprocher au prototype d’utiliser des données fixes.
