import { DataType } from '../interfaces/helper';
import * as ASHelper from '../helpers/advanced-helper';
import { SearchResponse } from 'elasticsearch';
import { validateLocaleAndSetLanguage } from 'typescript';
import { filter } from 'lodash';

const AGGR_SEPARATOR = "     ||| ";

export const ESHelper = {
  bulkIndex(response: string, index: string, Client: any, ELASTIC_URI: string) {
    // client = const { Client } = require('@elastic/elasticsearch')
    const client = new Client({ node: ELASTIC_URI }); // ELASTIC_URI  =  serverless "process.env.ELASTIC_URI"

    if (index != '') {
      client.deleteByQuery({
        index: index,
        body: {
          query: {
            match_all: {},
          },
        },
      });
    }
    let body: object[] = [];
    const dataset = JSON.parse(response);
    dataset.forEach((element: object) => {
      body.push({ index: { _index: index } });
      body.push(element);
    });

    client.bulk({ refresh: true, body }, (err: string, { body }: any) => {
      if (err) console.log(body.errors);
      const response = {
        statusCode: 200,
        body: JSON.stringify(body),
      };

      return response;
    });
  },
  makeSearch(
    index: string,
    body: string,
    Client: any,
    ELASTIC_URI: string
  ): Promise<SearchResponse<any>> {
    return new Promise(function (resolve, reject) {
      const client = new Client({
        node: ELASTIC_URI,
      });
      client.search(
        {
          index: index,
          body: body,
        },
        (err: string, { body }: any) => {
          if (err) console.log(err);
          resolve(body);
        }
      );
    });
  },
  // per la Query dell'AS dovrò la conf sarà advanced_search_config.ts
  buildQuery(data: DataType, conf: any, type: string) {
    const { searchId, results } = data; // searchId = "work", "results: {...}"
    const sort = results ? results.sort : data.sort; // sort = se ci sono i results è SEARCH-RESULTS e trova il sort dentro l'oggetto, altrimenti è SEARCH-FACETS e il sort è al primo livello
    const { limit, offset } = results || {}; // ci sono solo nel SEARCH-RESULTS, altrimenti vuoti
    
    // QUERY ELASTICSEARCH ... costruisco la query per ES    
    const sort_field = conf[searchId]?.base_query?.field 
      ? conf[searchId].base_query.field 
      : 'slug.keyword'; 
      
    const main_query: any =  {
        // prepara il data model per la basic query per ES (cf. Basic Query Theatheor su Postman)
        query: {
          bool: {
            must: [], //"record-type": "work"
          },
        },
        sort,
        aggregations: {},
      };
    
    if(conf[searchId].base_query && conf[searchId].base_query.value){    
        main_query.query.bool.must.push(
            { match: { [sort_field]: conf[searchId].base_query.value } }
        ) 
    }

    //ora deve produrre il sort e le aggregations
    //sorting
    const sort_object = [];
    if (conf[searchId].sort) {
      conf[searchId].sort.forEach((f) => {
        // ad es. nella search_config.ts di theatheor abbiamo [ "sort_title.keyword", "slug.keyword" ]
       
        if (typeof sort != 'undefined') {
          // es. "sort_DESC"
          const lastIndex = sort.lastIndexOf('_');
          const before = sort.slice(0, lastIndex);
          const after = sort.slice(lastIndex + 1);

          if( f === before){
            sort_object.push({ [f]: after }); // es. "title.keyword": "DESC"
          }
        }
      });
    } 
    sort_object.push({'slug.keyword': "ASC"});
    

    if (sort) {
      sort === '_score'
        ? (main_query.sort = ['_score'])
        : (main_query.sort = sort_object);
    } else {
      main_query.sort = sort_object; // aggiorna il sort della main query con es. "title.keyword": "DESC"
    }

    // pagination params
    if(type === "facets" ){
      main_query.size = 0; // aggiunge proprietà "size" a main_query con il valore di results.limit (e.g. 10)
    }
    else if (limit) {
      main_query.size = limit; // aggiunge proprietà "size" a main_query con il valore di results.limit (e.g. 10)
    }

    if (offset || offset === 0) {
      main_query.from = offset; // vd. sopra, aggiunge proprietà "from"
    }
    
    
    if (conf[searchId].options?.exclude) {
        main_query["_source"] = {
            exclude: conf[searchId].options.exclude
        }
    }
    
    if (conf[searchId].options?.include) {
        main_query["_source"] = {
            include: conf[searchId].options.include
        }
    }
    
    // aggregations filters
    if(conf[searchId]['facets-aggs']){
      const query_facets = conf[searchId]['facets-aggs'].aggregations; // { "types": {"nested": false, "search": "taxonomies.type.key.keyword", "title": "taxonomies.type.name.keyword"}, "collocations": {...}, "authors": {...}}
      const dataKeys = Object.keys(data); // ['searchId', 'results', 'query']
      Object.keys(conf[searchId].filters) // [ 'query', 'types', 'authors', 'collocations', 'dates' ]
        .filter((filterId) => dataKeys.includes(filterId)) // query
        .forEach((filterId) => {
          // query, types, authors etc.
          const query_key = conf[searchId].filters[filterId]; // { "type": "fulltext", "field": ["title", "description"], "addStar": true }, {...}
          if (query_key) {
             // fa uno switch su tutti i tipi di query
            switch (  query_key.type ) {
              case 'fulltext':
                const ft_query = {
                  // multi_match: {
                  query_string: {
                    query: query_key.addStar // if true
                      ? '*' + data[filterId] + '*' // il valore della query, es. "query": "*test*"
                      : data[filterId], // altrimenti query vuota
                    fields: query_key.field, // es. "title", "description"
                    default_operator: 'AND',
                  },
                };
                main_query.query.bool.must.push(ft_query); // aggiunge oggetto dopo "match" in "must" es. "query_string": { "query": "*bbb*", "fields": [ "title", "description" ] }
                break;
              case 'multivalue':
                const query_nested = query_facets[filterId].nested
                ? query_facets[filterId].nested // true || false
                : false;
  
                if (data[filterId] && query_nested === false) {
                  if(query_key.operator == "OR"){
                    const should = {
                        "bool": {
                            "should": []
                        }
                    };
                    data[filterId].map((value) => {
                        should.bool.should.push({
                            match: {
                                [query_key.field]: value,
                            },
                        });
                    });
                    main_query.query.bool.must.push(should);
  
                } else {
                    data[filterId].map((value) => {
                      main_query.query.bool.must.push({
                        match: {
                          [query_key.field]: value,
                        },
                      });
                    });
                  }
                } else {
                  const path = query_facets[filterId]['nestedFields'] ? query_facets[filterId]['nestedFields'].join(".") : filterId;
                  const values = typeof data[filterId] === "string" ? [data[filterId]] : data[filterId];
                  values.forEach( $val => {                   
                      const nested = {
                          nested: {
                              path: path,
                              query: {
                                  bool: {
                                      must: [
                                          { term: {[query_facets[filterId].search]: $val}}
                                      ]
                                  },
                              },
                          },
                      };
                      main_query.query.bool.must.push(nested);                    
                  })
              }
              break;
              case "range": 
              const ranges = typeof data[filterId] === "string" ? [data[filterId] ] :  data[filterId];
              ranges.forEach(range => {
                const ranges = range.split("-");
                const range_query = { 
                  "range": {
                    [query_key.field] : {
                      "gte": ranges[0] ?? "*",
                      "lte": ranges[1] ?? "*",
                    }                  
                  }
                }
                main_query.query.bool.must.push(range_query);    
              })
              break;
              default:
                break;
            }
          }
        });
      //facets aggregations
      main_query.aggregations = this.buildAggs(data.facets, query_facets);
    }
    
    return main_query;
  },
  buildAggs(facets_request, query_facets){
    const main_query = {
      aggregations: {}
    };
    for (const f in facets_request) {
      const key =  facets_request[f]["id"];
      if(query_facets[key] === undefined )  continue;
      const limit:number = ( facets_request[f].limit != undefined ) ?  facets_request[f].limit : 100; 
      const offset:number = (  facets_request[f].offset != undefined ) ? facets_request[f].offset : 0; 
      const size:number =  offset + limit;
      const filterTerm:string =  (  facets_request[f].query != undefined && facets_request[f].query != "" ) ? facets_request[f].query + "*" : "" ;
      const minDocCount: number = query_facets[key].showEmpty != undefined && query_facets[key].showEmpty ? 0 : 1;
      const sort:string = query_facets[key].sort != undefined ? "_" + query_facets[key].sort : "_count";
      const { nested, extra, ranges, global } = query_facets[key];     
      if (nested) {
        if(query_facets[key]["nestedFields"]){
          const build_aggs = this.buildNested(query_facets[key]["nestedFields"], query_facets[key].search, query_facets[key].title, size, filterTerm, query_facets[key]["innerFilterField"], extra, minDocCount, sort);
          main_query.aggregations[key] = build_aggs;       
        } else {
            //it contains a error, mantained for backward compatibility
          main_query.aggregations[key] = {
            nested: { path: key },
            aggs: {
              [key]: {
                terms: {
                  size: size,
                  order: {
                    [sort]: "asc"
                  },
                  script: {
                    source: `if(doc['${query_facets[key].search}'].size() > 0 ) doc['${query_facets[key].search}'].value + '${AGGR_SEPARATOR}' + doc['${query_facets[key].title}'].value`,
                    lang: 'painless',
                  },
                },
              }                
            },
          };
        }
      }
      else if(ranges){
        const range_aggs = {
          range: {
            field: query_facets[key].search,
            ranges: query_facets[key].ranges            
          },
        };
        if(global) {
          main_query.aggregations[key] = {
            global: {},
            aggs: {
              [key]: range_aggs
            }            
          }
          
        } else {
          main_query.aggregations[key] = range_aggs;
        }
      }
      else {
        let filterQuery = null;
        if( (filterTerm && filterTerm != "") || query_facets[key]['generalFilter'] ){
          filterQuery = this.buildAggsFilter(filterTerm, query_facets[key] )  
        } 
        let term_aggr = this.buildTerm(query_facets[key], size, extra, sort, global, filterQuery);        
        main_query.aggregations[key] = term_aggr;
        if(!term_aggr.aggs){
          const distTerm = this.distinctTerms(query_facets[key]['search']);
          main_query.aggregations["distinctTerms_" + key] = distTerm;
          
        }
      }
    }
    
    return main_query.aggregations;  
  },
  
  buildAggsFilter(filterTerm, facet_conf){
    const must_array = [];
    if((filterTerm && filterTerm != "") ){
      must_array.push(
        ASHelper.queryString({
          "value": filterTerm,
          "fields": facet_conf["innerFilterField"]
        })      
      )
    }
    if(facet_conf['generalFilter']){
      must_array.push(
        ASHelper.queryString(facet_conf["generalFilter"])      
      )
    }
    if(must_array.length > 0){
      const bool = ASHelper.queryBool(must_array);
      return bool.query;
    }
    return null;  
  },
  buildNested(terms, search, title, size = null, filterTerm="", filterField="", extraFields = null, minDocCount = 1, sort = "_count") {
    if (terms.length > 1) {
        let term = terms.splice(0, 1);
        terms[0] = term + "." + terms[0];      
  
      return {
            "nested": {
                "path": term[0]               
            },
            "aggs": {
                [term]: this.buildNested(terms, search, title, size, filterTerm, filterField, extraFields, minDocCount, sort)
            }
        };
    }
    else {
        const nestedObj = {
          "nested": {
            "path": terms[0]               
        },
        "aggs": {}
        }
  
        const nestedAgg =  {    
            [terms[0]]: {
                terms: {
                    size: size,
                    min_doc_count: minDocCount,
                    order: {
                      [sort]: sort == "_count" ? "desc" : "asc"
                    },
                    script: {
                        source: `if(doc['${search}'].size() > 0 ) doc['${search}'].value + '${AGGR_SEPARATOR}' + doc['${title}'].value`,
                        lang: 'painless',
                    },
                }                    
            },
            "distinctTerms": this.distinctTerms(search)
        };
      
      if( extraFields ){           
        const extraAggs = {};
        for (const key in extraFields) {
            extraAggs[key] = { "terms": {  "field": extraFields[key] } }
        }
        nestedAgg[terms[0]]['aggs'] = extraAggs;
    }      
  
      if( filterTerm && filterTerm != "" ){
        nestedObj.aggs['filter_term'] = {
          "filter" : {
            "query_string": {
              "query": filterTerm,
              "fields": filterField
            }
          },
          "aggs": nestedAgg
        }
      } else {
        nestedObj.aggs = nestedAgg
      }
        return nestedObj;
    }
  },
  
  buildTerm(term, size, extra = null, sort = "_count", global = false, filterQuery = null){
    let term_query = {}; 
    
    const term_aggr = {
      terms: {
        size: size,
        order: {
          [sort]: sort == "_count" ? "desc" : "asc"
        },
        script: {
          source: `if(doc['${term.search}'].size() > 0 ) doc['${term.search}'].value + '${AGGR_SEPARATOR}' + doc['${term.title}'].value`,
          lang: 'painless',
        },
      },
    };
  
    const distinct_term =  this.distinctTerms(term.search);
    if( extra ){           
      const extraAggs = {};
      for (const key in extra) {
          extraAggs[key] = { "terms": {  "field": extra[key] } }
      }
      term_aggr['aggs'] = extraAggs;
    }  
  
    if (filterQuery){
    term_query = {       
        "filter": filterQuery,       
        "aggs": {
          "term": term_aggr,
          "distinctTerms": distinct_term
        }
      }
    } else {
      term_query = term_aggr;    
    }
    
    if (global) { 
      return {
        "global": {},
        "aggs": {
          "term": term_query,
          "distinctTerms": distinct_term
        }
      }
    } 
    return term_query;
  },
  
  
  distinctTerms(term){
    return {
      "cardinality": {
          "field": term
      }
    }
  }
};
