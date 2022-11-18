"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedSearchService = void 0;
const ASHelper = require("../helpers/advanced-helper");
const helpers_1 = require("../helpers");
const parsers_1 = require("../parsers");
class AdvancedSearchService {
    constructor(configurations) {
        this.parseResponse = (query_res, query_params) => {
            const { searchId } = query_params;
            const { limit, offset, sort } = query_params.results ? query_params.results : 'null';
            const data = query_res.hits.hits;
            let total_count = query_res.hits.total.value;
            const parser = new parsers_1.AdvancedSearchParser();
            const response = parser.advancedParseResults({
                data,
                options: {
                    offset,
                    sort,
                    limit,
                    total_count,
                    searchId,
                    conf: this.configurations.advanced_search,
                },
            });
            return response;
        };
        this.extractXmlTextHl = (query_res) => {
            const data = query_res.hits.hits;
            const hl = [];
            data.forEach(hit => {
                var _a, _b;
                if (hit.inner_hits && ((_a = hit.inner_hits) === null || _a === void 0 ? void 0 : _a.xml_text)) {
                    (_b = hit.inner_hits) === null || _b === void 0 ? void 0 : _b.xml_text.hits.hits.forEach(element => {
                        const el = element._source;
                        if (element.highlight) {
                            for (const property in element.highlight) {
                                const hl_array = Object.values(element.highlight[property]);
                                if (/xml_text$/.test(property)) {
                                    if (hl_array[0] && hl_array[0]) {
                                        el['highlight'] = hl_array[0];
                                    }
                                }
                                else if (/.*\._attr\.\w*/.test(property)) {
                                    const nodes = property.match(/(.*\.)?(\w+)\._attr\.(\w*)/);
                                    if (Array.isArray(nodes)) {
                                        const node_name = nodes === null || nodes === void 0 ? void 0 : nodes[2];
                                        const node_attr = nodes === null || nodes === void 0 ? void 0 : nodes[3];
                                        let xml_text = el.xml_text;
                                        const snippet = helpers_1.CommonHelper.HighlightTagInXml(node_name, node_attr, hl_array[0], xml_text);
                                        el['highlight'] = snippet;
                                    }
                                }
                            }
                        }
                        hl.push(el);
                    });
                }
            });
            return hl;
        };
        this.buildAdvancedQuery = (query_params) => {
            var _a, _b;
            // prevedere valore search-type nel data?
            const { searchId, results } = query_params;
            const sort = (results === null || results === void 0 ? void 0 : results.sort) || null;
            const { limit, offset } = results || {};
            const advanced_conf = this.configurations['advanced_search'][searchId];
            const adv_query = {
                query: {},
                highlight: {
                    fields: {},
                    pre_tags: ["<em class='mrc__text-emph'>"],
                    post_tags: ['</em>'],
                },
            };
            //sorting        
            if (sort) {
                if (sort === '_score' || sort === 'sort_ASC') {
                    adv_query.sort = ['_score'];
                }
                else {
                    const lastIndex = sort.lastIndexOf('_');
                    const field = sort.slice(0, lastIndex);
                    const order = sort.slice(lastIndex + 1);
                    if (field != "" && order != "") {
                        adv_query.sort = { [field]: order }; // es. "title.keyword": "DESC"                        
                    }
                    else {
                        adv_query.sort = { [field]: "ASC" }; // es. "title.keyword": "DESC"                        
                    }
                }
            }
            if ((_a = advanced_conf === null || advanced_conf === void 0 ? void 0 : advanced_conf.options) === null || _a === void 0 ? void 0 : _a.exclude) {
                adv_query["_source"] = {
                    exclude: advanced_conf.options.exclude
                };
            }
            if ((_b = advanced_conf === null || advanced_conf === void 0 ? void 0 : advanced_conf.options) === null || _b === void 0 ? void 0 : _b.include) {
                adv_query["_source"] = {
                    include: advanced_conf.options.include
                };
            }
            //BASE QUERY
            const must_array = [];
            const must_not = [];
            let highlight_fields = {};
            if (advanced_conf === null || advanced_conf === void 0 ? void 0 : advanced_conf.base_query) {
                const base_query = ASHelper.queryTerm(advanced_conf.base_query.field, advanced_conf.base_query.value);
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
                    switch (query_key.type // fa uno switch su tutti i tipi di query
                    ) {
                        case 'fulltext':
                            if (!query_params[groupId])
                                break;
                            const query_string = ASHelper.buildQueryString(query_params[groupId], {
                                allowWildCard: query_key.addStar,
                                stripDoubleQuotes: query_key.stripDoubleQuotes != undefined ? query_key.stripDoubleQuotes : true,
                            });
                            const ft_query = ASHelper.queryString({ fields: query_key.field, value: query_string }, 'AND');
                            if (!query_key.noHighlight) {
                                highlight_fields = Object.assign(Object.assign({}, ASHelper.buildHighlights(query_key.field)), highlight_fields);
                            }
                            must_array.push(ft_query); // aggiunge oggetto dopo "match" in "must" es. "query_string": { "query": "*bbb*", "fields": [ "title", "description" ] }
                            if (query_key.baseQuery) {
                                const base_query = ASHelper.queryTerm(query_key.baseQuery.field, query_key.baseQuery.value);
                                must_array.push(base_query);
                            }
                            break;
                        case 'proximity':
                            if (!query_params[query_key.query_params.value])
                                break;
                            const pt_query = ASHelper.spanNear({
                                fields: query_key.field,
                                value: query_params[query_key.query_params.value],
                                distance: +query_params[query_key.query_params.slop],
                            });
                            if (!query_key.noHighlight) {
                                highlight_fields = Object.assign(Object.assign({}, ASHelper.buildHighlights(query_key.field)), highlight_fields);
                            }
                            must_array.push(pt_query);
                            break;
                        case 'term_value':
                            if (!query_params[groupId])
                                break;
                            let query_term = query_params[groupId];
                            if (query_key.separator) {
                                query_term = query_term.split(query_key.separator);
                            }
                            const _name = query_key.field.replace("*", "");
                            // from 2.3.1
                            const tv_query = ASHelper.queryTerm(query_key.field, query_term, _name);
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
                                highlight_fields = Object.assign(Object.assign({}, ASHelper.buildHighlights(query_key.field)), highlight_fields);
                            }
                            if (query_key.baseQuery) {
                                const base_query = ASHelper.queryTerm(query_key.baseQuery.field, query_key.baseQuery.value);
                                must_array.push(base_query);
                            }
                            must_array.push(tv_query);
                            break;
                        case 'term_field_value':
                            if (!query_params[query_key.query_params.value])
                                break;
                            const fields = query_params[query_key.query_params.field]
                                ? query_params[query_key.query_params.field]
                                : query_key.field;
                            const query_field_value = ASHelper.buildQueryString(query_params[query_key.query_params.value], {
                                allowWildCard: query_key.addStar,
                                stripDoubleQuotes: query_key.stripDoubleQuotes != undefined ? query_key.stripDoubleQuotes : true,
                            });
                            const tf_query = ASHelper.queryString({
                                fields: fields,
                                value: query_field_value,
                            }, 'AND');
                            if (!query_key.noHighlight) {
                                highlight_fields = Object.assign(Object.assign({}, ASHelper.buildHighlights(fields)), highlight_fields);
                            }
                            if (query_key.baseQuery) {
                                const base_query = ASHelper.queryTerm(query_key.baseQuery.field, query_key.baseQuery.value);
                                must_array.push(base_query);
                            }
                            must_array.push(tf_query);
                            break;
                        case 'term_exists':
                            if (query_params[groupId] === 'true') {
                                const te_query = ASHelper.queryExists(query_key.field);
                                if (!query_key.noHighlight) {
                                    highlight_fields = Object.assign(Object.assign({}, ASHelper.buildHighlights(query_key.field)), highlight_fields);
                                }
                                must_array.push(te_query);
                            }
                            else if (query_params[groupId] === 'false') {
                                const te_query = ASHelper.queryExists(query_key.field);
                                if (!query_key.noHighlight) {
                                    highlight_fields = Object.assign(Object.assign({}, ASHelper.buildHighlights(query_key.field)), highlight_fields);
                                }
                                must_not.push(te_query);
                            }
                            if (query_key.baseQuery) {
                                const base_query = ASHelper.queryTerm(query_key.baseQuery.field, query_key.baseQuery.value);
                                must_array.push(base_query);
                            }
                            break;
                        case 'term_range':
                            if (!query_params[groupId])
                                break;
                            const range_query = ASHelper.queryRange(query_key.field, query_params[groupId]);
                            if (!query_key.noHighlight) {
                                highlight_fields = Object.assign(Object.assign({}, ASHelper.buildHighlights(query_key.field)), highlight_fields);
                            }
                            if (query_key.baseQuery) {
                                const base_query = ASHelper.queryTerm(query_key.baseQuery.field, query_key.baseQuery.value);
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
                //to version 2.2.0
                /*let te_query;
                Object.keys(advanced_conf['search_full_text']).forEach((groupId) => {
                    if (this.body[groupId]) {
                        te_query = ASHelper.queryExists('xml_filename');
                    }
                });
                if (typeof te_query !== 'undefined') {
                    must_array.push(te_query);
                }*/
                const text_query = this.buildXmlTextQuery(advanced_conf.search_full_text, query_params);
                if (text_query) {
                    must_array.push({ "nested": text_query });
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
        this.configurations = configurations;
    }
    buildXmlTextQuery(advanced_conf, data) {
        const xml_query_should = [];
        const inner_hits = advanced_conf.inner_hits;
        inner_hits['name'] = "xml_text";
        Object.keys(advanced_conf.search_groups)
            .forEach((groupId) => {
            const query_conf = advanced_conf.search_groups[groupId];
            switch (query_conf.type // fa uno switch su tutti i tipi di query
            ) {
                case "fulltext":
                case "xml_attribute":
                    if (!data[groupId])
                        break;
                    query_conf.fields.forEach(field => {
                        const _name = field.replace("*", "");
                        xml_query_should.push(ASHelper.simpleQueryString({ fields: field, value: data[groupId] }, "AND", true, _name));
                    });
                    if (query_conf.highlight) {
                        inner_hits['highlight'] = Object.assign(Object.assign({}, ASHelper.buildHighlights(query_conf.highlight)), inner_hits['highlight']);
                    }
                    break;
            }
        });
        if (xml_query_should.length > 0) {
            const xml_query_nested = ASHelper.nestedQuery(advanced_conf.options.path, ASHelper.queryBool([], xml_query_should).query, inner_hits);
            return xml_query_nested;
        }
        else
            return null;
    }
    buildSingleTextQuery(query_params, id, field = "id") {
        this.buildAdvancedQuery(query_params);
    }
}
exports.AdvancedSearchService = AdvancedSearchService;
