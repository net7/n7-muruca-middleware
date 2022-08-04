"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedSearchParser = void 0;
const ASHelper = require("../helpers/advanced-helper");
const helpers_1 = require("../helpers");
class AdvancedSearchParser {
    constructor() {
        this.buildTextViewerQuery = (data, conf, doc) => __awaiter(this, void 0, void 0, function* () {
            const { searchId, results } = data;
            const advanced_conf = conf['configurations']['advanced_search'][searchId];
            if (!advanced_conf['search_full_text'])
                return;
            // let id_doc;
            const buildParameters = () => __awaiter(this, void 0, void 0, function* () {
                var _c;
                let teiPubParams;
                for (let groupId of Object.keys(advanced_conf['search_full_text'])) {
                    var _b;
                    const query_key = advanced_conf['search_full_text'][groupId];
                    if (query_key) {
                        switch (query_key.type) {
                            case 'fulltext':
                                if (!data[groupId])
                                    break;
                                const pagination = query_key['perPage'];
                                const query = data[groupId];
                                teiPubParams = teiPubParams == "" ? `query=${query}&start=1&per-page=${pagination}` : teiPubParams + `&query=${query}&start=1&per-page=${pagination}`;
                                break;
                            case 'header-meta':
                                if (!data[groupId])
                                    break;
                                const collection_2 = query_key['collection']; //petrarca
                                const pagination_2 = query_key['perPage']; //10
                                const query_2 = data[groupId]; //es. query-text:"res"
                                let teiHeaderParams;
                                teiHeaderParams = `query=${query_2}&start=1&per-page=${pagination_2}`;
                                teiHeaderParams += `&field=${query_key.field}`;
                                const collectionUri = conf.teiPublisherUri + 'mrcsearch';
                                let tmpParams = teiHeaderParams;
                                if (doc && teiHeaderParams && teiHeaderParams != "") {
                                    const docString = doc
                                        .map((filename) => {
                                        return 'doc=' + filename.replace('/', '%2F');
                                    })
                                        .join('&');
                                    tmpParams += '&' + docString;
                                }
                                const resp = yield helpers_1.HttpHelper.doRequest(
                                //qui devono arrivare già i params per il teiHeader
                                collectionUri + '?' + tmpParams);
                                // id_doc = resp;
                                // console.log(resp);
                                const textViewerResults = ASHelper.buildTeiHeaderResults(resp);
                                let matches_result = textViewerResults;
                                let query_list; // oppure =''
                                let id_array = [];
                                for (let id of matches_result.header_params) {
                                    if (!id_array.includes(id)) {
                                        id_array.push(id);
                                    }
                                }
                                if (id_array.length > 1) {
                                    id_array.map((id, i) => {
                                        if (i < id_array.length - 1) {
                                            query_list += id;
                                            query_list += ' OR ';
                                        }
                                        else {
                                            query_list += id;
                                        }
                                    });
                                }
                                else {
                                    query_list = id_array;
                                }
                                teiPubParams = `query=${query_list}&start=1&per-page=${pagination_2}`;
                                // console.log(teiPubParams);
                                break;
                            case 'proximity':
                                if (!data[groupId])
                                    break;
                                //const pag = query_key['perPage'];
                                const slop = (_c = data[query_key['query_params']['slop']]) !== null && _c !== void 0 ? _c : '';
                                //const q2 = data[query_key['query_params']['value']];
                                teiPubParams = teiPubParams == "" ? `slop=${slop}` : teiPubParams + `&slop=${slop}`;
                            default:
                                break;
                        }
                    }
                }
                ;
                // console.log(teiPubParams);
                return teiPubParams;
            });
            let teiPubParams = yield buildParameters();
            if (doc && teiPubParams && teiPubParams != "") {
                const docString = doc
                    .map((filename) => {
                    return 'doc=' + filename.replace('/', '%2F');
                })
                    .join('&');
                teiPubParams += '&' + docString;
            }
            return teiPubParams;
        });
        this.buildTeiHeaderQuery = (data, conf, doc, id_array) => {
            const { searchId, results } = data;
            const advanced_conf = conf['advanced_search'][searchId];
            let teiHeaderParams;
            // console.log(advanced_conf['search_full_text']);
            if (!advanced_conf['search_full_text'])
                return;
            Object.keys(advanced_conf['search_full_text']).forEach((groupId) => {
                var _a;
                const query_key = advanced_conf['search_full_text'][groupId];
                if (query_key) {
                    switch (query_key.type) {
                        case 'header-meta':
                            if (!data[groupId])
                                break;
                            const pagination_3 = query_key['perPage']; //10
                            let query_list = '';
                            if (id_array.length > 1) {
                                id_array.map((id, i) => {
                                    if (i < id_array.length - 1) {
                                        query_list += id;
                                        query_list += ' OR ';
                                    }
                                    else {
                                        query_list += id;
                                    }
                                });
                            }
                            else {
                                query_list = id_array;
                            }
                            teiHeaderParams = `query=${query_list}&start=1&per-page=${pagination_3}`;
                            break;
                    }
                }
            });
            if (doc && teiHeaderParams && teiHeaderParams != '') {
                const docString = doc
                    .map((filename) => {
                    return 'doc=' + filename.replace('/', '%2F');
                })
                    .join('&');
                teiHeaderParams += '&' + docString;
            }
            return teiHeaderParams;
        };
        this.buildAdvancedQuery = (data, conf) => {
            // prevedere valore search-type nel data?
            const { searchId, results } = data;
            const sort = results.sort;
            const { limit, offset } = results || {};
            const advanced_conf = conf['advanced_search'][searchId];
            const adv_query = {
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
                    }
                    else {
                        return { [f]: tmp };
                    }
                });
            }
            if (sort) {
                sort === '_score'
                    ? (adv_query.sort = ['_score'])
                    : (adv_query.sort = sort_object);
            }
            else {
                adv_query.sort = sort_object; // aggiorna il sort della main query con es. "title.keyword": "DESC"
            }
            //BASE QUERY
            const must_array = [];
            const must_not = [];
            let highlight_fields = {};
            if (advanced_conf.base_query) {
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
                            if (!data[groupId])
                                break;
                            const query_string = ASHelper.buildQueryString(data[groupId], {
                                allowWildCard: query_key.addStar,
                                stripDoubleQuotes: query_key.stripDoubleQuotes != undefined ? query_key.stripDoubleQuotes : true,
                            });
                            const ft_query = ASHelper.queryString({ fields: query_key.field, value: query_string }, 'AND');
                            if (!query_key.noHighlight) {
                                highlight_fields = Object.assign(Object.assign({}, ASHelper.buildHighlights(query_key.field)), highlight_fields);
                            }
                            must_array.push(ft_query); // aggiunge oggetto dopo "match" in "must" es. "query_string": { "query": "*bbb*", "fields": [ "title", "description" ] }
                            break;
                        case 'proximity':
                            if (!data[query_key.query_params.value])
                                break;
                            const pt_query = ASHelper.spanNear({
                                fields: query_key.field,
                                value: data[query_key.query_params.value],
                                distance: +data[query_key.query_params.slop],
                            });
                            if (!query_key.noHighlight) {
                                highlight_fields = Object.assign(Object.assign({}, ASHelper.buildHighlights(query_key.field)), highlight_fields);
                            }
                            must_array.push(pt_query);
                            break;
                        case 'term_value':
                            if (!data[groupId])
                                break;
                            // from 2.3.1
                            const query_term = data[groupId];
                            const tv_query = ASHelper.queryTerm(query_key.field, query_term);
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
                                if (query_key.highlightField) {
                                    highlight_fields = Object.assign(Object.assign({}, ASHelper.buildHighlights(query_key.highlightField, ["", ""], true)), highlight_fields);
                                }
                                else {
                                    highlight_fields = Object.assign(Object.assign({}, ASHelper.buildHighlights(query_key.field)), highlight_fields);
                                }
                            }
                            must_array.push(tv_query);
                            break;
                        case 'term_field_value':
                            if (!data[query_key.query_params.value])
                                break;
                            const fields = data[query_key.query_params.field]
                                ? data[query_key.query_params.field]
                                : query_key.field;
                            const query_field_value = ASHelper.buildQueryString(data[query_key.query_params.value], {
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
                            must_array.push(tf_query);
                            break;
                        case 'term_exists':
                            if (data[groupId] === 'true') {
                                const te_query = ASHelper.queryExists(query_key.field);
                                if (!query_key.noHighlight) {
                                    highlight_fields = Object.assign(Object.assign({}, ASHelper.buildHighlights(query_key.field)), highlight_fields);
                                }
                                must_array.push(te_query);
                            }
                            else if (data[groupId] === 'false') {
                                const te_query = ASHelper.queryExists(query_key.field);
                                if (!query_key.noHighlight) {
                                    highlight_fields = Object.assign(Object.assign({}, ASHelper.buildHighlights(query_key.field)), highlight_fields);
                                }
                                must_not.push(te_query);
                            }
                            break;
                        case 'term_range':
                            if (!data[groupId])
                                break;
                            const range_query = ASHelper.queryRange(query_key.field, data[groupId]);
                            if (!query_key.noHighlight) {
                                highlight_fields = Object.assign(Object.assign({}, ASHelper.buildHighlights(query_key.field)), highlight_fields);
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
                let te_query;
                Object.keys(advanced_conf['search_full_text']).forEach((groupId) => {
                    if (data[groupId]) {
                        te_query = ASHelper.queryExists('xml_filename');
                    }
                });
                if (typeof te_query !== 'undefined') {
                    must_array.push(te_query);
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
    }
    parse({ data, options }) {
        const { type } = options;
        return [];
    }
    // protected parseResultsItems({ data, options }: Input): SearchResultsItemData[];
    advancedParseResults({ data, options }) {
        //forEach dei resulsts, controlla se esiste data.valore di conf e costruisci l'oggetto
        if (options && 'limit' in options) {
            var { offset, limit, sort, total_count } = options;
        }
        const search_result = {
            limit,
            offset,
            sort,
            total_count,
            results: [],
        };
        search_result.results = this.advancedParseResultsItems({ data, options });
        return search_result;
    }
    advancedParseResultsItems({ data, options }) {
        var { searchId, conf } = options;
        let items = [];
        data.forEach(({ _source: source, highlight }) => {
            let itemResult = {
                highlights: [],
            };
            if (highlight) {
                for (let prop in highlight) {
                    if (prop != 'text_matches') {
                        itemResult.highlights.push([prop, highlight[prop]]);
                    }
                    else {
                        highlight[prop].forEach((el) => itemResult.highlights.push(el));
                    }
                }
            }
            conf[searchId].results.forEach((val) => {
                if (source.hasOwnProperty(val.field)) {
                    itemResult[val.label] = source[val.field];
                }
                else if (val.field) {
                    if (!Array.isArray(val.field)) {
                        if (val.isLink === true) {
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
                    let items = [];
                    fields.forEach((item) => {
                        let obj = source;
                        if (obj && obj.hasOwnProperty(item.field)) {
                            obj = obj[item.field];
                        }
                        else {
                            let fieldArray = item.field.split('.'); // [source, work, title]
                            obj = ASHelper.extractNestedFields(fieldArray, obj);
                        }
                        items.push({
                            label: obj ? item.label : '',
                            value: obj,
                        });
                    });
                    itemResult[val.label].push({ items: items });
                }
            });
            items.push(itemResult);
        });
        return items;
    }
}
exports.AdvancedSearchParser = AdvancedSearchParser;
