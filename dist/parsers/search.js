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
        search_result.results = this.parseResultsItems({ data, options });
        return search_result;
    }
    parseFacets({ data, options }) {
        let global_sum = 0;
        const { facets, conf, searchId } = options;
        const agg_res = {
            total_count: 0,
            facets: {}
        };
        const query_facets = conf[searchId]['facets-aggs'].aggregations;
        facets.forEach(({ id, query, offset }) => {
            let sum = 0;
            let filteredTotal = 0;
            let values = [];
            if (data[id]) {
                if (data[id]['distinctTerms']) {
                    filteredTotal = data[id]['distinctTerms']['value'];
                    delete data[id]['distinctTerms'];
                }
                let buckets_data = getBucket(data[id]);
                if (buckets_data && buckets_data.buckets) {
                    if (offset && offset > 0) {
                        sum += offset;
                        buckets_data.buckets = buckets_data.buckets.slice(offset);
                    }
                    if (buckets_data['distict_doc_count']) {
                        filteredTotal = buckets_data['distict_doc_count'];
                    }
                    buckets_data.buckets.forEach((agg) => {
                        var _a;
                        const haystack_formatted = (agg.key.split("|||")[0] || '').toLowerCase();
                        const haystack_notFormatted = (agg.key.split("|||")[1] || '').toLowerCase();
                        const needle = (query || '').toLowerCase();
                        if (haystack_formatted.includes(needle) || haystack_notFormatted.includes(needle)) {
                            const facet = {
                                text: agg.key.split("|||")[1],
                                counter: agg.doc_count,
                                payload: agg.key.split("|||")[0]
                            };
                            if (query_facets[id]['extra']) {
                                const extra_args = {};
                                for (const key in query_facets[id]['extra']) {
                                    if (agg[key] && agg[key]['buckets']) {
                                        if (agg[key]['buckets'].length == 1) {
                                            extra_args[key] = (_a = agg[key]['buckets'][0]) === null || _a === void 0 ? void 0 : _a.key;
                                        }
                                        else if (agg[key]['buckets'].length > 1) {
                                            extra_args[key] = agg[key]['buckets'].map((bucket) => { return bucket['key']; });
                                        }
                                        else {
                                            extra_args[key] = null;
                                        }
                                    }
                                }
                                facet['args'] = extra_args;
                            }
                            values.push(facet);
                            // filteredTotal += 1;
                        }
                        sum++;
                    });
                }
            }
            global_sum += sum;
            agg_res.facets[id] = {
                total_count: sum,
                filtered_total_count: filteredTotal,
                values,
            };
            agg_res.total_count = global_sum;
        });
        // pagination chunk
        /* facets
           .forEach(facet => {
             agg_res.facets[facet.id].values = agg_res.facets[facet.id].values.slice(facet.offset, facet.offset + facet.limit)
           });*/
        return agg_res;
    }
}
exports.SearchParser = SearchParser;
function getBucket(data, doc_count = null, distict_doc_count = null) {
    let keys = Object.keys(data);
    var bucketData;
    if (keys.includes("buckets")) {
        if (data['doc_count'] === undefined) {
            data['doc_count'] = doc_count;
        }
        return data;
    }
    else {
        keys.forEach(k => {
            if (k != "distinctTerms" && typeof data[k] === "object") {
                const c = data[k]['doc_count'] || data["doc_count"];
                const dt = data[k]['distinctTerms'] || data["distinctTerms"]["value"];
                bucketData = getBucket(data[k], c, dt);
            }
        });
    }
    if (bucketData && bucketData.buckets) {
        if (bucketData['doc_count'] === undefined) {
            bucketData['doc_count'] = doc_count;
        }
        if (distict_doc_count) {
            data['distict_doc_count'] = distict_doc_count;
        }
        return bucketData;
    }
}
