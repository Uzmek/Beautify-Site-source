# Beautify — revue produit, contenu et fidélisation

6 septembre 2026 · Décisions appliquées au prototype et hypothèses à vérifier

## Le choix de produit

Beautify doit aider à décider et à faire : trouver un look faisable, préparer une occasion, retrouver des gestes choisis. La valeur à vérifier est « je sais quoi faire et je retrouve ce qui me convient ». Une collection de résultats esthétiques ou de pages ne suffit pas à justifier un abonnement durable.

J’ai conservé les 82 vues pour couvrir les parcours demandés, mais réduit leur poids dans l’expérience. Une utilisatrice rencontre d’abord sa tâche. Les comparaisons, réglages détaillés, simulations et achats restent accessibles au moment pertinent.

« Les femmes » ne forment pas un besoin unique. Quatre situations guident cette version : peu de temps au quotidien ; envie d’un look pour une occasion ; besoin d’idées avec ses propres vêtements ; envie de retrouver ses habitudes sans pression. Ce sont des hypothèses de segmentation, pas des résultats d’entretiens. L’âge, la texture des cheveux, le budget, le handicap, le niveau de pratique et l’envie de se maquiller doivent être représentés dans les futurs tests, sans déduire des préférences d’un portrait.

## Ce que les recherches permettent de décider

| Source consultée | Observation utile | Décision pour Beautify | Limite |
|---|---|---|---|
| [Baymard, Health & Beauty, février 2026](https://baymard.com/blog/health-and-beauty-ux-research) | Les visuels complémentaires et les descriptions explicites des nuances aident à évaluer un produit. Un sélecteur qui oblige à mémoriser des teintes puis à remonter la page complique le choix. | Nuanciers directement visibles, profondeur et sous-ton décrits, informations près du choix. Fiches de looks avec durée et matériel. | Recherche qualitative sur 18 sites américains, plus de 275 sessions ; pas une estimation de conversion de Beautify. |
| [RevenueCat, State of Subscription Apps 2026](https://www.revenuecat.com/state-of-subscription-apps/) | Dans ces données, les applications IA monétisent davantage par payeur, mais retiennent moins bien à 12 mois. Les applications à paiement obligatoire convertissent mieux au départ sans avantage comparable de rétention à un an. | Ne pas faire reposer Premium sur la curiosité d’un résultat IA. Montrer une semaine utilisable et une organisation récurrente. Tester le moment de la proposition. | Données principalement de 2025, issues d’applications clientes de RevenueCat avec critères d’éligibilité. Comparaisons observationnelles, toutes catégories ; aucune causalité ni promesse pour ce produit. |
| [NN/g, Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/) | Montrer d’abord les commandes fréquentes et nommer clairement les options secondaires facilite l’apprentissage. Trop d’étapes peut également compliquer une tâche. | Formulaire d’occasion réduit à trois champs visibles ; réglages complémentaires dans des sections explicites ; classement des favoris facultatif. | Principe général : l’ordre réel des tâches doit être vérifié avec des utilisatrices. |
| [NN/g, UX Guidelines for Recommended Content](https://www.nngroup.com/articles/recommendation-guidelines/) | Une sélection compréhensible et des moyens d’interagir avec les propositions aident à ajuster les recommandations. | Retours « À refaire », « À adapter », « Pas pour moi », réinitialisables ; suggestions fondées sur les choix déclarés. | Le moteur du prototype est une règle éditoriale locale, pas un modèle d’apprentissage. |
| [NN/g, Five Mistakes in Designing Mobile Push Notifications](https://www.nngroup.com/articles/push-notification/) | Il faut expliquer l’utilité des notifications, éviter de solliciter trop tôt et faciliter leur désactivation. | Rappels choisis par catégorie et horaire, accessibles après l’usage ; aucune demande dès l’arrivée. | Le prototype ne programme aucun rappel réel. |
| [Baymard, produits montrés sur un modèle](https://baymard.com/blog/human-model) | Les produits portés ont besoin d’un contexte humain pour que l’on comprenne mieux leur rendu ou leurs dimensions. | Visuels de cheveux et de styles plus variés, portrait de coupe courte argentée, cheveux crépus/bouclés et raides. | Ces portraits IA sont des références éditoriales. Ils ne prouvent pas le résultat d’un cosmétique, ni sa compatibilité individuelle. |
| [Lally et al., How are habits formed](https://onlinelibrary.wiley.com/doi/10.1002/ejsp.674) | La répétition dans un contexte stable participe à l’automatisation ; un écart ponctuel ne signifie pas que tout est perdu. | Rythmes choisis, reprise après une pause, séances partielles conservées, aucun compteur de série perdue. | Étude sur la formation d’habitudes, pas sur l’abonnement à une application beauté. L’application au produit reste une hypothèse. |

Les décisions ci-dessous sont mon interprétation de ces recherches et de la revue du mockup. Les rapports ne démontrent pas que cette nouvelle version sera rentable.

## Structure retenue

| Destination | Question de l’utilisatrice | Contenu principal |
|---|---|---|
| Accueil | Qu’est-ce qui me serait utile maintenant ? | Journée, semaine, routines, prochaine occasion, deux inspirations. |
| Découvrir | Quelle idée ai-je envie d’essayer ? | Recherche, univers, inspirations, tenues personnelles ; tutoriels et produits en accès secondaire. |
| Analyses | Quels repères peuvent m’aider à choisir ? | Exploration guidée, réponses, comptes rendus datés et historique. |
| Enregistrés | Où est l’idée que j’avais aimée ? | Tous les favoris, recherche et collections facultatives. |
| Profil | Comment adapter et gérer mon espace ? | Préférences, abonnement, commandes, confidentialité, paramètres et aide. |

La semaine et les routines sont rattachées à l’accueil. Le journal est accessible depuis la journée et l’espace personnel de l’accueil. Le dressing est dans Découvrir. Les réglages ne sont plus confondus avec le profil. Le panier reste directement accessible pendant la découverte et les achats.

## Revue de toutes les familles de fonctionnalités

« Centrale » indique une priorité d’usage proposée. « Contextuelle » reste accessible dans son parcours. « Secondaire » doit justifier son intérêt avant davantage d’investissement.

| Vues couvertes | Fonction et décision | Friction traitée / comportement appliqué | Signal à observer |
|---|---|---|---|
| ENT-01 | Reprise — contextuelle | Une session en cours et une destination compréhensible ; pas de questionnaire complet à chaque retour. | Reprise aboutie, absence de recommencement involontaire. |
| ENT-02–04 | Arrivée — centrale | Trois intentions : look rapide, occasion, rituel. L’occasion et le rituel mènent directement à leur tâche ; le look demande un premier repère de temps. | Première tâche utile accomplie, aide requise, abandons. |
| ENT-05–08 | Compte — contextuelle | Exploration sans compte, vérification simulée claire, retour à la tâche d’origine. L’email n’est pas appliqué avant validation. | Part des créations de compte motivées par une utilité comprise. |
| ACC-01 | Accueil — centrale | Travail du jour avant le contenu éditorial ; raccourcis semaine/routines, prochaine occasion, dernier look réalisé. | Une action utile au retour, pas seulement une ouverture. |
| ACC-02 | Semaine — centrale à tester | Sept jours lisibles ; trois propositions remplaçables avec dates modifiables ; confirmation avant ajout ; pas d’écrasement des routines ou occasions. | Propositions gardées puis réellement utilisées. |
| ACC-03 | Journée — centrale | Routines dues, looks datés et occasions du jour ; note facultative par date ; cases cohérentes avec les séances. | Réalisation, report ou retrait compris sans aide. |
| ACC-04 | Messages — secondaire | Chaque message ouvre le bon objet ; aucun faux appel à revenir pour gonfler l’activité. | Action utile après ouverture, fréquence ressentie comme acceptable. |
| ANA-01–03 | Exploration — contextuelle | Point d’entrée « Mes repères beauté », domaine clair, fonctionnement expliqué. Un brouillon se reprend ou se remplace explicitement. | Compréhension de l’utilité et du caractère simulé. |
| ANA-04–06 | Photo — contextuelle | Photo facultative, sans portrait d’exemple trompeur. Elle peut être réutilisée pour une simulation de coupe, mais n’est pas interprétée par le mockup. Continuer avec ses réponses fonctionne réellement. | Réussite avec et sans photo ; refus sans impasse. |
| ANA-07–09 | Réponses et aperçu — contextuelle | Questions liées au domaine, réponses réutilisées ; correction produisant un nouveau compte rendu. Pas de vente imposée avant de comprendre les pistes. | Une piste essayée après le questionnaire. |
| ANA-10–12 | Comptes rendus — contextuelle | Seulement les domaines demandés ; origine des pistes ; historique daté, versions conservées, retrait individuel. | Réutilisation d’un repère pour choisir un look. |
| DEC-01–02 | Recherche — centrale | Recherche sans sensibilité aux accents, peu d’options visibles, filtres dans un panneau, état vide qui permet d’élargir. Le contexte d’une occasion reste visible. | Recherche réussie et premier contenu pertinent ouvert. |
| DEC-03 | Fiche de look — centrale | Une action principale, durée, moyens nécessaires, contexte, favori immédiat. Les références de coupe sont identifiées comme préparation au salon. | Décision « je peux le faire » puis réalisation. |
| DEC-04 | Tutoriels — à venir | Aperçu du futur fonctionnement, sans lancer un faux guide ni créer une progression. | Intérêt déclaré et besoin d’un vrai tutoriel vidéo. |
| DEC-05 | Conseil éditorial — secondaire | Conseil court relié à une action sur les couleurs, enregistrable. | Réutilisation concrète ; sinon réduire les articles autonomes. |
| DEC-06 | Produit — contextuelle | Pastilles et descriptions de nuances près du choix ; produit associé à une vraie routine ; fin du produit générique relié à tous les looks. | Compréhension du rendu et du choix de variante. |
| HAI-01 | Cheveux — centrale | Coiffures, coupes et couleurs distinctes ; textures variées ; une coupe ne promet pas une transformation domestique de cinq minutes. | Pertinence selon texture, longueur et entretien réel. |
| COL-01–02 | Couleurs — contextuelle | Familles chaudes, fraîches et neutres ; nuance puis association ; la bonne palette se retrouve dans les favoris. | Réutilisation avec ses vêtements ; confusion avec une analyse objective. |
| MAQ-01 | Maquillage — à venir | Aperçu relié au profil couleur, sans recommandation ou tutoriel prétendument disponible. | Intérêt pour les occasions, le temps disponible et l’option sans maquillage. |
| PEA-01 | Rituels — contextuelle | Accès direct aux routines et ressentis ; aucun diagnostic inventé. | Gestes personnels retrouvés avec moins d’effort. |
| GAR-01–04 | Garde-robe — à venir | Aperçu expliquant l’ajout progressif de pièces, les associations et la préparation par date, sans ouvrir d’éditeur inachevé. | Temps de saisie acceptable avant la première tenue utile. |
| ROU-01–02 | Routines — centrale | Actives séparées des autres ; gestes visibles, une action de démarrage ; activation/désactivation compréhensible. | Routine retrouvée puis reprise plusieurs semaines. |
| ROU-03–04 | Édition et séance — centrale | Fréquence effective, trois jours choisis ou rythme hebdomadaire ; une séance commencée conserve sa version des gestes ; séance partielle conservée. | Charge d’édition, cohérence des jours, reprise après absence. |
| EVE-01–03 | Occasions — centrale | Liste triée, terminés séparés, calendrier avec bons jours et tous les événements ; trois champs initiaux. | Occasion créée puis préparation retrouvée au moment utile. |
| EVE-04–05 | Composition et préparation — centrale | Choix adaptés au domaine, favoris disponibles sans perdre l’occasion ; remplacer un élément réinitialise sa préparation ; tutoriel lié à l’événement. | Look complet ou volontairement partiel utilisable le jour prévu. |
| SAV-01–03 | Favoris — centrale | Un appui pour garder, classement proposé ensuite ; retour à l’inspiration, recherche et collections indépendantes. | Inspiration retrouvée, puis utilisée au lieu d’un stockage passif. |
| PRO-01–03 | Journal — secondaire volontaire | Historique entier, recherche, modification/suppression d’une observation ; comparaison entre deux éléments clairement nommés ; séances consultables. | Valeur déclarée du journal, effort de saisie, réouverture de notes. |
| PRO-04–06 | Habitudes et objectifs — secondaire | Comptage des séances réalisées, pause et clôture distinctes ; aucun score d’apparence, aucune série punitive. | Compréhension du comptage et utilité au-delà du calendrier. |
| PRF-01–03 | Profil et goûts — contextuelle | Profil allégé ; réglages de goût à part ; brouillons appliqués seulement après validation ; retours sur les looks réinitialisables. | Sentiment de contrôle, pertinence après modification. |
| PRF-04–05 | Réglages et rappels — contextuelle | Catégories et horaires choisis ; désactivation facile ; commandes de simulation sorties du téléphone. | Rappel jugé utile, fréquence des désactivations. |
| PRF-06, PRE-01–04 | Premium — contextuelle | Valeur exposée par une semaine consultable ; mensuel/annuel explicites, restauration et retour à la tâche. Tous les parcours restent ouverts dans le prototype. | Bénéfice compris sans explication et usage après souscription simulée. |
| PRF-07–09 | Données — indispensable | Inventaire, export et retrait par catégorie, compte entier séparé. Retirer les routines ne supprime plus les actions personnelles ou les looks planifiés. | Suppression sans surprise, confiance et compréhension du périmètre. |
| PRF-10–11 | Aide et documents — indispensable | Questions concrètes, demande avec message nécessaire, documents ouverts au bon onglet. | Problème résolu sans assistance externe. |
| ESS-01–03 | Essayage illustratif — secondaire | Image source séparée de l’analyse, référence conservée, tutoriel du bon look. Limite de la simulation visible. | À réévaluer avec une vraie technologie ; ne pas en faire la raison principale de payer aujourd’hui. |
| ACH-01 | Vendeurs externes — secondaire | Distinction vendeur/Beautify compréhensible, aucune fausse disponibilité locale. | Besoin réel de redirection et confiance dans la destination. |
| ACH-02–07 | Boutique intégrée — secondaire | Panier visible, quantités et total, commande en attente distincte du panier suivant, détails accessibles. | À développer commercialement seulement si elle simplifie l’achat. |

## Les décisions de contenu

**Une idée doit être faisable.** Chaque fiche doit répondre à : résultat recherché, durée, matériel, produits déjà possédés, texture ou contexte utile, étapes et alternatives. Le prototype commence cette structure. Les textes de tutoriels restent courts et éditoriaux : une version commerciale demanderait des contenus effectivement démontrés, vérifiés et entretenus.

**Des looks différents doivent vraiment produire des choix différents.** Les onglets ne changent plus seulement leur apparence. Les nuances fraîches et neutres complètent les tons chauds. Le maquillage facultatif est traité comme une vraie envie. Les portraits IA élargissent les références, sans attribuer des propriétés physiques ou des préférences aux personnes qui les consultent.

**L’utilisatrice peut contredire la proposition.** « Pas pour moi » réduit l’exposition dans les suggestions, sans rendre le catalogue inaccessible. « À refaire » augmente la priorité d’une idée ; « À adapter » ouvre une note préremplie qu’elle peut modifier. Ce sont des règles simples, explicables et réinitialisables.

**Une réussite ne doit pas créer une nouvelle corvée.** Le favori ne force plus à créer une collection. Le tutoriel ne force pas à tenir un journal. La semaine ne nécessite pas de renseigner tout un dressing. Les champs secondaires sont facultatifs et accessibles par un intitulé qui dit ce qu’ils contiennent.

**La confiance doit rester distincte de la mise en scène.** Aucun avis client inventé, aucune promesse de diagnostic, aucune note de beauté et aucun avant/après présenté comme un effet observé. Les produits et prix sont fictifs. Les photos importées restent en mémoire de la page ; les choix textuels appartiennent à la session de l’onglet.

## Pourquoi revenir et pourquoi payer

La boucle proposée est : choisir quelque chose de faisable → le garder ou le prévoir → le retrouver au bon moment → l’essayer → indiquer ce qui convient → préparer la prochaine occasion. Le contenu s’accumule comme une mémoire utile de goûts, de pièces et de gestes, à condition d’être réellement réutilisable.

La proposition Premium à tester est désormais plus resserrée : **dix simulations de coupes par mois**, contre une simulation de découverte gratuite. Le profil 12 saisons et le rituel de peau donnent de la valeur avant le paiement. Les favoris et l’historique rendent ensuite les choix réutilisables. Il reste à vérifier que dix essais correspondent à un besoin réel et que la qualité du rendu justifie le prix ; le quota ne suffit pas à créer de la rétention si les simulations déçoivent.

Les prix affichés, 9,99 € par mois et 59,99 € par an, sont des hypothèses de maquette. Ils ne sont pas validés par les recherches. Le montant annuel complet est visible, ainsi que son équivalent mensuel approximatif. Aucun compte à rebours, faux rabais, faux essai ou renouvellement réel n’est ajouté.

Le prototype expose tous les parcours pour permettre leur évaluation. Il illustre une distinction Découverte/Premium sans verrouiller les fonctionnalités ni déclencher une facturation. Les droits commerciaux définitifs, le paiement réel et les modalités contractuelles restent un travail de produit séparé.

Le bon moment de la proposition payante est à tester après la simulation de découverte ou au moment où un deuxième essai est demandé. Un abonnement actif reçoit immédiatement dix nouveaux essais ; un quota Premium épuisé affiche sa date de renouvellement sans renvoyer au paiement. La mesure doit inclure la qualité perçue, l’usage du quota, les abandons et les renouvellements, pas seulement les souscriptions initiales.

## Ce qui serait inutile ou prématuré

- Une nouvelle analyse de visage chaque semaine sans changement pertinent : cela créerait une répétition artificielle. Préférer une nouvelle envie ou occasion explicite.
- Un journal imposé après chaque geste : l’effort peut dépasser son bénéfice. Il reste volontaire.
- Un inventaire complet du dressing avant la première tenue : trop de travail avant la valeur. Commencer avec quelques pièces.
- Des objectifs en doublon avec la simple routine : garder cette couche secondaire et la réduire si personne ne l’utilise.
- Une boutique intégrée complète avant de comprendre le besoin d’achat : elle ajoute livraison, service et retours à un produit dont le cœur est encore à valider.
- Des simulations impressionnantes mais peu fiables : elles doivent aider à décider. Leur nouveauté seule ne démontre pas un abonnement durable.
- Des séries quotidiennes, alertes répétées ou culpabilisation sur l’apparence : elles seraient incohérentes avec « à votre rythme » et ne prouvent pas une valeur utile.

## Comment vérifier l’intérêt réel

### Première étude : accomplir les tâches

Faire une petite première série d’entretiens avec des utilisatrices aux situations variées, puis une seconde après correction. Ne pas présenter cela comme un échantillon représentatif ni comme une validation statistique.

Leur demander, sans guider les clics : trouver une idée faisable aujourd’hui ; la garder et la retrouver ; préparer une occasion sans maquillage ; adapter une routine ; reporter un moment ; retrouver une ancienne observation ; expliquer Premium ; annuler une action ou retirer une donnée précise.

Observer le premier choix, les hésitations, retours inutiles, incompréhensions et demandes d’aide. Demander ensuite « à quel moment cela vous aurait servi récemment ? » et « qu’utiliseriez-vous à la place ? ». Une appréciation visuelle positive n’est pas une preuve de besoin.

### Deuxième étude : usage dans la durée

Pour une bêta consentie et techniquement persistante, suivre plusieurs semaines et distinguer les personnes venues pour le quotidien de celles venues pour une occasion. Une utilisatrice qui prépare un événement mensuel ne doit pas être jugée comme inactive parce qu’elle n’ouvre pas l’application chaque jour.

| Hypothèse | Mesure à définir avant le test | Lecture utile |
|---|---|---|
| La première séance donne une valeur concrète | Part des nouvelles utilisatrices qui réalisent ou préparent une tâche utile, par intention d’entrée | Évite de confondre visite et activation. |
| Les favoris servent réellement | Part des contenus enregistrés retrouvés puis utilisés | Détecte un simple cimetière d’inspirations. |
| La semaine réduit l’effort | Idées acceptées, modifiées, puis utilisées ; effort déclaré par rapport à la méthode habituelle | Vérifie le bénéfice de planification. |
| Les recommandations s’améliorent | Retours de pertinence et utilisation après ajustement ; fréquence de « Pas pour moi » | Évite de mesurer seulement les clics. |
| Les routines restent utiles | Reprise sur plusieurs semaines et après pause, selon le rythme choisi | N’impose pas une fréquence quotidienne. |
| Premium mérite son prix | Bénéfice reformulé, conversion, usages après achat, renouvellement, résiliation et motif | La conversion seule peut masquer une déception. |
| La simplicité augmente la confiance | Erreurs, aide demandée, retraits accidentels, facilité d’annulation | Suit l’utilité et le contrôle ensemble. |

Les taux de référence doivent venir des premiers usages de Beautify et être segmentés par besoin. Ne pas transformer arbitrairement un benchmark RevenueCat en objectif garanti. Aucune collecte analytique externe n’est ajoutée au mockup.

## Vérifications de cette version

Les contrôles automatisés de source couvrent les 82 vues dans 738 combinaisons de rendu à données vierges ou d’exemple et états de démonstration. Les transitions et règles métier sont vérifiées sur 95 scénarios ciblés : retours, favoris, événements, routines de peau, versions de séances, notes datées, historique, panier, préférences, compte, simulation, semaine, quotas gratuit et Premium, renouvellement mensuel, limites « bientôt », les trois studios d’analyse et le parcours colorimétrique en 12 saisons.

Ce sont des contrôles de code et de modèle, pas des sessions avec des utilisatrices ni une validation visuelle en navigateur. Le téléphone conserve un espace de dessin de 393 × 852, uniformément réduit pour tenir dans la fenêtre ; le défilement principal reste à l’intérieur de l’interface du téléphone.

Le livrable est un prototype interactif. Il permet maintenant de tester la valeur et les parcours avec beaucoup moins de frictions connues. La preuve de conversion et de fidélisation doit venir de l’usage réel.


## Suite appliquée — rendre le contenu utilisable

Cette passe prolonge la revue sans ajouter de destination principale :

- Les spécifications éditoriales des références de looks sont conservées pour la suite, mais aucun tutoriel guidé ne peut être lancé dans la V1.
- Les accès aux tutoriels conduisent vers un aperçu « Bientôt » ; ils ne créent ni progression, ni séance réalisée, ni tâche d’occasion terminée.
- Les enregistrés séparent « Tous », « À refaire » et « Collections ». Le choix « À refaire » conserve aussi le look pour que cette intention puisse être retrouvée. La recherche fonctionne au fil de la saisie, sans sensibilité aux accents.
- Les routines de peau disposent de deux points de départ modifiables : essentiels du matin et fin de journée. La routine « tenue prête pour demain » reste visible comme aperçu de la future garde-robe, sans ouvrir d’éditeur.
- Les retours entre pages conservent la date consultée, le filtre ou l’objet en cours d’édition. Une palette ajoutée à une collection conserve désormais exactement la variante affichée.

Les modèles de soin reprennent un petit nombre de principes généraux de l’[American Academy of Dermatology, Skin care on a budget](https://www.aad.org/public/everyday-care/skin-care-basics/care/skin-care-budget) : nettoyage doux, hydratation et protection solaire. La source est accessible depuis ces modèles. Il ne s’agit pas d’un protocole personnalisé ni de la recommandation d’un nouveau traitement.

Les futurs tutoriels de coiffure, maquillage et tenue restent des contenus éditoriaux à faire évaluer avant implémentation. Les prochains tests devront déterminer si des étapes textuelles suffisent, et quels gestes gagneraient à être montrés dans une vidéo. NN/g souligne l’intérêt de proposer des formats complémentaires lorsque la tâche le demande ([Videos as Instructional Content](https://www.nngroup.com/articles/instructional-video-guidelines/)). Aucune vidéo artificielle ou fausse démonstration n’a été ajoutée.

## Suite appliquée — trois studios complémentaires

Le mockup présente désormais Beautify comme une application beauté et style complète, organisée autour de trois moteurs visibles dès l’accueil et l’entrée « Pour moi » : Hair Studio, Color Studio et Skin Studio.

- Hair Studio sépare quatre meilleures correspondances d’un catalogue de douze références filtrables. Texture, longueur, forme déclarée, niveau de changement, frange et entretien influencent le classement. La découverte inclut un essai ; Premium en inclut dix par mois. Un échec, une réouverture ou une comparaison ne consomme rien.
- Color Studio détermine une saison parmi douze, regroupées en quatre familles : Spring, Summer, Autumn et Winter. Le résultat explique quatre axes — température, profondeur, intensité et contraste — puis fournit couleurs principales, neutres, comparaisons, alternatives proches et orientations de couleur de cheveux. L’utilisatrice peut refaire l’analyse ou explorer les autres saisons, mais l’exploration ne remplace jamais silencieusement son résultat.
- Skin Studio transforme les réponses déclarées en une proposition concrète matin/soir. L’utilisatrice choisit de l’ajouter à ses routines ; ses routines existantes ne sont pas écrasées silencieusement. En cas de sensibilité souvent ressentie, une garde-fou invite à arrêter lors d’une réaction persistante et à demander conseil. Le prototype n’affiche ni diagnostic médical ni score de valeur personnelle.

Ces trois studios utilisent le même parcours facultatif de photo et de consentement, mais conservent des questionnaires et des résultats distincts. Dans le mockup, aucune photo n’est interprétée : le résultat dépend des réponses. Une photo de coupe importée et encore disponible en mémoire peut être reprise dans Hair Studio. Depuis Color Studio, les accès au maquillage et à la garde-robe ouvrent leur aperçu « Bientôt ».

## Périmètre V1 — fonctionnalités annoncées

Tutoriels guidés, maquillage et garde-robe restent volontairement visibles pour rendre la trajectoire du produit compréhensible, sans les faire passer pour des fonctionnalités déjà disponibles.

- Chaque univers possède un écran d’aperçu cohérent avec le design system, une liste courte de bénéfices futurs et une action réversible « Garder cette nouveauté ».
- Les cartes de catalogue, favoris, résultats de recherche, routines et occasions redirigent vers cet aperçu au lieu d’ouvrir un éditeur ou un guide inachevé.
- La préparation d’une occasion accepte uniquement une coiffure dans la V1. Maquillage et tenue y sont indiqués comme prochaines extensions.
- L’écran Premium sépare explicitement ce qui est disponible maintenant de ce qui arrive bientôt, afin de ne pas vendre une promesse comme un avantage actuel.
- L’intérêt pour une fonctionnalité est conservé localement et décrit honnêtement comme tel. Aucun email, notification réelle ou date de sortie n’est annoncé. Le retour ramène à la page exacte d’origine.

## Suite appliquée — parcours complet en 12 saisons

Le système simplifié « chaudes / fraîches / neutres » est remplacé par les douze saisons déjà structurées dans le domaine Beautify : Bright, Warm et Light Spring ; Light, Cool et Soft Summer ; Soft, Warm et Deep Autumn ; Deep, Cool et Bright Winter.

- Le questionnaire utilise quatre axes déclarés comme repères explicatifs. La photo n’est pas interprétée dans le mockup. Si aucun axe n’est renseigné, aucune saison n’est inventée et l’utilisatrice est invitée à compléter ses repères.
- Le compte rendu affiche une bande qualitative — profil indicatif ou correspondance cohérente — sans présenter un pourcentage comme une précision scientifique.
- La palette complète sépare couleurs principales et neutres. Une interaction « Cette couleur est-elle pour moi ? » montre les trois états prévus : dans la palette, proche ou éloignée, avec une alternative plus cohérente.
- Les couleurs difficiles ne sont jamais formulées comme des interdictions. Chaque comparaison explique une nuance alternative et rappelle que l’utilisatrice garde le dernier mot.
- Les recommandations de couleur de cheveux restent des orientations à discuter au salon et conduisent naturellement vers Hair Studio.
- Maquillage, garde-robe et tutoriels montrent désormais un aperçu réaliste et personnalisé par la saison déjà connue. Ils portent clairement la mention « Bientôt », ne lancent aucun éditeur et ne sont pas vendus comme un avantage actuel de Premium.

## Passe d’audit client — corrections appliquées

Les tests de navigation par profils ont conduit à corriger les points de rupture les plus risqués : quota incohérent après souscription, profil couleur inventé malgré quatre réponses inconnues, résultat peau sans effet sur la routine, portrait d’exemple incompatible avec les consignes, photo temporaire encore considérée comme disponible après actualisation, répétition des mêmes cartes « Bientôt », et ouverture d’un ancien rapport couleur qui remplaçait silencieusement le profil actif.

Les sauvegardes de saison sont maintenant de vrais éléments retrouvables. Un ancien rapport sans saison est identifié comme tel au lieu d’afficher le profil actuel. Les noms des saisons sont bilingues, les quatre axes sont nommés, « À éviter » devient « À comparer », et les petites légendes fonctionnelles du parcours couleur ont été remontées à une taille lisible. La destination « Pour moi » est renommée « Analyses » et Découvrir ordonne les trois studios disponibles selon les intérêts choisis à l’onboarding.
