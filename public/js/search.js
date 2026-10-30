const configURL = "./tpl/public/js/search.config.json";
const indexDirURL = "./tpl/public/index/";
const { jssearchURLToken } = window;
const hiddenClassname = "d-none";

const indexes = new Map();
const metadatas = new Map();
let allDocuments = []; // only used with client generated indexes
let searchIteration = 0;
let searchResults = [];
let displayCount = 0;
let pages = 0;

// Fetch and parse a JSON file
async function fetchJSON(url, options = {}) {
  const fetchConfig = Object.assign({ method: "GET" }, options);
  const response = await fetch(url, fetchConfig);
  if (!response.ok) throw new Error(`Could not load ${url}`);
  return response.json();
}

// Return an index created from the provided layer
async function loadIndex(layer, indexList) {
  // Find index files list
  if (!indexList[layer.name]) throw new Error(`Index ${layer.name} is not referenced in indexlist.json`);
  const filesNames = indexList[layer.name];

  // Create index
  const index = new FlexSearch.Document(layer.flexsearchConfig);

  // Import files
  for (const fileName of filesNames) {
    const response = await fetch(indexDirURL + fileName);
    if (!response.ok) throw new Error(`Could not load index ${fileName}`);
    const [ , assetName ] = fileName.split("-");
    const data = await response.text();
    await index.import(assetName, data);
  }
  return index;
}

// Search in loaded indexes
async function search() {
  const query = $("#main-content input[name='query']").val();
  const iteration = ++searchIteration;
  searchResults = [];

  // TODO: if (query.trim().length < minLengthInEncoderConfig ) {
  if (!query.trim()) {
    renderResults();
    return;
  }

  for (const [name, index] of indexes) {
    const resultsByField = await index.searchAsync(query);
    if (iteration !== searchIteration) return;
    for (const { result } of resultsByField) {
      for (const id of result) {
        if (!searchResults.includes(id)) searchResults.push(id);
      }
    }
  }
  if (iteration === searchIteration) await renderResults();
}

async function getMetadatas(ids, fields) {
  // If client generated indexes
  if (allDocuments.length > 0) {
    return allDocuments.filter(({id}) => ids.includes(id));
  }
  // If server generated indexes
  let url = "?page=get_documents";
  if (ids) {
    url += "&ids=" + ids.join(",");
  }
  if (fields) {
    url += "&fields=" + fields.join(",");
  }
  const data = await fetchJSON(url);
  return data;
}

// Render results
// TODO: le spinner doit sans doute continuer à tourner tant que la recherche est en cours
async function renderResults() {
  if (pages === 0) {
    pages = 1;
  }
  const start = displayCount;
  const paginate = $("#search-results").data("paginate");
  const end = pages * paginate;
  if (start >= end) return;
  const ids = searchResults.slice(start, end);
  if (ids.length === 0) return;

  displayCount += ids.length;
  const fields = ["title", "subtitle", "number", "authors", "lang"];
  const items = await getMetadatas(ids, fields);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item.id || !item.title) return;
    const html = ["<li class='toc__li toc__li--class-" + item.classname + " lang-" + item.lang + " dir-" + item.dir + "' lang='" + item.lang + "'>"];
    if (item.authors) html.push("<p class='toc__author'>" + item.authors + "</p>");
    if (item.number) html.push("<p class='publi-number'>" + item.number + "</p>");
    html.push("<p class='toc__title'><a href='" + item.id + "'>" + item.title + "</a></p>");
    if (item.subtitle) html.push("<p class='toc__subtitle'>" + item.subtitle + "</p>");
    html.push("</li>");

    if (i === 0) $(".spinner").addClass(hiddenClassname);

    $("#search-results-list").append(html.join(""));
  }
  const flag = $(".toc__li").length >= searchResults.length;
  $("#search-more-link").toggleClass(hiddenClassname, flag);
}

function clearResults() {
  $("#search-results-list").empty();
  $(".spinner").removeClass(hiddenClassname);
  $("#search-more-link").addClass(hiddenClassname);
  $("#search-no-result").addClass(hiddenClassname);
  searchResults = [];
  displayCount = 0;
  pages = 0;
}

function showNoResultMessage() {
  $(".spinner").addClass(hiddenClassname);
  $("#search-no-result").removeClass(hiddenClassname);
}

function updatePage($sourceForm) {
  // Update all search inputs
  const $sourceInput = $sourceForm.find("input[name='query']");
  const query = $sourceInput.val();
  $(("input[name='query']")).not($sourceInput).val(query);

  // Update page title
  const newTitle = document.title.replace(/(&quot;|\").*(&quot;|\")/, "\"" + query + "\"");
  document.title = newTitle;

  // Update history
  history.replaceState({ search: query }, "", "?page=search&query=" + query);
}

// Main
$(async function() {
  const { use, presets } = await fetchJSON(configURL);
  if (!presets || !presets[use]) {
    throw new Error("Could not load search config.");
  }
  const searchConfig = presets[use];
  const { layers } = searchConfig;

  if (!searchConfig.fetch) {
    // Browser generated index
    try {
      // Create index
      // We only use the fist index in browser
      const { name, flexsearchConfig } = layers[0];
      const index = new FlexSearch.Document(flexsearchConfig);
      const url = "?page=get_documents&token=" + jssearchURLToken;
      const data = await fetchJSON(url, { cache: "force-cache" });
      allDocuments = data;
      data.forEach(item => {
        index.add(item)
      });
      indexes.set(name, index);
      search();
    } catch (err) {
      console.error(err);
      showNoResultMessage();
    }
  } else {
    // Server generated index
    try {
      // Get indexlist
      const listUrl = indexDirURL + "indexlist.json";
      const indexList = await fetchJSON(listUrl);
      // Load indexes and rerun search every time a loading is completed
      await Promise.allSettled(
        layers.map(async layer => {
          try {
            const index = await loadIndex(layer, indexList);
            indexes.set(layer.name, index);
            console.info("Loaded index: ", layer.name);
            await search();
          } catch (err) {
            console.error(`Index indisponible :`, err);
          }
        })
      );
    } catch (err) {
      console.error(err);
      showNoResultMessage();
    }
  }

  // Init submit button
  $(".search-form").on("submit", function(event) {
    event.preventDefault();
    clearResults();
    updatePage($(this));
    search();
  });

  // Init more button
  $("#search-more-link").on("click", function() {
    pages++;
    renderResults();
  });
});
