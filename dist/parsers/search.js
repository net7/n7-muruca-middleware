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
            var { sort, total_count } = options;
            var { limit, offset } = options.results;
        }
        const search_result = {
            limit,
            offset,
            sort,
            total_count,
            results: []
        };
        search_result.results = this.parseResultsItems(data, options);
        //pagination
        // search_result.results = search_result.results.slice((page - 1) * limit, page * limit)
        return search_result;
    }
    parseFacets({ data, options }) {
        const { facets } = options;
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
        if (facets) {
            let ordered = {};
            facets.forEach((key) => {
                ordered[key] = agg_res.inputs[key] || [];
            });
            agg_res.inputs = ordered;
        }
        return agg_res;
    }
}
exports.SearchParser = SearchParser;
