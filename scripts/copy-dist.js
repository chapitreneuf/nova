// Copy macros_custom.dist.html to macros_custom.html is it doesn't already exists

const fs = require("fs").promises;
const constants = require("fs").constants;

(async function() {
  try {
    await fs.copyFile("macros_custom.dist.html", "macros_custom.html", constants.COPYFILE_EXCL);
    console.log("macros_custom.html was successfully created");
  } catch (error) {
    if (error.code === "EEXIST") {
      console.log("macros_custom.html was not overwritten");
      return;
    }
    console.error(error);
  }
})();
