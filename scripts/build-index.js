#!/usr/bin/env node
// Build Flexsearch Index

const { writeFile } = require("node:fs/promises");
const { Readable } = require("node:stream");
const path = require("node:path");

const args = process.argv.slice(2);

if (args.length === 0) {
  throw new Error("Argument url manquant.");
}

const config = {
  url: args[0],
  dest: path.join(__dirname, "../public/data/searchindex.json"),
  username: args[1],
  password: args[2]
}

async function fetchData({ url, username, password }) {
  const auth = Buffer.from(`${username}:${password}`).toString("base64");
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return Readable.fromWeb(response.body);
}

async function main(config) {
  const data = await fetchData(config);
  await writeFile(config.dest, data);
}

main(config);
