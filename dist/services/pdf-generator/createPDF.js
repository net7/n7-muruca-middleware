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
const controllers_1 = require("../../controllers");
const common_1 = require("./common");
/**
 * Add the content to the pdfContent object. This content will the be transformed into a pdf
 */
function addContent(motive) {
    return __awaiter(this, void 0, void 0, function* () {
        // setup the pdf content
        let pdfContent = {
            content: [],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    color: "#641d1d",
                },
                subheader: {
                    fontSize: 15,
                    bold: true,
                    color: "#641d1d",
                },
                bold: {
                    bold: true,
                },
            },
            defaultStyle: {
                font: "Helvetica",
                lineHeight: 1.5,
            },
        };
        let sections = motive.sections;
        // add the title of the motive and the description of the information
        pdfContent.content.push({
            text: sections.header.title,
            style: "header",
        });
        return pdfContent;
    });
}
function createPDF(req, res, config) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        module.exports = createPDF;
        const locale = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.locale) || '';
        const body = JSON.parse(req.body);
        const controller = new controllers_1.getResourceController();
        let result = yield controller.searchResource(body, config, locale);
        console.log(result);
        let pdfContent = yield addContent(result);
        (0, common_1.createPdfBinary)(pdfContent, function (binary) {
            res.contentType("application/pdf");
            res.setHeader("Content-Disposition", "attachment; filename=" +
                encodeURIComponent(result.sections.header.title + ".pdf"));
            res.send(binary);
        });
    });
}
exports.default = createPDF;
