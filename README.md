# :warning: Branche obsolète !

**Ces outils ne sont pas compatibles avec les versions récentes de la Nova. Cette branche est conservée en tant qu'archive, pour une utilisation avec le Nova v1 uniquement.**

## Lodel-textfunc

Indispensable pour l'utilisation du template **Nova**.  
Le dépôt officiel est git@github.com:edinum/lodel-textfunc.git  
Le dossier fourni n'est présent que pour regrouper toutes les dépendances en un seul dépôt, mais il ne sera pas mis à jour.

Installer le dossier lodel-textfunc/ dans le même dossier que le dossier de l'installation pricipale de lodel, et ajouter dans lodelconfig.php :

```php
include_once('../lodel-textfunc/textfunc_local.php');
```

## Compilation less avec lessphp

Utile pour compiler le fichier site.css sans avoir à utiliser node.js  
Le dépôt officiel est https://github.com/leafo/lessphp.git  
Le dossier fourni n'est présent que pour regrouper toutes les dépendances en un seul dépôt, mais il ne sera pas mis à jour.

Installer les dépendances PHP dans /usr/share/php/, et le programme dans /usr/bin/ :

```bash
cd /usr/share/php/
sudo ln -sf /path/to/repo/lessphp/lessc.inc.php .
sudo ln -sf /path/to/repo/lessphp/lessify.inc.php .
cd /usr/bin/
sudo ln -sf /path/to/repo/lessphp/plessc .
sudo chmod 755 plessc
```

Une fois le logiciel en place on peut compiler le CSS d'un site, en se plaçant dans le dossier tpl/ de celui-ci et `plessc less/site.less public/css/site.css`

## Upgrade du Modèle éditorial

Placer le script nova_me_upgrade.php à la racine de l'installation lodel
lancer `php nova_me_upgrade.php nom_du_site`
