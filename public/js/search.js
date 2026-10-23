// Initialize FlexSearch library
const hiddenClassname = "d-none";

async function fetchJSON(url, options = {}) {
  const fetchConfig = Object.assign({ method: "GET" }, options);
  const data = await fetch(url, fetchConfig);
  return data.json();
}

function createIndexes(layers) {
  return layers.map(layer => new FlexSearch.Document(layer.flexsearchConfig));
}

function runSearch(index) {
  const query = $("#main-content input[name='query']").val();

  if (query.length < 3) {
    showNoResultMessage();
    return;
  }
  const searchResults = search(query, index);
  if (!searchResults || Object.keys(searchResults).length === 0) {
    showNoResultMessage();
    return;
  }
  displayResults(searchResults);
  $("#search-more-link").on("click", function() {
    displayResults(searchResults);
  });
}

function search(query, index) {
  const resultsByField = index.search(query);
  const indexFieldsByPriority = index.field;

  const resultsIds = [];
  indexFieldsByPriority.forEach(function(fieldName) {
    const foundResults = resultsByField.find(function(item) {
      return item.field === fieldName;
    });
    if (foundResults) {
      foundResults.result.forEach(function(id) {
        if (!resultsIds.includes(id)) resultsIds.push(id);
      });
    }
  });
  const searchResults = resultsIds.map(function(id) {
    return index.get(id);
  });
  return searchResults;
}

function displayResults(searchResults) {
  const startingIndex = $(".toc__li").length;
  let limit = $("#search-results").data("paginate");

  for (let i = startingIndex; i < searchResults.length; i++) {
    const item = searchResults[i];
    if (!item.id || !item.title) return;
    const html = ["<li class='toc__li toc__li--class-" + item.classname + " lang-" + item.lang + " dir-" + item.dir + "' lang='" + item.lang + "'>"];
    if (item.authors) html.push("<p class='toc__author'>" + item.authors + "</p>");
    if (item.number) html.push("<p class='publi-number'>" + item.number + "</p>");
    html.push("<p class='toc__title'><a href='" + item.id + "'>" + item.title + "</a></p>");
    if (item.subtitle) html.push("<p class='toc__subtitle'>" + item.subtitle + "</p>");
    html.push("</li>");

    if (i === 0) $(".spinner").addClass(hiddenClassname);

    $("#search-results-list").append(html.join(""));
    limit--;
    if (limit <= 0) break;
  }
  const flag = $(".toc__li").length >= searchResults.length;
  $("#search-more-link").toggleClass(hiddenClassname, flag);
}

function clearResults() {
  $("#search-results-list").empty();
  $(".spinner").removeClass(hiddenClassname);
  $("#search-more-link").addClass(hiddenClassname);
  $("#search-no-result").addClass(hiddenClassname);
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
  const configURL = "./tpl/public/js/search.config.json";
  const { use, presets } = await fetchJSON(configURL);
  if (!presets || !presets[use]) {
    throw new Error("Could not load search config.");
  }
  const searchConfig = presets[use];

  const indexes = createIndexes(searchConfig.layers);
  const index = indexes[0];

  if (!searchConfig.fetch) {
    // Browser generated index
    try {
      // Load index data asynchronously to populate index, then search
      const url = "?page=search_data&token=" + window.jssearchURLToken;
      const data = await fetchJSON(url, { cache: "force-cache" });
      data.forEach(item => {
        index.add(item)
      });
      runSearch(index);
    } catch (err) {
      console.error(err);
      showNoResultMessage();
    }
  } else {
    // Server generated index
    // TODO
  }

  // Init submit button
  $(".search-form").on("submit", function(event) {
    event.preventDefault();
    clearResults();
    updatePage($(this));
    runSearch(index);
  });
});
