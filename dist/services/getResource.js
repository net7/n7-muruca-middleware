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
exports.GetResourceService = void 0;
const helpers_1 = require("../helpers");
const parsers_1 = require("../parsers");
const sortObj = require("sort-object");
class GetResourceService {
    constructor() {
        this.buildResource = (body, data, conf) => {
            const { parsers, configurations } = conf;
            let { type, sections } = body;
            const parser = new parsers.resource();
            let response = parser.parse({
                data,
                options: {
                    type,
                    conf: configurations.resources[type],
                },
            });
            const sect = sortObj(response.sections, sections);
            // body sections filters
            response.sections = sect;
            if (data.locale) {
                const parseLang = new parsers_1.ResourceParser();
                response.locale = parseLang.localeParse(data.locale);
            }
            return response;
        };
        this.getResource = (body, conf, locale) => __awaiter(this, void 0, void 0, function* () {
            const { type, id } = body;
            const { baseUrl } = conf;
            const url = baseUrl + type + "/" + id;
            const path = locale ? "?lang=" + locale : "";
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(url + path));
            return data;
        });
    }
}
exports.GetResourceService = GetResourceService;
