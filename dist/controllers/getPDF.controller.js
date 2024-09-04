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
exports.getPDFController = void 0;
const helpers_1 = require("../helpers");
const pdf_generator_1 = require("../services/pdf-generator/pdf-generator");
class getPDFController {
    constructor() {
        this.getPDF = (req, res, config, locale, labels) => __awaiter(this, void 0, void 0, function* () {
            const service = new pdf_generator_1.GetPDFService();
            let response = yield service.createPDF(req, res, config, labels);
            return response;
        });
        this.getLabels = (req, res, config, locale) => __awaiter(this, void 0, void 0, function* () {
            const { baseUrl, parsers } = config;
            let queryLang = locale;
            if (locale && locale.length < 5) {
                queryLang =
                    locale === "en" ? locale + "_US" : locale + "_" + locale.toUpperCase();
            }
            const data = JSON.parse(yield helpers_1.HttpHelper.doRequest(baseUrl + "translations?lang=" + queryLang));
            const parser = new parsers.translation();
            const response = parser.parse({
                data,
                options: {
                    queryLang,
                },
            });
            return response;
        });
    }
}
exports.getPDFController = getPDFController;
