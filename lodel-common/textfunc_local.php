<?php

include_once('illustrations.php');
include_once('notes.php');
include_once('media.php');
include_once('loop_search.php');
include_once('../lodel/scripts/searchfunc.php');

function plus($a, $b) {
	return (int)$a + (int)$b;
}

function moins($a, $b) {
	return (int)$a - (int)$b;
}

function multiplier($a, $b) {
	return (int)$a * (int)$b;
}

function diviser($a, $b) {
	return (int)$a / (int)$b;
}

function repliquer($texte, $nb) {
	$res = "";
	for ($i = 1; $i <= abs($nb); $i++) {
	    $res .= $texte;
	}
	return $res;
}

function lang_is_rtl($lang) {
	$rtl_languages = array('ar' /* 'العربية', Arabic */, 'arc' /* Aramaic */, 'bcc' /* 'بلوچی مکرانی', Southern Balochi */, 'bqi' /* 'بختياري', Bakthiari */, 'ckb' /* 'Soranî / کوردی', Sorani */, 'dv' /* Dhivehi */, 'fa' /* 'فارسی', Persian */, 'glk' /* 'گیلکی', Gilaki */, 'he' /* 'עברית', Hebrew */, 'ku' /* 'Kurdî / كوردی', Kurdish */, 'mzn' /* 'مازِرونی', Mazanderani */, 'pnb' /* 'پنجابی', Western Punjabi */, 'ps' /* 'پښتو', Pashto, */, 'sd' /* 'سنڌي', Sindhi */, 'ug' /* 'Uyghurche / ئۇيغۇرچە', Uyghur */, 'ur' /* 'اردو', Urdu */, 'yi' /* 'ייִדיש', Yiddish */);
	return in_array($lang, $rtl_languages);
}

function text_is_rtl($text) {
	// regex de http://stackoverflow.com/questions/12006095/javascript-how-to-check-if-character-is-rtl
	$rtl_unicode = '/[\x{0591}-\x{07FF}\x{200F}\x{202B}\x{202E}\x{FB1D}-\x{FDFD}\x{FE70}-\x{FEFC}]/u';
	$small_portion = mb_substr(trim(strip_tags($text)),0,20);
// 	error_log("'$text' - '$small_portion'");
	$count = preg_match_all($rtl_unicode, $small_portion);
	return $count;
}

/**
 DOM utility functions
*/

// return text content of a DOM node
function gettext_from_node($dom_node) {
	return strip_tags($dom_node->ownerDocument->saveXML($dom_node));
}

// remove empty tags inside a DOM node
function remove_empty_tags($dom_node) {
	while (($empty_tags = xpath_find($dom_node->ownerDocument, '//*[not(*) and not(text()[normalize-space()])]', $dom_node)) && $empty_tags->length>0) {
		foreach($empty_tags as $node) {
			$node->parentNode->removeChild($node);
		}
	}
}

// load HTML string in a DOMDocument
function text_to_dom($html) {
	$dom = new DOMDocument('1.0', 'UTF-8');
	@$dom->loadHTML('<?xml encoding="utf-8" ?>' . $html); // use @ to supress warning…
	return $dom;
}

// convert the content of the <body> of an DOM document into a string
function dom_to_text($dom) {
	$body = $dom->getElementsByTagName('body');
	$body = $dom->saveXML($body[0]);
	$body = substr($body,6);
	$body = substr($body,0,-7);
	return $body;
}

// return results of a xpath query
function xpath_find($dom, $query, $ref_node=NULL) {
	$xpath = new DOMXpath($dom);
	$elements = $xpath->query($query, $ref_node);
	unset($xpath);
	return $elements;
}

// create an element and its attributes
function create_element($dom, $name, $attributes=array(), $content='') {
	$el = $dom->createElement($name, $content);
	foreach($attributes as $attribute) {
		list($attr_name, $attr_value) = $attribute;
		$attr = $dom->createAttribute($attr_name);
		$attr->value = $attr_value;
		$el->appendChild($attr);
	}
	return $el;
}

// return an array with all classes of an element
function get_classes($node) {
	$attributes = $node->attributes;
	if (!$attributes)
		return array();
	$class = $attributes->getNamedItem('class');
	if (!$class)
		return array();
	return explode(" ", $class->nodeValue);
}

/**
 cURL utility functions
*/

function curl_get($url, $user_agent="Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:48.0) Gecko/20100101 Firefox/48.0") {
	$curl = curl_init($url);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($curl, CURLOPT_USERAGENT, $user_agent);
	$response = curl_exec($curl);

	return $response;
}

// ajoute ou enlève un paramètre à une URL
function query_string($url, $param, $value) {
	parse_str(parse_url($url, PHP_URL_QUERY), $queries);

	if ($value) {
		$queries[$param] = $value;
	} elseif (isset($queries[$param])) {
		unset($queries[$param]);
	}

	$new_url = preg_replace('/\?.*$/', '', $url);
	if (!empty($queries))
		$new_url .= '?' . http_build_query($queries, '', '&amp;');

	return $new_url;
}
