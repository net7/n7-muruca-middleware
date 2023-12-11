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
        /**
         * Test if the post request is working.
         * @param request POST request
         */
        this.postTest = (request) => __awaiter(this, void 0, void 0, function* () {
            const body = JSON.parse(request.body); //la richiesta che arriva all'API
            const response = body;
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        /**
         * Test if the get request is working.
         * @param request GET request
         */
        this.getTest = (request) => __awaiter(this, void 0, void 0, function* () {
            const response = 'Hello from getTest!';
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        /**
         * Fetch the main menu of the app.
         * @param request GET request
         */
        this.getNavigation = (request) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { baseUrl, parsers } = this.config;
            const locale = ((_a = request.query) === null || _a === void 0 ? void 0 : _a.locale) || '';
            const path = locale ? 'menu?lang=' + locale : 'menu';
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + path));
            const parser = new parsers.menu();
            const response = parser.parse(data);
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        /**
         * Fetch data for the home layout components.
         * @param request POST request
         */
        this.getHomeLayout = (request) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            const { baseUrl, parsers, configurations } = this.config;
            if (!request || !(request === null || request === void 0 ? void 0 : request.body)) {
                return helpers_1.HttpHelper.returnErrorResponse('Empty body from request', 400);
            }
            const keyOrder = JSON.parse(request.body);
            const locale = ((_b = request.query) === null || _b === void 0 ? void 0 : _b.locale) || '';
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
        /**
         * Fetch the description content of the search page.
         * @param request GET request
         */
        this.getSearchDescription = (request) => __awaiter(this, void 0, void 0, function* () {
            var _c;
            const { baseUrl, parsers } = this.config;
            const { searchId } = request.params;
            const locale = ((_c = request.query) === null || _c === void 0 ? void 0 : _c.locale) || '';
            const path = locale ? '?lang=' + locale : '';
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + 'layout/' + searchId + path));
            const parser = new parsers.searchDescription();
            const response = parser.parse({ data });
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        /**
         * Fetch data for the timeline component.
         * @param request GET request
         */
        this.getTimeline = (request) => __awaiter(this, void 0, void 0, function* () {
            var _d;
            const { baseUrl, parsers } = this.config;
            const { id } = request.params;
            const locale = ((_d = request.query) === null || _d === void 0 ? void 0 : _d.locale) || '';
            const path = locale ? '?lang=' + locale : '';
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + 'views/' + id + path));
            const parser = new parsers.timeline();
            const response = parser.parse({ data });
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        /**
         * Fetch data for the map component.
         * @param request GET request
         */
        this.getMap = (request) => __awaiter(this, void 0, void 0, function* () {
            var _e;
            const { baseUrl, parsers } = this.config;
            const { id } = request.params;
            const locale = ((_e = request.query) === null || _e === void 0 ? void 0 : _e.locale) || '';
            const path = locale ? '?lang=' + locale : '';
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + 'views/' + id + path));
            const parser = new parsers.map();
            const response = parser.parse({ data });
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        /**
         * Fetch data for the resource layout.
         * @param request POST request
         */
        this.getResource = (request) => __awaiter(this, void 0, void 0, function* () {
            var _f;
            const locale = ((_f = request.query) === null || _f === void 0 ? void 0 : _f.locale) || '';
            const controller = new controllers.getResourceController();
            const body = JSON.parse(request.body);
            const response = yield controller.searchResource(body, this.config, locale);
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        /**
         * Submit a query and fetch the results.
         * @param request POST request
         */
        this.search = (request) => __awaiter(this, void 0, void 0, function* () {
            var _g;
            const { type } = request.params;
            const locale = ((_g = request.query) === null || _g === void 0 ? void 0 : _g.locale) || '';
            const body = JSON.parse(request.body);
            const controller = new controllers.searchController();
            const response = yield controller.search(body, this.config, type, locale);
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        /**
         * Submit a query and fetch the results.
         * @param request POST request
         */
        this.advancedSearch = (request) => __awaiter(this, void 0, void 0, function* () {
            var _h;
            const body = JSON.parse(request.body); // cf. SEARCH-RESULTS in Postman
            const locale = ((_h = request.query) === null || _h === void 0 ? void 0 : _h.locale) || '';
            const controller = new controllers.advancedSearchController();
            const response = yield controller.search(body, this.config, locale);
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        /**
         * Submit a text query and fetch the results.
         * @param request POST request
         */
        this.advancedSearchTextSearch = (request) => __awaiter(this, void 0, void 0, function* () {
            var _j;
            // const body = JSON.parse(request.body); // cf. SEARCH-RESULTS in Postman
            const locale = ((_j = request.query) === null || _j === void 0 ? void 0 : _j.locale) || '';
            const controller = new controllers.advancedSearchController();
            return controller.advancedSearchTextSearch(request.query, this.config, locale);
        });
        /**
         * Fetch data for tei-publisher component.
         * @param request POST request
         */
        this.teiPubGetNodePath = (request) => __awaiter(this, void 0, void 0, function* () {
            var _k;
            const body = JSON.parse(request.body);
            const locale = ((_k = request.query) === null || _k === void 0 ? void 0 : _k.locale) || '';
            const controller = new controllers.teiPublisherController(this.config);
            return controller.teiPubGetNodePath(body, locale);
        });
        /**
         * Fetch the available filters for the search page.
         * @param request GET request
         */
        this.advancedSearchOptions = (request) => __awaiter(this, void 0, void 0, function* () {
            var _l, _m;
            const { configurations, baseUrl, advancedSearchParametersPath } = this.config;
            const advanced_search_options = (_l = configurations.advanced_search.advanced_search) === null || _l === void 0 ? void 0 : _l.dynamic_options;
            if (advanced_search_options) {
                const requestURL = baseUrl + advancedSearchParametersPath;
                const locale = ((_m = request.query) === null || _m === void 0 ? void 0 : _m.locale) || '';
                const path = locale ? '?lang=' + locale : '';
                const data = yield helpers_1.HttpHelper.doPostRequest(requestURL + path, advanced_search_options);
                const options = data.data;
                for (const key in options) {
                    options[key].options.map((option) => (option.value = option.value.toString()));
                }
                return helpers_1.HttpHelper.returnOkResponse(options);
            }
        });
        /**
         * Fetch data for the footer component.
         * @param request GET request
         */
        this.getFooter = (request) => __awaiter(this, void 0, void 0, function* () {
            var _o;
            const { baseUrl, parsers, configurations } = this.config;
            const locale = ((_o = request.query) === null || _o === void 0 ? void 0 : _o.locale) || '';
            const path = locale ? 'footer?lang=' + locale : 'footer';
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + path));
            const parser = new parsers.footer();
            const response = parser.parse(data, { conf: configurations.footer });
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        /**
         * Fetch the translation strings in the language specified by the "?lang" query parameter.
         * @param request GET request
         */
        this.getTranslation = (request) => __awaiter(this, void 0, void 0, function* () {
            const { baseUrl, parsers } = this.config;
            const { lang } = request.params;
            let queryLang = lang;
            if (lang && lang.length < 5) {
                queryLang =
                    lang === 'en' ? lang + '_US' : lang + '_' + lang.toUpperCase();
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
        /**
         * Fetch the content of a static resource.
         * @param request GET request
         */
        this.getStaticPage = (request) => __awaiter(this, void 0, void 0, function* () {
            const { parsers, staticUrl } = this.config;
            const { slug } = request.params;
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
        /**
         * Fetch the content of a static post.
         * @param request GET request
         */
        this.getStaticPost = (request) => __awaiter(this, void 0, void 0, function* () {
            const { parsers, staticUrl } = this.config;
            const { slug } = request.params;
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
        /**
         * Get a list of objects of the defined type.
         * @param request POST request
         */
        this.getObjectsByType = (request) => __awaiter(this, void 0, void 0, function* () {
            const { parsers, staticUrl } = this.config;
            const { type } = request.params;
            const body = JSON.parse(request.body);
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
        /**
         * Fetch the list of available itineraries for geographic datasets.
         * @param request GET request
         */
        this.getItineraries = (request) => __awaiter(this, void 0, void 0, function* () {
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
        /**
         * Fetch the data of a specific itinerary.
         * @param request GET request
         */
        this.getItinerary = (request) => __awaiter(this, void 0, void 0, function* () {
            var _p;
            const { parsers, baseUrl, configurations } = this.config;
            const { id } = request.params;
            const locale = ((_p = request.query) === null || _p === void 0 ? void 0 : _p.locale) || '';
            const path = locale ? '?lang=' + locale : '';
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + 'itinerary/' + id + path));
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
            getObjectsByType: this.getObjectsByType.bind(this),
            getItinerary: this.getItinerary.bind(this),
            getItineraries: this.getItineraries.bind(this),
            advancedSearchOptions: this.advancedSearchOptions.bind(this),
            teiPubGetNodePath: this.teiPubGetNodePath.bind(this),
            advancedSearchTextSearch: this.advancedSearchTextSearch.bind(this),
        };
    }
}
exports.Controller = Controller;
