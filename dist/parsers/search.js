var SearchParser = /** @class */ (function () {
    function SearchParser() {
    }
    SearchParser.prototype.parse = function (_a) {
        var data = _a.data, options = _a.options;
        var type = options.type;
        return type === 'results'
            ? this.parseResults({ data: data, options: options })
            : this.parseFacets({ data: data, options: options });
    };
    SearchParser.prototype.parseResults = function (_a) {
        var data = _a.data, options = _a.options;
        if (options && "limit" in options) {
            var searchId = options.searchId, conf = options.conf, limit = options.limit, page = options.page, sort = options.sort, total_count = options.total_count;
        }
        var search_result = {
            limit: limit,
            page: page,
            sort: sort,
            total_count: total_count,
            results: []
        };
        data.map(function (hit) {
            var source = hit._source;
            // FIXME: generalizzare
            // questo è un controllo collegato al progetto totus
            switch (searchId) {
                case "map": {
                    var res_1 = {};
                    conf.results.map(function (val) {
                        switch (val.label) {
                            case "title":
                                res_1[val.label] = source[val.field];
                                break;
                            case "text":
                                res_1[val.label] = source[val.field];
                                break;
                            case "image":
                                res_1[val.label] = source[val.field] || null;
                                break;
                            case "link":
                                res_1[val.label] = "/map/" + source[val.field[0]] + "/" + source[val.field[1]];
                                break;
                            case "id":
                                res_1[val.label] = source.id;
                                break;
                            default:
                                break;
                        }
                    });
                    search_result.results.push(res_1);
                    break;
                }
                case "work": {
                    var res_2 = {};
                    conf.results.map(function (val) {
                        switch (val.label) {
                            case "title":
                                res_2[val.label] = source[val.field];
                                break;
                            case "text":
                                res_2[val.label] = source[val.field];
                                break;
                            case "image":
                                res_2[val.label] = source.gallery[0][val.field] || null;
                                break;
                            case "link":
                                res_2[val.label] = "/work/" + source[val.field[0]] + "/" + source[val.field[1]];
                                break;
                            case "id":
                                res_2[val.label] = source.id;
                                break;
                            default:
                                break;
                        }
                    });
                    search_result.results.push(res_2);
                    break;
                }
                default:
                    break;
            }
        });
        //pagination
        search_result.results = search_result.results.slice((page - 1) * limit, page * limit);
        return search_result;
    };
    SearchParser.prototype.parseFacets = function (_a) {
        var data = _a.data, options = _a.options;
        var keyOrder = options.keyOrder;
        var agg_res = {
            headers: {},
            inputs: {}
        };
        var _loop_1 = function (key) {
            var sum = 0;
            var inputs = [];
            data[key].buckets.map(function (agg) {
                inputs.push({
                    text: agg.key,
                    counter: agg.doc_count,
                    payload: agg.key
                });
                sum = sum + agg.doc_count;
            });
            agg_res.inputs[key] = inputs;
            agg_res.headers["header-" + key] = sum;
        };
        //header and inputs
        for (var key in data) {
            _loop_1(key);
        }
        if (keyOrder) {
            var ordered_1 = {};
            keyOrder.forEach(function (key) {
                ordered_1[key] = agg_res.inputs[key];
            });
            agg_res.inputs = ordered_1;
        }
        return agg_res;
    };
    return SearchParser;
}());
export { SearchParser };
