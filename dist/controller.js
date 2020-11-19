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
            const body = JSON.parse(event.body);
            const { type } = event.pathParameters;
            const params = helpers_1.ESHelper.buildQuery(body, configurations.search);
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
            const { parsers, pages } = this.config;
            const { slug } = event.pathParameters;
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(pages));
            const parser = new parsers.static();
            const response = parser.parse({ data, options: { slug } });
            return helpers_1.HttpHelper.returnOkResponse(response);
        });
        this.config = config;
    }
    getSlsMethods() {
        return {
            getNavigation: this.getNavigation.bind(this),
            getFooter: this.getFooter.bind(this),
            getHomeLayout: this.getHomeLayout.bind(this),
            getSearchDescription: this.getSearchDescription.bind(this),
            getResource: this.getResource.bind(this),
            search: this.search.bind(this),
            getTranslation: this.getTranslation.bind(this),
            getStaticPage: this.getStaticPage.bind(this)
        };
    }
}
exports.Controller = Controller;
