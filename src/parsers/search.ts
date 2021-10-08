import Parser, { Input, SearchOptions } from "../interfaces/parser";
import { SearchResultsData, SearchResultsItemData } from "../interfaces/parser-data/search";

export abstract class SearchParser implements Parser {
  parse({ data, options }: Input) {
    const { type } = options as SearchOptions;
    return type === 'results'
      ? this.parseResults({ data, options })
      : this.parseFacets({ data, options });
  }

  protected abstract parseResultsItems({ data, options }: Input): SearchResultsItemData[];

  protected parseResults({ data, options }: Input) {
    if (options && "limit" in options) {
      var { offset, limit, sort, total_count } = options;
    }
    const search_result: SearchResultsData = {
      limit,
      offset,
      sort,
      total_count,
      results: []
    };
    search_result.results = this.parseResultsItems({ data, options });

    return search_result;

  }

  protected parseFacets({ data, options }: Input) {
    let global_sum = 0;
    const { facets, conf, searchId } = options as SearchOptions;
    const agg_res: any = {
      total_count: 0,
      facets: {}
    }
    const query_facets = conf[searchId]['facets-aggs'].aggregations

    facets.forEach(({ id, query, offset }) => {
      let sum = 0;
      let filteredTotal = 0;
      let values: any[] = [];
      if (data[id]) {
        let buckets_data =  getBucket(data[id]);
        filteredTotal = buckets_data.doc_count;
        if (buckets_data && buckets_data.buckets) {
          if(offset && offset > 0){
            sum += offset;
            buckets_data.buckets = buckets_data.buckets.slice(offset)
          }
          buckets_data.buckets.forEach((agg: { key: string; doc_count: number }) => {
            const haystack_formatted = (agg.key.split("|||")[0] || '').toLowerCase();
            const haystack_notFormatted = (agg.key.split("|||")[1] || '').toLowerCase();
            const needle = (query || '').toLowerCase();
            if (haystack_formatted.includes(needle) || haystack_notFormatted.includes(needle)) {
              const facet = {
                text: agg.key.split("|||")[1],
                counter: agg.doc_count,
                payload: agg.key.split("|||")[0]
            };
            if(query_facets[id]['extra']){
                const extra_args = {};
                for (const key in query_facets[id]['extra']) {
                    if(agg[key] && agg[key]['buckets']){
                        extra_args[key] = agg[key]['buckets'].map( (bucket) => { return bucket['key'] } );
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

function getBucket(data, doc_count = null) {
  let keys = Object.keys(data);
  var bucketData;
  if (keys.includes("buckets")) {
    if( data['doc_count'] === undefined ){
      data['doc_count'] = doc_count;
    }
    return data;
  }
  else {
      keys.forEach(k => { 
        if (typeof data[k] === "object"){
          const c =  data[k]['doc_count'] || data["doc_count"];
          bucketData = getBucket(data[k], data[k]['doc_count'] ); 
        }
      });
  }
  if (bucketData && bucketData.buckets) {
      if( bucketData['doc_count'] === undefined ){
          bucketData['doc_count'] = doc_count;
      }
      return bucketData;
  }
}