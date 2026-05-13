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
exports.PDFGenerator = void 0;
const lodash_1 = require("lodash");
const controllers_1 = require("../../controllers");
const helpers_1 = require("../../helpers");
const common_1 = require("./common");
class PDFGenerator {
    constructor() {
        this.firstSection = true;
        this.afterTabTitle = false;
    }
    separator() {
        return {
            canvas: [{
                    type: 'line',
                    x1: 0, y1: 0,
                    x2: 515, y2: 0,
                    lineWidth: 1.5,
                    lineColor: '#dddddd',
                }],
            margin: [0, 0, 0, 0],
        };
    }
    flatNestedSeparator() {
        return {
            canvas: [{
                    type: 'line',
                    x1: 0, y1: 0,
                    x2: 515, y2: 0,
                    lineWidth: 0.5,
                    lineColor: '#dddddd',
                }],
            margin: [0, 10, 0, 10],
        };
    }
    nestedSeparator(pdfContent) {
        const lw = pdfContent.labelWidth;
        const offsetPx = typeof lw === 'number' ? lw + 5 : Math.round(parseFloat(lw) / 100 * 515) + 5;
        return {
            canvas: [{
                    type: 'line',
                    x1: 0, y1: 0,
                    x2: 515 - offsetPx, y2: 0,
                    lineWidth: 0.5,
                    lineColor: '#dddddd',
                }],
            margin: [offsetPx, 10, 0, 10],
        };
    }
    getLabel(item, labels) {
        return labels[item.label] ? (0, lodash_1.capitalize)(labels[item.label]) : (0, lodash_1.capitalize)(item.label);
    }
    addSpacing(pdfContent, top = 10) {
        pdfContent.content.push({ text: '', margin: [0, top, 0, 0] });
        return pdfContent;
    }
    addSectionSpacing(pdfContent) {
        if (this.firstSection) {
            this.firstSection = false;
            pdfContent = this.addSpacing(pdfContent, 20);
        }
        else if (this.afterTabTitle) {
            this.afterTabTitle = false;
            pdfContent = this.addSpacing(pdfContent, 5);
        }
        else {
            pdfContent = this.addSpacing(pdfContent, 5);
            if (!pdfContent.noSectionSeparator)
                pdfContent.content.push(this.separator());
            pdfContent = this.addSpacing(pdfContent, 5);
        }
        return pdfContent;
    }
    addContent(resource_1, configurations_1, type_1, labels_1) {
        return __awaiter(this, arguments, void 0, function* (resource, configurations, type, labels, locale = '') {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            const config = configurations.configurations.resources[type];
            const defaults = {
                content: [],
                styles: {
                    header: {
                        fontSize: 22,
                        bold: true,
                    },
                    subtitle: {
                        fontSize: 10,
                    },
                    sectionTitle: {
                        fontSize: 12,
                        color: '#7e8f9b',
                        bold: true,
                    },
                    tabTitle: {
                        fontSize: 14,
                        bold: true,
                    },
                    nestedTitle: {
                        fontSize: 11,
                        bold: true,
                    },
                    nestedMetadata: {
                        fontSize: 11,
                    },
                    bold: {
                        bold: true,
                    },
                    link: {
                        color: '#5397c7',
                        decoration: '',
                    },
                },
                defaultStyle: {
                    font: "OpenSans",
                    fontSize: 11,
                    lineHeight: 1,
                },
                labelWidth: '20%',
                nestedLabelWidth: '20%',
                noSectionSeparator: false
            };
            let pdfContent = Object.assign(Object.assign(Object.assign({}, defaults), config.pdf), { styles: Object.assign(Object.assign(Object.assign({}, defaults.styles), (_a = config.pdf) === null || _a === void 0 ? void 0 : _a.styles), { link: Object.assign(Object.assign({}, defaults.styles.link), (_c = (_b = config.pdf) === null || _b === void 0 ? void 0 : _b.styles) === null || _c === void 0 ? void 0 : _c.link) }), defaultStyle: Object.assign(Object.assign({}, defaults.defaultStyle), (_d = config.pdf) === null || _d === void 0 ? void 0 : _d.defaultStyle) });
            const tabMap = {};
            if (pdfContent.showTabTitles && pdfContent.tabs) {
                for (const tab of pdfContent.tabs) {
                    const label = typeof tab.label === 'string'
                        ? tab.label
                        : ((_f = (_e = tab.label[locale]) !== null && _e !== void 0 ? _e : tab.label[Object.keys(tab.label)[0]]) !== null && _f !== void 0 ? _f : '');
                    for (const sectionId of tab.sections) {
                        tabMap[sectionId] = label;
                    }
                }
            }
            let currentTabLabel = null;
            const sections = resource.sections;
            for (let section in sections) {
                const data = sections[section];
                if (((_g = config[section]) === null || _g === void 0 ? void 0 : _g.excludePDF) && ((_h = config[section]) === null || _h === void 0 ? void 0 : _h.excludePDF) === true) {
                    continue;
                }
                if (tabMap[section] && tabMap[section] !== currentTabLabel) {
                    currentTabLabel = tabMap[section];
                    pdfContent = this.addTabTitle(currentTabLabel, pdfContent);
                }
                switch ((_j = config[section]) === null || _j === void 0 ? void 0 : _j.type) {
                    case 'header':
                        if (!data)
                            break;
                        pdfContent = yield this.addHeader(data.title, pdfContent);
                        break;
                    case 'metadata-subtitle':
                        if (!data)
                            break;
                        pdfContent = yield this.addSubtitle(data.group[0].items, pdfContent, labels, (_k = config[section]) === null || _k === void 0 ? void 0 : _k.pdf);
                        break;
                    case 'metadata':
                        if (!data)
                            break;
                        pdfContent = yield this.addMetadata(data.group[0].items, pdfContent, labels, (_l = config[section]) === null || _l === void 0 ? void 0 : _l.pdf, locale);
                        break;
                    // case 'image-viewer':
                    //   if (!data) break;
                    //   pdfContent = await this.addImgViewer(data, pdfContent);
                    //   break;
                    // case 'image-viewer-iiif':
                    //   if (!data) break;
                    //   await this.addIIIF(data, pdfContent);
                    //   break;
                    // case 'collection':
                    //   if (!data) break;
                    //   pdfContent = await this.addCollection(data, pdfContent);
                    //   break;
                }
            }
            return pdfContent;
        });
    }
    addTabTitle(label, pdfContent) {
        this.addSectionSpacing(pdfContent);
        pdfContent.content.push({ text: label, style: 'tabTitle' });
        this.afterTabTitle = true;
        return pdfContent;
    }
    addHeader(title, pdfContent) {
        return __awaiter(this, void 0, void 0, function* () {
            pdfContent.content.push({
                text: yield (0, common_1.getTextObject)(title, pdfContent),
                style: "header",
            });
            return pdfContent;
        });
    }
    addSubtitle(items, pdfContent, labels, pdfSectionConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            pdfContent = this.addSpacing(pdfContent, -10);
            for (const item of items !== null && items !== void 0 ? items : []) {
                pdfContent = yield (0, common_1.columnsAdd)(pdfContent, this.getLabel(item, labels), item.value, pdfSectionConfig, "subtitle");
            }
            return pdfContent;
        });
    }
    addMetadata(items_1, pdfContent_1, labels_1, pdfSectionConfig_1) {
        return __awaiter(this, arguments, void 0, function* (items, pdfContent, labels, pdfSectionConfig, locale = '') {
            var _a, _b;
            pdfContent = this.addSectionSpacing(pdfContent);
            // Section title
            const titleConfig = pdfSectionConfig === null || pdfSectionConfig === void 0 ? void 0 : pdfSectionConfig.title;
            const sectionTitle = titleConfig
                ? ((_b = (_a = titleConfig[locale]) !== null && _a !== void 0 ? _a : titleConfig[Object.keys(titleConfig)[0]]) !== null && _b !== void 0 ? _b : '')
                : '';
            if (sectionTitle) {
                pdfContent.content.push({
                    text: sectionTitle,
                    style: "sectionTitle",
                    margin: [0, 0, 0, 5]
                });
            }
            let isFirst = true;
            for (const item of items !== null && items !== void 0 ? items : []) {
                const margin = (rowMargin) => rowMargin ? [0, 0, 0, 0] : [0, 5, 0, 0];
                const nestedMargin = [0, 5, 0, 0];
                if (!Array.isArray(item.value)) {
                    // Metadato piatto
                    pdfContent = yield (0, common_1.columnsAdd)(pdfContent, this.getLabel(item, labels), item.value, pdfSectionConfig, undefined, false, margin(isFirst));
                    isFirst = false;
                }
                else {
                    // Metadato annidato
                    for (let g = 0; g < item.value.length; g++) {
                        const rawItems = item.value[g]
                            .filter((subItem) => subItem.value && subItem.value !== '');
                        if (rawItems.length) {
                            // Annidato flat
                            if (pdfContent.flattenNested) {
                                if (g === 0) {
                                    const outerLabel = this.getLabel(item, labels);
                                    if (outerLabel) {
                                        pdfContent.content.push({ text: outerLabel, style: 'nestedTitle', margin: [0, isFirst ? 0 : 5, 0, 5] });
                                    }
                                }
                                for (let s = 0; s < rawItems.length; s++) {
                                    const subItem = rawItems[s];
                                    const subMargin = s === 0 ? [0, 0, 0, 0] : [0, 5, 0, 0];
                                    pdfContent = yield (0, common_1.columnsAdd)(pdfContent, this.getLabel(subItem, labels), subItem.value, pdfSectionConfig, undefined, false, subMargin);
                                }
                            }
                            else {
                                // Annidato incolonnato
                                const filteredItems = rawItems
                                    .map((subItem) => ({ label: this.getLabel(subItem, labels), value: subItem.value }));
                                const outerLabel = g === 0 ? this.getLabel(item, labels) : '';
                                pdfContent = yield (0, common_1.columnsAdd)(pdfContent, outerLabel, filteredItems, Object.assign(Object.assign({}, pdfSectionConfig), { nestedMargin }), "nestedMetadata", false);
                            }
                            isFirst = false;
                        }
                        if (g < item.value.length - 1) {
                            pdfContent.content.push(pdfContent.flattenNested ? this.flatNestedSeparator() : this.nestedSeparator(pdfContent));
                        }
                    }
                }
            }
            return pdfContent;
        });
    }
    addImgViewer(imgViewer, pdfContent) {
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
                pdfContent.content.push(" ");
            }
            catch (error) {
                console.error("Error converting image to base64:", error);
            }
            return pdfContent;
        });
    }
    addIIIF(iiif, pdfContent) {
        return __awaiter(this, void 0, void 0, function* () {
            const { manifestUrl } = iiif["iiif-manifests"][0];
            if (manifestUrl) {
                pdfContent = yield (0, common_1.columnsAdd)(pdfContent, 'Link IIIF', manifestUrl.replaceAll("\n", "").replaceAll("\r", ""));
            }
            return pdfContent;
        });
    }
    addCollection(collection, pdfContent) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = collection["items"];
            if (items.length) {
                pdfContent = yield (0, common_1.columnsAdd)(pdfContent, (0, lodash_1.capitalize)(collection["header"].title), items[0].text || items[0].title || "");
                if (items.length > 1) {
                    pdfContent.content.push(this.separator);
                }
                for (let i = 1, n = items === null || items === void 0 ? void 0 : items.length; i < n; i++) {
                    pdfContent = yield (0, common_1.columnsAdd)(pdfContent, "", items[i].text || items[i].title || "");
                    if (i < n - 1) {
                        pdfContent.content.push(this.separator);
                    }
                }
            }
            return pdfContent;
        });
    }
    createPDF(req, res, config, labels, resource) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const locale = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.locale) || '';
                const body = JSON.parse(req.body);
                const result = resource !== null && resource !== void 0 ? resource : yield new controllers_1.getResourceController().searchResource(body, config, locale);
                const pdfContent = yield this.addContent(result, config, body.type, labels, locale);
                const binary = yield (0, common_1.createPdfBinary)(pdfContent);
                const title = ((_c = (_b = result.sections) === null || _b === void 0 ? void 0 : _b.header) === null || _c === void 0 ? void 0 : _c.title) || 'Scheda PDF';
                const encodedTitle = encodeURIComponent(`${title}.pdf`);
                const headerData = {
                    "Content-Type": "application/pdf",
                    "Content-Disposition": `attachment; filename="${title}.pdf"; filename*=UTF-8''${encodedTitle}`,
                };
                return {
                    statusCode: 200,
                    headers: headerData,
                    body: binary,
                    isBase64Encoded: true,
                };
            }
            catch (error) {
                return helpers_1.HttpHelper.returnErrorResponse(error, 502);
            }
        });
    }
}
exports.PDFGenerator = PDFGenerator;
