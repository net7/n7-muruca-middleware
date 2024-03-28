import { DataType } from '../interfaces/helper';
import * as ASHelper from '../helpers/advanced-helper';
import { CommonHelper, ESHelper } from '../helpers';
import { Client } from '@elastic/elasticsearch';
import { AdvancedSearchParser, XmlSearchParser } from '../parsers';
import { SearchResultsData } from '../interfaces';

export class AdvancedSearchService {
    
    private configurations:any;
    
    constructor(configurations){
        
        this.configurations = configurations;
    }

    parseResponse = async (query_res: any, query_params, teiPublisherUri) => {
        
        const { searchId } = query_params;
        const { limit, offset, sort } = query_params.results ? query_params.results : 'null';
        const data = query_res.hits.hits;        
        let total_count = query_res.hits.total.value;
        
        const parser = new AdvancedSearchParser();
        
        const response: SearchResultsData = {
            limit,
            offset,
            sort,
            total_count,
            results: [],
        };
        
        const results = await parser.advancedParseResultsItems(
            {
                data,
                options: {
                    searchId,
                    conf: this.configurations.advanced_search,
                    teiPublisherUri
                }
            }
        );
        
        response.results = results;
        return response; 
    }
    
    extractXmlTextHl = (query_res: any ) => {
        
        const data = query_res.hits.hits;        
        const hl = [];
        const parser = new XmlSearchParser();
        data.forEach(hit => {          
          if( hit.inner_hits && hit.inner_hits?.xml_text ){
            hl.push(... parser.parseResponse(hit.inner_hits.xml_text));                
            }            
        });        
        return hl;
    }
    
    buildAdvancedQuery = (query_params) => {
        // prevedere valore search-type nel data?
        const { searchId, results } = query_params;
        const sort = results?.sort || null;
        const { limit, offset } = results || {};
        const advanced_conf = this.configurations['advanced_search'][searchId];

        const adv_query: any = {
            query: {},
            highlight: {
                fields: {},
                fragment_size:500,
                pre_tags: ["<em class='mrc__text-emph'>"],
                post_tags: ['</em>'],
            },
        };

        //sorting        
        if (sort) {
          adv_query.sort = ASHelper.buildSortParam(sort, advanced_conf.sort);      
        }
        if (advanced_conf?.options?.exclude) {
            adv_query["_source"] = {
                exclude: advanced_conf.options.exclude
            }
        }
        if (advanced_conf?.options?.include) {
            adv_query["_source"] = {
                include: advanced_conf.options.include
            }
        }
        
        //BASE QUERY
        const must_array = [];
        const must_not = [];
        let highlight_fields = {};
        if (advanced_conf?.base_query) {
            const base_query = ASHelper.queryTerm(
                advanced_conf.base_query.field,
                advanced_conf.base_query.value
            );
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
                            if (!query_params[groupId]) break;
                            let ft_query = this.buildFulltextQuery(query_key, query_params[groupId])                          
                            
                            if (!query_key.noHighlight) {
                                highlight_fields = {
                                    ...ASHelper.buildHighlights(query_key.field, query_key.noHighlightFields),
                                    ...highlight_fields,
                                };
                            }
                            must_array.push(ft_query); // aggiunge oggetto dopo "match" in "must" es. "query_string": { "query": "*bbb*", "fields": [ "title", "description" ] }
                            
                            if(query_key.baseQuery){
                                const base_query = ASHelper.queryTerm(
                                    query_key.baseQuery.field,
                                    query_key.baseQuery.value
                                );
                                must_array.push(base_query);
                            }
                            break;
                        case 'term_value':
                            if (!query_params[groupId]) break;
                            let query_term = query_params[groupId];
                            if( query_key.separator ){
                                query_term = query_term.split(query_key.separator);
                            }
                            const _name = query_key.field.replace("*", "");
                            // from 2.3.1
                            const tv_query = ASHelper.queryTerm(
                                query_key.field,
                                query_term,
                                _name
                            );
                            //until 2.2.0  
                            /*
                            const query_term = ASHelper.buildQueryString(data[groupId], {
                                allowWildCard: query_key.addStar,
                                stripDoubleQuotes: query_key.stripDoubleQuotes != undefined ? query_key.stripDoubleQuotes : true,
                            });
                            const operator = query_key.operator ? query_key.operator : 'AND';
                            const tv_query = ASHelper.queryString(
                                { fields: query_key.field, value: query_term },
                                operator
                            );*/

                            if (!query_key.noHighlight) {
                                highlight_fields = {
                                    ...ASHelper.buildHighlights(query_key.field, query_key.noHighlightFields ),
                                    ...highlight_fields,
                                };
                            }
                            if(query_key.baseQuery){
                                const base_query = ASHelper.queryTerm(
                                    query_key.baseQuery.field,
                                    query_key.baseQuery.value
                                );
                                must_array.push(base_query);
                            }
                            must_array.push(tv_query);
                            break;
                        case 'term_field_value':
                            if (!query_params[query_key.query_params.value]) break;
                            const fields = query_params[query_key.query_params.field]
                                ? query_params[query_key.query_params.field]
                                : query_key.field;
                            const query_field_value = ASHelper.buildQueryString(
                                query_params[query_key.query_params.value],
                                {
                                    allowWildCard: query_key.addStar,
                                    stripDoubleQuotes: query_key.stripDoubleQuotes != undefined ? query_key.stripDoubleQuotes : true,
                                }
                            );
                            const tf_query = ASHelper.queryString(
                                {
                                    fields: fields,
                                    value: query_field_value,
                                },
                                'AND'
                            );
                            if (!query_key.noHighlight) {
                                highlight_fields = {
                                    ...ASHelper.buildHighlights(fields),
                                    ...highlight_fields,
                                };
                            }
                            if(query_key.baseQuery){
                                const base_query = ASHelper.queryTerm(
                                    query_key.baseQuery.field,
                                    query_key.baseQuery.value
                                );
                                must_array.push(base_query);
                            }
                            must_array.push(tf_query);
                            break;
                        case 'term_exists':
                            if (<any>query_params[groupId] === 'true') {
                                const te_query = ASHelper.queryExists(query_key.field);
                                if (!query_key.noHighlight) {
                                    highlight_fields = {
                                        ...ASHelper.buildHighlights(query_key.field),
                                        ...highlight_fields,
                                    };
                                }
                                must_array.push(te_query);
                            } else if (<any>query_params[groupId] === 'false') {
                                const te_query = ASHelper.queryExists(query_key.field);
                                if (!query_key.noHighlight) {
                                    highlight_fields = {
                                        ...ASHelper.buildHighlights(query_key.field),
                                        ...highlight_fields,
                                    };
                                }
                                must_not.push(te_query);
                            }
                            
                            if(query_key.baseQuery){
                                const base_query = ASHelper.queryTerm(
                                    query_key.baseQuery.field,
                                    query_key.baseQuery.value
                                );
                                must_array.push(base_query);
                            }
                            break;
                        case 'term_range':
                            if (!query_params[groupId]) break;
                            const range_query = ASHelper.queryRange(
                                query_key.field,
                                query_params[groupId]
                            );
                            if (!query_key.noHighlight) {
                                highlight_fields = {
                                    ...ASHelper.buildHighlights(query_key.field),
                                    ...highlight_fields,
                                };
                            }
                            if(query_key.baseQuery){
                                const base_query = ASHelper.queryTerm(
                                    query_key.baseQuery.field,
                                    query_key.baseQuery.value
                                );
                                must_array.push(base_query);
                            }
                            must_array.push(range_query);
                            break;
                        case 'ternary':
                            break;

                        default:
                            break;
                    }
                }
            });

        if (advanced_conf['search_full_text']) {
            const text_query = this.buildXmlTextQuery(advanced_conf.search_full_text, query_params);
            if (text_query){
                must_array.push({"nested": text_query})                
            }
        }

        const bool_query = ASHelper.queryBool(must_array, [], [], must_not);
        adv_query.query = bool_query.query;
        if (advanced_conf.highlight_all) {
            highlight_fields['*'] = {};
        }
        if (Object.keys(highlight_fields).length) {
            adv_query.highlight.fields = highlight_fields;
        }
        return adv_query;
    };
    
    buildFulltextQuery(query_conf, query_param){
      const query_string = ASHelper.buildQueryString(query_param, {
        allowWildCard:query_conf.addStar,
        stripDoubleQuotes:query_conf.stripDoubleQuotes != undefined ?query_conf.stripDoubleQuotes : true,
      });
      const ft_query = ASHelper.queryString(
          { fields:query_conf.field, value: query_string },
          'AND'
      );
      return ft_query;
    }
        
    buildXmlTextQuery(advanced_conf, data){        
        const xml_query_should = [];            
        const inner_hits = advanced_conf.inner_hits;    
        inner_hits['name'] = "xml_text";   
        
        const q  = this.parseQueryGroups(advanced_conf.search_groups,data, inner_hits);
        xml_query_should.push(...q); 
        if (xml_query_should.length > 0 ){
            const xml_query_nested = ASHelper.nestedQuery(advanced_conf.options.path, ASHelper.queryBool([], xml_query_should).query, inner_hits);
            return xml_query_nested;            
        } else return null;
    }
    
    parseQueryGroups(search_groups, data, inner_hits){
      const xml_query_should = [];
      const nested_innerhits = {...inner_hits}
      Object.keys(search_groups)
          .forEach((groupId) => {
            const query_conf = search_groups[groupId];
            if(data[groupId] && !query_conf.search_groups ){
              const q = this.buildGroupQuery(query_conf, data, groupId, inner_hits);
              if(q.length > 0){
                xml_query_should.push(...q);         
              }               
            } else if( query_conf.search_groups ) {
              const inner_array = [];              
              const q = this.parseQueryGroups(query_conf.search_groups, data, inner_hits);
              if(q.length > 0){
                inner_array.push(...q);  
                const query_bool = ASHelper.queryBool(inner_array).query;                   
                if( query_conf.options?.nested ){
                  if(query_conf.highlight  ){
                    nested_innerhits['highlight'] = ASHelper.buildHighlights(query_conf.highlight)
                  }
                  nested_innerhits['name'] = groupId;          
                  const nested = {nested: ASHelper.nestedQuery( query_conf.options.nested, query_bool, nested_innerhits)}
                  xml_query_should.push(nested);
                } else {
                  xml_query_should.push(query_bool);    
                }
                
              }
            }
        })
        return xml_query_should;
    }
    
    buildGroupQuery(query_conf, data, groupId, inner_hits){
      
      const xml_query_should = [];
      switch (query_conf.type) {
        case "fulltext": 
        case "xml_attribute":
        if( query_conf.options?.proximity_search_param && data[query_conf.options.proximity_search_param.field] ){
          
          query_conf.fields.forEach(field => {
            const q = this.buildProximityTextQuery(query_conf.options.proximity_search_param, data[groupId], data[query_conf.options.proximity_search_param.field], field);
            if( q && q != "" ){
              xml_query_should.push(q);        
            }                    
            
          });
          
        }
        else {
          const q = this.buildTextQuery(data, query_conf, groupId,  {...inner_hits});           
          if(q && q != "" ){
            xml_query_should.push(q);         
          }                    
        }
        if(query_conf.highlight && !query_conf.options?.nested ){
            inner_hits['highlight'] = {
                ...ASHelper.buildHighlights(query_conf.highlight),
                ...inner_hits['highlight'],
            };
        }
        break;                    
      }
      return xml_query_should;
    }
    
    
    buildTextQuery(data, query_conf, groupId, inner_hits){    
      const value =  query_conf['data-value'] ? data[ query_conf['data-value'] ] : data[groupId];
      let queries;
      if(value && value != ""){
        queries = ASHelper.simpleQueryString({ fields: query_conf.fields, value: value}, "AND", false);
      } 
      
      if( query_conf.options?.nested ){
        if(query_conf.highlight){
          inner_hits['highlight'] = ASHelper.buildHighlights(query_conf.highlight)
        }
        inner_hits['name'] = groupId;

        const nested = {nested: ASHelper.nestedQuery( query_conf.options.nested, queries, inner_hits)}
        queries = nested;
      }      
      return queries;
    }
    
    
    buildSingleTextQuery(query_params, id, field="id"){
        
        this.buildAdvancedQuery(query_params);
    }
    
    buildProximityTextQuery(proximity_param, value, distance, text_field){
      
      if(proximity_param.field){
        const pt_query = ASHelper.spanNear({
          fields: text_field,
          value: value,
          distance: +distance,
          in_order: proximity_param.in_order || true
        });
        return pt_query;        
      }
      else return "";

    }
}
