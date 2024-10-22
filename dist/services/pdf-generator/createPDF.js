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
const lodash_1 = require("lodash");
const controllers_1 = require("../../controllers");
const helpers_1 = require("../../helpers");
const common_1 = require("./common");
/**
 * Add the content to the pdfContent object. This content will the be transformed into a pdf
 */
function addContent(resource, configurations, type, labels) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const config = configurations.configurations.resources[type];
        let pdfContent = (_a = config.configurations) === null || _a === void 0 ? void 0 : _a.getPDF;
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
                    font: "OpenSans",
                    lineHeight: 1.5,
                },
            };
        }
        let sections = resource.sections;
        for (let section in sections) {
            const data = sections[section];
            if (((_b = config[section]) === null || _b === void 0 ? void 0 : _b.excludePDF) && ((_c = config[section]) === null || _c === void 0 ? void 0 : _c.excludePDF) === true) {
                continue;
            }
            switch ((_d = config[section]) === null || _d === void 0 ? void 0 : _d.type) {
                case 'header':
                    if (!data) {
                        break;
                    }
                    pdfContent.content.push({
                        text: yield (0, common_1.getTextObject)(data.title, pdfContent),
                        style: "header",
                    });
                    // spacing
                    pdfContent.content.push(" ");
                    break;
                case 'editor-metadata':
                    if (!data) {
                        break;
                    }
                    pdfContent = yield addEditor(data.group[0].items, pdfContent, labels);
                    break;
                case 'metadata':
                    if (!data) {
                        break;
                    }
                    pdfContent = yield addMetadata(data.group[0].items, pdfContent, labels);
                    break;
                case 'image-viewer':
                    if (!data) {
                        break;
                    }
                    pdfContent = yield addImgViewer(data, pdfContent);
                    break;
                case 'image-viewer-iiif':
                    if (!data) {
                        break;
                    }
                    yield addIIIF(data, pdfContent);
                    break;
                case 'collection':
                    if (!data) {
                        break;
                    }
                    pdfContent = yield addCollection(data, pdfContent);
                    break;
            }
        }
        return pdfContent;
    });
}
function addEditor(editor, pdfContent, labels) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0, n = editor === null || editor === void 0 ? void 0 : editor.length; i < n; i++) {
            pdfContent = yield (0, common_1.columnsAdd)(pdfContent, (labels[editor[i].label]) ? (0, lodash_1.capitalize)(labels[editor[i].label]) : (0, lodash_1.capitalize)(editor[i].label), editor[i].value);
        }
        return pdfContent;
    });
}
;
function addImgViewer(imgViewer, pdfContent) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            for (let image of imgViewer["images"]) {
                let base64 = yield (0, common_1.convertImageToBase64)(image["url"]);
                pdfContent.content.push({
                    image: base64,
                    width: 250,
                    alignment: "center",
                    margin: [0, 3],
                });
            }
            // spacing
            pdfContent.content.push(" ");
        }
        catch (error) {
            console.error("Error converting image to base64:", error);
        }
        return pdfContent;
    });
}
function addIIIF(iiif, pdfContent) {
    return __awaiter(this, void 0, void 0, function* () {
        const { manifestUrl } = iiif["iiif-manifests"][0];
        if (manifestUrl) {
            pdfContent = yield (0, common_1.columnsAdd)(pdfContent, 'Link IIIF', manifestUrl.replaceAll("\n", "").replaceAll("\r", ""));
        }
        return pdfContent;
    });
}
function addMetadata(metadata, pdfContent, labels) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0, n = metadata === null || metadata === void 0 ? void 0 : metadata.length; i < n; i++) {
            if (Array.isArray(metadata[i].value)) {
                let jStart = 0;
                let kStart = 0;
                if (!(metadata[i].value[0][0].label)) {
                    // se i dati annidati non hanno label si affiancano al livello del label principale
                    if (((_a = metadata[i].value[0]) === null || _a === void 0 ? void 0 : _a.length) > 1) {
                        kStart = 1;
                    }
                    else {
                        jStart = 1;
                    }
                    pdfContent = yield (0, common_1.columnsAdd)(pdfContent, (labels[metadata[i].label]) ? (0, lodash_1.capitalize)(labels[metadata[i].label]) : (0, lodash_1.capitalize)(metadata[i].label), metadata[i].value[0][0].value);
                    if (((_b = metadata[i].value) === null || _b === void 0 ? void 0 : _b.length) > 1) {
                        // divider image
                        pdfContent.content.push({
                            image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyAAAAAKCAQAAADmpvIuAAAAMElEQVR42u3BQQEAMAgEoIuy/iUWwUp28KlAAAAAAAAAYOSl1NV/AAAAAAAAAIC7GtqVk53qw1CjAAAAAElFTkSuQmCC",
                            alignment: "right",
                            margin: [0, 0, -40, 0],
                            opacity: 0.4,
                            width: 583
                        });
                    }
                }
                else {
                    // se i dati annidati hanno label si lascia uno spazio vuoto accanto al label principale
                    pdfContent.content.push({
                        text: (labels[metadata[i].label]) ? (0, lodash_1.capitalize)(labels[metadata[i].label]) : (0, lodash_1.capitalize)(metadata[i].label),
                        bold: true,
                        // margin: [0, 3, 0, 0],
                    });
                }
                for (let j = jStart, n = metadata[i].value.length; j < n; j++) {
                    for (let k = kStart, m = metadata[i].value[j].length; k < m; k++) {
                        if (metadata[i].value[j][k].value !== "") {
                            pdfContent = yield (0, common_1.columnsAdd)(pdfContent, (labels[metadata[i].value[j][k].label]) ? (0, lodash_1.capitalize)(labels[metadata[i].value[j][k].label]) : (0, lodash_1.capitalize)(metadata[i].value[j][k].label), metadata[i].value[j][k].value);
                        }
                    }
                    if (j < n - 1) {
                        // divider image
                        pdfContent.content.push({
                            image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyAAAAAKCAQAAADmpvIuAAAAMElEQVR42u3BQQEAMAgEoIuy/iUWwUp28KlAAAAAAAAAYOSl1NV/AAAAAAAAAIC7GtqVk53qw1CjAAAAAElFTkSuQmCC",
                            alignment: "right",
                            margin: [0, 0, -40, 0],
                            opacity: 0.4,
                            width: 583
                        });
                    }
                }
            }
            else {
                pdfContent = yield (0, common_1.columnsAdd)(pdfContent, (labels[metadata[i].label]) ? (0, lodash_1.capitalize)(labels[metadata[i].label]) : (0, lodash_1.capitalize)(metadata[i].label), metadata[i].value);
            }
        }
        return pdfContent;
    });
}
function addCollection(collection, pdfContent) {
    return __awaiter(this, void 0, void 0, function* () {
        const items = collection["items"];
        if (items.length) {
            // aggiunge primo elemento accanto al label principale
            pdfContent = yield (0, common_1.columnsAdd)(pdfContent, (0, lodash_1.capitalize)(collection["header"].title), (items[0].text) ? items[0].text : (items[0].title) ? items[0].title : "");
            for (let i = 1, n = items === null || items === void 0 ? void 0 : items.length; i < n; i++) {
                pdfContent = yield (0, common_1.columnsAdd)(pdfContent, "", (items[i].text) ? items[i].text : (items[i].title) ? items[i].title : "");
            }
        }
        // spacing
        // pdfContent.content.push(" ");
        // const items = collection["items"];
        // if (items.length) {
        //   pdfContent.content.push({
        //     text: capitalize(collection["header"].title),
        //     style: "subheader",
        //     margin: [0, 3, 0, 0]
        //   });
        // }
        // for (let i = 0, n = items?.length; i < n; i++) {
        //   pdfContent.content.push(
        //     await getTextObject(
        //       items[i].text.replaceAll("\n", "").replaceAll("\r", ""),
        //       pdfContent
        //     )
        //   );
        // }
        return pdfContent;
    });
}
function createPDF(req, res, config, labels) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            module.exports = createPDF;
            const locale = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.locale) || '';
            const body = JSON.parse(req.body);
            const controller = new controllers_1.getResourceController();
            let result = yield controller.searchResource(body, config, locale);
            let pdfContent = yield addContent(result, config, body.type, labels);
            const binary = yield (0, common_1.createPdfBinary)(pdfContent);
            const headerData = {
                "Content-Type": "application/pdf",
                "Content-Disposition": "attachment; filename=" + encodeURIComponent("Metadata.pdf"),
            };
            const response = {
                statusCode: 200,
                headers: headerData,
                body: binary,
                isBase64Encoded: true,
            };
            //const response = HttpHelper.returnOkResponse(binary as any, headerData);
            return response;
        }
        catch (error) {
            return helpers_1.HttpHelper.returnErrorResponse(error, 502);
        }
    });
}
exports.default = createPDF;
