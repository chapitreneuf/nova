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
		// Hamburger menu
		hamburger: function () {
			$(function () {
				$("#main-menu-toggler").on("click", function () {
					$("#main-menu-container").toggleClass("d-none");
				});
			});
		},

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
				if ($("#sidenotes").length === 0) return;

				var margin = 10;
				var minTop = 0;
				var maxBottom = $("#sidenotes").offset().top + $("#sidenotes").innerHeight() - 100;

				// Lien "notes suivantes"
				var $more = $("#sidenotes .notesbaspage--more");
				$more.hide();

				$("#sidenotes > p:not(.notesbaspage--more)").each(function () {
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
		},

		// Zoom
		zoom: function () {
			$(function () {
				$("[data-set-zoom-level]").click(function () {
					var zoomLevel = $(this).attr("data-set-zoom-level");
					if (!zoomLevel) return;
					$("body").attr("data-zoom-level", zoomLevel);
				});
			});
		}
	}
};
