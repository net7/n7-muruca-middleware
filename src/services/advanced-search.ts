import { DataType } from '../interfaces/helper';
import * as ASHelper from '../helpers/advanced-helper';
import { ESHelper } from '../helpers';
import { Client } from '@elastic/elasticsearch';
import { AdvancedSearchParser } from '../parsers';

export class AdvancedSearchService {

    runAdvancedSearch = async (body: DataType, conf: any, locale: string) => {
        const {
            searchIndex,
            elasticUri,
            configurations,
            defaultLang
        } = conf;
        const params = this.buildAdvancedQuery(body, configurations); // return main_query (cf. Basic Query Theatheor body JSON su Postman)
        //console.log(JSON.stringify(params));
        let searchLangIndex = searchIndex;
        if (locale && defaultLang && locale != defaultLang) {
            searchLangIndex = searchIndex + '_' + locale
        }
        const query_res: any = await ESHelper.makeSearch(
            searchLangIndex,
            params,
            Client,
            elasticUri
        );
        const data = query_res.hits.hits;        
        let total_count = query_res.hits.total.value;
        
        const { searchId } = body;
        const { limit, offset, sort } = body.results ? body.results : 'null';
        const parser = new AdvancedSearchParser();
        const response = parser.advancedParseResults({
            data,
            options: {
                offset,
                sort,
                limit,
                total_count,
                searchId,
                conf: configurations.advanced_search,
            },
        });   
        return response; 
    }
    
    buildAdvancedQuery = (data: DataType, conf: any) => {
        // prevedere valore search-type nel data?
        const { searchId, results } = data;
        const sort = results.sort;
        const { limit, offset } = results || {};
        const advanced_conf = conf['advanced_search'][searchId];

        const adv_query: any = {
            query: {},
            sort,
            highlight: {
                fields: {},
                pre_tags: ["<em class='mrc__text-emph'>"],
                post_tags: ['</em>'],
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
        
        if (advanced_conf?.options?.exclude) {
            adv_query["_source"] = {
                exclude: advanced_conf.options.exclude
            }
        }
        
        //BASE QUERY
        const must_array = [];
        const must_not = [];
        let highlight_fields = {};
        if (advanced_conf.base_query) {
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
                            if (!data[groupId]) break;
                            const query_string = ASHelper.buildQueryString(data[groupId], {
                                allowWildCard: query_key.addStar,
                                stripDoubleQuotes: query_key.stripDoubleQuotes != undefined ? query_key.stripDoubleQuotes : true,
                            });
                            const ft_query = ASHelper.queryString(
                                { fields: query_key.field, value: query_string },
                                'AND'
                            );
                            if (!query_key.noHighlight) {
                                highlight_fields = {
                                    ...ASHelper.buildHighlights(query_key.field),
                                    ...highlight_fields,
                                };
                            }
                            must_array.push(ft_query); // aggiunge oggetto dopo "match" in "must" es. "query_string": { "query": "*bbb*", "fields": [ "title", "description" ] }
                            break;
                        case 'proximity':
                            if (!data[query_key.query_params.value]) break;
                            const pt_query = ASHelper.spanNear({
                                fields: query_key.field,
                                value: data[query_key.query_params.value],
                                distance: +data[query_key.query_params.slop],
                            });
                            if (!query_key.noHighlight) {
                                highlight_fields = {
                                    ...ASHelper.buildHighlights(query_key.field),
                                    ...highlight_fields,
                                };
                            }
                            must_array.push(pt_query);
                            break;
                        case 'term_value':
                            if (!data[groupId]) break;

                            // from 2.3.1
                            const query_term = data[groupId];
                            const tv_query = ASHelper.queryTerm(
                                query_key.field,
                                query_term
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
                                    ...ASHelper.buildHighlights(query_key.field),
                                    ...highlight_fields,
                                };
                            }
                            must_array.push(tv_query);
                            break;
                        case 'term_field_value':
                            if (!data[query_key.query_params.value]) break;
                            const fields = data[query_key.query_params.field]
                                ? data[query_key.query_params.field]
                                : query_key.field;
                            const query_field_value = ASHelper.buildQueryString(
                                data[query_key.query_params.value],
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
                            must_array.push(tf_query);
                            break;
                        case 'term_exists':
                            if (<any>data[groupId] === 'true') {
                                const te_query = ASHelper.queryExists(query_key.field);
                                if (!query_key.noHighlight) {
                                    highlight_fields = {
                                        ...ASHelper.buildHighlights(query_key.field),
                                        ...highlight_fields,
                                    };
                                }
                                must_array.push(te_query);
                            } else if (<any>data[groupId] === 'false') {
                                const te_query = ASHelper.queryExists(query_key.field);
                                if (!query_key.noHighlight) {
                                    highlight_fields = {
                                        ...ASHelper.buildHighlights(query_key.field),
                                        ...highlight_fields,
                                    };
                                }
                                must_not.push(te_query);
                            }
                            break;
                        case 'term_range':
                            if (!data[groupId]) break;
                            const range_query = ASHelper.queryRange(
                                query_key.field,
                                data[groupId]
                            );
                            if (!query_key.noHighlight) {
                                highlight_fields = {
                                    ...ASHelper.buildHighlights(query_key.field),
                                    ...highlight_fields,
                                };
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
            //to version 2.2.0
            /*let te_query;
            Object.keys(advanced_conf['search_full_text']).forEach((groupId) => {
                if (data[groupId]) {
                    te_query = ASHelper.queryExists('xml_filename');
                }
            });
            if (typeof te_query !== 'undefined') {
                must_array.push(te_query);
            }*/
            must_array.push({"nested":  this.buildXmlTextQuery(advanced_conf.search_full_text, data)})
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
        
    buildXmlTextQuery(advanced_conf, data){        
        const xml_query_should = [];            
        const inner_hits = advanced_conf.inner_hits;    
        inner_hits['name'] = "xml_text";    
        Object.keys(advanced_conf.search_groups)
        .forEach((groupId) => {
            const query_conf = advanced_conf.search_groups[groupId];
            switch (
                query_conf.type // fa uno switch su tutti i tipi di query
                ) {
                    case "fulltext": 
                    case "xml_attribute": 
                    if (!data[groupId]) break;
                    query_conf.fields.forEach(field => {
                        const _name = field.replace("*", "");
                        xml_query_should.push(ASHelper.simpleQueryString({ fields: field, value: data[groupId] }, "AND", true, _name));
                    });
                    if(query_conf.highlight){
                        inner_hits['highlight'] = {
                            ...ASHelper.buildHighlights(query_conf.highlight),
                            ...inner_hits['highlight'],
                        };
                    }
                    break;                    
                }
        })
        
        const xml_query_nested = ASHelper.nestedQuery(advanced_conf.options.path, ASHelper.queryBool([], xml_query_should).query, inner_hits);
        
        
        return xml_query_nested;
    }
}
