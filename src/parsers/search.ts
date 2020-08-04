import Parser from "../interfaces/parser";

export default class SearchParser implements Parser {
  parse({ type, searchId, options, data, order, config }) {
    return type === "results"
      ? this.parseResults({ searchId, options, data, config })
      : this.parseFacets({ order, data });
  }

  protected parseResults({ searchId, options, data, config }) {
    let search_result = {
      ...options,
      results: []
    };
    let res = {}

    data.map(hit => {
      res = {}
      const source = hit._source;
      // FIXME: generalizzare
      // questo è un controllo collegato al progetto totus
      switch (searchId) {
        case "map":
          config.results.map((val) => {
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
          config.results.map((val) => {
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

  protected parseFacets({ order, data }) {
    const agg_res = {
      headers: {},
      inputs: {}
    }
    //header and inputs
    for (const key in data) {
      let sum = 0;
      let inputs = []
      data[key].buckets.map((agg) => {
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
    let ord_parse = {};
    order.map(ord => {
      ord_parse[ord] = agg_res.inputs[ord];
    })
    agg_res.inputs = ord_parse;
    return agg_res;
  }
}
