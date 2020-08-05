import Parser, { Input, SearchOptions } from "../interfaces/parser";

export class SearchParser implements Parser {
  parse({ data, options }: Input) {
    const { type } = options as SearchOptions;
    return type === 'results'
      ? this.parseResults({ data, options })
      : this.parseFacets({ data, options });
  }

  protected parseResults({ data, options }: Input) {
    if (options && "limit" in options) {
      var { searchId, conf, limit, page, sort, total_count } = options;
    }
    const search_result = {
      limit,
      page,
      sort,
      total_count,
      results: <{
        title?: string;
        text?: string; 
        image?: string | null; 
        link?: string;
        id?: string | number;
      }[]>[]
    };

    data.map((hit: any) => {
      const source = hit._source;
      // FIXME: generalizzare
      // questo è un controllo collegato al progetto totus
      switch (searchId) {
        case "map": {
          const res = {} as any;
          conf.results.map((val: { label: string; field: any; }) => {
            switch (val.label) {
              case "title":
                res[val.label] = source[val.field];
                break;
              case "text":
                res[val.label] = source[val.field];
                break;
              case "image":
                res[val.label] = source[val.field] || null;
                break;
              case "link":
                res[val.label] = `/map/${source[val.field[0]]}/${source[val.field[1]]}`;
                break;
              case "id":
                res[val.label] = source.id;
                break;
              default:
                break;
            }
          })
          search_result.results.push(res);
          break;
        }

        case "work": {
          const res = {} as any;
          conf.results.map((val: { label: string; field: any; }) => {
            switch (val.label) {
              case "title":
                res[val.label] = source[val.field];
                break;
              case "text":
                res[val.label] = source[val.field]
                break;
              case "image":
                res[val.label] = source.gallery[0][val.field] || null
                break;
              case "link":
                res[val.label] = `/work/${source[val.field[0]]}/${source[val.field[1]]}`
                break;
              case "id":
                res[val.label] = source.id
                break;
              default:
                break;
            }
          })
          search_result.results.push(res);
          break;
        }

        default:
          break;
      }
    })
    //pagination
    search_result.results = search_result.results.slice((page - 1) * limit, page * limit)
    return search_result;
  }

  protected parseFacets({ data, options }: Input) {
    const { keyOrder } = options as SearchOptions;
    const agg_res: any = {
      headers: {},
      inputs: {}
    }
    //header and inputs
    for (const key in data) {
      let sum = 0;
      let inputs: any[] = []
      data[key].buckets.map((agg: { key: string; doc_count: number; }) => {
        inputs.push({
          text: agg.key,
          counter: agg.doc_count,
          payload: agg.key
        })
        sum = sum + agg.doc_count
      })
      agg_res.inputs[key] = inputs
      agg_res.headers["header-" + key] = sum;
    }

    if (keyOrder) {
      let ordered: any = {};
      keyOrder.forEach((key: string) => {
        ordered[key] = agg_res.inputs[key];
      })
      agg_res.inputs = ordered;
    }
    return agg_res;
  }
}
