$(function () {
  function getContrastErrors() {
    var $lodelContainer = $("#lodel-container");
    var alerts = contrast.check();
    if ($lodelContainer.length === 0) return alerts.errors;
    var errors = alerts.errors.filter(function(item) {
      var $el = item.name;
      return $lodelContainer.has($el).length > 0;
    });
    return errors;
  }

  function rgbToHex(rgb) {
    function valueToHex(value) {
      var hex = Math.floor(value).toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }

    var values = rgb.match(/\d+/g);
    if (values === null) return rgb;
    return "#" + values.map(valueToHex).join("");
  }

  function mergeErrors(errors) {
    return errors.reduce(function (res, e) {
      $el = $(e.name[0]);
      var rgbColor = $el.css("color");
      var rgbBg = contrast.getBackground($el);
      var color = rgbToHex(rgbColor);
      var bg = rgbToHex(rgbBg);
      if (!res[color]) {
        res[color] = [];
      }
      if (!res[color].includes(bg)) {
        res[color].push(bg);
      }
      return res;
    }, {});
  }

  function displayNotifications(notifications) {
    if (!notifications || notifications.length === 0) return;
    $("#contrast-warning").remove();
    var content = "<p>&#9888;&#65039; <b>Les couleurs utilisées sur cette page ne respectent pas <a href='https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#topic3' target='_blank'>les normes d'accessibilité du référentiel RGAA 4.1</a>.</b></p><p>Des contrastes trop faibles entre les couleurs peuvent gêner la navigation de certains visiteurs. Il est conseillé de remplacer les couleurs suivantes :</p><ul></ul><p>Seuls les utilisateurs identifiés peuvent lire ce message.</p>";
    $container = $("<div id='contrast-warning' class='contrast-warning lodeluser-info'>" + content + "</div>");
    $ul = $container.find("ul");

    Object.keys(notifications).forEach(function(color) {
      var bgColors = notifications[color].join(", ");
      var msg = "La couleur " + color + " n'est pas lisible sur les arrière-plans suivants : " + bgColors + ".";
      $("<li>" + msg + "</li>").appendTo($ul);
    });

    $container.insertBefore("#skip-links");
  }

  function addHighlightButton(errors) {
    var elements = errors.map(function(e) {
      return e.name[0];
    });
    var $elements = $(elements);

    var $button = $("<button class='btn btn-outline-dark'>Surligner les problèmes détectés</button>").on("click", function() {
      $elements.css("border", "2px dashed red");

    });
    $button.appendTo("#contrast-warning");
  }

  function waitAndRun() {
    var errors = getContrastErrors();
    if (!errors || errors.length === 0) return;
    console.info("Les problèmes de contraste suivants ont été détectés :", errors);
    var notifications = mergeErrors(errors);
    displayNotifications(notifications);
    addHighlightButton(errors);
  }

  if (window.devMode === true) {
    // In dev mode, wait for less to be ready
    window.setTimeout(waitAndRun, 1000);
  } else {
    waitAndRun();
  }
});
