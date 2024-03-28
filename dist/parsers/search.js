"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchParser = void 0;
const parseMetadataFunctions_1 = require("../utils/parseMetadataFunctions");
class SearchParser {
    parse({ data, options }, queryParams = null) {
        const { type } = options;
        return type === 'results'
            ? this.parseResults({ data, options }, queryParams, type)
            : this.parseFacets({ data, options });
    }
    parseResults({ data, options }, queryParams = null, type) {
        if (options && 'limit' in options) {
            var { offset, limit, sort, total_count } = options;
        }
        const search_result = {
            limit,
            offset,
            sort,
            total_count,
            results: [],
        };
        search_result.results = this.parseResultsItems({ data, options }, type, queryParams);
        return search_result;
    }
    parseResultsItems({ data, options }, type, queryParams) {
        var { searchId, conf } = options;
        let items = [];
        data.forEach(({ _source: source }) => {
            const item = {};
            conf.results.forEach((val) => {
                switch (val.label) {
                    case 'metadata':
                        item[val.label] = [
                            {
                                items: this.searchResultsMetadata(source, val.field),
                            },
                        ];
                        break;
                    default:
                        item[val.label] = this.parseResultsDefault(source, val.field);
                        break;
                }
            });
            items.push(item);
        });
        return items;
    }
    ;
    parseResultsDefault(source, field) {
        return source[field] || null;
    }
    searchResultsMetadata(source, field) {
        const items = [];
        field.map((f) => {
            if (source[f]) {
                let metadataItem = {
                    label: source[f] ? f : null,
                    value: (0, parseMetadataFunctions_1.parseMetadataValue)(source, f)
                };
                items.push(this.filterResultsMetadata(f, metadataItem, source));
            }
        });
        return items;
    }
    filterResultsMetadata(field, metadataItem, source) {
        return metadataItem;
    }
    parseFacets({ data, options }) {
        let globalSum = 0;
        const { facets, conf, searchId } = options;
        const queryFacets = conf[searchId]['facets-aggs'].aggregations;
        const aggregationResult = {
            total_count: 0,
            facets: {},
        };
        facets.forEach(({ id, query, offset }) => {
            var _a;
            let facetSum = 0;
            let filteredTotal = 0;
            const values = [];
            const facetData = data[id];
            if (facetData) {
                // Assuming getBucket is a method from the upper class
                const bucketsData = this.getBucket(facetData);
                if (bucketsData && bucketsData.buckets) {
                    const buckets = offset && offset > 0 ? bucketsData.buckets.slice(offset) : bucketsData.buckets;
                    filteredTotal = bucketsData['distinct_doc_count'] || ((_a = data['distinctTerms_' + id]) === null || _a === void 0 ? void 0 : _a.value) || 0;
                    buckets.forEach((bucket) => {
                        const [payload, text] = bucket.key.split('|||').map(part => part.trim());
                        const searchQuery = (query || '').toLowerCase();
                        if (payload.toLowerCase().includes(searchQuery) || text.toLowerCase().includes(searchQuery)) {
                            const facet = this.createFacet(bucket, text, payload, queryFacets[id]);
                            const modifiedFacet = this.applyFacetFilter(facet); // With this function you can handle different exceptions on the single facet
                            values.push(modifiedFacet);
                        }
                        facetSum++;
                    });
                    this.sortFacetValues(values, queryFacets[id]['sortValues']);
                }
            }
            globalSum += facetSum;
            aggregationResult.facets[id] = { total_count: filteredTotal || facetSum, filtered_total_count: filteredTotal || values.length, values };
        });
        aggregationResult.total_count = globalSum;
        return this.applyFacetResultsFilter(aggregationResult); // With this function you can handle different exceptions the total results
    }
    createFacet(bucket, text, payload, queryFacet) {
        const facet = { text, counter: bucket.doc_count, payload };
        this.addExtraArgsToFacet(facet, bucket, queryFacet['extra']);
        this.addRangeToFacet(facet, bucket, queryFacet['ranges']);
        return facet;
    }
    addExtraArgsToFacet(facet, bucket, extra) {
        var _a;
        if (extra) {
            const extraArgs = {};
            for (const key in extra) {
                const bucketData = bucket[key];
                if (bucketData && bucketData['buckets']) {
                    extraArgs[key] = bucketData['buckets'].length === 1 ? (_a = bucketData['buckets'][0]) === null || _a === void 0 ? void 0 : _a.key : bucketData['buckets'].map(b => b.key);
                }
                else {
                    extraArgs[key] = null;
                }
            }
            facet['args'] = extraArgs;
        }
    }
    addRangeToFacet(facet, bucket, ranges) {
        if (ranges) {
            if (bucket.from) {
                facet['text'] = ranges['from'];
                facet['payload'] = bucket.from;
            }
            if (bucket.to) {
                facet['range'] = { text: ranges['to'], payload: bucket.to };
            }
        }
    }
    sortFacetValues(values, sortValues) {
        if (sortValues) {
            values.sort((a, b) => sortValues.indexOf(a['payload']) - sortValues.indexOf(b['payload']));
        }
    }
    getBucket(data, docCount = null, distinctDocCount = null) {
        var _a, _b, _c;
        const keys = Object.keys(data);
        if (keys.includes('buckets')) {
            data['doc_count'] = (_a = data['doc_count']) !== null && _a !== void 0 ? _a : docCount;
            if (distinctDocCount) {
                data['distinct_doc_count'] = distinctDocCount;
            }
            return data;
        }
        for (const key of keys) {
            if (key !== 'distinctTerms' && typeof data[key] === 'object') {
                const currentDocCount = data[key]['doc_count'] || data['doc_count'];
                const currentDistinctDocCount = (_b = data['distinctTerms']) === null || _b === void 0 ? void 0 : _b.value;
                const bucketData = this.getBucket(data[key], currentDocCount, currentDistinctDocCount);
                if (bucketData && bucketData.buckets) {
                    bucketData['doc_count'] = (_c = bucketData['doc_count']) !== null && _c !== void 0 ? _c : docCount;
                    if (distinctDocCount) {
                        bucketData['distinct_doc_count'] = distinctDocCount;
                    }
                    return bucketData;
                }
            }
        }
    }
    applyFacetFilter(facet) {
        return facet;
    }
    applyFacetResultsFilter(result) {
        return result;
    }
}
exports.SearchParser = SearchParser;
