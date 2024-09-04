"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPDFService = void 0;
// import the createPDF function from the utils folder
const createPDF_1 = require("./createPDF");
class GetPDFService {
    constructor() {
        this.createPDF = (req, res, config, labels) => {
            return (0, createPDF_1.default)(req, res, config, labels);
        };
    }
}
exports.GetPDFService = GetPDFService;
