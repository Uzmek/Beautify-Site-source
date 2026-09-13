# Déblocage direct et vues peau — 7 septembre 2026

- La page de confirmation PRE-02 est supprimée. Le bouton du paywall appelle directement l’activation simulée existante, puis reprend l’activité conservée.
- Les anciens liens PRE-02 reviennent aux offres sans activer l’accès. La page n’est plus proposée dans l’explorateur.
- Prix, quotas, états d’erreur et d’attente et mention « Démo · aucun débit réel » sont conservés.
- Matin / Soir / Bilan restent trois onglets explicites. Le rapport peau remplit la hauteur disponible du téléphone ; la liste des soins adapte ses cartes à cet espace et les actions restent visibles.
- La date répétée et le libellé de produit non choisi répété sont retirés du rapport compact. Le nom du produit, le rôle du soin, ses détails et sa modification restent accessibles.
- Le Bilan affiche directement les trois priorités, sans accordéon ni blocs de faits redondants.

## Vérification

Navigateur réel, téléphone logique 393 × 852, données fictives du mockup. Photo : portrait éditorial fourni dans le projet, aucun moteur d’analyse externe ni paiement réel.

| Vue | Défilement du contenu principal | Défilement du panneau | Défilement de la liste |
| --- | --- | --- | --- |
| Matin, 3 soins + proposition | Aucun : 698 / 698 px | Aucun : 478 / 478 px | Aucun : 219 / 219 px |
| Soir, 3 soins | Aucun : 698 / 698 px | Aucun : 478 / 478 px | Aucun : 267 / 267 px |
| Bilan, 3 priorités | Aucun : 698 / 698 px | Aucun : 478 / 478 px | Sans objet |

Ajout de soins et application de la proposition testés par les contrôles visibles. Déblocage mensuel testé depuis le rapport Peau : retour immédiat au même rapport, sans page de confirmation.

11 contrôles automatisés de continuation après activation, 63 contrôles de parcours, 13 contrôles de routine, et 725 états de vues sans erreur. Ces contrôles automatisés ne remplacent pas les captures navigateur présentes ici.

Pour une routine longue ou le mode de réorganisation, la liste peut défiler à l’intérieur du panneau afin de conserver les noms lisibles et les commandes accessibles. Aucun contenu utilisateur n’est tronqué pour forcer artificiellement une vue sans défilement. Les gestes sur appareil physique et les réglages de texte système n’ont pas été vérifiés.
