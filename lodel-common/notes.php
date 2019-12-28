<?php

/** filtre cutnotes pour lodel

 Coupe les notes de bas de page
 Utilisation : [#NOTESBASPAGE|cutnotes(150, '…')]

*/

// Uncomment to test
// include_once('textfunc_local.php');
// $html = file_get_contents('notes.html');
// $html_notes = cutnotes($html, 50);
// echo $html_notes;

function cutnotes($html, $max_length=100, $ellipsis='…') {
	if (!$html) {
		return '';
	}
	$dom = text_to_dom($html);

	// Notes should be in p.notesbaspage, but not always, so we use childNodes instead
	// $notes_nodes = xpath_find($dom, '//p[@class=\'notesbaspage\']');

	// Get body and loop on children, they are the notes
	$body = $dom->getElementsByTagName('body')[0];
	foreach ($body->childNodes as $note) {
		$href = change_note_link($note);
		cuttext_from_node($note, $max_length, $ellipsis, $href);
// 		echo $dom->saveXML($note)."\n";
// 		echo "----\n";
	}
	
	return dom_to_text($dom);
}

function change_note_link($note) {
	$a = xpath_find($note->ownerDocument, './/a[@class=\'FootnoteSymbol\']', $note)[0];
	if ($a) {
		$id = $a->attributes->getNamedItem('id')->nodeValue;
		$new_href = '#' . $id;
		$a->attributes->getNamedItem('id')->nodeValue = 'cutted-' . $id;
		$a->attributes->getNamedItem('href')->nodeValue = $new_href;
	} else {
		$new_href = 'notes_not_found';
	}
	return $new_href;
}

/*
 Cut the text of a DOM node
 add an ellipsis (if cutted) at the end in a <a href="$href">
*/
function cuttext_from_node($node, $max_length, $ellipsis='…', $href='') {
		$text = gettext_from_node($node);
		if (mb_strlen($text) >= $max_length) {
			$where_to_cut = find_best_cut_offset($text, $max_length);
			cuttext_from_node_recurs($node, $where_to_cut);
// 			if ($where_to_cut == mb_strlen(gettext_from_node($node)))
// 				echo " - SUPER cutted at $where_to_cut";
			remove_empty_tags($node);
			if ($ellipsis)
				add_ellipsis($node, $ellipsis, $href);
		}
}

/*
 find the best offset where to cut a string without cutting words or numbers
 remaining string should not be longer than $max_length
*/
function find_best_cut_offset($text, $max_length) {
	$removed = mb_substr($text, $max_length, 1);
	$text = mb_substr($text, 0, $max_length);
	// if removed was a letter or a number then remove last letters
	if (mb_ereg_match('[\p{L}\p{N}]', $removed)) {
		$strlen = strlen($text);
		$mb_strlen = mb_strlen($text);
		$text = mb_ereg_replace('[\p{L}\p{N}-]*$', '', $text);
	}
	// remove last spaces and comas
	$text = rtrim($text, " ,");
	$where_to_cut = mb_strlen($text);

	return $where_to_cut;
}

// used by cuttext_from_node, this function do the real job of cutting
function cuttext_from_node_recurs($node, $max_length, $current_length = 0) {
	if (!isset($node->tagName) || $node->tagName == null) {
		$text = $node->textContent;
		$length = mb_strlen($text);
		// max length allready, remove the text
		if ($current_length >= $max_length) {
			$node->textContent = "";
		// the string is too long, cut it
		} else if ($length + $current_length >= $max_length) {
			$nb_char_to_keep = $length - (($length + $current_length) - $max_length);
			$cutted_text = mb_substr($text, 0, $nb_char_to_keep);
			$node->textContent = $cutted_text;
		}
		return $length + $current_length;
	}

	$node = $node->firstChild;
	if ($node != null) {
		$current_length = cuttext_from_node_recurs($node, $max_length, $current_length);
	}

	while($node && $node->nextSibling != null) {
		$current_length = cuttext_from_node_recurs($node->nextSibling, $max_length, $current_length);
		$node = $node->nextSibling;
	}
	return $current_length;
}

function add_ellipsis($note, $ellipsis, $href) {
	$a = create_element($note->ownerDocument, 'a', [['href', $href], ['class', 'ellipsis']], $ellipsis);
	$note->appendChild($a);
}
