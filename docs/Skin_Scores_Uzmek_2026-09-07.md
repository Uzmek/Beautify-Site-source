# Bilan Peau — scores et audit du dépôt UZMEK

Inspection du dépôt privé `Uzmek/Beautify`, révision `bef258e42971f7e5c7864e7b63e0f06d5d7b8d26`, le 7 septembre 2026. Inspection du code, sans exécution du service distant.

## Ce qui existe réellement

- `services/vision/src/vision/classifiers/skin_report.py` : quatre scores entiers de 0 à 100, toujours « élevé = signe moins marqué ». Rougeurs (`redness`), uniformité (`evenness`), brillance (`shine`), cernes (`underEye`). Score global pondéré respectivement à 30 %, 30 %, 20 %, 20 %. Seuils de présentation : favorable dès 70, attention de 45 à 69, action en dessous de 45.
- `services/vision/src/vision/extractors/skin_appearance.py` : mesures de différences dans l’image, sur des régions du visage ; pas une comparaison à une couleur de peau de référence. Le code indique explicitement des seuils vérifiés sur quelques selfies, pas une calibration validée.
- `services/vision/src/vision/pipelines/skin_analysis.py` : contrôle de qualité de la photo, mesures, scores, puis étape IA facultative. L’IA n’a pas le droit de remplacer les chiffres. Elle reçoit la photo et les mesures, ajoute les résumés, un type de peau observé et éventuellement un âge apparent. Les estimations signalées incertaines sont effacées.
- `apps/mobile/src/features/skin-analysis/components/report/score-section.tsx` : score global, photo, type, âge apparent facultatif, résumé et variation depuis la précédente analyse.
- `apps/mobile/src/features/skin-analysis/components/report/metrics-section.tsx` : quatre cartes avec score, commentaire et delta. Accès à la routine.
- `apps/mobile/src/features/skin-analysis/screens/report-screen.tsx` : lecture des résultats enregistrés. Deux panneaux Score/Metrics ; routine quotidienne sur une route séparée. Comparaison uniquement si une analyse précédente existe.

## Ce qui n’est pas un score implémenté

Aucun champ de score d’acné, d’hydratation, de pores ou de rides dans le contrat actuel `schemas/skin_analysis.py`. Les points rouges peuvent influencer le signal de rougeur, mais cela ne constitue pas un diagnostic ou un score d’acné. L’IA peut décrire des signes visibles avec prudence ; le prompt lui interdit d’affirmer une maladie.

Attention à une incohérence avant branchement en production : `ai/skin_prompt.py` transmet au modèle des bandes à 80/60/40, alors que le moteur et l’interface utilisent 70/45. Les qualificatifs peuvent diverger pour le même score. Harmoniser les deux couches et valider la stabilité entre photos comparables.

## Modification du mockup

- Bilan remplacé par un score global, quatre jauges tactiles et une explication courte dans une fenêtre refermable.
- Matin/Soir et le retour au parcours après le paywall restent en place.
- Contrat `result.skin` aligné sur les clés du dépôt. Fixture stable : 72, 64, 81, 55 ; moyenne pondérée 68. Source `demo/skin-v1` enregistrée avec chaque nouveau résultat.
- « Exemple » et « Scores illustratifs · votre photo n’a pas été analysée » restent affichés. Les anciens résultats sans chiffres affichent l’exemple sans créer de mesures historiques fictives.
- Les deltas ne comparent que deux enregistrements chiffrés de même provenance. Aucun gain n’est fabriqué après une nouvelle analyse.
- Aucun appel réel à ChatGPT, Gemini ou au moteur vision n’est ajouté au Site statique. Pas de diagnostic, de pourcentage d’acné ou de mesure physiologique d’hydratation inventés.

## Repères externes consultés

- [Perfect Corp — contrat AI Skin Analysis](https://docs.perfectcorp.com/reference/ai_skin_analysis) : scores par catégorie et masques de détection. Ce fournisseur spécialisé propose notamment des catégories pores, texture et acné. Cela ne prouve pas qu’un modèle vision généraliste produit des scores équivalents.
- [American Academy of Dermatology — applications de santé cutanée](https://www.aad.org/public/fad/digital-health/apps) : intérêt du suivi, prudence envers le diagnostic fourni par des applications.

Pour la vraie V1 : garder le moteur comme source des chiffres, relier les commentaires IA à ces chiffres, permettre une réponse « non évaluable » et valider les critères supplémentaires avant de les afficher comme mesures. Un score sur 100 est un indice d’apparence, pas une proportion de peau malade ni une probabilité de diagnostic.
