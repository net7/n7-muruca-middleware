"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESHelper = void 0;
exports.ESHelper = {
    bulkIndex(response, index, Client, ELASTIC_URI) {
        const client = new Client({ node: ELASTIC_URI }); // ELASTIC_URI  =  serverless "process.env.ELASTIC_URI"
        if (index != "") {
            client.deleteByQuery({
                index: index,
                body: {
                    query: {
                        match_all: {}
                    }
                }
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
                body: body
            }, (err, { body }) => {
                if (err)
                    console.log(err);
                resolve(body);
            });
        });
    },
    // data = body 
    buildQuery(data, conf) {
        const { searchId, sort, results } = data;
        const { limit, offset } = (results || {});
        // QUERY ELASTICSEARCH
        const main_query = {
            query: {
                bool: {
                    must: [
                        { match: { [conf[searchId].base_query.field]: searchId } }
                    ]
                }
            },
            sort: sort ? [{ "title.keyword": sort.split("_")[1] }, "_score"] : ["_score"],
            aggregations: {}
        };
        // pagination params
        if (limit) {
            main_query.size = limit;
        }
        if (offset || offset === 0) {
            main_query.from = offset;
        }
        const query_facets = conf[searchId]["facets-aggs"].aggregations;
        const dataKeys = Object.keys(data);
        Object.keys(conf[searchId].filters)
            .filter((facetId) => dataKeys.includes(facetId))
            .forEach((facetId) => {
            const query_key = conf[searchId].filters[facetId];
            const query_nested = query_facets[facetId] ? query_facets[facetId].nested : false;
            if (query_key) {
                switch (query_key.type) {
                    case "fulltext":
                        const ft_query = {
                            multi_match: {
                                query: query_key.addStar ? "*" + data.query + "*" : data,
                                fields: query_key.field
                            }
                        };
                        main_query.query.bool.must.push(ft_query);
                        break;
                    case "multivalue":
                        if (data[facetId] && query_nested === false) {
                            data[facetId].map((value) => {
                                main_query.query.bool.must.push({
                                    match: {
                                        [query_key.field]: value
                                    }
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
                        path: facetId,
                        query: {
                            terms: {
                                [query_facets[facetId].search]: data[facetId]
                            }
                        }
                    }
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
                                    source: `if(doc['${query_facets[key].search}'].size() > 0 ) doc['${query_facets[key].search}'].value +'|||' + doc['${query_facets[key].title}'].value`,
                                    lang: "painless"
                                }
                            }
                        }
                    }
                };
            }
            else {
                main_query.aggregations[key] = {
                    terms: {
                        script: {
                            source: `if(doc['${query_facets[key].search}'].size() > 0 ) doc['${query_facets[key].search}'].value +'|||' + doc['${query_facets[key].title}'].value`,
                            lang: "painless"
                        }
                    }
                };
            }
        }
        return main_query;
    }
};
