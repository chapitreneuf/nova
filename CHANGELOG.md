# Changelog Nova

## Version 2.x

### 2.0.4 (12/12/2022)

* Ajout d'options pour l'affichage de la plateforme dans la topbar : logo, position, affichage optionnel du texte au survol.
* Amélioration des tableaux pour un meilleur affichage des exemples linguistiques.
* Amélioration de l'affichage des logos partenaires.
* Correction de l'accessibilité des éléments `<nav>`.
* Correction des liens du footer qui apparaissaient en double en cas d'alias de traduction.
* Correction de la couleur de survol des liens du menu et de la topbar.

### 2.0.3 (08/12/2022)

* Masquage des titres des numéros "Varia" dans le menu principal.
* Affichage des numéros dans la liste des entités liées à une entrée d'index (dont directeurs de publication).
* Suppression de l'affichage de la date de publication sur les textes de type "informations" dans le sommaire.
* Amélioration de l'attribut title des boutons de partage de l'article.
* Correction de l'affichage de l'icône "lien externe" sur certains systèmes OSX.

### 2.0.2 (02/11/2022)

* Correction des intertitres des section annexe et bibliographie des articles.
* Ajout de variables pour la personnalisation des couleurs des intertitres du texte des articles.
* Affichage d'une flèche au survol des intertitres du texte des articles.

### 2.0.1 (01/11/2022)

* Corrections diverses de la feuille de style et des templates.
* Correction de la hauteur de la barre latérale.
* Éviter l'affichage de la barre latérale quand elle est vide.
* Correction d'un problème avec les variables @color-footer-link et @color-footer-link-hover.
* Suppression du mixin .include-font().
* Amélioration des styles de focus et de survol.

### 2.0.0 (20/10/2022)

Cette mise à jour majeure entraîne une incompatibilité des fichiers de personnalisation avec la version 1. Lire la documentation pour plus d'informations concernant la procédure de migration.

Améliorations générales :

* Réécriture intégrale des feuilles de styles pour une meilleure ergonomie et une modularité simplifiée.
* Ajout de nombreuses variables LESS pour une personnalisation plus fine.
* Refonte esthétique et typographique.
* Suppression de la webfont embarquée. La Nova utilise par défaut les polices standard du client.
* Ajout d'un mixin LESS .font-face() pour faciliter l'inclusion de webfonts.
* Suppression des boutons de zoom non-standard et prise en charge de la fonction zoom du navigateur.
* Rassemblement des options par défaut dans le fichier `default_options.html`.
* Ajout d'une barre supérieure pour l'affichage des icônes des réseaux sociaux.
* Modification du comportement d'affichage par défaut de la barre latérale droite.
* Ajout de marqueurs de sections près de la barre de défilement pour naviguer à l'intérieur des articles (dot-shortcuts). Par défaut cette interface remplace les anciens liens de sections.
* Affichage de la langue dans les titres traduits.
* Utilisation d'icônes SVG.
* Affichage responsive de iframes avec reframe.js.
* Ajout de la possibilité d'afficher des iframes dans les documents annexes.

Accessibilité :

* Amélioration générale de l'accessibilité. Les critères suivants du référentiel RGAA 4.1 ont été l'objet d'un travail : 1.3, 3.1, 3.2, 3.3, 5.4, 6.1, 8.2, 9.1, 9.2, 9.3, 10.7, 10.11, 11.1, 11.9, 12.2, 12.6, 12.7.
* Meilleure prise en charge des testes alternatifs des images.
* Association d'une légende aux figures.
* Meilleure utilisation des couleurs dans l'interface.
* Amélioration des contrastes par défaut.
* Ajout d'un outil de détection des contrastes faibles dans la maquette.
* Association d'un titre aux tableaux.
* Utilisation de liens explicites (ajout d'attributs `aria-label` et `aria-labelledby`).
* Icônes accessibles.
* Amélioration générale du markup HTML conformément aux standards du W3C.
* Amélioration de l'arborescence des titres.
* Utilisation des landmarks et des attributs role.
* Utilisation généralisée d'éléments de listes (li) dans les interfaces.
* Meilleur affichage de la prise de focus.
* Amélioration de l'accessibilité des liens, formulaires et boutons.
* Amélioration des liens d'évitement.
* Amélioration de la navigation au clavier.

Développement et maintenance :

* Mise à jour des dépendances.
* Mise à jour des dotfiles.
* Suppression du module frontend-dependencies.
* Suppression de less php.
* Renommage de `macros_custom.html` en `macros_custom.dist.html` et ajout d'une tâche pour créer le fichier `macros_custom.html` si nécessaire lors de l'initialisation du projet. Cela permet des mises à jour simplifiées de la Nova.
* Activation automatique du mode de développement si site.css n'existe pas.
* Subdivision de certaines macros LodelScript pour faciliter les surcharges.
* Ajout de fichiers .htaccess "deny from all" dans les répertoires qui ne sont pas destinés à un affichage public.

Correction de bugs :

* Correction de l'affichage des pages d'information en bas de page (footer-links), notamment en cas d'absence de documents dans la langue de navigation.
* Suppression de code inutile.

Régression :

* Abandon des variables de traduction dans les langues ES, IT, PT et RU. Seules les langues FR en EN ont été mises à niveau.

## Version 1.x

## 1.6.3 (14/04/22)

* Introduction de la variable LESS publicDir qui change selon l'environnement dev ou production.

### 1.6.2 (04/03/2022)

* Amélioration du positionnement des notes marginales (#89).
* Suppression du lien "Notes suivantes" dans les notes marginales.

### 1.6.1 (10/02/2022)

* Correction du positionnement des notes marginales (#100).
* Corrections mineures de styles.
* Correction d'un paramètre dans PUBLICATION_LI_DOCUMENT.

### 1.6.0 (08/10/2021)

* Amélioration de l'import des pages web dans Zotero.
* Ajout des métadonnées OpenGraph et Twitter.
* Ajout des métadonnées Highwire Press (Google Scholar) pour les articles.
* Ajout des métadonnées COinS pour les sommaires des publications.
* Correction du filtrage des métadonnées dans le head.
* Correction du protocole :443 encore présent dans certaines URL.

### 1.5.2 (09/07/2021)

* Correction de la taille des logos partenaires.

### 1.5.1 (23/06/2021)

* Affichage de l'index editeurscientifique dans les articles (#93).
* Traduction du titre du numéro courant dans le fil d'ariane (#94).
* Découpage des URL dans les liens afin d'éviter les débordements de colonne (#88).
* Correction de l'affichage des sous-titres dans la table des matières (#92).
* Ne pas afficher les documents annexes s'ils n'ont pas de titre.

### 1.5.0 (03/05/2021)

* Amélioration des titres dans la table des matières : ajout du sous-titre, ajout de la date de publication dans les rubriques (#86).
* Ajout des styles des notes de fin dans les articles.

### 1.4.1 (21/04/2021)

* Corrections d'ancres (#87).
* Correction de l'ordre des métadonnées (#90).
* Correction du markup de la page tous les numéros (#85).

### 1.4.0 (30/03/2021)

* Ajout de l'option MENU_MAX_ISSUES.
* Ajout d'une marge pour le menu avec l'identifier "suivez-nous" (#83).
* Correction de l'année de publication dans le fil d'ariane (#82).

### 1.3.5 (16/03/2021)

* Correction d'une vulnérabilité présente dans toutes les versions précédentes. La mise à niveau de la Nova vers la version 1.3.5 est fortement conseillée.
* Ajout d'une pagination en haut de la page "Tous les numéros".

### 1.3.4 (04/02/2021)

* Compatibilité avec Métopes version 2.3 : affichage correct des sauts de lignes séparant les différentes affiliations d'un même auteur.

### 1.3.3 (14/12/2020)

* Correction des URLs dans les flux RSS (suppression du protocol ajouté dans certains contextes).
* Ajout des variables de traductions en Espagnol, Italien et Portuguais.

Mise à niveau depuis la version 1.2.x : voir "Version 1.3.0" ci-dessous.

### 1.3.2 (27/11/2020)

* Masquer le lien vers le générateur de PDF sur les articles non publiés (#77).
* Correction de l'affichage des références papier (#78).
* Branche "outils" : correction de l'import TEI du champ "chapo" (#74).

Mise à niveau depuis la version 1.2.x : voir "Version 1.3.0" ci-dessous.

### 1.3.1 (06/10/2020)

* Support du générateur de PDF https://github.com/edinum/pdfgen : intégration du bouton de téléchargement sur la page article.

Mise à niveau depuis la version 1.2.x : voir "Version 1.3.0" ci-dessous.

### 1.3.0 (01/10/2020)

* Utilisation des options "extra" (voir [lodel-options-extra](https://github.com/edinum/lodel-options-extra)) comme méthode conseillée pour renseigner le préfixe du DOI, le nom et l'URL du portail. Les méthodes d'insertion précédentes sont toujours supportées, bien que dépréciées.
* Le lien vers le portail ne s'affiche que si les informations le concernant existent.

Mise à niveau depuis la version 1.2.x :

* Exécuter le script d'upgrade sur le site [lodel-options-extra](https://github.com/edinum/lodel-options-extra)
* Renseigner les options "Préfixe des DOI", "Nom du portail" et "URL du portail" dans les Options du site > Extra.
* Supprimer la définition de ces informations du template de personnalisation `tpl/macros_custom.html`.

### 1.2.8 (28/09/2020)

* Revert de la modification de 1.2.5 : macros_publications.html n'est plus une dépendance commune.
* Modification de l'ordre d'appel et d'initialisation des macros. Corrige le problème de certaines macros non-surchargeables dans macros_custom.html.
* Agrandissement de la taille des couvertures.

### 1.2.7 (22/09/2020)

* Suppression d'un élément en double (section.home-latest-issue).

### 1.2.6 (22/09/2020)

* Correction du chemin des webfonts : introduction de la variable LESS @webfontsDir qui change selon qu'on utilise LESS côté serveur ou browser.

### 1.2.5 (22/09/2020)

* macros_publications.html devient une dépendance commune (appelée une fois pour toutes dans macros_page.html). Cela corrige le problème de certaines macros non-surchargeables dans macros_custom.html.
* Fonction BASE_ACCROCHE_PUBLICATION : ajout de la possibilité de faire pointer le lien sur l'image vers l'#ID de l'imageaccroche en renseignant "self" dans l'attribut HREF.

### 1.2.4 (17/09/2020)

* Correction de l'affichage de la référence papier
* Correction du chemin de la webfont par défaut (#75)

### 1.2.3 (30/07/2020)

* Correction du fil d'ariane sur les images d'accroche.
* Déplacement de l'appel des webfonts dans une feuille de styles fonts.less afin de permettre leur écrasement.

### 1.2.0 à 1.2.2 (21/07/2020)

Ajout de la variable `[%DEV_MODE]` qui lorsqu'elle est vraie permet l'exécution de LESS dans le navigateur (à utiliser pendant le développement uniquement).

### 1.1.0 (18/05/2020)

La mise à niveau depuis une version antérieure requiert de mettre à jour les traductions du site.

* Support de l'affichage des timelines Twitter à partir d'une URL (barre latérale et page du fil de syndication).
* Harmonisation de l'indentation du code.
* Ajout d'un fichier de configuration `.editorconfig`.
* Correction du fonctionnement du paramètre `NO_ARROW` de la fonction `BASE_SECTION_HEADER`.

### 1.0.5 (27/04/2020)

* Compatibilité avec Node.js versions 0.10 et 0.12 (downgrade de LESS, passage des dépendances non bloquantes en optionalDependencies).

### 1.0.4 (15/04/2020)

* Création du CHANGELOG.
* Correction des problèmes d'affichage de la barre de raccourcis ARTICLE_RACCOURCIS (#70).
* Remplacement de la fonction BASE_SECTION_HEADER_NO_ARROW par un paramètre à la fonction BASE_SECTION_HEADER.
* Ajout d'une tâche NPM "gulp" pour assurer la compatibilité avec les scripts conçus pour la Prima.
