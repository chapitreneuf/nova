# Documentation de la maquette Nova

:bulb: Cette documentation concerne la version 2 de la maquette Nova pour Lodel. Pour la documentation concernant la version 1, lire [le fichier README.md de la branche `v1`](https://github.com/chapitreneuf/nova/blob/v1/README.md).

## Mise en route

### Prérequis

Prérequis sur le serveur :

* Une instance de Lodel 1.0 opérationnelle.
* La dernière version des filtres [lodel-textfunc](https://github.com/chapitreneuf/lodel-textfunc) installés avec Lodel.
* Un site Lodel avec le modèle éditorial [OEJ.EM](https://github.com/OpenEdition/oej.em).

Prérequis sur le poste du développeur :

* Git.
* NodeJS (version 10 ou supérieure).

**Remarque :** il est possible de lancer les scripts de développement directement sur le serveur auquel cas il faudra au préalable y installer tous les prérequis. Cette documentation suppose toutefois que la personnalisation de maquette est réalisée sur une machine à part.

### Préparation du site

* Importer les fichiers `translations/translation-xx.xml` depuis l'interface du site Lodel : onglet "Administration" > "Administrer les traductions du site" > "Importer une traduction". Les langues ajoutées apparaîtront dans le sélecteur de langues de navigation du site.
* **Optionnel :** ajouter le champ `chapo` et les identifiants auteurs ME. Placer le script `nova_me_upgrade.php` (fourni dans le répertoire `scripts/`) à la racine de l'installation Lodel et lancer la commande `php nova_me_upgrade.php nom_du_site`.
* **Optionnel :** installer les options extra, utilisées pour configurer l'affichage des DOI et du lien vers le portail. Voir le dépôt dédié : [lodel-options-extra](https://github.com/chapitreneuf/lodel-options-extra).

### Préparation de la maquette

* Cloner la branche `master` de ce dépôt : `git clone git@github.com:chapitreneuf/nova.git`
* Dans le dossier cloné, installer les dépendances avec la commande `npm install`
* Suivre la méthode ci-après pour effectuer les personnalisations de maquette.

### Installation de la maquette sur le site

* Transpiler les CSS : `npm run css`
* Copier tous les fichiers du dépôt dans le dossier `tpl/` du site.

### Sécurité

Seuls les sous-dossiers `tpl` et `tpl/public` nécessitent d'être accessibles sur le serveur. Il est conseillé de bloquer l'accès aux autres sous-dossiers (`less`, `node_modules`, `scripts`, `translations`) ou de les supprimer du serveur.

## Personnalisation de la maquette

Les instructions ci-dessous expliquent comment personnaliser un site tout en conservant la possibilité de mettre à niveau la maquette Nova facilement à posteriori. La maquette est conçue pour permettre d'isoler les modifications du code source de la maquette de base. C'est la méthode recommandée.

:warning: **Lors de la personnalisation d'un site, il est recommandé de n'éditer que les fichiers `macros_custom.html` et `less/custom.less` et de ne jamais modifier les autres fichiers de la maquette.**

### Les fichiers de personnalisation

La personnalisation est réalisée en modifiant les fichiers suivants :

* `macros_custom.html` contient toutes les modifications du code LodelScript des templates. Ce fichier est créé automatiquement lors de l'installation des dépendances avec `npm install`.
* `less/custom.less` contient les modifications des styles CSS.
* Il est possible d'ajouter de nouveaux scripts, images et polices dans le répertoire `public/`.

Le dépôt [nova-starter](https://github.com/chapitreneuf/nova-starter) propose un modèle de site vierge à personnaliser.

### Nommage et personnalisation des macros Lodelscript

À chaque template correspond un fichier macros nommé `macros_nomdutemplate.html`.

Toutes les macros contenues dans ce fichier sont préfixées par `NOMDUTEMPLATE_`.

Il est possible de personnaliser une macro (ou une fonction) `NOMDUTEMPLATE_MA_MACRO` en la redéclarant simplement dans le fichier `macros_custom.html` :

```html
<DEFMACRO NAME="NOMDUTEMPLATE_MA_MACRO">
  <!--[ Ici le code de la macro d'origine avec les modifications voulues... ]-->
</DEFMACRO>
```

La macro redéclarée dans `macros_custom.html` remplacera la macro initiale lors de l'affichage.

Le fichier `macros_custom.html` peut aussi contenir de nouvelles macros nommées avec le préfixe `CUSTOM_`.

### Options de la maquette

Il est possible de modifier les options de la maquette en les redéclarant dans la macro `CUSTOM_INIT` de `macros_custom.html` :

```html
<DEFMACRO NAME="CUSTOM_INIT">
  <!--[ Nombre de numéros par page. On change la valeur pour 5. ]-->
  <LET VAR="issues_per_page" GLOBAL="1">5</LET>
</DEFMACRO>
```

La liste des options disponibles et de leurs valeurs par défaut se trouve dans [le fichier `default_options.html`](./default_options.html). :warning: **Ce fichier ne doit jamais être directement modifié.**

### Personnalisation des styles

Pour personnaliser les styles CSS d'un site, créer un fichier `custom.less` dans le répertoire `less/`. Toutes les surcharges CSS ou modifications de variables doivent être faites dans ce fichier.

Il est ainsi possible de modifier les variables LESS définies dans [`less/inc/vars/less`](./less/inc/vars.less), de surcharger les déclarations de [`site.less`](./less/site.less) ou encore d'ajouter des déclarations CSS qui seront ajoutées à la suite des styles par défaut de la maquette Nova.

### Ajout d'une police de texte

Par défaut la maquette Nova 2 n'intègre aucune webfont dans sa feuille de style, mais il est possible d'en ajouter lors de la personnalisation.

La variable LESS `webfontsDir` contient le chemin vers le répertoire des polices (par défaut : `public/fonts/`) pour une utilisation avec la propriété `src` de `@font-face`. Il est recommandé d'utiliser cette variable dans la feuille de style pour permettre le fonctionnement de LESS en [mode de développement](#mode-de-développement).

### Personnalisation du JavaScript

Il est possible d'appeler un script dans la macro `HEAD_CUSTOM_JS`, à déclarer dans `macros_custom.html`.

```html
<DEFMACRO NAME="HEAD_CUSTOM_JS">
  <script src="tpl/public/js/mon-script.js"></script>
</DEFMACRO>
```

Le script par défaut `public/js/nova.js` stocke les fonctions dans un objet `window.fnLoader.fns`. Celles-ci ne sont exécutées qu'après le chargement complet de la page. Il est donc possible de surcharger n'importe laquelle de ces fonctions en modifiant directement cet objet. De la même façon, pour ajouter une fonction il suffit d'insérer sa déclaration dans l'objet.

### Mode de développement

Pendant l'intégration CSS, il est possible d'exécuter LESS directement dans le navigateur pour prévisualiser plus rapidement les modifications.

Par défaut le mode de développement sera activé si aucun fichier CSS compilé `public/css/site.css` n'existe dans les templates.

Il est également possible de forcer l'activation du mode de développement en ajoutant la déclaration suivante dans `CUSTOM_INIT` :

```html
<LET VAR="dev_mode" GLOBAL="1">1</LET>
```

Le mode de développement permet d'utiliser l'API LESS dans la console du navigateur :

* `less.refresh()` : rafraîchir les CSS (sans recharger toute la page),
* `less.watch()` : mettre à jour les CSS à chaque modification du fichier LESS.

:warning: **Cette fonctionnalité est réservée au développement et ne doit jamais être utilisée en production pour des questions de performance. Pensez à la désactiver avant de publier le site.**

### Détection des problèmes de contraste

La maquette Nova détecte les problèmes de contraste entre le texte et son arrière-plan et affiche un message d'erreur si le contraste n'est pas conforme [aux critères du RGAA 4.1](https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#topic3). Par défaut le message n'apparaît que pour les visiteurs identifiés.

Les contrastes des couleurs des images, icônes et médias embarqués ne sont pas vérifiés par la Nova.

## Paramétrage du site

### Nommage des élément généraux

| Élément | Type de document | Parent |
| ----- | ----- | ----- |
| Billet de présentation | "billet" | Racine du site |
| Icônes réseaux sociaux (barre supérieure) | "noticedesite" | Collection "reseaux-sociaux" |
| Logos des partenaires (menu principal) | "noticedesite" | Collection "partenaires" |
| Actualités (barre latérale) | "actualite" | Rubrique d'actualités |
| Flux RSS (barre latérale) | "fluxdesyndication" | Collection "flux" |
| Fil Twitter (barre latérale) | "fluxdesyndication" | Collection "flux" |
| Liens d'informations générales (footer) | "information" | Collection "informations" |

### Barre supérieure

#### Nom de la plateforme

Définir les champs `portail_nom` et `portail_url` dans les [options-extra](https://github.com/chapitreneuf/lodel-options-extra).

#### Liens vers les réseaux sociaux

Ajouter un document de type "noticedesite" dans une collection avec l'identifiant "reseaux-sociaux" à la racine du site.

L'icône affichée est déterminée par l'identifiant de la notice de site. Les icônes supportées par défaut sont consultables dans le répertoire [`public/icons/`](./public/icons/). Elles sont obligatoirement au format SVG.

Pour utiliser une icône personnalisée, deux méthodes sont possibles :

* La méthode recommandée consiste à ajouter l'icône au format SVG dans le répertoire [`public/icons/`](./public/icons/) et de renseigner l'identifiant correspondant (sans l'extension SVG) dans la notice.
* Il est également possible de renseigner le champ "vignette" de la notice avec une icône au format PNG.

### Ajout d'un fil Twitter en barre latérale

:warning: **Cette fonctionnalité expose les visiteurs du site à la collecte de données par la plateforme Twitter.**

1. Dans une collection à la racine du site avec l'identifiant "flux", créer une entité de type "Flux de syndication".
2. Remplir le formulaire d'édition de l'entité comme habituellement pour les flux RSS.
3. Dans le champ "URL du fil de syndication du site" renseigner l'URL complète de la timeline Twitter, sans oublier le protocole `https://`. Exemple : `https://twitter.com/EdinumOrg`
4. Le champ "Nombre maximum d’items du flux" détermine le nombre de tweets affichés (par défaut : 3).
5. Enregistrer et publier.

### Articles

#### Affichage du DOI

Pour afficher le DOI des articles, il faut définir le préfixe du DOI, c'est-à-dire la chaîne de caractères qui doit préfixer l'identifiant numérique de l'article pour former le DOI.

1. Installer le groupe d'options "extra" avec le script distribué ici : [lodel-options-extra](https://github.com/chapitreneuf/lodel-options-extra)
2. Dans l'espace privé, naviguer jusqu'à l'onglet "Administration" > Section "Configuration" > Options du site > Sélectionner "Extra" dans le menu déroulant
3. Compléter l'option "Préfixe des DOI"

À partir de la Nova 2.4, il est possible d'afficher les DOI des numéros en utilisant la dernière version de [lodel-options-extra](https://github.com/chapitreneuf/lodel-options-extra) et en renseignant "article,numero" dans l'option "Types présentant des DOI".

La maquette Nova n'assure pas le dépôt automatique des DOI. Cela doit faire l'objet d'une intervention manuelle de la part des rédacteurs du site.

#### Lien vers un fichier TEI

1. Éditer l'article,
2. Dans le menu "Documents annexes", sélectionner "Ajouter :" > "Fichiers" > "Fichier placé en annexe",
3. Renseigner le titre : "TEI",
4. Uploader le fichier TEI via le champ "Document",
5. (Important) Renseigner l'identifiant en bas du formulaire : "tei",
6. Enregistrer le formulaire avec le bouton "Terminer",
7. Ne pas oublier que le document doit être "publié" pour qu'il soit visible en ligne.

#### Textes alternatifs des illustrations

Pour ajouter un texte alternatif aux illustrations dans les articles :

1. Mettre à jour [lodel-textfunc](https://github.com/chapitreneuf/lodel-textfunc) vers la version 2.1.0 (septembre 2025).
2. Ajouter le style interne `figdesc` dans le modèle éditorial.

> **Style interne** <br>
> id: `figdesc` <br>
> Style précédent <br>
> xpath: `//*[@rend='figDesc']`

Les articles doivent alors être importés en TEI. Chaque texte alternatif doit être renseigné dans un élément `<p rend="figDesc">` et placé à la suite de l'image, de la légende, et/ou du crédit. Avec Métopes, un export spécifique peut permettre d'automatiser cette étape.

En l'absence de texte alternatif renseigné c'est le titre (ou la légende) de l'illustration qui sera utilisé par défaut.

Notez que ce format de données n'est pas standard et ne sera donc pas reconnu par OpenEdition Journals lors de la migration.

### Favicon

À partir de la Nova 2.3 il est possible d'ajouter un favicon personnalisé en indiquant dans l'option `favicon_dir` le dossier contenant les icônes. Il est conseillé de placer les icônes directement à la racine du domaine (`/`).

Les fichiers appelés sont les suivants :

* favicon.ico (32x32)
* icon.svg
* apple-touch-icon.png (180x180)
* icon-192.png (192x192)
* icon-512.png (512x512)

On peut trouver un exemple de favicons dans [`public/icons/`](./public/favicon/).

La méthode d'inclusion utilisée est tirée de [ce billet](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs).

## Plugins

### PDFgen

La maquette Nova est compatible avec [PDFgen](https://github.com/chapitreneuf/pdfgen), le générateur automatique de PDF développé par Chapitre neuf.

À partir de la Nova 2.4 et de PDFgen 1.3, la génération est disponible pour les numéros de revues et pour les documents en attente de publication. Référez-vous à la [documentation de PDFgen](https://github.com/chapitreneuf/pdfgen) pour davantage d'informations.

## Mise à niveau

### Mise à jour de la Nova 2

:warning: **Cette méthode ne fonctionne que si la Nova a été personnalisée en suivant la méthode recommandé (voir plus haut). Dans le cas contraire les modifications réalisées pourraient être définitivement perdues !**

Pour mettre à jour la maquette Nova sur un site :

1. Par prévention, créer une sauvegarde des templates d'origine.
2. Écraser les fichiers de l'ancienne Nova avec ceux de la dernière version stable.
3. Lancer la commande de transpilation des CSS.

### Migration depuis la Nova 1

La Nova 2.0 rompt la compatibilité avec les versions précédentes. Par conséquent la mise à niveau nécessitera dans la plupart des cas une réécriture des fichiers de personnalisation `custom.less` et `macros_custom.html` pour prendre en compte les spécificités de cette nouvelle version.

Voici une liste non-exhaustive de changements à prendre en compte :

* Les filtres [lodel-textfunc](https://github.com/chapitreneuf/lodel-textfunc) doivent être mis à jour vers leur version la plus récente.
* Toute la feuille de styles `site.less` a été réécrite, il est donc probable que les surcharges de styles doivent être revues au cas par cas et réécrites si nécessaire.
* Plusieurs macros ont été renommées et le markup a ponctuellement été modifié. Il est donc conseillé de vérifier la compatibilité de toutes les macros dans `macros_custom.html`.
* Les variables de traductions doivent impérativement être mises à jour avec les nouveaux fichiers distribués.
* Les options ont été déplacées dans [`default_options.html`](./default_options.html) et de nombreuses options ont été ajoutées.
* Plusieurs interfaces et comportements anciens qui ont été supprimés peuvent être rétablis à l'aide d'options dédiées.
* Le dossier de polices par défaut a été déplacé de `public/webfonts` vers `public/fonts`.
* L'option `custom_script_path` de la Nova 1 a été remplacé par un hook avec la macro `HEAD_CUSTOM_JS` (voir explications plus haut).
