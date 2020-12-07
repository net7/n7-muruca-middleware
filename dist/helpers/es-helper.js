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
    // data = body
    buildQuery(data, conf) {
        const { searchId, results } = data;
        const sort = results ? results.sort : data.sort;
        const { limit, offset } = results || {};
        // QUERY ELASTICSEARCH
        const sort_field = conf[searchId].base_query.field
            ? conf[searchId].base_query.field
            : 'slug.keyword';
        const main_query = {
            query: {
                bool: {
                    must: [{ match: { [sort_field]: conf[searchId].base_query.value } }],
                },
            },
            sort,
            aggregations: {},
        };
        //sorting
        let sort_object = ['slug.keyword'];
        if (conf[searchId].sort) {
            sort_object = conf[searchId].sort.map((f) => {
                let tmp;
                if (typeof sort != 'undefined') {
                    tmp = sort.split('_')[1];
                    return { [f]: sort.split('_')[1] };
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
            main_query.sort = sort_object;
        }
        // pagination params
        if (limit) {
            main_query.size = limit;
        }
        if (offset || offset === 0) {
            main_query.from = offset;
        }
        // aggregations filters
        const query_facets = conf[searchId]['facets-aggs'].aggregations;
        const dataKeys = Object.keys(data);
        Object.keys(conf[searchId].filters)
            .filter((filterId) => dataKeys.includes(filterId))
            .forEach((filterId) => {
            const query_key = conf[searchId].filters[filterId];
            const query_nested = query_facets[filterId]
                ? query_facets[filterId].nested
                : false;
            if (query_key) {
                switch (query_key.type) {
                    case 'fulltext':
                        const ft_query = {
                            // multi_match: {
                            query_string: {
                                query: query_key.addStar
                                    ? '*' + data[filterId] + '*'
                                    : data[filterId],
                                fields: query_key.field,
                                default_operator: 'AND',
                            },
                        };
                        main_query.query.bool.must.push(ft_query);
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
