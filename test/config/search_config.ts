import { ConfigSearch } from "../../src/interfaces";

const searchConfig : ConfigSearch = {
  /** EDITION **/
  edition: {
    base_query: {
      field: "record-type",
      value: "edition",
    },
    sort: {title: {field: "title.sort"}},
    lang: {
      query: {
        type: "selection",
        field: "language",
      },
    },
    "facets-aggs": {
      type: "obj",
      aggregations: {
        luogo: {
          nested: true,
          nestedFields: ["taxonomy", "luogo"],
          search: "taxonomies.luogo.key.keyword",
          title: "taxonomies.luogo.name.keyword",
        },
        author: {
          nested: true,
          nestedFields: ["creator"],
          search: "creator.slug.keyword",
          title: "creator.title.keyword",
        },
        temporalCoverage: {
          nested: false,
          search: "temporalCoverage.keyword",
          title: "temporalCoverage.keyword",
        },
        subject: {
          nested: true,
          search: "subject.key.keyword",
          title: "subject.name.keyword",
        },
      },
    },
    filters: {
      query: {
        type: "fulltext",
        field: ["title"],
        addStar: true,
      },
      luogo: {
        type: "multivalue",
        field: "taxonomies.luogo.key.keyword",
        operator: "AND",
      },
      author: {
        type: "multivalue",
        field: "creator.slug.keyword",
        operator: "AND",
      },
      temporalCoverage: {
        type: "multivalue",
        field: "temporalCoverage.keyword",
        operator: "AND",
      },
      subject: {
        type: "multivalue",
        field: "subject.key.keyword",
        operator: "AND",
      },
      // "languages": {
      // 	"type": "multivalue",
      // 	"field": "lingua.keyword",
      // 	"operator": "AND"
      // }
    },
  },
  results: [
    {
      label: "title",
      field: "title",
    },
    {
      label: "metadata",
      field: ["creator", "spatialCoverage", "temporalCoverage"],
      "max-char": 100,
    },
    {
      label: "image",
      field: "thumbnail",
    },
    {
      label: "id",
      field: "id",
    },
    {
      label: "routeId",
      field: "record-type"
    },
    {
      label: "slug",
      field: "slug"
    }
  ], 
};

export default searchConfig;