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
exports.advancedSearchController = void 0;
const elasticsearch_1 = require("@elastic/elasticsearch");
const helpers_1 = require("../helpers");
const services_1 = require("../services");
class advancedSearchController {
    constructor() {
        this.search = (body, config, locale) => __awaiter(this, void 0, void 0, function* () {
            const { searchIndex, elasticUri, teiPublisherUri, configurations, defaultLang, } = config;
            const service = new services_1.AdvancedSearchService(configurations);
            const params = service.buildAdvancedQuery(body);
            let searchLangIndex = searchIndex;
            if (locale && defaultLang && locale != defaultLang) {
                searchLangIndex = searchIndex + '_' + locale;
            }
            //console.log(JSON.stringify(params));
            const query_res = yield helpers_1.ESHelper.makeSearch(searchLangIndex, params, elasticsearch_1.Client, elasticUri);
            if (query_res) {
                const response = yield service.parseResponse(query_res, body, teiPublisherUri);
                return response;
            }
            else
                return { error: 'error' };
        });
        /**
         * Search term in text and replaces the highlighted results in original xml file
         */
        this.advancedSearchTextSearch = (body, config, locale) => __awaiter(this, void 0, void 0, function* () {
            const { searchIndex, elasticUri, teiPublisherUri, configurations, defaultLang, } = config;
            const { xml, id, searchId } = body;
            const service = new services_1.AdvancedSearchService(configurations);
            const params = service.buildAdvancedQuery(body);
            let searchLangIndex = searchIndex;
            if (locale && defaultLang && locale != defaultLang) {
                searchLangIndex = searchIndex + '_' + locale;
            }
            //console.log(JSON.stringify(params));
            const query_res = yield helpers_1.ESHelper.makeSearch(searchLangIndex, params, elasticsearch_1.Client, elasticUri);
            if (query_res) {
                const xmlService = new services_1.XmlService();
                const teipubservice = new services_1.TeipublisherService(teiPublisherUri);
                const hlNodes = service.extractXmlTextHl(query_res);
                const xml_doc = yield teipubservice.getXmlDocument(xml);
                const xml_hl = xmlService.replaceHlNodes(xml_doc, hlNodes);
                return helpers_1.HttpHelper.returnOkResponse(xml_hl, {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
                    'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
                    'Content-Type': 'application/xml',
                });
            }
            else
                return helpers_1.HttpHelper.returnErrorResponse('no xml root found', 400);
        });
    }
}
exports.advancedSearchController = advancedSearchController;
