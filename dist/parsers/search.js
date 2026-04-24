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
    // RESULTS
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
            let item = {};
            conf.results.forEach((val) => {
                switch (val.label) {
                    case 'metadata':
                        item[val.label] = [
                            {
                                items: this.searchResultsMetadata(source, val.field, val.label, type),
                            },
                        ];
                        break;
                    default:
                        item[val.label] = this.parseResultsDefault(source, val.field);
                        break;
                }
            });
            item = this.filterResultItem(item, source, type, source['record-type']);
            items.push(item);
        });
        return items;
    }
    ;
    searchResultsMetadata(source, field, label, type) {
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
    parseResultsDefault(source, field) {
        return source[field] || null;
    }
    filterResultItem(item, source, type, itemType) {
        return item;
    }
    filterResultsMetadata(field, metadataItem, source) {
        return metadataItem;
    }
    // FACETS
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
            if (!queryFacets[id])
                return;
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
                    buckets.forEach((bucket, index) => {
                        const [payload, text] = bucket.key.split('|||').map(part => part.trim());
                        const searchQuery = (query || '').toLowerCase();
                        if (payload.toLowerCase().includes(searchQuery) || text.toLowerCase().includes(searchQuery)) {
                            const facet = this.createFacet(bucket, text, payload, queryFacets[id], index);
                            const modifiedFacet = this.applyFacetFilter(facet); // With this function you can handle different exceptions on the single facet
                            values.push(modifiedFacet);
                        }
                        facetSum++;
                    });
                    this.sortFacetValues(values, queryFacets[id]['sortValues'], id);
                }
            }
            if (queryFacets[id].searchNoValue && data[id + '_missing'] !== undefined) {
                const missingCount = data[id + '_missing'].doc_count;
                if (missingCount > 0) {
                    values.push({
                        text: queryFacets[id].searchNoValueLabel || '__NO_VALUE__',
                        counter: missingCount,
                        payload: '__NO_VALUE__',
                    });
                }
            }
            globalSum += facetSum;
            aggregationResult.facets[id] = { total_count: filteredTotal || facetSum, filtered_total_count: filteredTotal || values.length, values };
        });
        aggregationResult.total_count = globalSum;
        return this.applyFacetResultsFilter(aggregationResult); // With this function you can handle different exceptions the total results
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
    createFacet(bucket, text, payload, queryFacet, index) {
        var _a, _b;
        // Use reverse_nested count if available (for countUniqueDocs option)
        const docCount = (_b = (_a = bucket.unique_docs) === null || _a === void 0 ? void 0 : _a.doc_count) !== null && _b !== void 0 ? _b : bucket.doc_count;
        const facet = { text, counter: docCount, payload };
        this.addExtraArgsToFacet(facet, bucket, queryFacet['extra']);
        this.addRangeToFacet(facet, bucket, index, queryFacet['ranges']);
        return facet;
    }
    applyFacetFilter(facet) {
        return facet;
    }
    sortFacetValues(values, sortValues, id) {
        if (sortValues) {
            values.sort((a, b) => sortValues.indexOf(a['payload']) - sortValues.indexOf(b['payload']));
        }
    }
    applyFacetResultsFilter(result) {
        return result;
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
    addRangeToFacet(facet, bucket, index, ranges) {
        if (ranges) {
            if (bucket.from) {
                facet['text'] = ranges[index]['from'];
                facet['payload'] = bucket.from;
            }
            if (bucket.to) {
                facet['range'] = { text: ranges[index]['to'], payload: bucket.to };
            }
        }
    }
}
exports.SearchParser = SearchParser;
