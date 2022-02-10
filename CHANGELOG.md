# Changelog Nova

## 1.6.1 (10/02/22)

* Correction du positionnement des notes marginales (#100).
* Corrections mineures de styles.
* Correction d'un paramètre dans PUBLICATION_LI_DOCUMENT.

## 1.6.0 (08/10/21)

* Amélioration de l'import des pages web dans Zotero.
* Ajout des métadonnées OpenGraph et Twitter.
* Ajout des métadonnées Highwire Press (Google Scholar) pour les articles.
* Ajout des métadonnées COinS pour les sommaires des publications.
* Correction du filtrage des métadonnées dans le head.
* Correction du protocole :443 encore présent dans certaines URL.

## 1.5.2 (09/07/21)

* Correction de la taille des logos partenaires.

## 1.5.1 (23/06/21)

* Affichage de l'index editeurscientifique dans les articles (#93).
* Traduction du titre du numéro courant dans le fil d'ariane (#94).
* Découpage des URL dans les liens afin d'éviter les débordements de colonne (#88).
* Correction de l'affichage des sous-titres dans la table des matières (#92).
* Ne pas afficher les documents annexes s'ils n'ont pas de titre.

## 1.5.0 (03/05/21)

* Amélioration des titres dans la table des matières : ajout du sous-titre, ajout de la date de publication dans les rubriques (#86).
* Ajout des styles des notes de fin dans les articles.

## 1.4.1 (21/04/21)

* Corrections d'ancres (#87).
* Correction de l'ordre des métadonnées (#90).
* Correction du markup de la page tous les numéros (#85).

## 1.4.0 (30/03/21)

* Ajout de l'option MENU_MAX_ISSUES.
* Ajout d'une marge pour le menu avec l'identifier "suivez-nous" (#83).
* Correction de l'année de publication dans le fil d'ariane (#82).

## 1.3.5 (16/03/21)

* Correction d'une vulnérabilité présente dans toutes les versions précédentes. La mise à niveau de la Nova vers la version 1.3.5 est fortement conseillée.
* Ajout d'une pagination en haut de la page "Tous les numéros".

## 1.3.4 (04/02/21)

* Compatibilité avec Métopes version 2.3 : affichage correct des sauts de lignes séparant les différentes affiliations d'un même auteur.

## 1.3.3 (14/12/20)

* Correction des URLs dans les flux RSS (suppression du protocol ajouté dans certains contextes).
* Ajout des variables de traductions en Espagnol, Italien et Portuguais.

Mise à niveau depuis la version 1.2.x : voir "Version 1.3.0" ci-dessous.

## 1.3.2 (27/11/2020)

* Masquer le lien vers le générateur de PDF sur les articles non publiés (#77).
* Correction de l'affichage des références papier (#78).
* Branche "outils" : correction de l'import TEI du champ "chapo" (#74).

Mise à niveau depuis la version 1.2.x : voir "Version 1.3.0" ci-dessous.

## 1.3.1 (06/10/2020)

* Support du générateur de PDF https://github.com/edinum/pdfgen : intégration du bouton de téléchargement sur la page article.

Mise à niveau depuis la version 1.2.x : voir "Version 1.3.0" ci-dessous.

## 1.3.0 (01/10/2020)

* Utilisation des options "extra" (voir [lodel-options-extra](https://github.com/edinum/lodel-options-extra)) comme méthode conseillée pour renseigner le préfixe du DOI, le nom et l'URL du portail. Les méthodes d'insertion précédentes sont toujours supportées, bien que dépréciées.
* Le lien vers le portail ne s'affiche que si les informations le concernant existent.

Mise à niveau depuis la version 1.2.x :

* Exécuter le script d'upgrade sur le site [lodel-options-extra](https://github.com/edinum/lodel-options-extra)
* Renseigner les options "Préfixe des DOI", "Nom du portail" et "URL du portail" dans les Options du site > Extra.
* Supprimer la définition de ces informations du template de personnalisation `tpl/macros_custom.html`.

## 1.2.8 (28/09/2020)

* Revert de la modification de 1.2.5 : macros_publications.html n'est plus une dépendance commune.
* Modification de l'ordre d'appel et d'initialisation des macros. Corrige le problème de certaines macros non-surchargeables dans macros_custom.html.
* Agrandissement de la taille des couvertures.

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
