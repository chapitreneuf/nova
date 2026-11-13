const FlexSearch = window.FlexSearch;

const configPath = "./searchconfig.js";
const customConfigPath = "./searchconfig.custom.js";
const { jssearchURLToken } = window;
const hiddenClassname = "d-none";

const indexes = new Map();
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
async function loadIndex(indexDirURL, layer, indexList) {
  // Find index files list
  if (!indexList[layer.name]) throw new Error(`Index ${layer.name} is not referenced in indexlist.json`);
  const filesNames = indexList[layer.name];

  // Create index
  const index = new FlexSearch.Document(layer.flexsearchConfig);

  // Import files
  for (const fileName of filesNames) {
    const response = await fetch(indexDirURL + fileName);
    if (!response.ok) throw new Error(`Could not load index ${fileName}: ${response.status}`);
    const [ , assetName ] = fileName.split("-");
    const data = await response.text();
    try {
      await index.import(assetName, data);
    } catch (err) {
      console.error("Could not load index:", assetName, data);
    }
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

// Get toc HTML for ids
async function getToc(ids) {
  let url = "?page=get_toc&ids=" + ids.join(",");
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load ${url}: ${response.status}`);
  const html = await response.text();
  return html;
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
  const html = await getToc(ids);
  $("#search-results-list").append(html);
  $(".spinner").addClass(hiddenClassname);
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

// Run search according to config
async function run(preset) {
  const { layers } = preset;

  if (!preset.source) {
    throw new Error("preset.source is not defined");
  }

  if (!preset.fetch) {
    // Browser generated index
    // Create index
    // We only use the fist index in client mode
    const { name, flexsearchConfig } = layers[0];
    const index = new FlexSearch.Document(flexsearchConfig);
    const url = preset.source + "&token=" + jssearchURLToken;
    const data = await fetchJSON(url, { cache: "force-cache" });
    allDocuments = data;
    data.forEach(item => {
      index.add(item)
    });
    indexes.set(name, index);
    search();
  } else {
    // Server generated index
    // Get indexlist
    const listUrl = preset.fetch + "indexlist.json";
    const indexList = await fetchJSON(listUrl);
    // Load indexes and rerun search every time a loading is completed
    await Promise.allSettled(
      layers.map(async layer => {
        try {
          const index = await loadIndex(preset.fetch, layer, indexList);
          indexes.set(layer.name, index);
          console.info("Loaded index: ", layer.name);
          await search();
        } catch (err) {
          console.error(`Index indisponible : ${layer.name}.`, err);
        }
      })
    );
  }
}

// Main
$(async function() {
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
  const { use, fallback, presets } = config.default;

  if (!presets || !use) {
    throw new Error("Could not load search config.");
  }
  if (!presets[use]) {
    throw new Error(`Could not find search preset '${use}'.`);
  }

  try {
    await run(presets[use]);
  } catch (err) {
    console.error(err);
    // Run fallback preset in case of error (missing built index for instance)
    if (fallback && presets[fallback]) {
      try {
        console.info(`Running preset '${fallback}' as fallback.`)
        await run(presets[fallback]);
      } catch (err) {
        console.error(err);
        showNoResultMessage();
      }
    } else {
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
