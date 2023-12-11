import { ConfigAdvancedSearch } from '../../src/interfaces';
const advancedConfig: ConfigAdvancedSearch = {
  advanced_search: {
    lang: {
      query: {
        type: 'selection',
        field: 'language',
      },
    },
    sort: ['slug.keyword', 'record-type-label.keyword'],
    noHighlightLabels: ['description'],
    options: {
      include: [
        'title',
        'description',
        'contenuti.*',
        'storia',
        'scrittura',
        'origine',
        'editor',
        'xml_filename',
        'id',
        'slug',
        'record-type',
        'record-type-label',
      ],
    },
    base_query: {
      field: 'record-type',
      value: [
        'work',
        'book',
        'witness',
        'view_time_event',
        'biography',
        'itinerary',
        'iconography',
        'bibliography_wit',
      ],
    },
    search_groups: {
      /*"query": {
        "type": "fulltext",
        "field": [
          "title",
          "description"
        ],
        "addStar": true
      },*/
      /*"proximity": {
        "type": "proximity",
        "field": "title",
        "query_params": {
          "value": "query-distance-text",
          "slop": "query-distance-value"
        },
      },*/
      'resource-type': {
        type: 'term_value',
        field: 'record-type-label',
        operator: 'OR',
        noHighlight: true,
        separator: ',',
      },
      mrc_work_post_title: {
        type: 'term_value',
        field: 'id',
        operator: 'OR',
        noHighlight: true,
        separator: ',',
      },
      'query-fulltext': {
        type: 'fulltext',
        field: [
          'title',
          'description',
          'contenuti.*',
          'storia',
          'scrittura',
          'origine',
          'editor',
        ],
        noHighlightFields: ['title'],
        addStar: false,
      },
      'query-title': {
        type: 'fulltext',
        field: ['title'],
        addStar: false,
        noHighlight: true,
        baseQuery: {
          field: 'record-type',
          value: ['work', 'book', 'witness'],
        },
      },
      'query-content': {
        type: 'fulltext',
        field: ['contenuti*', 'works.title'],
        addStar: false,
      },
    },
    search_full_text: {
      inner_hits: {
        sort: ['_doc'],
        source: ['*.node', '*._path', '*.xml_text', '*._refs'],
        size: 35,
      },
      options: {
        path: 'xml_transcription_texts_json',
      },
      search_groups: {
        'query-text': {
          type: 'fulltext',
          fields: ['xml_transcription_texts_json.xml_text'],
          highlight: [{ field: 'xml_transcription_texts_json.xml_text' }],
        },
        mrc_work_mrc_tei_name: {
          type: 'fulltext',
          fields: ['*._attr.key'],
          highlight: [
            {
              field: '*._attr.key',
              options: {
                pre_tags: [''],
                post_tags: [''],
              },
            },
          ],
        },
        'query-text-authority': {
          type: 'xml_attribute',
          fields: ['*._attr.key'],
          'data-value': 'query-text',
          highlight: [
            {
              field: '*._attr.key',
              options: {
                pre_tags: [''],
                post_tags: [''],
              },
            },
          ],
        },
        'query-bibl': {
          type: 'fulltext',
          options: {
            nested: 'xml_transcription_texts_json.quote',
          },
          fields: ['*.quote.xml_text'],
          highlight: [
            {
              field: '*.quote.xml_text',
            },
          ],
        },
        mrc_work_mrc_tei_bibliography: {
          type: 'fulltext',
          fields: ['*._refs.*'],
          highlight: [
            {
              field: '*._refs.*',
              options: {
                pre_tags: [''],
                post_tags: [''],
              },
            },
          ],
        },
        /*"query_name_key": {
            "type": "xml_attribute",
            "fields": ['*.name._attr.key'],
            "highlight": ['*.name._attr.key']
            
        },
        "query-bibl": {
            "type": "header-meta",
            "collection": "petrarca",
            "field": "bibl",
            "perPage": 50
        },
        "query-distance-value": {
            "type": "proximity",
            "collection": "petrarca",
            "perPage": 50,
            "field": "title",
            "query_params": {
                "value": "query-distance-text",
                "slop": "query-distance-value"		
            }		
        }*/
      },
    },
    show_highlights: true,
    results: [
      {
        label: 'title',
        field: 'title',
      },
      {
        label: 'risorsa',
        field: 'record-type',
      },
      {
        label: 'metadata',
        fields: [
          {
            label: 'sezione',
            field: 'record-type-label',
          },
        ],
        'max-char': 100,
      },
      {
        label: 'type',
        field: 'record-type',
      },
      {
        label: 'id',
        field: 'id',
      },
      {
        label: 'link',
        isLink: true,
        field: '/{record-type}/{id}/{slug}',
      },
    ],
    dynamic_options: {
      fields: [
        {
          key: 'post_title',
          content_type: 'mrc_work',
          type: 'post',
        },
        {
          key: 'mrc_tei_bibliography',
          content_type: 'mrc_work',
          type: 'taxonomy',
          value: 'name',
        },
        {
          key: 'mrc_tei_name',
          content_type: 'mrc_work',
          type: 'taxonomy',
        },
      ],
    },
  },
};
export default advancedConfig;
