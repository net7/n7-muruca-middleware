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
exports.Controller = void 0;
const elasticsearch_1 = require("@elastic/elasticsearch");
const sortObj = require("sort-object");
const helpers_1 = require("./helpers");
const ASHelper = require("./helpers/advanced-helper");
const parsers_1 = require("./parsers");
class Controller {
    constructor(config) {
        this.postTest = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const body = JSON.parse(event.body); //la richiesta che arriva all'API
            const response = body;
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.getTest = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const response = 'dummy string';
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.getNavigation = (_event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { baseUrl, parsers } = this.config;
            const { locale } = _event.queryStringParameters ? _event.queryStringParameters : '';
            const path = locale ? 'menu?lang=' + locale : 'menu';
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + path));
            const parser = new parsers.menu();
            const response = parser.parse(data);
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.getHomeLayout = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { baseUrl, parsers, configurations } = this.config;
            const keyOrder = JSON.parse(event.body);
            const { locale } = event.queryStringParameters ? event.queryStringParameters : '';
            const path = locale ? 'layout/home?lang=' + locale : 'layout/home';
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + path));
            const parser = new parsers.home();
            const response = parser.parse({
                data,
                options: {
                    keyOrder,
                    conf: configurations.home,
                },
            });
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.getSearchDescription = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { baseUrl, parsers } = this.config;
            const { searchId } = event.pathParameters;
            const { locale } = event.queryStringParameters ? event.queryStringParameters : '';
            const path = locale ? '?lang=' + locale : '';
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + 'layout/' + searchId + path));
            const parser = new parsers.searchDescription();
            const response = parser.parse({ data });
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.getTimeline = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { baseUrl, parsers } = this.config;
            const { id } = event.pathParameters;
            const { locale } = event.queryStringParameters ? event.queryStringParameters : '';
            const path = locale ? '?lang=' + locale : '';
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + 'views/' + id + path));
            const parser = new parsers.timeline();
            const response = parser.parse({ data });
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.getMap = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { baseUrl, parsers } = this.config;
            const { id } = event.pathParameters;
            const { locale } = event.queryStringParameters ? event.queryStringParameters : '';
            const path = locale ? '?lang=' + locale : '';
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + 'views/' + id + path));
            const parser = new parsers.map();
            const response = parser.parse({ data });
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.getResource = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { baseUrl, parsers, configurations } = this.config;
            // change id whit slug and no un parameters but in the boy request  in POST
            let { type, id, sections } = JSON.parse(event.body);
            const requestURL = baseUrl;
            const url = requestURL + type + '/' + id;
            const { locale } = event.queryStringParameters ? event.queryStringParameters : '';
            const path = locale ? '?lang=' + locale : '';
            //remove, only for test
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(url + path));
            const parser = new parsers.resource();
            const response = parser.parse({
                data,
                options: {
                    type,
                    conf: configurations.resources[type],
                },
            });
            const sect = sortObj(response.sections, sections); // body sections filters
            response.sections = sect;
            // FIX ME: non serve il parser
            if (data.locale) {
                const parseLang = new parsers_1.ResourceParser();
                response.locale = parseLang.localeParse(data.locale);
            }
            // 
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.search = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { parsers, searchIndex, elasticUri, configurations, defaultLang } = this.config;
            const body = JSON.parse(event.body); // cf. SEARCH-RESULTS in Postman
            const { type } = event.pathParameters;
            const { locale } = event.queryStringParameters ? event.queryStringParameters : '';
            let searchLangIndex = searchIndex;
            if (locale && defaultLang && locale != defaultLang) {
                searchLangIndex = searchIndex + '_' + locale;
            }
            const params = helpers_1.ESHelper.buildQuery(body, configurations.search, type); // return main_query (cf. Basic Query Theatheor body JSON su Postman)
            // make query
            //console.log(JSON.stringify(params));
            const query_res = yield helpers_1.ESHelper.makeSearch(searchLangIndex, params, elasticsearch_1.Client, elasticUri);
            const data = type === 'results' ? query_res.hits.hits : query_res.aggregations;
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
            });
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.advancedSearch = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { parsers, searchIndex, elasticUri, teiPublisherUri, configurations, defaultLang } = this.config;
            const body = JSON.parse(event.body); // cf. SEARCH-RESULTS in Postman
            const parser = new parsers_1.AdvancedSearchParser();
            const params = parser.buildAdvancedQuery(body, configurations); // return main_query (cf. Basic Query Theatheor body JSON su Postman)
            //console.log(JSON.stringify(params));
            const { locale } = event.queryStringParameters ? event.queryStringParameters : '';
            let searchLangIndex = searchIndex;
            if (locale && defaultLang && locale != defaultLang) {
                searchLangIndex = searchIndex + '_' + locale;
            }
            const query_res = yield helpers_1.ESHelper.makeSearch(searchLangIndex, params, elasticsearch_1.Client, elasticUri);
            const es_data = query_res.hits.hits;
            let map_data = {};
            es_data.map((res) => {
                if (res['_source']['xml_filename']) {
                    const xml_filename = res['_source']['xml_filename'];
                    map_data[xml_filename] = res;
                }
            });
            const docs = Object.keys(map_data);
            const teiPublisherParams = yield parser.buildTextViewerQuery(body, this.config, docs);
            let total_count = query_res.hits.total.value;
            var data = [];
            if (teiPublisherParams) {
                const collectionUri = this.config.teiPublisherUri + 'mrcsearch';
                const doc = yield helpers_1.HttpHelper.doRequest(
                //qui devono arrivare già i params per il teiHeader
                collectionUri + '?' + teiPublisherParams);
                // console.log(doc);
                const textViewerResults = ASHelper.buildTextViewerResults(doc);
                let matches_result = textViewerResults;
                // if (matches_result.header_params.length > 0) {
                //     const teiHeaderParams = parser.buildTeiHeaderQuery(body, configurations, docs, matches_result.header_params);
                //     const header = yield helpers_1.HttpHelper.doRequest(collectionUri + '?' + teiHeaderParams);
                //     const teiHeaderResults = ASHelper.buildTextViewerResults(header);
                //     matches_result = teiHeaderResults;
                // }
                es_data.map((res) => {
                    if (res['_source']['xml_filename']) {
                        for (let key in matches_result) {
                            if (key === res['_source']['xml_filename']) {
                                if (!res['highlight']) {
                                    res['highlight'] = {};
                                }
                                res['highlight']['text_matches'] = matches_result[key].matches;
                                data.push(res);
                            }
                        }
                    }
                });
                total_count = data.length;
            }
            else {
                data = es_data;
            }
            const { searchId } = body;
            const { limit, offset, sort } = body.results ? body.results : 'null';
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
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.getFooter = (_event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { baseUrl, parsers, configurations } = this.config;
            const { locale } = _event.queryStringParameters ? _event.queryStringParameters : '';
            const path = locale ? 'footer?lang=' + locale : 'footer';
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + path));
            const parser = new parsers.footer();
            const response = parser.parse(data, { conf: configurations.footer });
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.getTranslation = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { baseUrl, parsers } = this.config;
            const { lang } = event.pathParameters;
            let queryLang = lang;
            if (lang && lang.length < 5) {
                queryLang = lang === 'en' ? lang + '_US' : lang + '_' + lang.toUpperCase();
            }
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + 'translations?lang=' + queryLang));
            const parser = new parsers.translation();
            const response = parser.parse({
                data,
                options: {
                    queryLang,
                },
            });
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.getStaticPage = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { parsers, staticUrl } = this.config;
            const { slug } = event.pathParameters;
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(staticUrl + 'pages?' + 'slug=' + slug));
            const parser = new parsers.static();
            const response = parser.parse({ data });
            if (response) {
                return helpers_1.HttpHelper.returnOkResponse(response);
            }
            else {
                return helpers_1.HttpHelper.returnErrorResponse('page not found', 404);
            }
        });
        this.getStaticPost = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { parsers, staticUrl } = this.config;
            const { slug } = event.pathParameters;
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(staticUrl + 'posts?' + 'slug=' + slug));
            const parser = new parsers.static();
            const response = parser.parse({ data });
            if (response) {
                return helpers_1.HttpHelper.returnOkResponse(response);
            }
            else {
                return helpers_1.HttpHelper.returnErrorResponse('page not found', 404);
            }
        });
        this.getTypeList = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { parsers, staticUrl } = this.config;
            const { type } = event.pathParameters;
            const body = JSON.parse(event.body);
            let params = '';
            if (body.results && body.results.limit) {
                params = 'per_page=' + body.results.limit;
            }
            if (body.results && body.results.offset) {
                params +=
                    params == ''
                        ? 'offset=' + body.results.offset
                        : '&offset=' + body.results.offset;
            }
            const apiUrl = params != '' ? staticUrl + type + '?' + params : staticUrl + type;
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(apiUrl));
            const parser = new parsers.static();
            const response = {
                results: parser.parseList({ data, options: { type } }),
                limit: body.results.limit || 10,
                offset: body.results.offset || 0,
                total_count: data.length,
                sort: '',
            };
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.getItineraries = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { parsers, baseUrl, configurations } = this.config;
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + 'itinerary'));
            /* const parser = new parsers.itineraries();
            const response = parser.parse({ data });
            if ( response ){
              return HttpHelper.returnOkResponse(response);
            } else {
              return HttpHelper.returnErrorResponse("page not found", 404);
            }*/
        });
        this.getItinerary = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { parsers, baseUrl, configurations } = this.config;
            const { id } = event.pathParameters;
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + 'itinerary/' + id));
            const parser = new parsers.itinerary(configurations === null || configurations === void 0 ? void 0 : configurations.itineraries);
            const response = parser.parse({ data });
            if (response) {
                return helpers_1.HttpHelper.returnOkResponse(response);
            }
            else {
                return helpers_1.HttpHelper.returnErrorResponse('page not found', 404);
            }
        });
        this.config = config;
    }
    getSlsMethods() {
        return {
            postTest: this.postTest.bind(this),
            getTest: this.getTest.bind(this),
            getNavigation: this.getNavigation.bind(this),
            getFooter: this.getFooter.bind(this),
            getHomeLayout: this.getHomeLayout.bind(this),
            getSearchDescription: this.getSearchDescription.bind(this),
            getTimeline: this.getTimeline.bind(this),
            getMap: this.getMap.bind(this),
            getResource: this.getResource.bind(this),
            search: this.search.bind(this),
            advancedSearch: this.advancedSearch.bind(this),
            getTranslation: this.getTranslation.bind(this),
            getStaticPage: this.getStaticPage.bind(this),
            getStaticPost: this.getStaticPost.bind(this),
            getTypeList: this.getTypeList.bind(this),
            getItinerary: this.getItinerary.bind(this),
            getItineraries: this.getItineraries.bind(this),
        };
    }
}
exports.Controller = Controller;
