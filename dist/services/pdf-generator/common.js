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
exports.convertImageToBase64 = convertImageToBase64;
exports.cleanText = cleanText;
exports.getTextObject = getTextObject;
exports.simpleAdd = simpleAdd;
exports.columnsAdd = columnsAdd;
exports.listAdd = listAdd;
exports.createPdfBinary = createPdfBinary;
const fonts_vfs_1 = require("./fonts/fonts-vfs");
const pdfprinter = require("pdfmake");
const jsdom = require("jsdom");
const { document } = new jsdom.JSDOM().window;
pdfprinter.vfs = fonts_vfs_1.pdfMakeVfs;
// default font, should be included in any system
const fonts = {
    OpenSans: {
        normal: Buffer.from(pdfprinter.vfs["OpenSans-Regular.ttf"], "base64"),
        bold: Buffer.from(pdfprinter.vfs["OpenSans-Bold.ttf"], "base64"),
        italics: Buffer.from(pdfprinter.vfs["OpenSans-Italic.ttf"], "base64"),
        bolditalics: Buffer.from(pdfprinter.vfs["OpenSans-BoldItalic.ttf"], "base64"),
    },
    Helvetica: {
        normal: "Helvetica",
        bold: "Helvetica-Bold",
        italics: "Helvetica-Oblique",
        bolditalics: "Helvetica-BoldOblique",
    },
};
/**
 * Fetch the image from the given url and convert it to base64.
 * @param {string} url
 * @returns {string} - the base64 string of the image
 */
function convertImageToBase64(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url);
            const buffer = yield response.arrayBuffer();
            const type = response.headers.get("content-type");
            if (type && (type === "image/jpeg" || type === "image/png")) {
                return `data:${type};base64,${Buffer.from(buffer).toString('base64')}`;
            }
            throw new Error("Image type not supported");
        }
        catch (error) {
            console.error("Error converting image to base64:", error);
            throw error;
        }
    });
}
/**
 * Get a parsed string from a text containing html tags.
 * @param {string} str
 * @param {boolean} replaceSpaces - if true, multiple spaces will be replaced by a newline character
 */
function cleanText(str, replaceSpaces = false) {
    if (replaceSpaces) {
        str = str.replace(/\s{2,}/g, "\n");
    }
    str = str.replace(/ʺ/g, '"');
    const element = document.createElement("div");
    element.innerHTML = str;
    return element.textContent || element.innerText;
}
/**
 * Create text content in an object that can be used by pdfMake.
 * Every <i> tag and <em> tag will be transformed into an italics text.
 * Every <sup> tag will be transformed into a superscript text.
 * Every <img> tag will be transformed into an image.
 * @param {string} text
 * @param {object} pdfContent
 * @param {boolean} isLink - if true, the text will be a link
 * @param {boolean} replaceSpaces - if true, multiple spaces will be replaced by a newline character
 * @returns {object} - the object with the text added
 */
function getTextObject(text_1, pdfContent_1) {
    return __awaiter(this, arguments, void 0, function* (text, pdfContent, isLink = false, replaceSpaces = false) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        let toRtn = [];
        const linkColor = (_c = (_b = (_a = pdfContent.styles) === null || _a === void 0 ? void 0 : _a.link) === null || _b === void 0 ? void 0 : _b.color) !== null && _c !== void 0 ? _c : '#5397c7';
        const linkDecoration = (_f = (_e = (_d = pdfContent.styles) === null || _d === void 0 ? void 0 : _d.link) === null || _e === void 0 ? void 0 : _e.decoration) !== null && _f !== void 0 ? _f : '';
        let splitText = text.split(/(<i>|<\/i>|<em>|<\/em>|<sup>|<\/sup>|<img.*?>|<strong>|<\/strong>|<a[^>]*>|<\/a>)/g);
        for (let i = 0; i < splitText.length; i++) {
            let current = splitText[i];
            if (current === "<i>" || current === "<em>") {
                let italicText = splitText[++i];
                toRtn.push({ text: cleanText(italicText, replaceSpaces), italics: true });
            }
            else if (current === "<sup>") {
                let supText = splitText[++i];
                toRtn.push({ text: cleanText(supText, replaceSpaces), sup: true });
            }
            else if (current === "<strong>") {
                let boldText = splitText[++i];
                toRtn.push({ text: cleanText(boldText, replaceSpaces), bold: true });
            }
            else if (current.startsWith("<a")) {
                const href = ((_g = current.match(/href="(.*?)"/)) === null || _g === void 0 ? void 0 : _g[1]) || ((_h = current.match(/href='(.*?)'/)) === null || _h === void 0 ? void 0 : _h[1]) || '';
                const linkText = cleanText(splitText[++i], replaceSpaces);
                i++;
                toRtn.push({ text: linkText, link: href, color: linkColor, decoration: linkDecoration });
            }
            else if (current.startsWith("<img")) {
                let imgSrc = current.match(/src="(.*?)"/)[1];
                try {
                    let base64 = yield convertImageToBase64(imgSrc);
                    pdfContent.content.push({ text: toRtn, margin: [0, 3] });
                    toRtn = [];
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
            }
            else if (current.trim().startsWith('http://') || current.trim().startsWith('https://')) {
                const url = current.trim();
                toRtn.push({ text: url, link: url, color: linkColor, decoration: linkDecoration });
            }
            else {
                toRtn.push(cleanText(current, replaceSpaces));
            }
        }
        if (isLink && (toRtn.length === 1)) {
            return { text: toRtn[0], link: toRtn[0], color: linkColor, decoration: linkDecoration, margin: [0, 3] };
        }
        else {
            return { text: toRtn, margin: [0, 3] };
        }
    });
}
/**
 * Add text content in the form of a label and a text.
 * @param {object} pdfContent
 * @param {string} label
 * @param {string} rawText
 * @param {boolean} isLink
 * @returns {object} - the pdfContent object with the text added
 */
function simpleAdd(pdfContent_1, label_1, rawText_1) {
    return __awaiter(this, arguments, void 0, function* (pdfContent, label, rawText, isLink = false) {
        pdfContent.content.push({
            text: label,
            bold: true,
            margin: [0, 3, 0, 0],
        });
        pdfContent.content.push(yield getTextObject(rawText, pdfContent, isLink));
        return pdfContent;
    });
}
/**
 * Add text content in the form of a label and a text in two columns.
 * @param {object} pdfContent
 * @param {string} label
 * @param {string} text
 * @param {number[]} margin
 * @param {boolean} isLink
 * @returns {object} - the pdfContent object with the text added
 */
function parseListNode(node) {
    const items = [];
    for (const child of Array.from(node.childNodes)) {
        if (child.tagName === 'LI') {
            const parts = [];
            let text = '';
            for (const liChild of Array.from(child.childNodes)) {
                if (liChild.tagName === 'UL') {
                    if (text.trim())
                        parts.push(text.trim());
                    text = '';
                    parts.push(parseListNode(liChild));
                }
                else {
                    text += liChild.textContent || '';
                }
            }
            if (text.trim())
                parts.push(text.trim());
            if (parts.length === 0)
                continue;
            items.push(parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : { stack: parts });
        }
        else if (child.tagName === 'UL') {
            items.push(parseListNode(child));
        }
    }
    return { ul: items };
}
function htmlToList(html) {
    const el = document.createElement('div');
    el.innerHTML = html;
    const parts = [];
    for (const child of Array.from(el.childNodes)) {
        if (child.tagName === 'UL') {
            parts.push(parseListNode(child));
        }
        else {
            const text = (child.textContent || '').trim();
            if (text)
                parts.push({ text });
        }
    }
    if (parts.length === 0)
        return { text: '' };
    if (parts.length === 1)
        return parts[0];
    return { stack: parts };
}
function buildTextContent(text_1, pdfContent_1, isLink_1) {
    return __awaiter(this, arguments, void 0, function* (text, pdfContent, isLink, pdfSectionConfig = undefined) {
        if (Array.isArray(text)) {
            const stackItems = yield Promise.all(text.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                const hasLabel = item.label && item.label !== '';
                const margin = index === 0 ? [0, 0, 0, 0] : ((_a = pdfSectionConfig === null || pdfSectionConfig === void 0 ? void 0 : pdfSectionConfig.nestedMargin) !== null && _a !== void 0 ? _a : [0, 5, 0, 0]);
                if ((pdfSectionConfig === null || pdfSectionConfig === void 0 ? void 0 : pdfSectionConfig.noEmptyLabels) && !hasLabel) {
                    return {
                        columns: [
                            Object.assign({ width: '*' }, yield buildTextContent(item.value, pdfContent, isLink, pdfSectionConfig)),
                        ],
                        margin,
                    };
                }
                return {
                    columns: [
                        { width: (_b = pdfContent.nestedLabelWidth) !== null && _b !== void 0 ? _b : '30%', text: (_c = item.label) !== null && _c !== void 0 ? _c : '', bold: true },
                        { width: 5, text: '' },
                        Object.assign({ width: '*' }, yield buildTextContent(item.value, pdfContent, isLink, pdfSectionConfig)),
                    ],
                    margin,
                };
            })));
            return { stack: stackItems };
        }
        const textStr = String(text !== null && text !== void 0 ? text : '');
        if (/<ul|<li/i.test(textStr)) {
            return htmlToList(textStr);
        }
        return { text: yield getTextObject(textStr, pdfContent, isLink) };
    });
}
function columnsAdd(pdfContent_1, label_1, text_1) {
    return __awaiter(this, arguments, void 0, function* (pdfContent, label, text, pdfSectionConfig = undefined, style = undefined, isLink = false, margin = [0, 3, 0, 0]) {
        const entry = { margin };
        const textContent = yield buildTextContent(text, pdfContent, isLink, pdfSectionConfig);
        if ((pdfSectionConfig === null || pdfSectionConfig === void 0 ? void 0 : pdfSectionConfig.noEmptyLabels) && !label && !Array.isArray(text)) {
            entry.columns = [
                Object.assign({ width: '*' }, textContent),
            ];
        }
        else {
            entry.columns = [
                { width: pdfContent.labelWidth, text: label, bold: true },
                { width: 10, text: '' },
                Object.assign({ width: '*' }, textContent),
            ];
        }
        if (style) {
            entry.columns[entry.columns.length - 1].style = style;
        }
        pdfContent.content.push(entry);
        return pdfContent;
    });
}
/**
 * Add a list to the pdfContent object. The list is an object, where the keys are the values of the list.
 * @param {object} pdfContent
 * @param {string} label
 * @param {object} list
 * @returns {object} - the pdfContent object with the list added
 */
function listAdd(pdfContent, label, list) {
    pdfContent.content.push({
        text: label,
        bold: true,
        margin: [0, 3, 0, 0],
    });
    let listValues = [];
    let key = "";
    let leftMargin = 0;
    while (true) {
        key = Object.keys(list)[0];
        listValues.push({ text: key, margin: [leftMargin, 0, 0, 0] });
        list = list[key];
        leftMargin += 5;
        if (list.length === 0) {
            break;
        }
    }
    pdfContent.content.push({
        ul: listValues,
    });
    return pdfContent;
}
/**
 * Create the PDF file and create a binary file from it.
 * @param {object} pdfDoc
 * @param {Function} callback
 */
function createPdfBinary(pdfDoc) {
    return new Promise((resolve, reject) => {
        try {
            const printer = new pdfprinter(fonts);
            const doc = printer.createPdfKitDocument(pdfDoc);
            const chunks = [];
            doc.on("data", function (chunk) {
                chunks.push(chunk);
            });
            doc.on("end", function () {
                const result = Buffer.concat(chunks);
                resolve(result.toString("base64"));
            });
            doc.end();
        }
        catch (error) {
            reject(error);
        }
    });
}
