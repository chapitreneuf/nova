function onImagesLoaded(fn) {
	// https://stackoverflow.com/a/60949881
	Promise.all(Array.from(document.images).filter(img => !img.complete).map(img => new Promise(resolve => { img.onload = img.onerror = resolve; }))).then(fn);
}

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

		initLargetable: function () {
			$(function () {
				if (!$("body").hasClass("class-textes")) return;
				$(".article__text table").largetable({ enableMaximize: true });
			});
		},

		linkIsUrl: function() {
			$(function() {
				$("a[href^='http://'], a[href^='https://']").each(function () {
					var text = $(this).text();
					if (text.match(/^(https?:\/\/|www\.)/)) {
						$(this).addClass("link-is-url");
					}
				});
			});
		},

		loadTweets: function () {
			$(function () {
				var $twitterContainers = $("[data-twitter-src]");
				if ($twitterContainers.length === 0) return;

				var timelineDefaultOptions = {
					chrome: "noheader, nofooter",
					tweetLimit: 3,
					dnt: true,
					lang: $("body").attr("data-sitelang")
				};

				function twttrError(err, $el) {
					console.error(err);
					
					var selector = ".side-twitter__message";
					var $msg = $el ? $el.find(selector) : $(selector);

					$msg.each(function () {
						$(this).addClass("error");
					});
				}

				// Load Twitter script
				window.twttr = (function (d, s, id) {
					var js, fjs = d.getElementsByTagName(s)[0],
						t = window.twttr || {};
					if (d.getElementById(id)) return t;
					js = d.createElement(s);
					js.id = id;
					js.onerror = twttrError;
					js.src = "https://platform.twitter.com/widgets.js";
					fjs.parentNode.insertBefore(js, fjs);

					t._e = [];
					t.ready = function (f) {
						t._e.push(f);
					};

					return t;
				}(document, "script", "twitter-wjs"));

				// When Twitter script is ready, create timelines
				window.twttr.ready(function (twttr) {
					$twitterContainers.each(function () {
						var $container = $(this),
							src = $container.attr("data-twitter-src"),
							maxItems = Number($container.attr("data-twitter-max-items"));

						var options = Object.assign({}, timelineDefaultOptions);
						if (maxItems) {
							options.tweetLimit = maxItems;
						}

						twttr.widgets.createTimeline(
							{
								sourceType: 'url',
								url: src
							},
							$container.get(0),
							options
						)
						.then(function () {
							$container.next(".side-twitter__message").remove();
							twttr.widgets.load($container.get(0));
						})
						.catch(function (err) {
							twttrError(err, $container);
						});
					});

					twttr.widgets.load(
						document.getElementById("main-container")
					);
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

		// Generation des page-shortcuts
		pageShortcuts: function () {
			$(function () {
				var $list = $(".page-shortcuts__list");
				var $targets = $("h2.section-header[id]");
				var html = "";
				$targets.each(function () {
					var id = $(this).attr("id");
					var title = $(this).text();
					html += "<li class='page-shortcuts__item'><a href='#" + id + "' class='page-shortcuts__link'>" + title + "</a></li>\n";
				});
				$list.html(html);
			});
		},

		// Sidenotes
		sidenotes: function () {
			var setSidenotesPosition = function () {
				if ($("#sidenotes").length === 0) return;
				
				$("#sidenotes > p:not(.notesbaspage--more)").wrap("<div class='sidenote'></div>");
				if ($("#sidenotes .sidenote-placeholder").length === 0) {
					$("#sidenotes").prepend("<div class='sidenote sidenote-placeholder'></div>");
				}

				var containerTop = $("#sidenotes").offset().top;
				var top = containerTop;
				var factor = 0;

				$("#sidenotes > .sidenote").each(function () {
					try {
						var $a = $(this).find("a.FootnoteSymbol");
						if ($a.length === 0) return;
						
						var href = $a.attr("href");
						var targetId = href.replace("#ftn", "#bodyftn");
						var $target = $(targetId);

						// Barriere mobile
						if (!$(this).is(".sidenote-placeholder") && $target.length === 0) {
							$(this).hide();
							return;
						}

						var symbolY = $target.offset().top;
						var $prev = $(this).prev(".sidenote");
						$(this).css("display", "block");
						if ($prev.length === 1) {
							factor = symbolY - top;
							$prev.css("flex-grow", factor);
						}

						top = symbolY;

					} catch (error) {
						$(this).hide();
						console.error(error, $(this));
					}
				});
			};

			var waitAndRun = function() {
				window.setTimeout(function() {
					setSidenotesPosition();
				}, 500);
			};

			// Run when page is ready + when all images are loaded + on viewport resize
			$(waitAndRun);
			onImagesLoaded(waitAndRun);
			$(window).on("resize", waitAndRun);
			$(document).on("zoomLevelChanged", waitAndRun);
		},

		// Zoom
		zoom: function () {
			$(function () {
				$("[data-set-zoom-level]").click(function () {
					var zoomLevel = $(this).attr("data-set-zoom-level");
					if (!zoomLevel) return;
					$("body").attr("data-zoom-level", zoomLevel);
					$(document).trigger("zoomLevelChanged");
				});
			});
		}
	}
};
