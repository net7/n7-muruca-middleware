/**
 * Fetch the image from the given url and convert it to base64.
 * @param {string} url
 * @returns {string} - the base64 string of the image
 */
export declare function convertImageToBase64(url: any): Promise<string>;
/**
 * Get a parsed string from a text containing html tags.
 * @param {string} str
 * @param {boolean} replaceSpaces - if true, multiple spaces will be replaced by a newline character
 */
export declare function cleanText(str: any, replaceSpaces?: boolean): any;
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
export declare function getTextObject(text: any, pdfContent: any, isLink?: boolean, replaceSpaces?: boolean): Promise<{
    text: any;
    link: any;
    margin: number[];
} | {
    text: any[];
    margin: number[];
    link?: undefined;
}>;
/**
 * Add text content in the form of a label and a text.
 * @param {object} pdfContent
 * @param {string} label
 * @param {string} rawText
 * @param {boolean} isLink
 * @returns {object} - the pdfContent object with the text added
 */
export declare function simpleAdd(pdfContent: any, label: any, rawText: any, isLink?: boolean): Promise<any>;
/**
 * Add text content in the form of a label and a text in two columns.
 * @param {object} pdfContent
 * @param {string} label
 * @param {string} text
 * @param {number[]} margin
 * @param {boolean} isLink
 * @returns {object} - the pdfContent object with the text added
 */
export declare function columnsAdd(pdfContent: any, label: any, text: any, margin?: number[], isLink?: boolean): Promise<any>;
/**
 * Add a list to the pdfContent object. The list is an object, where the keys are the values of the list.
 * @param {object} pdfContent
 * @param {string} label
 * @param {object} list
 * @returns {object} - the pdfContent object with the list added
 */
export declare function listAdd(pdfContent: any, label: any, list: any): any;
/**
 * Create the PDF file and create a binary file from it.
 * @param {object} pdfDoc
 * @param {Function} callback
 */
export declare function createPdfBinary(pdfDoc: any): Promise<unknown>;
