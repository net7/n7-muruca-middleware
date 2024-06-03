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
function addContent(motive, pdfContent) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!pdfContent) {
            // setup the default pdf content
            pdfContent = {
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
        }
        let sections = motive.sections;
        // add the title of the motive and the description of the information
        pdfContent.content.push({
            text: sections.header.title,
            style: "header",
        });
        pdfContent = yield addMetadata(sections["metadata"].group[0].items, "metadata", pdfContent);
        pdfContent = yield imgViewer(sections["image-viewer"], "imageViewer", pdfContent);
        return pdfContent;
    });
}
const labels = {
    bibliographyData: {
        author: "Autor",
        type: "Tipología",
        date: "Fecha",
        collocation: "Localización",
        signature: "Signatura",
        source: "Procedencia",
        note: "Crítica",
        "censors licenses": "Censuras y licencias",
        troupe: "Compañía teatral",
        "troupe note": "Notas a la compañía teatral",
        facsimile: "Facsímil",
    },
    licenses: {
        censoring: "Censor",
        place: "Ciudad",
        date: "Fecha",
        texto: "Texto",
    },
    sections: {
        metadata: "metadata"
    }
};
function addMetadata(metadata, section, pdfContent) {
    return __awaiter(this, void 0, void 0, function* () {
        pdfContent.content.push({
            text: labels.sections[section],
            style: "subheader",
        });
        console.log(metadata);
        for (let i = 0, n = metadata.length; i < n; i++) {
            if (Array.isArray(metadata[i].value)) {
                pdfContent.content.push({
                    text: labels.bibliographyData[metadata[i].label],
                    bold: true,
                    margin: [0, 3, 0, 0],
                });
                for (let j = 0, n = metadata[i].value.length; j < n; j++) {
                    for (let k = 0, m = metadata[i].value[j].length; k < m; k++) {
                        if (metadata[i].value[j][k].value !== "") {
                            pdfContent = yield (0, common_1.columnsAdd)(pdfContent, metadata[i].value[j][k].label, (0, common_1.cleanText)(metadata[i].value[j][k].value), [10, 3]);
                        }
                    }
                    if (j < n - 1) {
                        // divider image
                        pdfContent.content.push({
                            image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyAAAAAKCAQAAADmpvIuAAAAMElEQVR42u3BQQEAMAgEoIuy/iUWwUp28KlAAAAAAAAAYOSl1NV/AAAAAAAAAIC7GtqVk53qw1CjAAAAAElFTkSuQmCC",
                            alignment: "center",
                            margin: [0, 0, 38, 0],
                        });
                    }
                }
            }
            else {
                pdfContent = yield (0, common_1.columnsAdd)(pdfContent, metadata[i].label, metadata[i].value);
            }
        }
        // spacing
        pdfContent.content.push(" ");
        return pdfContent;
    });
}
function imgViewer(imgViewer, section, pdfContent) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let base64 = yield (0, common_1.convertImageToBase64)(imgViewer["images"][0]["url"]);
            pdfContent.content.push({
                image: base64,
                width: 400,
                alignment: "center",
                margin: [0, 3],
            });
        }
        catch (error) {
            console.error("Error converting image to base64:", error);
        }
        // spacing
        pdfContent.content.push(" ");
        return pdfContent;
    });
}
function createPDF(req, res, config) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        module.exports = createPDF;
        const locale = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.locale) || '';
        const body = JSON.parse(req.body);
        const controller = new controllers_1.getResourceController();
        let result = yield controller.searchResource(body, config, locale);
        console.log(result, config);
        let pdfContent = yield addContent(result, (_b = config.configurations) === null || _b === void 0 ? void 0 : _b.getPDF);
        (0, common_1.createPdfBinary)(pdfContent, function (binary) {
            res.contentType("application/pdf");
            res.setHeader("Content-Disposition", "attachment; filename=" +
                encodeURIComponent(result.sections.header.title + ".pdf"));
            res.send(binary);
        });
    });
}
exports.default = createPDF;
