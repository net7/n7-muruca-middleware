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
let pdfprinter = require("pdfmake");
const jsdom = require("jsdom");
const { document } = new jsdom.JSDOM().window;
pdfprinter.vfs = fonts_vfs_1.pdfMakeVfs;
// default font, should be included in any system
let fonts = {
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
        function _arrayBufferToBase64(buffer) {
            var binary = "";
            var bytes = new Uint8Array(buffer);
            for (var i = 0, len = bytes.byteLength; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return btoa(binary);
        }
        try {
            const response = yield fetch(url);
            const buffer = yield response.arrayBuffer();
            // Convert the image to base64
            const type = response.headers.get("content-type");
            if (type && (type === "image/jpeg" || type === "image/png")) {
                return `data:${type};base64,${_arrayBufferToBase64(buffer)}`;
            }
            else {
                throw new Error("Image type not supported");
            }
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
    var element = document.createElement("div");
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
        let toRtn = [];
        let splitText = text.split(/(<i>|<\/i>|<em>|<\/em>|<sup>|<\/sup>|<img.*?>|<strong>|<\/strong>)/g);
        for (let i = 0; i < splitText.length; i++) {
            let current = splitText[i];
            current = current.replace(/\n/g, "");
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
                let href = current.match(/href="(.*?)"/)[1];
                toRtn.push({ text: cleanText(href, replaceSpaces) });
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
            else {
                toRtn.push(cleanText(current, replaceSpaces));
            }
        }
        if (isLink && (toRtn.length === 1)) {
            return { text: toRtn[0], link: toRtn[0], margin: [0, 3] };
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
function columnsAdd(pdfContent_1, label_1, text_1) {
    return __awaiter(this, arguments, void 0, function* (pdfContent, label, text, margin = [0, 3], isLink = false) {
        pdfContent.content.push({
            columns: [
                {
                    width: 140,
                    text: label,
                    bold: true,
                },
                {
                    // Colonna per spaziare
                    width: 5,
                    text: ""
                },
                {
                    width: 355,
                    text: yield getTextObject(text, pdfContent, isLink),
                },
            ],
            margin: margin,
        });
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
            var printer = new pdfprinter(fonts);
            var doc = printer.createPdfKitDocument(pdfDoc);
            var chunks = [];
            doc.on("data", function (chunk) {
                chunks.push(chunk);
            });
            doc.on("end", function () {
                var result = Buffer.concat(chunks);
                resolve(result.toString("base64"));
            });
            doc.end();
        }
        catch (error) {
            reject(error);
        }
    });
}
