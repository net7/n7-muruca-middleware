"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESHelper = void 0;
exports.ESHelper = {
    bulkIndex(response, index, Client, ELASTIC_URI) {
        // client = const { Client } = require('@elastic/elasticsearch')
        const client = new Client({ node: ELASTIC_URI }); // ELASTIC_URI  =  serverless "process.env.ELASTIC_URI"
        if (index != '') {
            client.deleteByQuery({
                index: index,
                body: {
                    query: {
                        match_all: {},
                    },
                },
            });
        }
        let body = [];
        const dataset = JSON.parse(response);
        dataset.forEach((element) => {
            body.push({ index: { _index: index } });
            body.push(element);
        });
        client.bulk({ refresh: true, body }, (err, { body }) => {
            if (err)
                console.log(body.errors);
            const response = {
                statusCode: 200,
                body: JSON.stringify(body),
            };
            return response;
        });
    },
    makeSearch(index, body, Client, ELASTIC_URI) {
        return new Promise(function (resolve, reject) {
            const client = new Client({
                node: ELASTIC_URI,
            });
            client.search({
                index: index,
                body: body,
            }, (err, { body }) => {
                if (err)
                    console.log(err);
                resolve(body);
            });
        });
    },
    // per la Query dell'AS dovrò la conf sarà advanced_search_config.ts
    buildQuery(data, conf) {
        const { searchId, results } = data; // searchId = "work", "results: {...}"
        const sort = results ? results.sort : data.sort; // sort = se ci sono i results è SEARCH-RESULTS e trova il sort dentro l'oggetto, altrimenti è SEARCH-FACETS e il sort è al primo livello
        const { limit, offset } = results || {}; // ci sono solo nel SEARCH-RESULTS, altrimenti vuoti
        // QUERY ELASTICSEARCH ... costruisco la query per ES
        const sort_field = conf[searchId].base_query.field // sort_field = "record-type"?
            ? conf[searchId].base_query.field // record-type, altrimenti
            : 'slug.keyword'; // .keyword significa che cercherà su ES lo slug
        const main_query = {
            // prepara il data model per la basic query per ES (cf. Basic Query Theatheor su Postman)
            query: {
                bool: {
                    must: [{ match: { [sort_field]: conf[searchId].base_query.value } }],
                },
            },
            sort,
            aggregations: {},
        };
        //ora deve produrre il sort e le aggregations
        //sorting
        let sort_object = ['slug.keyword'];
        if (conf[searchId].sort) {
            sort_object = conf[searchId].sort.map((f) => {
                // ad es. nella search_config.ts di theatheor abbiamo [ "sort_title.keyword", "slug.keyword" ]
                let tmp;
                if (typeof sort != 'undefined') {
                    // es. "sort_DESC"
                    tmp = sort.split('_')[1];
                    return { [f]: sort.split('_')[1] }; // es. "title.keyword": "DESC"
                }
                else {
                    return { [f]: tmp };
                }
            });
        }
        if (sort) {
            sort === '_score'
                ? (main_query.sort = ['_score'])
                : (main_query.sort = sort_object);
        }
        else {
            main_query.sort = sort_object; // aggiorna il sort della main query con es. "title.keyword": "DESC"
        }
        // pagination params
        if (limit) {
            main_query.size = limit; // aggiunge proprietà "size" a main_query con il valore di results.limit (e.g. 10)
        }
        if (offset || offset === 0) {
            main_query.from = offset; // vd. sopra, aggiunge proprietà "from"
        }
        // aggregations filters
        const query_facets = conf[searchId]['facets-aggs'].aggregations; // { "types": {"nested": false, "search": "taxonomies.type.key.keyword", "title": "taxonomies.type.name.keyword"}, "collocations": {...}, "authors": {...}}
        const dataKeys = Object.keys(data); // ['searchId', 'results', 'query']
        Object.keys(conf[searchId].filters) // [ 'query', 'types', 'authors', 'collocations', 'dates' ]
            .filter((filterId) => dataKeys.includes(filterId)) // query
            .forEach((filterId) => {
            // query, types, authors etc.
            const query_key = conf[searchId].filters[filterId]; // { "type": "fulltext", "field": ["title", "description"], "addStar": true }, {...}
            const query_nested = query_facets[filterId] // {"nested": false, "search": "taxonomies.type.key.keyword", ...}
                ? query_facets[filterId].nested // true || false
                : false;
            if (query_key) {
                switch (query_key.type // fa uno switch su tutti i tipi di query
                ) {
                    case 'fulltext':
                        const ft_query = {
                            // multi_match: {
                            query_string: {
                                query: query_key.addStar // if true
                                    ? '*' + data[filterId] + '*' // il valore della query, es. "query": "*test*"
                                    : data[filterId],
                                fields: query_key.field,
                                default_operator: 'AND',
                            },
                        };
                        main_query.query.bool.must.push(ft_query); // aggiunge oggetto dopo "match" in "must" es. "query_string": { "query": "*bbb*", "fields": [ "title", "description" ] }
                        break;
                    case 'multivalue':
                        if (data[filterId] && query_nested === false) {
                            data[filterId].map((value) => {
                                main_query.query.bool.must.push({
                                    match: {
                                        [query_key.field]: value,
                                    },
                                });
                            });
                        }
                        break;
                    default:
                        break;
                }
            }
            if (query_nested) {
                const nested = {
                    nested: {
                        path: filterId,
                        query: {
                            terms: {
                                [query_facets[filterId].search]: data[filterId],
                            },
                        },
                    },
                };
                main_query.query.bool.must.push(nested);
            }
        });
        //facets aggregations
        for (const key in query_facets) {
            const { nested } = query_facets[key];
            if (nested) {
                main_query.aggregations[key] = {
                    nested: { path: key },
                    aggs: {
                        [key]: {
                            terms: {
                                script: {
                                    source: `if(doc['${query_facets[key].search}'].size() > 0 ) doc['${query_facets[key].search}'].value + '|||' + doc['${query_facets[key].title}'].value`,
                                    lang: 'painless',
                                },
                            },
                        },
                    },
                };
            }
            else {
                main_query.aggregations[key] = {
                    terms: {
                        script: {
                            source: `if(doc['${query_facets[key].search}'].size() > 0 ) doc['${query_facets[key].search}'].value + '|||' + doc['${query_facets[key].title}'].value`,
                            lang: 'painless',
                        },
                    },
                };
            }
        }
        return main_query;
    },
};
