#!/usr/bin/env node
// Build Flexsearch Index

import fs from "node:fs/promises";
import path from "node:path";
import util from "node:util";
import { fileURLToPath } from "node:url";

import FlexSearch from "flexsearch";
import GermanPreset from "flexsearch/lang/de";
import EnglishPreset from "flexsearch/lang/en";
import FrenchPreset from "flexsearch/lang/fr";
FlexSearch.Language = {
  de: GermanPreset,
  en: EnglishPreset,
  fr: FrenchPreset
};
global.FlexSearch = FlexSearch;

async function emptyDir(dirPath) {
  for (const file of await fs.readdir(dirPath)) {
    if (file === ".keep") continue;
    await fs.unlink(path.join(dirPath, file));
  }
}

async function fetchData(src, limit = 100) {
  // Support de la syntaxe https://user:password@url.com
  const [, protocol,, username, password, rest ] = src.match(/^(https?):\/\/((.+):(.+)@)?(.*)/);
  const url = `${protocol}://${rest}`;

  const auth = Buffer.from(`${username}:${password}`).toString("base64");

  const results = [];
  let offset = 0;

  // On découpe en plusieurs requêtes avec offset
  while (true) {
    const separator = url.includes("?") ? "&" : "?";
    const paginatedUrl = `${url}${separator}offset=${offset}&limit=${limit}`;

    const response = await fetch(paginatedUrl, {
      headers: {
        Authorization: `Basic ${auth}`
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error ${paginatedUrl} ${response.status}: ${response.statusText}`);
    }

    try {
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        break;
      }
      results.push(...data);
      if (data.length < limit) {
        break;
      }
      offset += limit;
    } catch (err) {
      throw new Error(`JSON Error ${paginatedUrl}`, err);
    }
  }

  return results;
}

// TODO: harmoniser cette structure avec celle du client search.js. Ici l'index est stocké dans l'objet de config "layer", ce n'est pas clair.
function createIndexes(preset) {
  return preset.layers.map(i => {
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
  const list = {};
  for (const index of indexes) {
    list[index.name] = [];
    await index.document.export(async function(key, data){
      const fileName = index.name + "-" + key;
      await fs.writeFile(dest + fileName, data, "utf8");
      list[index.name].push(fileName);
    });
  }
  const listData = JSON.stringify(list);
  await fs.writeFile(dest + "indexlist.json", listData, "utf8");
}

async function checkImport(preset, dest) {
  const indexes = createIndexes(preset);
  const listStr = await fs.readFile(path.join(dest, "indexlist.json"));
  const list = JSON.parse(listStr);
  for (const index of indexes) {
    const indexFiles = list[index.name];
    for (const file of indexFiles) {
      const data = await fs.readFile(path.join(dest, file), "utf8");
      const [ , assetName ] = file.split("-");
      await index.document.import(assetName, data);
    }
  }
  console.info(util.inspect(indexes, { depth: 5 }));
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    throw new Error("Argument url manquant.");
  }

  // Options CLI
  // URL de la source en premier argument
  const siteURL = args[0].endsWith("\/") ? args[0] : args[0] + "\/";
  // --check: test d'import à la fin pour vérifier l'intégrité de l'index généré
  const check = args.find(value => value === "--check") ? true : false;

  // Chemins
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const dest = path.join(__dirname, "../public/index/");
  const configPath = "../public/js/searchconfig.js";
  const customConfigPath = "../public/js/searchconfig.custom.js";

    // Lecture de la configuration : user d'abord, defaut sinon.
  let config;

  try {
    config = await import(customConfigPath);
    console.info(`Loaded custom config ${ customConfigPath }.`);
  } catch (err) {
    // console.error(err);
    console.info(`Failed to load ${ customConfigPath }.`);
    config = await import(configPath);
    console.info(`Loaded default config ${ configPath }.`);
  }
  const { use, presets } = config.default;

  if (!presets || !use) {
    throw new Error("Could not load search config.");
  }
  if (!presets[use]) {
    throw new Error(`Could not find search preset '${use}'.`);
  }
  const preset = presets[use];

  if (!preset.source || !preset.source.url) {
    throw new Error("preset.source.url is not defined");
  }

  // Vider les anciens index
  emptyDir(dest);

  // Main logic
  const { url, split } = preset.source;
  const src = new URL(url, siteURL).href;
  console.info(`Building index from ${src}`);
  const data = await fetchData(src, split);
  const emptyIndexes = createIndexes(preset);
  const indexes = populateIndexes(emptyIndexes, data);
  await writeIndexes(indexes, dest);

  // FIXME: le paramètre --check ne fonctionne pas quand on lance avec : npm run build-index
  if (check) {
    await checkImport(preset, dest);
    console.info(`Documents in index: ${data.length}`);
  }
}

main();
