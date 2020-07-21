# Maquette Nova pour Lodel

> Maquette générique pour l'affichage des sites de revues avec Lodel 1.0. 

La maquette Nova est compatible avec [le modèle éditorial d'OpenEdition Journals](https://github.com/OpenEdition/oej.em) et utilise [les filtres Lodel développés par Edinum](https://github.com/edinum/lodel-textfunc).

En plus des champs habituellement supportés par le le modèle éditorial d'OpenEdition Journals, la maquette Nova permet l'affichage (optionnel) des données suivantes pour les articles :

* Le champ [#CHAPO]
* Les liens vers les fiches des auteurs dans les bases de données suivantes : IdRef, BNF, Orcid, HAL, Isni
* Le courriel des auteurs (déjà supporté par le ME OEJ mais non affiché).
* La mise en valeur d'un fichier TEI attaché à l'article.

## Installation

* Prérequis
  * Installation de lodel-textfunc: voir les instructions dans la branche outils de ce dépôt.
  * Optionnellement installer lessphp pour compiler le CSS (aussi présent dans la branche outils), ou bien utiliser la méthode node.js décrite plus loin.
* Installation
  * Créer un nouveau site depuis l'interface de lodel
  * Installer le template nova dans un dossier nommé tpl/ à l'intérieur du dossier du nouveau site
  * Compiler le CSS
* Traductions
  * utiliser les fichiers translations/translation-{fr,en}.xml fournis dans ce dépôt et les importer depuis l'interface du site lodel.
* Script d'ajout des champs au ME (optionel)
  * Voir la branche outils

## Personnalisation de la maquette d'un site

Les instructions ci-dessous vous permettent de personnaliser votre site tout en conservant la possibilité de mettre à niveau la maquette Nova facilement à posteriori. La maquette est conçue pour vous permettre d'isoler vos modifications du reste du code.

:warning: **Lors de la personnalisation d'un site, il est recommandé de n'éditer que les fichiers `macros_custom.html` et `less/custom.less` et de ne jamais modifier les autres fichiers de la maquette.**

Les deux fichiers `macros_custom.html` et `less/custom.less` (en plus des éventuelles images, scripts JavaScript ou fichiers CSS qu'il est possible d'ajouter) permettent de surcharger tous les templates et tous les styles sans jamais toucher au code source de la maquette Nova. Respecter cette méthode facilite grandement la mise à jour future de la Nova et facilite donc la maintenance de votre site.

Les paragraphes suivants expliquent comment procéder.

### Nommage des macros (et fonctions) Lodelscript

À chaque template correspond un fichier macros nommé `macros_[nomdutemplate].html`.

Toutes les macros contenues dans ce fichier sont préfixées par `NOMDUTEMPLATE_`.

### Personnaliser les macros et les fonctions

Il est possible de personnaliser une macro (ou une fonction) `NOMDUTEMPLATE_MA_MACRO` en la redéclarant simplement dans le fichier `macros_custom.html` :

```html
<DEFMACRO NAME="NOMDUTEMPLATE_MA_MACRO">
  <!--[ Ici le code de la macro d'origine avec les modifications voulues... ]-->
</DEFMACRO>
```

La macro redéclarée dans `macros_custom.html` remplacera la macro initiale lors de l'affichage.

### Personnaliser les variables

Chacun des fichiers macro contient une macro `NOMDUTEMPLATE_INIT` qui appelle les éventuelles dépendances du fichier template (= autres fichiers macros) et créé les variables nécessaires à son exécution.

Par exemple, dans `macros_base.html` la variable `[%SIDE_MAX_ACTUALITES]` :

```html
<DEFMACRO NAME="BASE_INIT">
  <!--[ Option : nombre maximum d'actualités présentées dans la colonne de droite ]-->
	<LET VAR="side_max_actualites" GLOBAL="1">5</LET>
</DEFMACRO>
```

peut être modifiée dans `macros_custom.html` avec une simple redéclaration dans la macro `CUSTOM_INIT` :

```html
<DEFMACRO NAME="CUSTOM_INIT">
  <!--[ On change la valeur pour 10 ]-->
  <LET VAR="side_max_actualites" GLOBAL="1">10</LET>
</DEFMACRO>
```

### Personnaliser les CSS

Pour personnaliser les CSS d'un site, créer `custom.less` dans le répertoire `less` et lancer le préprocesseur LESS (voir partie "Installation" plus haut). Toutes les surcharges CSS ou modification de variables doivent être faites dans le fichier `custom.less`.

Il est ainsi possible de modifier une variable de couleur utilisée dans `site.less` :

```less
@color-1: #c00;
```

de modifier un mixin ou encore d'ajouter des déclarations CSS qui seront ajoutées à la suite des styles par défaut de la maquette Nova.

#### Exécuter LESS dans le navigateur (développement uniquement)

Pendant l'intégration CSS, il est possible d'exécuter LESS directement dans le navigateur pour éviter l'étape de compilation sur le serveur. Il faut pour cela ajouter la déclaration de variable suivante dans la macro `CUSTOM_INIT` : 

```html
<LET VAR="dev_mode" GLOBAL="1">1</LET>
```

:warning: **Cette fonctionnalité ne doit jamais être utilisée en production. Pensez à la désactiver avant de publier la maquette.**

### Personnaliser le JavaScript

Il est possible d'appeler un script en plus du script par défaut en indiquant le chemin relatif dans la globale Lodelscript `[%CUSTOM_SCRIPT_PATH]`.

Le script par défaut `public/js/nova.js` stocke les fonctions dans un objet `window.fnLoader.fns`, il est donc possible de surcharger n'importe laquelle de ces fonctions en modifiant directement cet objet. De la même façon, pour ajouter une fonction, on insère sa déclaration dans l'objet.

Les fonctions sont exécutées après tous les appels javascript.

### Autres questions

#### Comment afficher les DOI des articles ?

Il faut définir le préfixe du DOI, c'est-à-dire la chaîne de caractères qui doit préfixer l'identifiant numérique de l'article pour former le DOI.

**Option 1 :** créer dans le ME le champ d'options `[#OPTIONS.NOVA.PREFIXEDOI]`, puis dans les options du site y renseigner le préfixe DOI.

**Option 2 :** modifier la valeur de la variable `[%PREFIXEDOI]` dans `macros_custom.html` pour y ajouter directement le préfixe DOI.

Exemple :

```xml
<LET VAR="prefixedoi" GLOBAL="1">10.35562/marevue.</LET>
```

#### Comment définir le lien du diffuseur (en haut du menu latéral) ?

Le nom du bouton est déterminé par le champ `diffuseursite` dans les options du site (groupe métadonnées).

Le lien du bouton peut être défini via l'une des deux options suivantes :

**Option 1 :** créer dans le ME le champ d'options `[#OPTIONS.NOVA.URLDIFFUSEURSITE]`, puis dans les options du site y renseigner l'URL du lien.

**Option 2 :** modifier la valeur de la variable `[%URLDIFFUSEURSITE]` dans `macros_custom.html` avec l'URL du lien.

#### Comment attacher un fichier TEI à un article ?

1. Éditer l'article,
2. Dans le menu "Documents annexes", sélectionner "Ajouter :" > "Fichiers" > "Fichier placé en annexe",
3. Renseigner le titre : "TEI",
4. Uploader le fichier TEI via le champ "Document",
5. (Important) Renseigner l'identifiant en bas du formulaire : "tei",
6. Enregistrer le formulaire avec le bouton "Terminer",
7. Ne pas oublier que le document doit être "publié" pour qu'il soit visible en ligne.

#### Comment afficher une timeline Twitter dans la barre latérale

1. Dans une collection à la racine du site, créer une entité de type "Flux de syndication".
2. Remplir le formulaire d'édition de l'entité comme habituellement pour les flux RSS.
3. Dans le champ "URL du fil de syndication du site" renseigner l'URL complète de la timeline Twitter, sans oublier le protocole `https://`. Exemple : https://twitter.com/EdinumOrg
4. Le champ "Nombre maximum d’items du flux" détermine le nombre de tweets affichés (par défaut : 3).
5. Enregistrer et publier.

## Mise à jour de la maquette Nova sur un site

Pour mettre à jour la maquette Nova sur un site :

1. Créer une sauvegarde du contenu de dossier `tpl/`.
2. Remplacer le contenu du dossier `tpl/` du site avec la nouvelle maquette Nova à jour.
3. Copier dans cette nouvelle maquette les fichiers de personnalisation du site sauvegardés en 1 : `macros_custom.html`, `less/custom.less` ainsi que toutes les ressources externes ajoutées lors de la personnalisation (images, scripts, webfonts, etc.).

## Développement avec NodeJS

Les scripts optionnels suivants sont disponibles pour permettre le développement avec NodeJS :

* Installation du projet avec NPM : `npm install`
* Compiler les CSS (avec LESS) : `npm run css`
* Surveiller les fichiers LESS et compiler les CSS à chaque changement : `npm run watch:css`
* Mettre à jour les dépendances dans le dossier `public/vendor` : `npm run copy:vendor`
* Tout ceci en même temps : `npm run build`

Remarque : la tâche `gulp` déclarée dans `package.json` est un alias mis en place pour des raisons de compatibilité avec la maquette Prima.

## Crédits et financement

Ce projet a été développé par le [collectif Edinum](https://edinum.org) pour les Bibliothèques universitaires de l'Université Jean Moulin Lyon 3. Il a été financé par l'Université Jean Moulin Lyon 3. 

Le collectif Edinum a accepté de publier son code source sous licence libre GPL3 sans contrepartie, affirmant ainsi son engagement en faveur du logiciel libre.

* Webdesign, graphisme et CSS : Yolaine de Villeneuve
* Programmation PHP et Lodel : Arnaud Cordier
* HTML, LodelScript et JavaScript : Thomas Brouard

## Licence

**2019, Edinum.org**

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.

