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
const helpers_1 = require("./helpers");
const controllers = require("./controllers");
class Controller {
    constructor(config) {
        this.postTest = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const body = JSON.parse(event.body); //la richiesta che arriva all'API
            const response = body;
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.getTest = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const response = "dummy string";
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.getNavigation = (_event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { baseUrl, parsers } = this.config;
            const { locale } = _event.queryStringParameters
                ? _event.queryStringParameters
                : "";
            const path = locale ? "menu?lang=" + locale : "menu";
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + path));
            const parser = new parsers.menu();
            const response = parser.parse(data);
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.getHomeLayout = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { baseUrl, parsers, configurations } = this.config;
            if (!event || !(event === null || event === void 0 ? void 0 : event.body)) {
                return helpers_1.HttpHelper.returnErrorResponse("Empty body from request", 400);
            }
            const keyOrder = JSON.parse(event.body);
            const { locale } = event.queryStringParameters
                ? event.queryStringParameters
                : "";
            const path = locale ? "layout/home?lang=" + locale : "layout/home";
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
            const { locale } = event.queryStringParameters
                ? event.queryStringParameters
                : "";
            const path = locale ? "?lang=" + locale : "";
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + "layout/" + searchId + path));
            const parser = new parsers.searchDescription();
            const response = parser.parse({ data });
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.getTimeline = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { baseUrl, parsers } = this.config;
            const { id } = event.pathParameters;
            const { locale } = event.queryStringParameters
                ? event.queryStringParameters
                : "";
            const path = locale ? "?lang=" + locale : "";
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + "views/" + id + path));
            const parser = new parsers.timeline();
            const response = parser.parse({ data });
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.getMap = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { baseUrl, parsers } = this.config;
            const { id } = event.pathParameters;
            const { locale } = event.queryStringParameters
                ? event.queryStringParameters
                : "";
            const path = locale ? "?lang=" + locale : "";
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + "views/" + id + path));
            const parser = new parsers.map();
            const response = parser.parse({ data });
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.getResource = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { locale } = event.queryStringParameters ? event.queryStringParameters : "";
            const controller = new controllers.getResourceController();
            const body = JSON.parse(event.body);
            const response = yield controller.searchResource(body, this.config, locale);
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.getPDF = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { locale } = event.queryStringParameters ? event.queryStringParameters : "";
            const controller = new controllers.getPDFController();
            const body = JSON.parse(event.body);
            controller.getPDF(event, _callback, this.config);
        });
        this.search = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { type } = event.pathParameters;
            const { locale } = event.queryStringParameters ? event.queryStringParameters : "";
            const body = JSON.parse(event.body);
            const controller = new controllers.searchController();
            const response = yield controller.search(body, this.config, type, locale);
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.advancedSearch = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const body = JSON.parse(event.body); // cf. SEARCH-RESULTS in Postman
            const { locale } = event.queryStringParameters ? event.queryStringParameters : "";
            const controller = new controllers.advancedSearchController();
            const response = yield controller.search(body, this.config, locale);
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.advancedSearchTextSearch = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const body = JSON.parse(event.body); // cf. SEARCH-RESULTS in Postman
            const { locale } = event.queryStringParameters ? event.queryStringParameters : '';
            const controller = new controllers.advancedSearchController();
            return controller.advancedSearchTextSearch(event.queryStringParameters, this.config, locale);
        });
        this.teiPubGetNodePath = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const body = JSON.parse(event.body);
            const { locale } = event.queryStringParameters ? event.queryStringParameters : '';
            const controller = new controllers.teiPublisherController(this.config);
            return controller.teiPubGetNodePath(body, locale);
        });
        this.advancedSearchOptions = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { configurations, baseUrl, advancedSearchParametersPath } = this.config;
            const advanced_search_options = (_a = configurations.advanced_search.advanced_search) === null || _a === void 0 ? void 0 : _a.dynamic_options;
            if (advanced_search_options) {
                const requestURL = baseUrl + advancedSearchParametersPath;
                const { locale } = event.queryStringParameters
                    ? event.queryStringParameters
                    : "";
                const path = locale ? "?lang=" + locale : "";
                const data = yield helpers_1.HttpHelper.doPostRequest(requestURL + path, advanced_search_options);
                const options = data.data;
                for (const key in options) {
                    options[key].options.map(option => option.value = option.value.toString());
                }
                return helpers_1.HttpHelper.returnOkResponse(options);
            }
        });
        this.getFooter = (_event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { baseUrl, parsers, configurations } = this.config;
            const { locale } = _event.queryStringParameters
                ? _event.queryStringParameters
                : "";
            const path = locale ? "footer?lang=" + locale : "footer";
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
                queryLang =
                    lang === "en" ? lang + "_US" : lang + "_" + lang.toUpperCase();
            }
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + "translations?lang=" + queryLang));
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
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(staticUrl + "pages?" + "slug=" + slug));
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
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(staticUrl + "posts?" + "slug=" + slug));
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
                params +=
                    params == ""
                        ? "offset=" + body.results.offset
                        : "&offset=" + body.results.offset;
            }
            const apiUrl = params != "" ? staticUrl + type + "?" + params : staticUrl + type;
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(apiUrl));
            const parser = new parsers.static();
            const response = {
                results: parser.parseList({ data, options: { type } }),
                limit: body.results.limit || 10,
                offset: body.results.offset || 0,
                total_count: data.length,
                sort: "",
            };
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.getItineraries = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { parsers, baseUrl, configurations } = this.config;
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + "itinerary"));
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
            const { locale } = event.queryStringParameters
                ? event.queryStringParameters
                : "";
            const path = locale ? "?lang=" + locale : "";
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + "itinerary/" + id + path));
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
            advancedSearchOptions: this.advancedSearchOptions.bind(this),
            teiPubGetNodePath: this.teiPubGetNodePath.bind(this),
            advancedSearchTextSearch: this.advancedSearchTextSearch.bind(this),
            getPDF: this.getPDF.bind(this),
        };
    }
}
exports.Controller = Controller;
