import Parser, { Input } from "../interfaces/parser";

export default class SearchParser implements Parser {
  parse({ type, searchId, options, data, keyOrder, conf }: Input) {
    return type === "results"
      ? this.parseResults({ searchId, options, data, conf })
      : this.parseFacets({ keyOrder, data });
  }

  protected parseResults({ searchId, options, data, conf }: Input) {
    let search_result = {
      ...options,
      results: []
    };
    let res: any = {}

    data.map((hit: any) => {
      const source = hit._source;
      // FIXME: generalizzare
      // questo è un controllo collegato al progetto totus
      switch (searchId) {
        case "map":
          conf.results.map((val: { label: string; field: any; }) => {
            switch (val.label) {
              case "title":
                res[val.label] = source[val.field];
                break;
              case "text":
                res[val.label] = source[val.field]
                break;
              case "image":
                res[val.label] = source[val.field] || null
                break;
              case "link":
                res[val.label] = `/map/${source[val.field[0]]}/${source[val.field[1]]}`
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

        case "work":
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

        default:
          break;
      }
    })
    //pagination
    search_result.results = search_result.results.slice((options.page - 1) * options.limit, options.page * options.limit)
    return search_result;
  }

  protected parseFacets({ keyOrder, data }: Input) {
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
      keyOrder.forEach(key => {
        ordered[key] = agg_res.inputs[key];
      })
      agg_res.inputs = ordered;
    }
    return agg_res;
  }
}
