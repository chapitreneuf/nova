# Méthode recommandée pour l'ajout de webfonts à un site Nova

## Choix des polices

La méthode qui suit s'applique à toutes les polices disponibles librement sur [Google Fonts](https://fonts.google.com/), mais elle peut être adaptée à n'importe quelle police.

Assurez-vous de détenir les droits d'utilisation adéquats avant d'embarquer une police sur une site.

## Hébergement et déclaration des polices

* Sur le site [google-webfonts-helper](https://gwfh.mranftl.com/fonts) sélectionnez la police choisie.
* Cochez les charsets désirés. Plus nombreux sont les polices et les charsets embarqués, moins performante sera l'affichage de la page.
* Dans les styles disponibles cochez : `regular`, `italic`, `700`, `700italic`. Les autres styles ne sont pas utilisés par la Nova et n'ont donc pas d'intérêt à être embarqués.
* Dans le champ **Customize folder prefix**, renseignez la valeur : `@{webfontsDir}/`
* Copier le code proposé.
* Créez un fichier `less/fonts.less` et collez-y le code.
* De nouveau sur google-webfonts-helper, cliquez sur le bouton de la section **Download files** afin de télécharger les polices sélectionnées.
* Décompressez l'archive et collez les fichiers de polices qu'elle contient dans `public/fonts/`.

## Intégration des polices dans la Nova

**Prérequis : Nova 2.5.7 ou supérieure.**

Dans `less/custom.less`, changez les valeurs des variables `@font-1` et `@font-2` par le nom de la police tel qu'il apparaît dans la propriété `font-family` du code collé dans `less/fonts.less` à l'étape précédente.

Il est possible d'utiliser [d'autres variables](https://github.com/chapitreneuf/nova/blob/master/less/inc/vars.less) pour personnaliser l'affichage des polices dans la Nova.

On peut également utiliser ces variables dans des règles CSS habituelles :

```css
.foo__bar {
  font-family: @font-1;
}
```

## Intégration des polices dans PDFgen

**Prérequis : PDFgen 1.50 ou supérieur.**

Pour que les PDF générés automatiquement pour la revue utilisent les polices déclarées dans les étapes précédentes :

* Créer le fichier `less/pdf.less`
* Y insérer le code : `@import "fonts.less";`
* Déclarer dans le scope `:root` les polices à l'aide des [custom properties](https://github.com/chapitreneuf/pdfgen/blob/master/public/css/inc/vars.css) utilisées par PDFgen. Par exemple :

```css
/* less/pdf.less */
`@import "fonts.less";`

:root {
  --font-ui: "Noto Sans", "Lucida Sans", "Lucida Grande", "Lucida Sans Unicode", "Luxi Sans", sans-serif;
  --font-text: "Noto Serif", serif;
  --font-mono: "Inconsolata", monospace;
}
```

* Relancer la transpilation des CSS : `npm run css`
* Vider le cache des PDF.
