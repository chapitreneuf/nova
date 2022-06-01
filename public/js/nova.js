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

    // Generation des dots-shortcuts
    dotShortcuts: function() {
      var activate = window.activateDotShortcuts;
      if (!activate || activate === "none") {
        return;
      }

      function addDot(y, id, title, classname) {
        const $container = $(".dot-shortcuts-container");
        $("<a class='dot-shortcut " + classname + "' href='#" + id + "' style='top: " + y + "px' title='" + title + "' aria-hidden='true'></a>").appendTo($container);
      }

      function waitAndRun() {
        $(".dot-shortcut").remove();
        var scrollbarArrowHeight = 15;
        var documentHeight = $(document).height();
        var viewportHeight = $(window).height() - (scrollbarArrowHeight * 2);

        // Main title
        if (activate === "all" || activate === "top") {
          addDot(10, "main-header", $("main-title").text(), "dot-shortcut--top");
        }

        // Page sections
        if (activate === "all" || activate === "sections") {
          var $targets = $("h2.section-header[id]");
          $targets.each(function () {
            var id = $(this).attr("id");
            var title = $(this).text().trim();
            var top = $(this).offset().top;
            var y = ((top / documentHeight) * viewportHeight) + scrollbarArrowHeight;
            addDot(y, id, title, "dot-shortcut--section");
          });
        }
      }

      // Run when page is ready + when all images are loaded + on viewport resize
      $(function() {
        var $lodelContainer = $("#lodel-container");
        var $root = $lodelContainer.length === 0 ? $("body") : $lodelContainer;
        $("<div class='dot-shortcuts-placeholder'><div class='dot-shortcuts-container'></div></div>").appendTo($root);
        var $container = $(".dot-shortcuts-container");

        if (devMode) {
          // In dev mode, wait for less to be ready
          window.setTimeout(waitAndRun, 1000);
        } else {
          waitAndRun();
        }
        onImagesLoaded(waitAndRun);
        $(window).on("resize", waitAndRun);
        $(document).on("zoomLevelChanged", waitAndRun);

        // Display on hover and scroll events
        var timeoutId;
        function hideContainer() {
          $container.removeClass("visible");
          timeoutId = undefined;
        }
        function displayContainer() {
          if (timeoutId) {
            window.clearTimeout(timeoutId);
          } else {
            $container.addClass("visible");
          }
          timeoutId = window.setTimeout(hideContainer, 1000);
        }
        $(window).on("scroll", displayContainer);
        $container.hover(displayContainer);
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

        var margin = 10;
        var minTop = 0;
        var maxBottom = $("#sidenotes").offset().top + $("#sidenotes").innerHeight() - 20;

        var hideThisAndNext = function($el) {
          $el.add($el.nextAll()).hide();
        };

        $("#sidenotes > p:not(.notesbaspage--more)").each(function () {
          try {
            $(this).show();
            var $a = $(this).find("a.FootnoteSymbol");
            if ($a.length === 0) return;

            var href = $a.attr("href");
            var targetId = href.replace("#ftn", "#bodyftn");
            var $target = $(targetId);

            // Barriere mobile
            if ($target.length === 0) {
              $(this).hide();
              return;
            }

            var top = $target.offset().top;
            if (top <= minTop) {
              top = minTop;
            }
            $(this).offset({ top: top }); // afficher pour lire height
            var height = $(this).height();
            var bottom = top + height;

            if (bottom > maxBottom) {
              // Vérifier qu'il n'y a pas la place au dessus
              var $prev = $(this).prev("p");
              if ($prev.length !== 1) {
                hideThisAndNext($(this));
                return false;
              }

              var requiredTop = maxBottom - height;
              var emptyY = $prev.offset().top + $prev.height() + margin;

              if (requiredTop <= emptyY) {
                hideThisAndNext($(this));
                return false;
              }

              $(this).offset({ top: requiredTop });
              bottom = requiredTop + height;
            }

            minTop = bottom + margin;

          } catch (error) {
            $(this).hide();
            console.error(error, $(this));
          }
        });
      };

      var waitAndRun = function() {
        window.setTimeout(function() {
          setSidenotesPosition();
        }, 100);
      };

      // Run when page is ready + when all images are loaded + on viewport resize
      $(waitAndRun);
      onImagesLoaded(waitAndRun);
      $(window).on("resize", waitAndRun);
      $(document).on("zoomLevelChanged", waitAndRun);
    }
  }
};
