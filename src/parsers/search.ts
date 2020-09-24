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
    const { facets } = options as SearchOptions;
    const agg_res: any = {
      total_count: 0,
      facets: {}
    }

    facets.forEach(({ id, query }) => {
      let sum = 0;
      let values: any[] = [];
      if (data[id]) {
        let buckets_data = data[id].buckets === undefined ? data[id][id] : data[id];
        if (buckets_data.buckets) {
          buckets_data.buckets.forEach((agg: { key: string; doc_count: number }) => {
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
        agg_res.facets[facet.id].values = agg_res.facets[facet.id].values.slice(facet.offset, facet.offset + facet.limit)
      });
    return agg_res;
  }

}
