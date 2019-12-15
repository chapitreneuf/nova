(function($) {
	$.fn.largetable = function(options) {
		var scrollbarsHeight;

		// Add CSS rules
		function addCSS(rule) {
			var css = document.createElement("style");
			css.type = "text/css";
			css.innerHTML = rule;
			document.body.appendChild(css);
		}

		// Fix shadow covering scollbars
		function fixShadowsHeight($scroller) {
			scrollbarsHeight = (function(div) {
				return div.offsetHeight - div.clientHeight;
			})($scroller.get(0));
			if (scrollbarsHeight) {
				addCSS(".largetable:before, .largetable:after { bottom: " + scrollbarsHeight + "px; }");
			}
		}

		// Function to render shadows
		function renderShadows() {
			var pos = $(this).scrollLeft();
			var $container = $(this).parent(".largetable");
			$container.toggleClass("largetable-shadow-left", pos > 0);
			$container.toggleClass("largetable-shadow-right", pos < $(this).find("table").width() - $(this).width());
		}

		// Maximize table
		function toggleMaximize($container) {
			var classname = "largetable-maximized";
			$container.toggleClass(classname);
			var isMaximized = $container.hasClass(classname);

			// Disable scroll on body
			$("body").toggleClass("largetable-noscroll", isMaximized);
			
			// Re-render shadows on unmaximize (for Blink-based browsers)
			var $scroller = $container.find(".largetable-scroller");
			renderShadows.bind($scroller)();
			
			// Dispatch event
			var $table = $scroller.find("table");
			$table.trigger("toggleMaximize");
			$table.trigger(isMaximized ? "maximize" : "unmaximize");
		}

		// Close maximized table on 'Esc' keypress
		function initKeypress() {
			$(document).on("keyup", function (e) {
				if (e.keyCode === 27) {
					var $maximized = $(".largetable-maximized");
					if ($maximized.length === 0) return;
					toggleMaximize($maximized);
				}
			});
		}

		// Init maximize function
		function initMaximize() {
			var $container = $(this).parent(".largetable");
			var $btn = $("<button class='largetable-maximize-btn'></button>").appendTo($container);
			$btn.on("click", function() {
				toggleMaximize($container);
			});
		}

		// Init
		this.each(function() {
			var $table = $(this);

			if (!$table.is("table")) return;

			$table.wrap("<div class='largetable'>");
			$table.wrap("<div class='largetable-scroller'>");
			var $scroller = $table.parent(".largetable-scroller");

			if (!scrollbarsHeight) {
				fixShadowsHeight($scroller);
			}

			if (options.enableMaximize) {
				initMaximize.bind($scroller)();
				initKeypress();
			}
			renderShadows.bind($scroller)();
			$scroller.scroll(renderShadows);
		});

		return this;
	};
}(jQuery));
