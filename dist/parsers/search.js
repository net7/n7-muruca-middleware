"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchParser = void 0;
class SearchParser {
    parse({ data, options }) {
        const { type } = options;
        return type === 'results'
            ? this.parseResults({ data, options })
            : this.parseFacets({ data, options });
    }
    parseResults({ data, options }) {
        if (options && "limit" in options) {
            var { searchId, conf, limit, page, sort, total_count } = options;
        }
        const search_result = {
            limit,
            page,
            sort,
            total_count,
            results: []
        };
        data.map((hit) => {
            const source = hit._source;
            // FIXME: generalizzare
            // questo è un controllo collegato al progetto totus
            switch (searchId) {
                case "map": {
                    const res = {};
                    conf.results.map((val) => {
                        switch (val.label) {
                            case "title":
                                res[val.label] = source[val.field];
                                break;
                            case "text":
                                res[val.label] = source[val.field];
                                break;
                            case "image":
                                res[val.label] = source[val.field] || null;
                                break;
                            case "link":
                                res[val.label] = `/map/${source[val.field[0]]}/${source[val.field[1]]}`;
                                break;
                            case "id":
                                res[val.label] = source.id;
                                break;
                            default:
                                break;
                        }
                    });
                    search_result.results.push(res);
                    break;
                }
                case "work": {
                    const res = {};
                    conf.results.map((val) => {
                        switch (val.label) {
                            case "title":
                                res[val.label] = source[val.field];
                                break;
                            case "text":
                                res[val.label] = source[val.field];
                                break;
                            case "image":
                                res[val.label] = source.gallery[0][val.field] || null;
                                break;
                            case "link":
                                res[val.label] = `/work/${source[val.field[0]]}/${source[val.field[1]]}`;
                                break;
                            case "id":
                                res[val.label] = source.id;
                                break;
                            default:
                                break;
                        }
                    });
                    search_result.results.push(res);
                    break;
                }
                default:
                    break;
            }
        });
        //pagination
        search_result.results = search_result.results.slice((page - 1) * limit, page * limit);
        return search_result;
    }
    parseFacets({ data, options }) {
        const { keyOrder } = options;
        const agg_res = {
            headers: {},
            inputs: {}
        };
        //header and inputs
        for (const key in data) {
            let sum = 0;
            let inputs = [];
            data[key].buckets.map((agg) => {
                inputs.push({
                    text: agg.key,
                    counter: agg.doc_count,
                    payload: agg.key
                });
                sum = sum + agg.doc_count;
            });
            agg_res.inputs[key] = inputs;
            agg_res.headers["header-" + key] = sum;
        }
        if (keyOrder) {
            let ordered = {};
            keyOrder.forEach((key) => {
                ordered[key] = agg_res.inputs[key];
            });
            agg_res.inputs = ordered;
        }
        return agg_res;
    }
}
exports.SearchParser = SearchParser;
