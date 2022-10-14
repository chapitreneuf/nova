$(function () {
  function waitAndRun() {
    var errors = contrast.check();
    console.log(errors);
  }

  if (window.devMode === true) {
    // In dev mode, wait for less to be ready
    window.setTimeout(waitAndRun, 1000);
  } else {
    waitAndRun();
  }
});
