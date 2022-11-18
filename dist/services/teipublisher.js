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
exports.TeipublisherService = void 0;
const helpers_1 = require("../helpers");
class TeipublisherService {
    constructor(teiPublisherUri) {
        this.getXmlDocument = (xml) => __awaiter(this, void 0, void 0, function* () {
            const api_url = this.teiPublisherUri + 'document/' + encodeURIComponent(xml);
            const res = yield helpers_1.HttpHelper.doRequestNoJson(api_url);
            return res;
        });
        this.getNodePath = (doc, path) => __awaiter(this, void 0, void 0, function* () {
            //doc_root_id/petrarca%2Fde-viris_i_23_3_2022_1648127195.xml
            const api_url = this.teiPublisherUri + 'doc_root_id' + encodeURIComponent(doc);
            const res = yield helpers_1.HttpHelper.doRequest(
            //qui devono arrivare già i params per il teiHeader
            api_url + '?path=' + path);
            return res;
        });
        this.teiPublisherUri = teiPublisherUri;
    }
}
exports.TeipublisherService = TeipublisherService;
