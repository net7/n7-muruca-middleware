import { DataType } from '../interfaces/helper';
import * as ASHelper from '../helpers/advanced-helper';

// searchGroup.forEach((group: any, groupId: any) => { //FIXME groupId + group
//   if (data.group) {
//   switch (group.type) { // FIXME group.type
//     case "fulltext":
//       const queryTerms = ESHelper.buildQueryString(data.value, options);
// chiamo ES.buildquerystring passando stringa come arg (data.value) e poi le options
// ritorna stringa con * e strip dei caratteri
// puoi usarlo anche su query_string
// avendo la stringa mi chiamo build query così da aver l'oggetto; pusho tutto in un array definito all'inizio (es. array dei must)
// poi passi a build_query alla fine degli switch (infatti prende come parametro i must ecc.)
// check su addStar, aggiungi * su data

export const buildAdvancedQuery = (data: DataType, conf: any) => {
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
        title: {},
        note: {},
      },
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
  const dataKeys = Object.keys(data); // ['searchId', 'results', 'query']
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
            must_array.push(ft_query); // aggiunge oggetto dopo "match" in "must" es. "query_string": { "query": "*bbb*", "fields": [ "title", "description" ] }
            break;
          case 'proximity':
            if (!data[query_key.query_params.value]) break;
            const pt_query = ASHelper.matchPhrase({
              fields: query_key.field,
              value: data[query_key.query_params.value],
              distance: +data[query_key.query_params.slop],
            });
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
            must_array.push(tf_query);
            break;
          case 'term_exists':
            if (<any>data[groupId] === true) {
              const te_query = ASHelper.queryExists(query_key.field);
              must_array.push(te_query);
            } else if (<any>data[groupId] === false) {
              const te_query = ASHelper.queryExists(query_key.field);
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
  return adv_query;
};
