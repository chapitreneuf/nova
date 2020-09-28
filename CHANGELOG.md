# Changelog Nova

## 1.2.8 (28/09/2020)

* Revert de la modification de 1.2.5 : macros_publications.html n'est plus une dépendance commune.
* Modification de l'ordre d'appel et d'initialisation des macros. Corrige le problème de certaines macros non-surchargeables dans macros_custom.html.

## 1.2.7 (22/09/2020)

* Suppression d'un élément en double (section.home-latest-issue).

## 1.2.6 (22/09/2020)

* Correction du chemin des webfonts : introduction de la variable LESS @webfontsDir qui change selon qu'on utilise LESS côté serveur ou browser.

## 1.2.5 (22/09/2020)

* macros_publications.html devient une dépendance commune (appelée une fois pour toutes dans macros_page.html). Cela corrige le problème de certaines macros non-surchargeables dans macros_custom.html.
* Fonction BASE_ACCROCHE_PUBLICATION : ajout de la possibilité de faire pointer le lien sur l'image vers l'#ID de l'imageaccroche en renseignant "self" dans l'attribut HREF.

## 1.2.4 (17/09/2020)

* Correction de l'affichage de la référence papier
* Correction du chemin de la webfont par défaut (#75)

## 1.2.3 (30/07/2020)

* Correction du fil d'ariane sur les images d'accroche.
* Déplacement de l'appel des webfonts dans une feuille de styles fonts.less afin de permettre leur écrasement.

## 1.2.0 à 1.2.2 (21/07/2020)

Ajout de la variable `[%DEV_MODE]` qui lorsqu'elle est vraie permet l'exécution de LESS dans le navigateur (à utiliser pendant le développement uniquement).

## 1.1.0 (18/05/2020)

La mise à niveau depuis une version antérieure requiert de mettre à jour les traductions du site.

* Support de l'affichage des timelines Twitter à partir d'une URL (barre latérale et page du fil de syndication).
* Harmonisation de l'indentation du code.
* Ajout d'un fichier de configuration `.editorconfig`.
* Correction du fonctionnement du paramètre `NO_ARROW` de la fonction `BASE_SECTION_HEADER`.

## 1.0.5 (27/04/2020)

* Compatibilité avec Node.js versions 0.10 et 0.12 (downgrade de LESS, passage des dépendances non bloquantes en optionalDependencies).

## 1.0.4 (15/04/2020)

* Création du CHANGELOG.
* Correction des problèmes d'affichage de la barre de raccourcis ARTICLE_RACCOURCIS (#70).
* Remplacement de la fonction BASE_SECTION_HEADER_NO_ARROW par un paramètre à la fonction BASE_SECTION_HEADER.
* Ajout d'une tâche NPM "gulp" pour assurer la compatibilité avec les scripts conçus pour la Prima.
