#!/usr/bin/env node
// Build Flexsearch Index

const fs = require("node:fs/promises");
const path = require("node:path");

const FlexSearch = require("flexsearch");

const args = process.argv.slice(2);

if (args.length === 0) {
  throw new Error("Argument url manquant.");
}

// TODO: devrait être une option
const indexFieldsByPriority = ["title", "altertitle", "subtitle", "description", "authors"];

// Support de la syntaxe https://user:password@url.com
const [, protocol,, username, password, rest ] = args[0].match(/^(https?):\/\/((.+):(.+)@)?(.*)/);
const url = `${protocol}://${rest}`;

const config = {
  url,
  username,
  password,
  dest: path.join(__dirname, "../public/index/")
};

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
  return Buffer.from(await response.arrayBuffer());
}

function createIndex(data) {
  const items = JSON.parse(data);

  const index = new FlexSearch.Document({
    tokenize: "strict",
    charset: "latin:advanced",
    cache: 100,
    document: {
      id: "id",
      store: [
        "id", "number", "title", "subtitle", "authors", "classname", "lang", "dir"
      ],
      index: indexFieldsByPriority
    }
  });

  items.forEach(item => {
    // Create index
    index.add({
      id: item.id,
      number: item.n || "",
      title: item.t || "",
      subtitle: item.st || "",
      altertitle: item.at || "",
      authors: item.au || "",
      description: item.d || "",
      lang: item.l || "",
      dir: item.ld || "",
      classname: item.c === "p" ? "publication" : "text"
    });
  });
  return index;
}

async function writeIndex(index, dest) {
  await index.export(async function(key, data){
    await fs.writeFile(dest + key, data, "utf8");
  });
}

async function checkImport(config) {
  // !! Meme config que plus haut
  // TODO: il faut donc factoriser la config côté node et browser
  const index = new FlexSearch.Document({
    tokenize: "strict",
    charset: "latin:advanced",
    cache: 100,
    document: {
      id: "id",
      store: [
        "id", "number", "title", "subtitle", "authors", "classname", "lang", "dir"
      ],
      index: indexFieldsByPriority
    }
  });

  const files = await fs.readdir(config.dest);
  for(let i = 0; i < files.length; i++){
    const data = await fs.readFile(path.join(config.dest, files[i]), "utf8");
    await index.import(files[i], data);
  }
  console.log(index);
}

async function main(config) {
  const data = await fetchData(config);
  const index = createIndex(data);
  await writeIndex(index, config.dest);

  // Test d'import pour vérifier l'intégrité de l'index
  await checkImport(config);
}

main(config);
