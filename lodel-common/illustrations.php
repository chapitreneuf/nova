<?php

/** filtre illustrations pour lodel

 Utilisation : [#TEXTE|illustrations(200, 'nom_de_la_section')]
 Il remplit un tableau #IMAGES utilisable pour la table des illustrations
 exemple : #IMAGES['titre', 'image', 'legende', 'credit', 'section'] chaque éléments contient le HTML, la partie 'section' contient le nom de la section passée en paramètre du filtre

*/

// Uncomment to test
// $html = file_get_contents('text.html');
// $html_ill = illustrations($html, 100);
// echo $html_ill;

function illustrations($html, $width=400, $surounding_class="texte") {
	$dom = text_to_dom($html);
	remove_embedded_img($dom, $surounding_class);

	$images = C::get('images');
	if (empty($images))
		$images = array();

	// $dom et $image sont passés par référence, les fonctions modifient le HTML et le tableau des illustrations #IMAGES
	$start_offset = count($images);
	find_and_group_illustrations($dom, $images, $start_offset, $surounding_class);
	illustration_thumbnails($dom, $images, $start_offset, $width);
	export_illustrations_to_lodel($dom, $images, $start_offset, $surounding_class);
	C::set('images', $images);

// 	var_export($images);
	return dom_to_text($dom);
}

// destroy parents of <img> that are not p[@texte]
function remove_embedded_img(&$dom, $surounding_class) {
	$paragraphes = xpath_find($dom, '//p[@class=\''.$surounding_class.'\']');
	foreach ($paragraphes as $paragraphe) {
		$images = $paragraphe->getElementsByTagName('img');
		foreach ($images as $image) {
			while ($image->parentNode->tagName != 'p') {
				$parent = $image->parentNode;
				$parent->parentNode->replaceChild($image, $parent);
			}
		}
	}
}

// function name is explicit enough
function find_and_group_illustrations(&$dom, &$images, $start_offset, $surounding_class) {
	$images_nodes = xpath_find($dom, '//p[@class=\''.$surounding_class.'\' and img]');

	// find all elements that belong to the image
	$nb_img = $start_offset;
	foreach ($images_nodes as $image) {
		$images[$nb_img]['image'] = $image;
		$image->attributes->getNamedItem('class')->nodeValue = 'imageillustration';
		foreach ([['previous','titre'], ['next','legende'], ['next','credit']] as $search) {
			list($direction, $class_name) = $search;
			$found = find_Sibling($direction, $image, 'p', $class_name.'illustration', $surounding_class);
			if ($found) {
				$images[$nb_img][$class_name] = $found;
			}
		}
		$nb_img +=1;
	}

	// create container and put illustrations elements in in
	for ($index=$start_offset; $index<$nb_img; $index++) {
		$image = &$images[$index];
		$container = create_element($dom, 'div', [['id','illustration-'.($index+1)], ['class','groupe-illustration groupe-illustration-'.$surounding_class]]);
		// put container just before img tag
		$container = $image['image']->parentNode->insertBefore($container, $image['image']);
		foreach(['titre', 'image', 'legende', 'credit'] as $to_move) {
			if (isset($image[$to_move])) {
				// remove node and put it in container
				$old_node = $image[$to_move]->parentNode->removeChild($image[$to_move]);
				$images[$index][$to_move] = $container->appendChild($old_node);
			}
		}
	}

}

// do thumbnail of illustrations
function illustration_thumbnails(&$dom, &$images, $start_offset, $width) {
	$nb_img = count($images);
	for ($index=$start_offset; $index<$nb_img; $index++) {
		$image = &$images[$index];
		$img = $image['image']->firstChild;
		$src = $img->attributes->getNamedItem('src')->nodeValue;
// 		$thumb_src = $src.'.thumb'; // uncomment next line in lodel
		$thumb_src = vignette($src, $width);
// 		error_log('Image convertie : ' . $thumb_src);
		$image['src'] = $src;
		$image['thumb_src'] = $thumb_src;
		$img->attributes->getNamedItem('src')->nodeValue = $thumb_src;
		$a = create_element($dom, 'a', [['href', $src]]);
		$img = $image['image']->replaceChild($a, $img);
		$a->appendChild($img);
	}
}

function export_illustrations_to_lodel(&$dom, &$images, $start_offset, $surounding_class) {
	$nb_img = count($images);
	for ($index=$start_offset; $index<$nb_img; $index++) {
		$image = &$images[$index];
		foreach(['titre', 'image', 'legende', 'credit'] as $export) {
			if (isset($image[$export])) {
				$image[$export] = $dom->saveXML($image[$export]);
			}
		}
		$image['section'] = $surounding_class;
	}
}

// find the sibling of $node using $nodeName and $class_name
function find_Sibling($direction, $node, $nodeName, $class_name, $stop_class) {
	$property = "{$direction}Sibling";
	while ($previous = $node->$property) {
		if ($previous->nodeName == $nodeName) {
			if ($classes = get_classes($previous)) {
				if (in_array($class_name, $classes))
					return $previous;
				if (in_array($stop_class, $classes))
					return false;
			}
		}
		$node = $previous;
	}
	return false;
}
