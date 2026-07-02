#!/usr/bin/env node
// Build css

const path = require("node:path");
const fs = require("node:fs");
const { execSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");

function run(command) {
  execSync(command, {
    cwd: root,
    stdio: "inherit"
  });
}

run("lessc less/site.less public/css/site.css --autoprefix");

if (fs.existsSync(path.join(root, "less", "pdf.less"))) {
  run("lessc less/pdf.less public/css/pdf.css --autoprefix");
}
