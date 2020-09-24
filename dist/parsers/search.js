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
            var { offset, limit, sort, total_count } = options;
        }
        const search_result = {
            limit,
            offset,
            sort,
            total_count,
            results: []
        };
        search_result.results = this.parseResultsItems(data, options);
        return search_result;
    }
    parseFacets({ data, options }) {
        let global_sum = 0;
        const { facets } = options;
        const agg_res = {
            total_count: 0,
            facets: {}
        };
        facets.forEach(({ id, query }) => {
            let sum = 0;
            let values = [];
            if (data[id]) {
                let buckets_data = data[id].buckets === undefined ? data[id][id] : data[id];
                if (buckets_data.buckets) {
                    buckets_data.buckets.forEach((agg) => {
                        const haystack = (agg.key.split("|||")[0] || '').toLocaleLowerCase();
                        const needle = (query || '').toLocaleLowerCase();
                        if (haystack.includes(needle)) {
                            values.push({
                                text: agg.key.split("|||")[1],
                                counter: agg.doc_count,
                                payload: agg.key.split("|||")[0]
                            });
                        }
                        sum = sum + 1;
                    });
                }
            }
            global_sum += sum;
            agg_res.facets[id] = {
                total_count: sum,
                values,
            };
            agg_res.total_count = global_sum;
        });
        // pagination chunk
        facets
            .forEach(facet => {
            agg_res.facets[facet.id].values = agg_res.facets[facet.id].values.slice(facet.offset, facet.offset + facet.limit);
        });
        return agg_res;
    }
}
exports.SearchParser = SearchParser;
