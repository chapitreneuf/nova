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

  function waitAndRun() {
    var errors = getContrastErrors();
    console.log(errors);
  }

  if (window.devMode === true) {
    // In dev mode, wait for less to be ready
    window.setTimeout(waitAndRun, 1000);
  } else {
    waitAndRun();
  }
});
