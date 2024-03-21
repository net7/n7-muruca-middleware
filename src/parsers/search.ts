import Parser, { Input, SearchOptions, AggregationResult, Bucket, OutputMetadataItem } from '../interfaces/parser';
import {
  SearchResultsData,
  SearchResultsItemData,
} from '../interfaces';
import { parseMetadataValue } from '../utils/parseMetadataFunctions';

export abstract class SearchParser implements Parser {
  parse({ data, options }: Input, queryParams = null) {
    const { type } = options as SearchOptions;
    return type === 'results'
      ? this.parseResults({ data, options }, queryParams, type)
      : this.parseFacets({ data, options });
  }

  protected parseResults({ data, options }: Input, queryParams = null, type) {
    if (options && 'limit' in options) {
      var { offset, limit, sort, total_count } = options;
    }
    const search_result: SearchResultsData = {
      limit,
      offset,
      sort,
      total_count,
      results: [],
    };
    search_result.results = this.parseResultsItems(
      { data, options }, type,  queryParams, 
    );

    return search_result;
  }  
  
  protected parseResultsItems({ data, options }: Input, type, queryParams?, ): SearchResultsItemData[]{
    var { searchId, conf } = options as SearchOptions;
    let items = [];
    
    data.forEach(({ _source: source }) => {
      const item = {} as SearchResultsItemData;
      conf.results.forEach((val: { label: string; field: any }) => {
        
        switch (val.label) {

          case 'metadata': 
            item[val.label] = [
              {
                items: this.searchResultsMetadata(source, val.field, val.label, type),
              },
            ];  
            break;
          
          default:
            item[val.label] = this.parseResultsDefault(source, val.field) 
            break;
        }
      });
      items.push(item);
    })

      return items;
  };

  protected parseResultsDefault(source, field: string): any{
    return source[field] || null;
  }

  protected searchResultsMetadata(source, field, label, type) {
    const items = [];
    field.map((f) => {

      if(source[f]){
        
        let metadataItem = {
          label: source[f] ? f : null,
          value: parseMetadataValue(source, f)
  
        }
  
        items.push(
          this.filterResultsMetadata(f, metadataItem, source)
        );
      }

    });
    return items;
  }

  protected filterResultsMetadata(field: string, metadataItem: OutputMetadataItem, source?: any ): OutputMetadataItem{
    
    return metadataItem;
  }

  protected parseFacets({ data, options }: Input): AggregationResult {
    let globalSum = 0;
    const { facets, conf, searchId } = options as SearchOptions;
    const queryFacets = conf[searchId]['facets-aggs'].aggregations;

    const aggregationResult: AggregationResult = {
      total_count: 0,
      facets: {},
    };

    facets.forEach(({ id, query, offset }) => {
      let facetSum = 0;
      let filteredTotal = 0;
      const values: any[] = [];
      const facetData = data[id];

      if (facetData) {
        // Assuming getBucket is a method from the upper class
        const bucketsData = this.getBucket(facetData);
        if (bucketsData && bucketsData.buckets) {
          const buckets = offset && offset > 0 ? bucketsData.buckets.slice(offset) : bucketsData.buckets;
          filteredTotal = bucketsData['distinct_doc_count'] || data['distinctTerms_' + id]?.value || 0;

          buckets.forEach((bucket: Bucket) => {
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
      aggregationResult.facets[id] = { total_count: filteredTotal || globalSum, filtered_total_count: filteredTotal || values.length, values };
    });

    aggregationResult.total_count = globalSum;
    return this.applyFacetResultsFilter(aggregationResult); // With this function you can handle different exceptions the total results
  }

  private createFacet(bucket: Bucket, text: string, payload: string, queryFacet: any) {
    const facet = { text, counter: bucket.doc_count, payload };
    this.addExtraArgsToFacet(facet, bucket, queryFacet['extra']);
    this.addRangeToFacet(facet, bucket, queryFacet['ranges']);
    return facet;
  }

  private addExtraArgsToFacet(facet: any, bucket: Bucket, extra?: any) {
    if (extra) {
      const extraArgs = {};
      for (const key in extra) {
        const bucketData = bucket[key];
        if (bucketData && bucketData['buckets']) {
          extraArgs[key] = bucketData['buckets'].length === 1 ? bucketData['buckets'][0]?.key : bucketData['buckets'].map(b => b.key);
        } else {
          extraArgs[key] = null;
        }
      }
      facet['args'] = extraArgs;
    }
  }

  private addRangeToFacet(facet: any, bucket: Bucket, ranges?: any[]) {
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

  private sortFacetValues(values: any[], sortValues?: any) {
    if (sortValues) {
      values.sort((a, b) => sortValues.indexOf(a['payload']) - sortValues.indexOf(b['payload']));
    }
  }

  private getBucket(data, docCount = null, distinctDocCount = null) {
    const keys = Object.keys(data);

    if (keys.includes('buckets')) {
      data['doc_count'] = data['doc_count'] ?? docCount;
      if (distinctDocCount) {
        data['distinct_doc_count'] = distinctDocCount;
      }
      return data;
    }

    for (const key of keys) {
      if (key !== 'distinctTerms' && typeof data[key] === 'object') {
        const currentDocCount = data[key]['doc_count'] || data['doc_count'];
        const currentDistinctDocCount = data['distinctTerms']?.value;
        const bucketData = this.getBucket(data[key], currentDocCount, currentDistinctDocCount);

        if (bucketData && bucketData.buckets) {
          bucketData['doc_count'] = bucketData['doc_count'] ?? docCount;
          if (distinctDocCount) {
            bucketData['distinct_doc_count'] = distinctDocCount;
          }
          return bucketData;
        }
      }
    }
  }

  protected applyFacetFilter(facet: any): any {
    return facet
  }

  protected applyFacetResultsFilter(result: AggregationResult): AggregationResult {
    return result;
  }

}

