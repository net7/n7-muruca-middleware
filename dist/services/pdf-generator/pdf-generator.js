"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPDFService = void 0;
// import the createPDF function from the utils folder
const calderon_1 = require("./calderon");
const auteso_1 = require("./auteso");
const memoram_1 = require("./memoram");
const createPDF_1 = require("./createPDF");
class GetPDFService {
    constructor() {
        this.createPDF = (req, res, config) => {
            (0, createPDF_1.default)(req, res, config);
        };
        this.createPDFAuteso = (req, res) => {
            (0, auteso_1.default)(req, res);
        };
        this.createPDFCalderon = (req, res) => {
            (0, calderon_1.default)(req, res);
        };
        this.createPDFMemoram = (req, res, config) => {
            (0, memoram_1.default)(req, res, config);
        };
    }
}
exports.GetPDFService = GetPDFService;
