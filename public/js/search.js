// Initialize FlexSearch library
var indexFieldsByPriority = ["title", "altertitle", "subtitle", "description", "authors"];
var hiddenClassname = "d-none";

function runSearch() {
  var query = $("#main-container input[name='query']").val();

  if (query.length < 3) {
    showNoResultMessage();
    return;
  }
  window.searchResults = search(query); // Global context to recall on user interaction
  if (!window.searchResults || Object.keys(window.searchResults).length === 0) {
    showNoResultMessage();
    return;
  }
  displayResults();
  $("#search-more-link").on("click", function() {
    displayResults();
  });
}

function search(query) {
  var resultsByField = index.search(query);
  var resultsIds = [];
  indexFieldsByPriority.forEach(function(fieldName) {
    var foundResults = resultsByField.find(function(item) {
      return item.field === fieldName;
    });
    if (foundResults) {
      foundResults.result.forEach(function(id) {
        if (!resultsIds.includes(id)) resultsIds.push(id);
      });
    }
  });
  var searchResults = resultsIds.map(function(id) {
    return index.get(id);
  });
  return searchResults;
}

function displayResults() {
  var startingIndex = $(".toc__li").length;
  var limit = $("#search-results").data("paginate");

  for (var i = startingIndex; i < window.searchResults.length; i++) {
    var item = window.searchResults[i];
    if (!item.id || !item.title) return;
    var html = ["<li class='toc__li toc__li--class-" + item.classname + " lang-" + item.lang + " dir-" + item.dir + "' lang='" + item.lang + "'>"];
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
  var flag = $(".toc__li").length >= window.searchResults.length;
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

// Main
// Create index
var index = new FlexSearch.Document({
  tokenize: "forward",
  charset: "latin:advanced",
  cache: 100,
  document: {
    id: 'id',
    store: [
      "id", "number", "title", "subtitle", "authors", "classname", "lang", "dir"
    ],
    index: indexFieldsByPriority
  }
});

// Load index data asynchronously
var dataURL = "?page=search_data&token=" + window.jssearchURLToken;
var fetchPromise = fetch(dataURL, {method: "GET", cache: "force-cache"});
fetchPromise.then(function (response) {
  response.text().then(function(data) {
    JSON.parse(data).forEach(function(item) {
      // Create index
      index.add({
        id: item.id,
        number: item.n,
        title: item.t,
        subtitle: item.st,
        altertitle: item.at,
        authors: item.au,
        description: item.d,
        lang: item.l,
        dir: item.ld,
        classname: item.c === "p" ? "publication" : "text"
      });
    });

    // Search
    runSearch();
  });
}, function() {
  console.error("Could not load JSON data");
  showNoResultMessage();
});

$(function() {
  // Init submit button
  $(".nav-search-form").on("submit", function(event) {
    event.preventDefault();
    clearResults();
    runSearch();
  });
});
