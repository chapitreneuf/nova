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

  function mergeErrors(errors) {
    return errors.reduce(function (res, e) {
      $el = $(e.name[0]);
      var color = $el.css("color");
      var bg = contrast.getBackground($el);
      if (!res[color]) {
        res[color] = [];
      }
      if (!res[color].includes(bg)) {
        res[color].push(bg);
      }
      return res;
    }, {});
  }

  function waitAndRun() {
    var errors = getContrastErrors();
    errors = mergeErrors(errors);
    console.log(errors);
  }

  if (window.devMode === true) {
    // In dev mode, wait for less to be ready
    window.setTimeout(waitAndRun, 1000);
  } else {
    waitAndRun();
  }
});
