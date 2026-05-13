"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPDFService = void 0;
const createPDF_1 = require("./createPDF");
class GetPDFService {
    constructor() {
        this.createPDF = (req, res, config, labels, resource, generator) => {
            const gen = generator !== null && generator !== void 0 ? generator : new createPDF_1.PDFGenerator();
            return gen.createPDF(req, res, config, labels, resource);
        };
    }
}
exports.GetPDFService = GetPDFService;
