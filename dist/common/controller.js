'use strict';
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
const index_1 = require("../helpers/index");
class Controller {
    constructor(projectPath, environment) {
        this.projectPath = projectPath;
        this.environment = environment;
        /**
         *  MENU - GET
         **/
        this.getNavigation = (_event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const data = JSON.parse(yield index_1.HttpHelper.doRequest(this.environment.BASE_URL + "menu"));
            const parser = new this.projectPath.parsers.menu();
            const response = parser.parse(data);
            return index_1.HttpHelper.returnOkResponse(response);
        });
        /**
         *  HOME LAYOUT - POST
         **/
        this.getHomeLayout = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const keyOrder = JSON.parse(event.body);
            const data = JSON.parse(yield index_1.HttpHelper.doRequest(this.environment.BASE_URL + "layout/home"));
            const parser = new this.projectPath.parsers.home();
            const response = parser.parse({
                data,
                options: {
                    keyOrder,
                    conf: this.projectPath.configurations.home
                }
            });
            return index_1.HttpHelper.returnOkResponse(response);
        });
        /**
         *  RESOURCE - POST
         **/
        this.getResource = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            // change id whit slug and no un parameters but in the boy request  in POST
            let { type, id, sections } = JSON.parse(event.body);
            const requestURL = this.environment.BASE_URL;
            const url = requestURL + type + "/" + id;
            //remove, only for test
            const data = JSON.parse(yield index_1.HttpHelper.doRequest(url));
            const parser = new this.projectPath.parsers.resource();
            const response = parser.parse({
                data,
                options: {
                    type,
                    conf: this.projectPath.configurations.resources[type]
                },
            });
            const sect = sortObj(response.sections, sections); // body sections filters
            response.sections = sect;
            return index_1.HttpHelper.returnOkResponse(response);
        });
        /**
         *  SEARCH - POST
         **/
        this.search = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const body = JSON.parse(event.body);
            const { type } = event.pathParameters;
            const params = index_1.ESHelper.buildQuery(body, this.projectPath.configurations.search);
            // make query
            const query_res = yield index_1.ESHelper.makeSearch(this.environment.SEARCH_INDEX, params, elasticsearch_1.Client, this.environment.ELASTIC_URI);
            const data = type === 'results' ? query_res.hits.hits : query_res.aggregations;
            const parser = new this.projectPath.parsers.search();
            const { searchId, facets } = body;
            const { limit, offset, sort } = body.results ? body.results : "null";
            const total_count = query_res.hits.total['value']; // this fix outdated elasticsearch interface 
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
                    conf: this.projectPath.configurations.search
                }
            });
            return index_1.HttpHelper.returnOkResponse(response);
        });
        /**
         *  FOOTER - GET
         **/
        this.getFooter = (_event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const data = JSON.parse(yield index_1.HttpHelper.doRequest(process.env.BASE_URL + "footer"));
            const parser = new this.projectPath.parsers.footer();
            const response = parser.parse(data, { conf: this.projectPath.configurations.footer });
            return index_1.HttpHelper.returnOkResponse(response);
        });
        /**
         *  TRANSLATION - POST
         **/
        this.getTranslation = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { lang } = event.pathParameters;
            const data = JSON.parse(yield index_1.HttpHelper.doRequest(process.env.BASE_URL + "translations?lang=" + lang));
            const parser = new this.projectPath.parsers.translation();
            const response = parser.parse({
                data,
                options: {
                    lang
                },
            });
            return index_1.HttpHelper.returnOkResponse(response);
        });
        /**
         *  STATIC_PAGE - GET
         **/
        this.getStaticPage = (event, _context, _callback) => __awaiter(this, void 0, void 0, function* () {
            const { slug } = event.pathParameters;
            const data = JSON.parse(yield index_1.HttpHelper.doRequest(this.environment.PAGES));
            const parser = new this.projectPath.parsers.static();
            const response = parser.parse({ data, options: { slug } });
            return index_1.HttpHelper.returnOkResponse(response);
        });
    }
    conf(projectPath, env) {
        this.projectPath = projectPath;
        this.environment = env.env;
        return;
    }
}
exports.Controller = Controller;
