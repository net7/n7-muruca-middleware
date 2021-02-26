import { DataType } from '../interfaces/helper';
import * as ASHelper from '../helpers/advanced-helper';
import Parser, { Input, SearchOptions } from "../interfaces/parser";
import { SearchResultsData, SearchResultsItemData } from "../interfaces/parser-data/search";

export class AdvancedSearchParser implements Parser {
  
  parse({ data, options }: Input) {
    const { type } = options as SearchOptions;
    return [];
  }

  // protected parseResultsItems({ data, options }: Input): SearchResultsItemData[];

  advancedParseResults({ data, options }: Input) {
    //forEach dei resulsts, controlla se esiste data.valore di conf e costruisci l'oggetto
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
    search_result.results = this.advancedParseResultsItems({ data, options });

    return search_result;

  }

  advancedParseResultsItems({ data, options }) {
    var { searchId, conf } = options;
    let items = [];
    data.forEach(({ _source: source, highlight }) => {
        let itemResult = {
            highlights: {}
        };
        if (conf[searchId].show_highlights === true && highlight) {
          itemResult.highlights = highlight;
        }
        conf[searchId].results.forEach((val) => {
            if (source.hasOwnProperty(val.field)) {
                itemResult[val.label] = source[val.field];  
            }
            else if (val.field) {
                if (!Array.isArray(val.field)) {
                    if (val.isLink === true){
                        itemResult[val.label] = ASHelper.buildLink(val.field, source);
                    }
                    else {
                      //check for nested properties
                      let obj = source;
                      let fieldArray = val.field.split('.');
                      for (let i = 0; i < fieldArray.length; i++) {
                        let prop = fieldArray[i];
                        if (!obj || !obj.hasOwnProperty(prop)) {
                            return false;
                        }
                        else {
                            obj = obj[prop];
                        }
                    }
                    itemResult[val.label] = obj;
                  }
                }
                else {
                    for (let e of val.field) {
                        if (source.hasOwnProperty(e)) {
                            itemResult[val.label] = source[val.field];
                        }
                    }
                }
            }
            else if (val.fields) {
                let fields = val.fields;
                itemResult[val.label] = [];
                fields.forEach(item => {
                    if (source.hasOwnProperty(item.field)) {
                      itemResult[val.label][item.label] = source[item.field];
                    }
                });
            }
        });
        items.push(itemResult);
    });
    return items;
}

buildTextViewerQuery = (data: DataType, conf: any) => {
  const { searchId, results } = data;
  const advanced_conf = conf['advanced_search'][searchId];
  let teiPubParams;
  Object.keys(advanced_conf['search_full_text'])
      .forEach((groupId) => {
      const query_key = advanced_conf['search_full_text'][groupId];
      if (query_key) {
          switch (query_key.type) {
              case 'fulltext':
                  if (!data[groupId])
                      break;
                  const collection = query_key['collection'];
                  const pagination = query_key['perPage'];
                  const query = data[groupId];
                  teiPubParams = `mrcsearch?query=${query}&start=1&per-page=${pagination}&collection=${collection}`;
                  break;
              default:
                  break;
          }
      }
  });
  return teiPubParams;
};

  buildAdvancedQuery = (data: DataType, conf: any) => {
    // prevedere valore search-type nel data?
    const { searchId, results } = data;
    const sort = results.sort;
    const { limit, offset } = results || {};
    const advanced_conf = conf['advanced_search'][searchId];   
    const adv_query: any = {
      query: {
      },
      sort,
      highlight: {
        fields: {
        },
        pre_tags : ["<em class='mrc__text-emph'>"],
        post_tags : ["</em>"],
      },
    };
  
    //sorting
    let sort_object = ['slug.keyword'];
    if (advanced_conf.sort) {
      sort_object = advanced_conf.sort.map((f) => {
        // ad es. nella search_config.ts di theatheor abbiamo [ "sort_title.keyword", "slug.keyword" ]
        let tmp;
        if (typeof sort != 'undefined') {
          // es. "sort_DESC"
          tmp = sort.split('_')[1];
          return { [f]: sort.split('_')[1] }; // es. "title.keyword": "DESC"
        } else {
          return { [f]: tmp };
        }
      });
    }
  
    if (sort) {
      sort === '_score'
        ? (adv_query.sort = ['_score'])
        : (adv_query.sort = sort_object);
    } else {
      adv_query.sort = sort_object; // aggiorna il sort della main query con es. "title.keyword": "DESC"
    }
    //BASE QUERY
    const must_array = [];
    const must_not = [];
    let highlight_fields = {};
    if (advanced_conf.base_query) {
      const base_query = ASHelper.queryTerm(advanced_conf.base_query.field, advanced_conf.base_query.value)
      must_array.push(base_query);
    }
  
    // pagination params
    if (limit) {
      adv_query.size = limit; // aggiunge proprietà "size" a adv_query con il valore di results.limit (e.g. 10)
    }
    if (offset || offset === 0) {
      adv_query.from = offset; // vd. sopra, aggiunge proprietà "from"
    }
  
    //search groups
    Object.keys(advanced_conf['search_groups']) // [ 'query', 'types', 'authors', 'collocations', 'dates' ]
      .forEach((groupId) => {
        // query, types, authors etc.
        const query_key = advanced_conf['search_groups'][groupId]; // { "type": "fulltext", "field": ["title", "description"], "addStar": true }, {...}
        if (query_key) {
          switch (
            query_key.type // fa uno switch su tutti i tipi di query
          ) {
            case 'fulltext':
              if (!data[groupId]) break;
              const query_string = ASHelper.buildQueryString(data[groupId], {
                allowWildCard: query_key.addStar,
                stripDoubleQuotes: true,
              });
              const ft_query = ASHelper.queryString(
                { fields: query_key.field, value: query_string },
                'AND'
              );
              highlight_fields = {...ASHelper.buildHighlights(query_key.field), ...highlight_fields};
              must_array.push(ft_query); // aggiunge oggetto dopo "match" in "must" es. "query_string": { "query": "*bbb*", "fields": [ "title", "description" ] }
              break;
            case 'proximity':
              if (!data[query_key.query_params.value]) break;
              const pt_query = ASHelper.spanNear({
                fields: query_key.field,
                value: data[query_key.query_params.value],
                distance: +data[query_key.query_params.slop],
              });
              highlight_fields = {...ASHelper.buildHighlights(query_key.field), ...highlight_fields};
              must_array.push(pt_query);
              break;
            case 'term_value':
              if (!data[groupId]) break;
              const query_term = ASHelper.buildQueryString(data[groupId], {
                allowWildCard: query_key.addStar,
                stripDoubleQuotes: true,
              });
              const tv_query = ASHelper.queryString(
                { fields: query_key.field, value: query_term },
                'AND'
              );
              highlight_fields = {...ASHelper.buildHighlights(query_key.field), ...highlight_fields};
              must_array.push(tv_query);
              break;
            case 'term_field_value':
              if (!data[query_key.query_params.value]) break;
              const query_field_value = ASHelper.buildQueryString(data[query_key.query_params.value], {
                allowWildCard: query_key.addStar,
                stripDoubleQuotes: true,
              });
              const tf_query = ASHelper.queryString(
                {
                  fields: data[query_key.query_params.field],
                  value: query_field_value,
                },
                'AND'
              );
              highlight_fields = {...ASHelper.buildHighlights(query_key.field), ...highlight_fields};
              must_array.push(tf_query);
              break;
            case 'term_exists':
              if (<any>data[groupId] === "true") {
                const te_query = ASHelper.queryExists(query_key.field);
                highlight_fields = {...ASHelper.buildHighlights(query_key.field), ...highlight_fields};
                must_array.push(te_query);
              } else if (<any>data[groupId] === "false") {
                const te_query = ASHelper.queryExists(query_key.field);
                highlight_fields = {...ASHelper.buildHighlights(query_key.field), ...highlight_fields};
                must_not.push(te_query);
              }
              break;
            case 'ternary':
              break;
  
            default:
              break;
          }
        }
        
      });
    const bool_query = ASHelper.queryBool(must_array, [], [], must_not);
    adv_query.query = bool_query.query;
    adv_query.highlight.fields = highlight_fields;
    return adv_query;


  };

}
