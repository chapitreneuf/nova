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
			var setSidenotesPosition = function () {
				var margin = 10;
				var minTop = 0;
				var maxBottom = $("#sidenotes").offset().top + $("#sidenotes").innerHeight() - 100;

				// Lien "notes suivantes"
				var $more = $("#sidenotes .notesbaspage--more");
				$more.hide();

				$("#sidenotes .notesbaspage:not(.notesbaspage--more)").each(function () {
					try {
						$(this).show();
						var $a = $(this).find("a.FootnoteSymbol");
						var href = $a.attr("href");
						var targetId = href.replace("#ftn", "#bodyftn");
						var $target = $(targetId);
						var top = $target.offset().top;
						if (top <= minTop) {
							top = minTop;
						}
						$(this).offset({ top: top });
						var bottom = top + $(this).height();
						minTop = bottom + margin;
						if (bottom > maxBottom) {
							$(this).add($(this).nextAll()).hide();
							$more.find("a").attr("href", href);
							$more.show().offset({ top: top });
							return false;
						}
					} catch (error) {
						$(this).hide();
						console.error(error, $(this));
					}
				});
			};

			// Run when page is ready + on viwport resize
			$(setSidenotesPosition);
			$(window).resize(setSidenotesPosition);
		}
	}
};
