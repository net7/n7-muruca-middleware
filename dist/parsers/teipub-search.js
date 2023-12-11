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
exports.TeipubSearchParser = void 0;
const ASHelper = require("../helpers/advanced-helper");
const helpers_1 = require("../helpers");
class TeipubSearchParser {
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
                                teiPubParams =
                                    teiPubParams == ''
                                        ? `query=${query}&start=1&per-page=${pagination}`
                                        : teiPubParams +
                                            `&query=${query}&start=1&per-page=${pagination}`;
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
                                if (doc && teiHeaderParams && teiHeaderParams != '') {
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
                                teiPubParams =
                                    teiPubParams == ''
                                        ? `slop=${slop}`
                                        : teiPubParams + `&slop=${slop}`;
                            default:
                                break;
                        }
                    }
                }
                // console.log(teiPubParams);
                return teiPubParams;
            });
            let teiPubParams = yield buildParameters();
            if (doc && teiPubParams && teiPubParams != '') {
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
    }
    parse({ data, options }) {
        const { type } = options;
        return [];
    }
}
exports.TeipubSearchParser = TeipubSearchParser;
