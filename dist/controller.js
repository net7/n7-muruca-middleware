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
const parsers_1 = require("./parsers");
class Controller {
    constructor(config) {
        this.getNavigation = (_event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { baseUrl, parsers } = this.config;
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + "menu"));
            const parser = new parsers.menu();
            const response = parser.parse(data);
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.getHomeLayout = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { baseUrl, parsers, configurations } = this.config;
            const keyOrder = JSON.parse(event.body);
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + "layout/home"));
            const parser = new parsers.home();
            const response = parser.parse({
                data,
                options: {
                    keyOrder,
                    conf: configurations.home
                }
            });
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.getSearchDescription = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { baseUrl, parsers } = this.config;
            const { searchId } = event.pathParameters;
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + "layout/" + searchId));
            const parser = new parsers.searchDescription();
            const response = parser.parse({ data });
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.getTimeline = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { baseUrl, parsers } = this.config;
            const { id } = event.pathParameters;
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + "views/" + id));
            const parser = new parsers.timeline();
            const response = parser.parse({ data });
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.getMap = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { baseUrl, parsers } = this.config;
            const { id } = event.pathParameters;
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + "views/" + id));
            const parser = new parsers.map();
            const response = parser.parse({ data });
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.getResource = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { baseUrl, parsers, configurations } = this.config;
            // change id whit slug and no un parameters but in the boy request  in POST
            let { type, id, sections } = JSON.parse(event.body);
            const requestURL = baseUrl;
            const url = requestURL + type + "/" + id;
            //remove, only for test
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(url));
            const parser = new parsers.resource();
            const response = parser.parse({
                data,
                options: {
                    type,
                    conf: configurations.resources[type]
                },
            });
            const sect = sortObj(response.sections, sections); // body sections filters
            response.sections = sect;
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.search = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { parsers, searchIndex, elasticUri, configurations } = this.config;
            const body = JSON.parse(event.body); // cf. SEARCH-RESULTS in Postman
            const { type } = event.pathParameters;
            const params = helpers_1.ESHelper.buildQuery(body, configurations.search); // return main_query (cf. Basic Query Theatheor body JSON su Postman)
            // make query
            const query_res = yield helpers_1.ESHelper.makeSearch(searchIndex, params, elasticsearch_1.Client, elasticUri);
            const data = type === 'results' ? query_res.hits.hits : query_res.aggregations;
            const parser = new parsers.search();
            const { searchId, facets } = body;
            const { limit, offset, sort } = body.results ? body.results : "null";
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
                    conf: configurations.search
                }
            });
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.advancedSearch = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { parsers, searchIndex, elasticUri, teiPublisherUri, configurations } = this.config;
            const body = JSON.parse(event.body); // cf. SEARCH-RESULTS in Postman
            const parser = new parsers_1.AdvancedSearchParser();
            const params = parser.buildAdvancedQuery(body, configurations); // return main_query (cf. Basic Query Theatheor body JSON su Postman)
            const query_res = yield helpers_1.ESHelper.makeSearch(searchIndex, params, elasticsearch_1.Client, elasticUri);
            const es_data = query_res.hits.hits;
            let map_data = {};
            es_data.map((res) => {
                if (res['_source']['xml_filename']) {
                    const xml_filename = res['_source']['xml_filename'];
                    map_data[xml_filename] = res;
                }
            });
            const docs = Object.keys(map_data);
            const teiPublisherParams = parser.buildTextViewerQuery(body, configurations, docs);
            let total_count = query_res.hits.total.value;
            var data = [];
            if (teiPublisherParams) {
                const collectionUri = this.config.teiPublisherUri + 'mrcsearch';
                ;
                const doc = yield helpers_1.HttpHelper.doRequest(collectionUri + '?' + teiPublisherParams);
                let stripped_doc = doc.replace(/<!DOCTYPE\s\w+>/g, '');
                let wrapped_doc = '<body>' + stripped_doc + '</body>';
                let convert = require('xml-js');
                let expandedResult = convert.xml2js(wrapped_doc, {
                    // ignoreDoctype: true,
                    // ignoreDeclaration: true,
                    compact: true,
                    spaces: 4,
                });
                let matches_result = {};
                if (expandedResult['body']['paper-card']) {
                    const cards = Array.isArray(expandedResult['body']['paper-card']) ? expandedResult['body']['paper-card'] : [expandedResult['body']['paper-card']];
                    cards.map((papercard) => {
                        let div = papercard.div;
                        let breadcrumbs = papercard.breadcrumbs["_text"].split("body/");
                        if (breadcrumbs.length > 1) {
                            breadcrumbs = breadcrumbs[1];
                        }
                        breadcrumbs = breadcrumbs.split("/");
                        let path = "";
                        breadcrumbs.forEach(el => {
                            const regexp = /\[(?:@type|@n) eq "([\w]+)"\]/g;
                            const matches = [...el.matchAll(regexp)];
                            if (path != "")
                                path += ", ";
                            for (const match of matches) {
                                path += match[1] + " ";
                            }
                        });
                        let id = papercard['_attributes'].id;
                        let href = div['_attributes'] ? div['_attributes']['ref'] : "";
                        let text_highlight = "";
                        if (path != "") {
                            text_highlight = "<span class='mrc__text-breadcrumbs'>" + path + "</span>";
                        }
                        /*if(div.a.span && Array.isArray(div.a.span)){
                            div.a.span.forEach(element => {
                                if(element['_attributes'] && element['_attributes']['class'] === "mrc__text-emph"){
                                    text_highlight += "<em class='mrc__text-emph'>" + element['_text'] + "</em>"
                                } else {
                                    text_highlight += element['_text'] + " "
                                }
                            });
                        }*/
                        if (div.p) {
                            let paragraphs = Array.isArray(div.p) ? div.p : [div.p];
                            paragraphs.forEach(p => {
                                let texts;
                                if (p._text) {
                                    texts = Array.isArray(p._text) ? p._text : [p._text];
                                }
                                const span = Array.isArray(p.span) ? p.span : [p.span];
                                if (texts && texts.length == span.length) {
                                    for (let i = 0; i < span.length; i++) {
                                        text_highlight += texts[i] + "<em class='mrc__text-emph'>" + span[i]["_text"] + "</em>";
                                    }
                                }
                                if (texts && texts.length > span.length) {
                                    for (let i = 0; i < texts.length; i++) {
                                        text_highlight += texts[i];
                                        if (span[i]) {
                                            text_highlight += "<em class='mrc__text-emph'>" + span[i]["_text"] + "</em>";
                                        }
                                    }
                                }
                                else if (span.length > 0) {
                                    span.forEach(el1 => {
                                        if (el1.span) {
                                            el1.span.forEach(el => {
                                                if (el["_attributes"]["class"]) {
                                                    text_highlight += "<span class='" + el["_attributes"]["class"] + "'>" + el["_text"] + "</span> ";
                                                }
                                                else {
                                                    text_highlight += el["_text"] + " ";
                                                }
                                            });
                                        }
                                        text_highlight += "<span class='mrc__text-emph'>" + el1["_text"] + "</em>";
                                    });
                                }
                            });
                        }
                        if (!matches_result[id]) {
                            matches_result[id] = {
                                matches: [],
                            };
                        }
                        matches_result[id].matches.push({
                            link: "?root=" + href,
                            text: text_highlight
                        });
                    });
                }
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
            const { limit, offset, sort } = body.results ? body.results : "null";
            const response = parser.advancedParseResults({
                data,
                options: {
                    offset,
                    sort,
                    limit,
                    total_count,
                    searchId,
                    conf: configurations.advanced_search
                }
            });
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.getFooter = (_event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { baseUrl, parsers, configurations } = this.config;
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + "footer"));
            const parser = new parsers.footer();
            const response = parser.parse(data, { conf: configurations.footer });
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.getTranslation = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { baseUrl, parsers } = this.config;
            const { lang } = event.pathParameters;
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + "translations?lang=" + lang));
            const parser = new parsers.translation();
            const response = parser.parse({
                data,
                options: {
                    lang
                },
            });
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.getStaticPage = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { parsers, staticUrl } = this.config;
            const { slug } = event.pathParameters;
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(staticUrl + 'pages?' + "slug=" + slug));
            const parser = new parsers.static();
            const response = parser.parse({ data });
            if (response) {
                return helpers_1.HttpHelper.returnOkResponse(response);
            }
            else {
                return helpers_1.HttpHelper.returnErrorResponse("page not found", 404);
            }
        });
        this.getStaticPost = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { parsers, staticUrl } = this.config;
            const { slug } = event.pathParameters;
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(staticUrl + 'posts?' + "slug=" + slug));
            const parser = new parsers.static();
            const response = parser.parse({ data });
            if (response) {
                return helpers_1.HttpHelper.returnOkResponse(response);
            }
            else {
                return helpers_1.HttpHelper.returnErrorResponse("page not found", 404);
            }
        });
        this.getTypeList = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { parsers, staticUrl } = this.config;
            const { type } = event.pathParameters;
            const body = JSON.parse(event.body);
            let params = "";
            if (body.results && body.results.limit) {
                params = "per_page=" + body.results.limit;
            }
            if (body.results && body.results.offset) {
                params += params == "" ? "offset=" + body.results.offset : "&offset=" + body.results.offset;
            }
            const apiUrl = params != "" ? staticUrl + type + "?" + params : staticUrl + type;
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(apiUrl));
            const parser = new parsers.static();
            const response = {
                results: parser.parseList({ data, options: { type } }),
                limit: body.results.limit || 10,
                offset: body.results.offset || 0,
                total_count: data.length,
                sort: ""
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
                return helpers_1.HttpHelper.returnErrorResponse("page not found", 404);
            }
        });
        this.config = config;
    }
    getSlsMethods() {
        return {
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
            getItineraries: this.getItineraries.bind(this)
        };
    }
}
exports.Controller = Controller;
