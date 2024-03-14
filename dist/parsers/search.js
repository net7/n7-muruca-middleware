"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchParser = void 0;
class SearchParser {
    parse({ data, options }, queryParams = null) {
        const { type } = options;
        return type === 'results'
            ? this.parseResults({ data, options }, queryParams)
            : this.parseFacets({ data, options });
    }
    searchResultsMetadata(source, field, label) {
        const item = [];
        field.map((f) => {
            item[label][0].items.push({
                label: source[f] ? f : null,
                // value: f === 'contenuti' ? (source[f] || []).map(sf => sf['contenuto']) : source[f]
                value: source[f],
            });
        });
        return item;
    }
    parseResults({ data, options }, queryParams = null) {
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
        search_result.results = this.parseResultsItems({ data, options }, queryParams);
        // implementare
        // data.forEach(({ _source: source }) => {
        //   const item = {} as SearchResultsItemData;
        //   conf.results.forEach((val: { label: string; field: any }) => {
        //     switch (val.label) {
        //       case 'title':
        //       case 'text':
        //         item[val.label] = source[val.field] || null;
        //         break;
        //       case 'metadata':
        //         item[val.label] = [
        //           {
        //             items: [],
        //           },
        //         ];
        //         val.field.map((f) => {
        //           item[val.label][0].items.push({
        //             label: source[f] ? f : null,
        //             // value: f === 'contenuti' ? (source[f] || []).map(sf => sf['contenuto']) : source[f]
        //             value:
        //               f === 'origine' && source[f]
        //                 ? source[f].replace(/(<([^>]+)>)/gi, '')
        //                 : source[f],
        //           });
        //         });
        //         break;
        //       case 'image':
        //         item[val.label] = source[val.field] || null;
        //         break;
        //       case 'link':
        //         item[
        //           val.label
        //         ] = `/${source['record-type']}/${source.id}/${source.slug}`;
        //         break;
        //       case 'id':
        //         item[val.label] = source.id;
        //         break;
        //       case 'routeId':
        //           item[val.label] = source[val.field];
        //       case 'slug':
        //         item[val.label] = source[val.field];
        //       default:
        //         break;
        //     }
        //   });
        //   items.push(item);
        // });
        return search_result;
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
                        const [payload, text] = bucket.key.split('|||').map(part => part.toLowerCase());
                        const searchQuery = (query || '').toLowerCase();
                        if (payload.includes(searchQuery) || text.includes(searchQuery)) {
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
            aggregationResult.facets[id] = { total_count: filteredTotal, filtered_total_count: filteredTotal, values };
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
