

import { ConfigAdvancedSearch } from '../../src/interfaces';
const advancedConfig: ConfigAdvancedSearch = {
  "advanced_search": {
    "lang": {
      "query": {
        "type": "selection",
        "field": "language"
      }
    },
    "sort": {
      "section": ["record-type-label.keyword", "title.sort"],
      "slug": ["slug.keyword"]    
    },
    noHighlightLabels: ["description"],
    "options": {
      "include": ["title", "description", "contenuti.*", "storia", "scrittura", "origine", "editor", "xml_filename", "id", "slug", "record-type", "record-type-label"]
    },
    "base_query": {
      "field": "record-type",
      "value": ["work", "book", "witness", "view_time_event", "biography", "itinerary", "iconography", "bibliography_wit", "tools"]
    },
    "search_groups": {
      "resource-type": {
        "type": "term_value",
        "field": "record-type-label.keyword",
        "operator": "OR",
        "noHighlight": true,
        separator: ","
      },
      "mrc_post_type": {
        "type": "term_value",
        "field": "record-type",
        "operator": "OR",
        "noHighlight": true,
        separator: ","
      },
      "mrc_work_post_title": {
        "type": "term_value",
        "field": "id",
        "operator": "OR",
        "noHighlight": true,
        separator: ","
      },
      "query-fulltext": {
        "type": "fulltext",
        "field": ["title", "description", "contenuti.*", "storia", "scrittura", "origine", "editor", "author.name", "curator.name"],
        "noHighlightFields": ["title"],
        "addStar": false,
        stripDoubleQuotes: false,
        highlightOptions: {
          "number_of_fragments": 40
        }
      },
      "query-title": {
        "type": "fulltext",
        "field": [
          "title"
        ],
        "addStar": false,
        "noHighlight": true,
        "baseQuery": {
          "field": "record-type",
          "value": ["work", "book", "witness"]
        }
      },
      "query-content": {
        "type": "fulltext",
        "field": [
          "contenuti*",
          "works.title"
        ],
        "addStar": false
      }
    },
   "search_full_text": {
      "inner_hits": {
        "sort": ["_doc"],
        "source": ["*.node", "*._path", '*.xml_text', '*._refs'],
        "size": 45
      },
      "options": {
        "path": 'xml_transcription_texts_json'
      },
      "search_groups": {
        "query-text": {
          "type": "fulltext",
          "fields": ['xml_transcription_texts_json.xml_text'],
          "highlight": [
            { "field": 'xml_transcription_texts_json.xml_text', }
          ],
          options: {
            "proximity_search_param": {
              field: "query-distance-value"
            }
          }
        },
        "mrc_work_mrc_tei_name": {
          "type": "fulltext",
          "fields": ['*._attr.key.keyword'],
          options: {
            exact_match: true
          },
          "highlight": [
            {
              "field": '*._attr.key.keyword',
              "options": {
                "pre_tags": [""],
                "post_tags": [""]
              }
            }]
        },
        "mrc_work_mrc_tei_place": {
          "type": "fulltext",
          "fields": ['*._attr.key.keyword'],
          options: {
            exact_match: true
          },
          "highlight": [
            {
              "field": '*._attr.key.keyword',
              "options": {
                "pre_tags": [""],
                "post_tags": [""]
              }
            }]
        },
        "query-text-authority": {
          "type": "xml_attribute",
          "fields": ['*._attr.key'],
          "data-value": 'query-text',
          "highlight": [
            {
              "field": '*._attr.key',
              "options": {
                "pre_tags": [""],
                "post_tags": [""]
              }
            }
          ]
        },
        "query-sources": {
          "search_groups": {
            "query-bibl": {
              "type": "fulltext",
              "fields": ['*.quote.xml_text'],
              "highlight": [
                {
                  "field": '*.xml_text',
                  "options": {
                    "pre_tags": ["<em class='mrc__text-emph'>"],
                    "post_tags": ["</em>"]
                  }
                }
              ]
            },
            "mrc_work_mrc_tei_bibliography": {
              "type": "fulltext",
              "fields": ['*.quote._refs.*.keyword'],
              /*  "options": {
                            "nested": "xml_transcription_texts_json.quote"
                          },*/
              "highlight": [
                {
                  "field": '*.xml_text'
                },
                {
                  "field": '*._refs.label.*',
                  "options": {
                    "pre_tags": [""],
                    "post_tags": [""]
                  }
                }
              ]
            }
          },
          "options": {
            "nested": "xml_transcription_texts_json.quote"
          }
        }
      }
    },
    "show_highlights": true,
    "results": [
      {
        "label": "title",
        "field": "title"
      },
      {
        "label": "risorsa",
        "field": "record-type"
      },
      {
        "label": "metadata",
        "fields": [{
          "label": "sezione",
          "field": "record-type-label"
        },
        ],
        "max-char": 100
      },
      {
        "label": "type",
        "field": "record-type"
      },
      {
        "label": "routeId",
        "field": "record-type"
      },
      {
        "label": "slug",
        "field": "slug"
      },
      {
        "label": "id",
        "field": "id"
      },
    /*  {
        "label": "link",
        "isLink": true,
        "field": "/{record-type}/{id}/{slug}"
      }*/
    ],
    dynamic_options: {
      fields: [
        {
          "key": "post_title",
          "content_type": "mrc_work",
          "type": "post"
        },
        {
          "key": "mrc_tei_bibliography",
          "content_type": "mrc_work",
          "type": "taxonomy",
          "value": "name"
        },
        {
          "key": "mrc_tei_name",
          "content_type": "mrc_work",
          "type": "taxonomy",
          "value": "name"
        },
        {
          "key": "mrc_tei_place",
          "content_type": "mrc_work",
          "type": "taxonomy",
          "value": "name"
        }
      ]
    }
  }
}
export default advancedConfig;