export var ESHelper = {
    bulkIndex: function (response, index, Client, ELASTIC_URI) {
        var client = new Client({ node: ELASTIC_URI }); // ELASTIC_URI  =  serverless "process.env.ELASTIC_URI"
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
        var body = [];
        var dataset = JSON.parse(response);
        dataset.forEach(function (element) {
            body.push({ index: { _index: index } });
            body.push(element);
        });
        client.bulk({ refresh: true, body: body }, function (err, _a) {
            var body = _a.body;
            if (err)
                console.log(body.errors);
            var response = {
                statusCode: 200,
                body: JSON.stringify(body),
            };
            return response;
        });
    },
    makeSearch: function (index, body, Client, ELASTIC_URI) {
        return new Promise(function (resolve, reject) {
            var client = new Client({
                node: ELASTIC_URI,
            });
            client.search({
                index: index,
                body: body
            }, function (err, _a) {
                var body = _a.body;
                if (err)
                    console.log(err);
                resolve(body);
            });
        });
    },
    buildQuery: function (data, conf) {
        var searchId = data.searchId, sort = data.sort;
        // QUERY ELASTICSEARCH
        var main_query = {
            query: {
                bool: {
                    must: [
                        { match: { type: searchId } }
                    ]
                }
            },
            sort: sort ? { "title.keyword": sort = sort.split("_")[2] } : ["_score"],
            aggregations: {}
        };
        var query_facets = conf[searchId]["facets-aggs"].aggregations;
        var _loop_1 = function (key) {
            var query_key = conf[searchId].filters[key];
            if (query_key) {
                switch (query_key.type) {
                    case "fulltext":
                        var ft_query = {
                            query_string: {
                                query: query_key.addStar ? "*" + data.query + "*" : data,
                                fields: query_key.field
                            }
                        };
                        main_query.query.bool.must.push(ft_query);
                        break;
                    case "multivalue":
                        data[key].map(function (value) {
                            var _a;
                            main_query.query.bool.must.push({
                                match: (_a = {},
                                    _a[query_key.field] = value,
                                    _a)
                            });
                        });
                        break;
                    default:
                        break;
                }
            }
        };
        for (var key in data) {
            _loop_1(key);
        }
        //facets aggregations
        query_facets.map(function (f) {
            for (var key in f) {
                main_query.aggregations[key] = {
                    terms: {
                        field: f[key]
                    }
                };
            }
        });
        return main_query;
    }
};
