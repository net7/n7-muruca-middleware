import Parser, { Input, SearchOptions } from "../interfaces/parser";
import { SearchResultsData, SearchResultsItemData } from "../interfaces/parser-data/search";

export class SearchParser implements Parser {
  [x: string]: any;
  parse({ data, options }: Input) {
    const { type } = options as SearchOptions;
    return type === 'results'
      ? this.parseResults({ data, options })
      : this.parseFacets({ data, options });
  }

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
  search_result.results = this.parseResultsItems(data, options);

  return search_result;

  }

  protected parseFacets({ data, options }: Input) {
    let global_sum = 0;
    const { facets } = options as SearchOptions;
    const agg_res: any = {
      total_count: 0,
      facets: {}
    }
    //header and inputs
    for (const key in data) {
        let sum = 0;
        let values: any[] = [];
        facets.forEach(facet => {
          data[key].buckets.map((agg: { key: string; doc_count: number; }) => {
            if (agg.key.includes(facet.query) && key === facet.id){
              values.push({
                text: agg.key,
                counter: agg.doc_count,
                payload: agg.key
              });
              sum = sum + 1;
            }
          });
        });
        global_sum = global_sum + sum
        const facet = {
            total_count: sum,
            values,
        }
        agg_res.facets[key] = facet;
        agg_res.total_count = global_sum;
    }
    facets.forEach(facet => {
      agg_res.facets[facet.id].values = agg_res.facets[facet.id].values.slice((facet.offset) * facet.limit, facet.limit * facet.offset)
    });
    return agg_res;
  }
  
}
