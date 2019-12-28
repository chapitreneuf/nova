<?php

/*
	Boucle de recherche externe pour lodel

	Utilisation:
		<LOOP NAME="search" Q="[#Q]" LIMIT="6" SITE="edinum.org" ENGINE="qwant">
	Options:
		-engine: pour l'instant uniquement qwant
		-site: par défaut le site en cours

	On reçoit dans la boucle : title, 'favicon', 'url', 'desc', 'date'

*/

function loop_websearch(&$context, $funcname, $args) {
	// mise en place des options de la boucle
	$options = ['engine'=>'qwant', 'site'=>'', 'limit'=>10, 'q'=>'', 'offset'=>0];
	$options['site'] = !empty($context['options']['metadonneessite']['urldusite']) ? $context['options']['metadonneessite']['urldusite'] : $context['siteurl'];
	$options['site'] = preg_replace('@^.*\/\/@', '', $options['site']);
	foreach ($options as $option => $value) {
		$$option = empty($args[$option]) ? $value : $args[$option];
	}

	if (intval($limit) < 1)
		$limit = $options['limit'];
	$q = urlencode($q);

	// appel au moteur de recherche
	$search_func = "search_".$engine;
	$results = $search_func($q, $limit, $offset, $site);

	// pas de résultats
	$localcontext = $context;

	if (empty($results['items'])) {
		if (function_exists("code_alter_$funcname"))
			call_user_func("code_alter_$funcname", $localcontext);
		return;
	}

	$total = $results['total'];
	$localcontext['total'] = $total;

	// code avant
	if (function_exists("code_before_$funcname"))
		call_user_func("code_before_$funcname", $localcontext);

	$count = 0;
	foreach ($results['items'] as $result) {
		$localcontext['count'] = ++$count;
		$docontext = array_merge($localcontext, $result);

		if ($count == 1 && function_exists("code_dofirst_$funcname")) {
			call_user_func("code_dofirst_$funcname", $docontext);
		} elseif( $count == $total && function_exists("code_dolast_$funcname") ) {
			call_user_func("code_dolast_$funcname", $docontext);
		} else {
			call_user_func("code_do_$funcname", $docontext);
		}
	}

	if (function_exists("code_after_$funcname"))
		call_user_func("code_after_$funcname", $localcontext);
}

// ask qwant
// Output:
// [
//		'total' => int,
//		'items' => [ [ 'title','url','favicon','source','desc','_id','position'], … ]
// ]
function search_qwant($q, $limit, $offset, $site) {
	// URL de l'API + la recherche
	$url = 'https://api.qwant.com/api/search/web?q=site:'.$site.'+'.$q;

	// ajout des paramètres (non docummentés) pour qwant
	$url .= "&count=$limit&t=web&extensionDisabled=true&safesearch=1&locale=fr_FR&uiv=4";

	// ajout de la pagination
	if ($offset)
		$url .= "&offset=$offset";

	// chargment de la réponse
	$ret = curl_get($url);
	if (!$ret) {
		error_log("Pb avec qwant $url ." . var_export($ret, true));
		return array();
	}
	
	// on décode, test
	$json = json_decode($ret, true);
	if (!$json || empty($json['data']['result'])) {
		error_log("Pb avec qwant $url." . var_export($ret, true));
		return array('total'=>0,'items'=>[]);
	}

	$results = $json['data']['result'];
	unset($results['filters']);

	return $results;
}
