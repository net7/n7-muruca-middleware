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
exports.teiPublisherController = void 0;
const helpers_1 = require("../helpers");
const services_1 = require("../services");
class teiPublisherController {
    constructor(configurations) {
        // teiPubGetNodePath = async (event: any, _context: any, _callback: any) => {
        //     const body = JSON.parse(event.body);
        //     const { locale } = event.queryStringParameters ? event.queryStringParameters : '';
        //     const controller = new controllers.teiPublisherController(this.config);
        //     const response = await controller.getNodePath(body, this.config, locale);
        //     return HttpHelper.returnOkResponse(response);
        // }
        this.teiPubGetNodePath = (body, locale) => __awaiter(this, void 0, void 0, function* () {
            const { teiPublisherUri } = this.configurations;
            const teipubService = new services_1.TeipublisherService(teiPublisherUri);
            if (body.xpath && body.doc) {
                const root = yield teipubService.getNodePath(body.doc, body.xpath);
                if (root)
                    return helpers_1.HttpHelper.returnOkResponse(root);
            }
            return helpers_1.HttpHelper.returnErrorResponse("no xml root found", 400);
        });
        this.configurations = configurations;
    }
}
exports.teiPublisherController = teiPublisherController;
