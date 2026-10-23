#!/usr/bin/env node
// Build Flexsearch Index

const fs = require("node:fs/promises");
const path = require("node:path");
const util = require("node:util");

const FlexSearch = require("flexsearch");

async function emptyDir(dirPath) {
  for (const file of await fs.readdir(dirPath)) {
    if (file === ".keep") continue;
    await fs.unlink(path.join(dirPath, file));
  }
}

async function fetchData(src) {
  // Support de la syntaxe https://user:password@url.com
  const [, protocol,, username, password, rest ] = src.match(/^(https?):\/\/((.+):(.+)@)?(.*)/);
  const url = `${protocol}://${rest}`;

  const auth = Buffer.from(`${username}:${password}`).toString("base64");
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

function createIndexes(searchConfig) {
  return searchConfig.layers.map(i => {
    return Object.assign({
      document: new FlexSearch.Document(i.flexsearchConfig)
    }, i);
  });
}

function populateIndexes(indexes, data) {
  data.forEach(item => {
    indexes.forEach(index => index.document.add(item));
  });
  return indexes;
}

async function writeIndexes(indexes, dest) {
  for (const index of indexes) {
    await index.document.export(async function(key, data){
      await fs.writeFile(dest + index.name + "-" + key, data, "utf8");
    });
  }
}

async function checkImport(searchConfig, dest) {
  const indexes = createIndexes(searchConfig);
  const files = await fs.readdir(dest);
  for (const file of files) {
    if (file === ".keep") {
      continue;
    }
    const [ indexName, assetName ] = file.split("-");
    const relatedIndex = indexes.find(index => index.name === indexName);
    if (!relatedIndex) {
      throw new Error(`Echec de la vérification : impossible de trouver l'index ${ indexName }.`);
    }
    const data = await fs.readFile(path.join(dest, file), "utf8");
    await relatedIndex.document.import(assetName, data);
  }
  console.log(util.inspect(indexes, { depth: 5 }));
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    throw new Error("Argument url manquant.");
  }

  // Options CLI
  // URL de la source en premier argument
  const src = args[0];
  // --check: test d'import à la fin pour vérifier l'intégrité de l'index généré
  const check = args.find(value => value === "--check") ? true : false;

  // Chemins
  const dest = path.join(__dirname, "../public/index/");
  const configPath = path.join(__dirname, "../public/js/search.config.json");

  // Lecture de la configuration
  const searchConfigStr = await fs.readFile(configPath);
  const { use, presets } = JSON.parse(searchConfigStr);
  if (!presets || !presets[use]) {
    throw new Error("Could not load search config.");
  }
  const searchConfig = presets[use];

  // Vider les anciens index
  emptyDir(dest);

  // Main logic
  const str = await fetchData(src);
  const data = JSON.parse(str);
  const emptyIndexes = createIndexes(searchConfig);
  const indexes = populateIndexes(emptyIndexes, data);
  await writeIndexes(indexes, dest);

  if (check) {
    await checkImport(searchConfig, dest);
  }
}

main();
