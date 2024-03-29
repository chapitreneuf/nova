function onImagesLoaded(fn) {
  // https://stackoverflow.com/a/60949881
  Promise.all(Array.from(document.images).filter(img => !img.complete).map(img => new Promise(resolve => { img.onload = img.onerror = resolve; }))).then(fn);
}

window.fnLoader = {
  // Système de chargement des fonctions
  load: function() {
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
    hamburger: function() {
      $(function() {
        var $body = $("body");
        var $btn = $("#main-menu-toggler");
        var $menus = $("#main-menu, #topbar");
        var classname = "menu-visible";

        function toggleMenu() {
          $body.toggleClass(classname);
          var isExpanding = $body.hasClass(classname);
          var btnLabel = isExpanding ? window.translations.menuPrincipalMasquer : window.translations.menuPrincipalAfficher;
          $btn.attr("aria-label", btnLabel);
          var expandedAttr = isExpanding ? "true" : "false";
          $menus.attr("aria-expanded", expandedAttr);
        }

        $btn.on("click", toggleMenu);
        $menus.on("keydown", function(e) {
          if (!$body.hasClass(classname)) {
            return;
          }
          if (e.key === "Escape" || e.key === "Esc") {
            $btn.focus();
            toggleMenu();
          }
        });
      });
    },

    initLargetable: function() {
      $(function() {
        if (!$("body").hasClass("class-textes")) return;

        function waitAndRun() {
          $(".article__text table").largetable({ enableMaximize: true });
        }

        if (window.devMode === true) {
          // In dev mode, wait for less to be ready
          window.setTimeout(waitAndRun, 1000);
        } else {
          waitAndRun();
        }
      });
    },

    linkIsUrl: function() {
      $(function() {
        $("a[href^='http://'], a[href^='https://']").each(function() {
          var text = $(this).text();
          if (text.match(/^(https?:\/\/|www\.)/)) {
            $(this).addClass("link-is-url");
          }
        });
      });
    },

    mailtoAriaLabel: function() {
      $(function() {
        $("a[href^='mailto:']").each(function() {
          $this = $(this);
          if ($this.attr("aria-label")) return;
          var text = $this.text();
          $this.attr("aria-label", window.translations.ecrireA + " " + text);
        });
      });
    },

    loadTweets: function() {
      $(function() {
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

          $msg.each(function() {
            $(this).addClass("error");
          });
        }

        // Load Twitter script
        window.twttr = (function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0],
            t = window.twttr || {};
          if (d.getElementById(id)) return t;
          js = d.createElement(s);
          js.id = id;
          js.onerror = twttrError;
          js.src = "https://platform.twitter.com/widgets.js";
          fjs.parentNode.insertBefore(js, fjs);

          t._e = [];
          t.ready = function(f) {
            t._e.push(f);
          };

          return t;
        }(document, "script", "twitter-wjs"));

        // When Twitter script is ready, create timelines
        window.twttr.ready(function(twttr) {
          $twitterContainers.each(function() {
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
            .then(function() {
              $container.next(".side-twitter__message").remove();
              twttr.widgets.load($container.get(0));
            })
            .catch(function(err) {
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
    pAnchors: function() {
      // Ready
      $(function() {
        $(".article__text-contents > p.texte").each(function(index) {
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

      function addDot(y, id, title, label, classname) {
        var $container = $(".dot-shortcuts-container");
        $("<a class='dot-shortcut " + classname + "' href='#" + id + "' style='top: " + y + "px' title='" + title + "' aria-label ='" + label + "' data-toggle='tooltip'></a>").appendTo($container);
      }

      function waitAndRun() {
        $(".dot-shortcut").remove();
        var scrollbarArrowHeight = 15;
        var documentHeight = $(document).height();
        var viewportHeight = $(window).height() - (scrollbarArrowHeight * 2);

        // Top anchor
        if (activate === "all" || activate === "top") {
          var label = window.translations.retourEnHaut;
          addDot(10, "", label, label, "dot-shortcut--top");
        }

        // Page sections
        if (activate === "all" || activate === "sections") {
          var $targets = $("h2.section-header[id]");
          $targets.each(function() {
            var id = $(this).attr("id");
            var title = $(this).text().trim();
            var label = window.translations.atteindreSection + " " + title;
            var top = $(this).offset().top;
            var y = ((top / documentHeight) * viewportHeight) + scrollbarArrowHeight;
            addDot(y, id, title, label, "dot-shortcut--section");
          });
        }

        // Init tooltips
        var $dots = $(".dot-shortcut");
        $dots.tooltip({
          animation: false,
          container: ".dot-shortcuts-container",
          customClass: "dot-shortcut-tooltip",
          placement: "left"
        });
      }

      // Run when page is ready + when all images are loaded + on viewport resize
      $(function() {
        var $lodelContainer = $("#lodel-container");
        var $root = $lodelContainer.length === 0 ? $("body") : $lodelContainer;

        // Detect OS and add class if Mac
        var platform = navigator["userAgentData"] && navigator["userAgentData "]["platform"] ? navigator["userAgentData "]["platform"] : (navigator["userAgent"] || navigator["platform"]);
        var isMac = /mac/i.test(platform);
        var isMacClass = isMac ? "is-mac" : ""

        $("<div class='dot-shortcuts-placeholder " + isMacClass + "' aria-hidden='true'><div class='dot-shortcuts-container' aria-label='" + window.translations.naviguerDansLArticle + "'></div></div>").appendTo($root);
        var $container = $(".dot-shortcuts-container");

        if (window.devMode === true) {
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
    pageShortcuts: function() {
      $(function() {
        var $list = $(".page-shortcuts__list");
        var $targets = $("h2.section-header[id]");
        var html = "";
        $targets.each(function() {
          var id = $(this).attr("id");
          var title = $(this).text();
          var label = window.translations.atteindreSection + " " + title;
          html += "<li class='page-shortcuts__item'><a href='#" + id + "' class='page-shortcuts__link' aria-label='" + label + "'>" + title + "</a></li>\n";
        });
        $list.html(html);
      });
    },

    // Sidenotes
    sidenotes: function() {
      var setSidenotesPosition = function() {
        if ($("#sidenotes").length === 0) return;

        var margin = 10;
        var minTop = 0;
        var maxBottom = $("#sidenotes").offset().top + $("#sidenotes").innerHeight() - 20;

        var hideThisAndNext = function($el) {
          $el.add($el.nextAll()).hide();
        };

        $("#sidenotes > p:not(.notesbaspage--more)").each(function() {
          try {
            $(this).show();
            var $a = $(this).find("a.FootnoteSymbol");
            if ($a.length === 0) return;

            var href = $a.attr("href");
            var targetId = href.replace("#ftn", "#bodyftn");
            var $target = $(".article__text-contents " + targetId);

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
    },

    // Responsive iframes
    reframe: function() {
      $(function() {
        reframe("iframe");
      });
    },

    // Accessible dropdowns. Read: https://medium.com/@mariusc23/making-bootstrap-dropdowns-more-accessible-27b2566abdda
    accessibleDropdowns: function() {
      $(document).on("shown.bs.dropdown", function(e) {
        var $dropdown = $(e.target);
        // Set aria-expanded to true
        $dropdown.find(".dropdown-menu").attr("aria-expanded", "true");
        // Set focus on the first link in the dropdown
        setTimeout(function() {
          $dropdown.find(".dropdown-menu li:first-child a").focus();
        }, 10);
      });

      // On dropdown close
      $(document).on("hidden.bs.dropdown", function(e) {
        var $dropdown = $(e.target);
        // Set aria-expanded to false
        $dropdown.find(".dropdown-menu").attr("aria-expanded", "false");
        // Set focus back to dropdown toggle
        $dropdown.find(".dropdown-toggle").focus();
      });
    }
  }
};
