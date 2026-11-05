#!/usr/bin/env node
// Build css

import { dirname, join, resolve } from "node:path";
import { existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, "..");

function run(command) {
  execSync(command, {
    cwd: root,
    stdio: "inherit"
  });
}

run("lessc less/site.less public/css/site.css --autoprefix");

if (existsSync(join(root, "less", "pdf.less"))) {
  run("lessc less/pdf.less public/css/pdf.css --autoprefix");
}
