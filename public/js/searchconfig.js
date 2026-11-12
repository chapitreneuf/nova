const FlexSearch = globalThis.FlexSearch;

export default {
  // Preset utilisé par la recherche
  use: "server",

  // Preset utilisé en fallback, notamment si les index n'existent pas sur le serveur
  fallback: "client",

  // Liste des presets
  presets: {
    client: {
      fetch: false,
      layers: [
        {
          name: "main",
          flexsearchConfig: {
            tokenize: "strict",
            document: {
              id: "id",
              index: ["title", "altertitle", "subtitle", "authors", "keywords"]
            }
          }
        }
      ]
    },
    server: {
      fetch: "./tpl/public/index/",
      layers: [
        {
          name: "minimal",
          flexsearchConfig: {
            tokenize: "forward",
            document: {
              id: "id",
              index: ["title", "altertitle", "subtitle", "authors"]
            }
          }
        },
        {
          name: "metadata",
          flexsearchConfig: {
            tokenize: "strict",
            document: {
              id: "id",
              index: ["keywords", "abstract", "introduction", "notice"]
            }
          }
        },
        {
          name: "fulltext",
          flexsearchConfig: {
            tokenize: "strict",
            document: {
              id: "id",
              index: ["text", "appendix", "notes", "addenda"]
            }
          }
        }
      ]
    }
  },

  extend: function(obj = {}) {
    return Object.assign({}, this, obj);
  }
};
