<?php


/*
	On a deux types de fichiers inclus:
		les distant => table fichiersexternes
			soit une URL
			soit un code HTML
		les docannexe => table fichiers

	Les tables sont définis dans le ME, mais on les utilise ici en dur !
*/

function media($text) {
	global $db;

	$reg = '#\[(image|son|sound|video|animation|pdf):([^\]]*?)\]#';
	preg_match_all($reg, $text, $matches, PREG_SET_ORDER);

	foreach ($matches as $medium) {
		list($media_reference, $media_type, $identifier) = $medium;
		
		// récupérer l'id du document, son status et sa class (fichiers ou fichiersexternes)
		$idparent = intval($GLOBALS['context']['id']);
		$sql = lq('SELECT e.id, e.status, t.class FROM #_TP_entities as e JOIN #_TP_types as t ON e.idtype=t.id WHERE idparent='.$idparent.' AND identifier='.$GLOBALS['db']->quote($identifier));
		$row = $db->GetRow($sql);

		// Le media n'est pas trouvé dans la base
		if (empty($row)) {
			$warning = '<div style="background-color:red;">'.getlodeltextcontents("A media was expected","site").' : '.$media_reference.'</div>';
			$text = str_replace($media_reference, $warning, $text);
			continue;
		}

		// effacer le <p class="texte"> qui entoure eventuellement le media
		$reg = "@<p class=\"texte\">\s*".preg_quote($media_reference)."\s*<\/p>@";
		$text = preg_replace($reg, $media_reference, $text);

		// populate $id, $status, $class
		extract($row); 
		
		// Document non publié, utilisateur non logué, on efface toute trace
		if (($status <= 0) && !C::get('visitor','lodeluser')) {
			$text = str_replace($media_reference, '', $text);
			continue;
		}

		// chercher les infos du document
		$sql = ($class == 'fichiers') ?
			"select titre, document, description, legende, credits FROM #_TP_$class WHERE identity=$id" :
			"select titre, object, description, legende, credits, urlaccesmedia  FROM #_TP_$class WHERE identity=$id";
		$info = $db->GetRow(lq($sql));
		$info['id'] = $id;
		$info['media_type'] = $media_type;
		
		// Si class fichiers: créer la balise object qui convient
		if ($class == 'fichiers') {
			$info['object'] = media_create_object($info['document'], $media_type, $id);
			$info['urlaccesmedia'] = "";
		}

		// créer le HTML selon le type
		$html = '<div id ="media-'.$identifier.'" class="doc-media doc-media-type-'.$media_type.'">';
		if(!empty($info['titre'])){
			$html .= '<p class="media-titre">'.$info['titre'].'</p>';
		}
		$html .= '<div class="doc-media-contents">'.$info['object'].'</div>';
		if(!empty($info['description']))
			$html .= '<div class="media-description">'.$info['description'].'</div>';
		if(!empty($info['legende']))
			$html .= '<div class="media-legende">'.$info['legende'].'</div>';
		if(!empty($info['credits'])){
			$html .= '<p class="media-credits">'.getlodeltextcontents("Credits","site").': '.$info['credits'].'</p>';
		}
		if(!empty($info['urlaccesmedia'])){
			$html .= '<p class="media-urlaccesmedia">'.getlodeltextcontents("Permalien","site").': <a href="'.$info['urlaccesmedia'].'">'.$info['urlaccesmedia'].'</a></p>';
		}
		$html .='</div>';
		$text = str_replace($media_reference, $html, $text);

	}

	return $text;
}


function media_create_object($url, $media_type, $id) {
	switch($media_type) {
		case "image":
			$object = "<img src='$url' />";
			break;
		case "pdf":
			global $context;
			$url = urlencode($context['siteurl'] . '/' . makeurlwithfile($id));
			$object = "<iframe src='tpl/node_modules/pdfjs-dist-viewer-min/build/minified/web/viewer.html?file=$url'></iframe>";
			$object .= "<a class='media-pdf-download' href='tpl/node_modules/pdfjs-dist-viewer-min/build/minified/web/viewer.html?file=$url' target='_blank'>".getlodeltextcontents("TELECHARGER_PDF_EMBED","site")."</a>";
			break;
		default:
			$object = "<img src='$url' />";
	}
	return $object;
}