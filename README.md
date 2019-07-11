# Maquette Nova pour Lodel

## Déploiement rapide

Requis : git et NodeJS/NPM.

1. Cloner le dépôt
2. `cd nova`
3. `npm install`
4. Copier les fichiers dans le répertoire `tpl` du site (les dossiers `.git`, `less` et `node_modules` n'ont pas besoin d'être copiés dans tpl).

## Développement

* Compiler les CSS (avec LESS) : `npm run css`
* Surveiller les fichiers LESS et compiler les CSS à chaque changement : `npm run watch:css`
* Copier les dépendances et les webfonts dans le dossier `public` : `npm run copy`
* Tout ceci en même temps : `npm run build`

## Personnalisation de la maquette

:warning: **Les infos ci-dessous sont destinées à la personnalisation du site, pas au dev de la maquette.**

Cette maquette est conçue pour être modulaire et faciliter la maintenance et la mise à jour. 

:point_up: **Lors de la personnalisation du site il est fortement recommandé de n'éditer que les fichiers `macros_custom.html` et `less/custom.less` et de ne jamais modifier les autres fichiers de la maquette.** 

Les deux fichiers `macros_custom.html` et `less/custom.less` (en plus des éventuelles images, scripts JavaScript ou fichiers CSS qu'il est possible d'ajouter) permettent de surcharger tous les templates et tous les styles sans jamais toucher au code source de la maquette Nova. Respecter cette méthode facilite grandement la mise à jour future de la Nova et facilite donc la maintenance de votre site.

Les paragraphes suivants expliquent comment procéder.

### Nommage des macros (et fonctions) Lodelscript

À chaque template correspond un fichier macros nommé  `macros_[nomdutemplate].html`.

Toutes les macros contenues dans ce fichier sont préfixées par `NOMDUTEMPLATE_`.

### Personnaliser les macros et les fonctions

Il est possible de personnaliser une macro (ou une fonction) `NOMDUTEMPLATE_MA_MACRO` en la redéclarant simplement dans le fichier `macros_custom.html` :

```html
<DEFMACRO NAME="NOMDUTEMPLATE_MA_MACRO">
  <!--[ Ici le code de la macro d'origine avec les modifications voulues... ]-->
</DEFMACRO>
```

### Personnaliser les variables

Chacun des fichiers macro contient une macro `NOMDUTEMPLATE_INIT` qui appelle les éventuelles dépendances du fichier template (`USE MACROFILE`), créé les variables nécessaires à son exécution, déclare les scripts JS qui doivent être appelés et contient les éventuelles variables permettant la configuration du template.

Par exemple, imaginons que le template `macros_home.html` contienne la macro d'initialisation suivante :

```html
<DEFMACRO NAME="HOME_INIT">
  <!--[ Afficher 3 numéros en home ]-->
  <LET VAR="NOMBRE_DE_NUMEROS_AFFICHES" GLOBAL="1">3</LET>
</DEFMACRO>
```

Dans cet exemple, la variable globale `[%NOMBRE_DE_NUMEROS_AFFICHES]` peut être modifiée dans `macros_custom.html` avec une simple redéclaration dans `CUSTOM_INIT` :

```html
<DEFMACRO NAME="CUSTOM_INIT">
  <!--[ On change la valeur pour 5 ]-->
  <LET VAR="NOMBRE_DE_NUMEROS_AFFICHES" GLOBAL="1">5</LET>
</DEFMACRO>
```

## CSS

Pour personnaliser les CSS d'un site, créer `custom.less` dans le répertoire `less` et lancer le préprocesseur LESS. Toutes les surcharges CSS ou modification de variables doivent être faites dans le fichier `custom.less`.

Il est ainsi possible de modifier une variable de couleur utilisée dans `site.less` :

```less
@color-1: #c00;
```

de modifier un mixin ou encore d'ajouter des déclarations CSS qui seront ajoutées à la suite des styles par défaut de la maquette Nova.

## Javascript

:warning: **Cette fonctionnalité n'est pas encore implémentée : à revoir.**

Il est possible d'appeler un script en plus du script par défaut en indiquant le chemin relatif dans la globale Lodelscript `[%CUSTOM_SCRIPT_PATH]`.

Le script par défaut stocke les fonctions dans un objet `window.fnLoader.fns`, il est donc possible de surcharger n'importe laquelle de ces fonctions en modifiant directement cet objet. De la même façon, pour ajouter une fonction, on insère sa déclaration dans l'objet.

Les fonctions sont exécutées après tous les appels javascript.

