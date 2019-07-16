window.fnLoader = {
	// Système de chargement des fonctions
	load: function () {
		var fns = this.fns;
		for (var fnName in fns) {
			if (fns.hasOwnProperty(fnName) && typeof fns[fnName] === "function") {
				fns[fnName]();
			}
		}
	},

	// Déclaration des fonctions à charger par défaut
	fns: {
		// Ajouter des ancres aux paragraphes
		pAnchors: function () {
			// Ready
			$(function () {
				$(".article__text-contents > p.texte").each(function (index) {
					var num = index + 1;
					$(this).attr("id", "p" + num);
				});
			});
		},

		// Sidenotes
		sidenotes: function () {
			$(function() {
				$("#sidenotes .notesbaspage").each(function () {
					try {
						var $a = $(this).find("a.FootnoteSymbol");
						var href = $a.attr("href");
						var targetId = href.replace("#ftn", "#bodyftn");
						var $target = $(targetId);
						var top = $target.offset().top;
						$(this).offset({ top: top });
					} catch (error) {
						$(this).hide();
						console.error(error);
					}
				});
			});
		}
	}
};
