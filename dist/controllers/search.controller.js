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
exports.searchController = void 0;
const elasticsearch_1 = require("@elastic/elasticsearch");
const helpers_1 = require("../helpers");
class searchController {
    constructor() {
        this.search = (body, config, type, locale) => __awaiter(this, void 0, void 0, function* () {
            const { parsers, searchIndex, elasticUri, configurations, defaultLang } = config;
            let searchLangIndex = searchIndex;
            if (locale && defaultLang && locale != defaultLang) {
                searchLangIndex = searchIndex + '_' + locale;
            }
            const params = helpers_1.ESHelper.buildQuery(body, configurations.search, type); // return main_query (cf. Basic Query Theatheor body JSON su Postman)
            // make query
            //console.log(JSON.stringify(params));
            const query_res = yield helpers_1.ESHelper.makeSearch(searchLangIndex, params, elasticsearch_1.Client, elasticUri);
            const data = type === 'results' ? query_res.hits.hits : query_res.aggregations;
            if (!data)
                return {};
            const parser = new parsers.search();
            const { searchId, facets } = body;
            const { limit, offset, sort } = body.results ? body.results : 'null';
            let total_count = query_res.hits.total.value;
            const response = parser.parse({
                data,
                options: {
                    type,
                    offset,
                    sort,
                    limit,
                    total_count,
                    searchId,
                    facets,
                    conf: configurations.search,
                },
            }, body);
            return response;
        });
    }
}
exports.searchController = searchController;
