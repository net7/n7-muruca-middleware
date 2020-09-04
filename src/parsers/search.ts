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

  // protected parseResults({ data, options }: Input) {
  //   if (options && "limit" in options) {
  //     var { limit, offset, sort, total_count } = options;
  //   }
  //   const search_result: SearchResultsData = {
  //     limit,
  //     offset,
  //     sort,
  //     total_count,
  //     results: []
  //   };

  //   search_result.results = this.parseResultsItems(data, options);

  //   //pagination
  //   // search_result.results = search_result.results.slice((page - 1) * limit, page * limit)
  //   return search_result;
  // }

  // protected parseFacets({ data, options }: Input) {
  //   const { facets } = options as SearchOptions;
  //   const agg_res: any = {
  //     headers: {},
  //     inputs: {}
  //   }
  //   //header and inputs
  //   for (const key in data) {
  //     let sum = 0;
  //     let inputs: any[] = []
  //     data[key].buckets.map((agg: { key: string; doc_count: number; }) => {
  //       inputs.push({
  //         text: agg.key,
  //         counter: agg.doc_count,
  //         payload: agg.key
  //       })
  //       sum = sum + agg.doc_count
  //     })
  //     agg_res.inputs[key] = inputs
  //     agg_res.headers["header-" + key] = sum;
  //   }

  //   if (facets) {
  //     let ordered: any = {};
  //     facets.forEach((key: string) => {
  //       ordered[key] = agg_res.inputs[key] || [];
  //     })
  //     agg_res.inputs = ordered;
  //   }
  //   return agg_res;
  // }
}
