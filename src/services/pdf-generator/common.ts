let pdfprinter = require("pdfmake");
const jsdom = require("jsdom");
const { document } = new jsdom.JSDOM().window;

// default font, should be included in any system
let fonts = {
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
export async function convertImageToBase64(url) {
  function _arrayBufferToBase64(buffer) {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    for (var i = 0, len = bytes.byteLength; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    // Convert the image to base64
    const type = response.headers.get("content-type");
    if (type && (type === "image/jpeg" || type === "image/png")) {
      return `data:${type};base64,${_arrayBufferToBase64(buffer)}`;
    } else {
      throw new Error("Image type not supported");
    }
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw error;
  }
}

/**
 * Get a parsed string from a text containing html tags.
 * @param {string} str
 * @param {boolean} replaceSpaces - if true, multiple spaces will be replaced by a newline character
 */
export function cleanText(str, replaceSpaces = false) {
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
export async function getTextObject(
  text,
  pdfContent,
  isLink = false,
  replaceSpaces = false
) {
  let toRtn = [];

  let splitText = text.split(
    /(<i>|<\/i>|<em>|<\/em>|<sup>|<\/sup>|<img.*?>|<strong>|<\/strong>)/g
  );
  for (let i = 0; i < splitText.length; i++) {
    let current = splitText[i];

    if (current === "<i>" || current === "<em>") {
      let italicText = splitText[++i];
      toRtn.push({ text: cleanText(italicText, replaceSpaces), italics: true });
    } else if (current === "<sup>") {
      let supText = splitText[++i];
      toRtn.push({ text: cleanText(supText, replaceSpaces), sup: true });
    } else if (current === "<strong>") {
      let boldText = splitText[++i];
      toRtn.push({ text: cleanText(boldText, replaceSpaces), bold: true });
    } else if (current.startsWith("<img")) {
      let imgSrc = current.match(/src="(.*?)"/)[1];
      try {
        let base64 = await convertImageToBase64(imgSrc);
        pdfContent.content.push({ text: toRtn, margin: [0, 3] });
        toRtn = [];

        pdfContent.content.push({
          image: base64,
          width: 400,
          alignment: "center",
          margin: [0, 3],
        });
      } catch (error) {
        console.error("Error converting image to base64:", error);
      }
    } else {
      toRtn.push(cleanText(current, replaceSpaces));
    }
  }

  if (isLink && (toRtn.length === 1)) {
    return { text: toRtn[0], link: toRtn[0], margin: [0, 3] };
  } else {
    return { text: toRtn, margin: [0, 3] };
  }
}

/**
 * Add text content in the form of a label and a text.
 * @param {object} pdfContent
 * @param {string} label
 * @param {string} rawText
 * @param {boolean} isLink
 * @returns {object} - the pdfContent object with the text added
 */
export async function simpleAdd(pdfContent, label, rawText, isLink = false) {
  pdfContent.content.push({
    text: label,
    bold: true,
    margin: [0, 3, 0, 0],
  });
  pdfContent.content.push(await getTextObject(rawText, pdfContent, isLink));
  return pdfContent;
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
export async function columnsAdd(
  pdfContent,
  label,
  text,
  margin = [0, 3],
  isLink = false
) {
  pdfContent.content.push({
    columns: [
      {
        width: 150,
        text: label,
        bold: true,
      },
      {
        width: 350,
        text: await getTextObject(text, pdfContent, isLink),
      },
    ],
    margin: margin,
  });

  return pdfContent;
}

/**
 * Add a list to the pdfContent object. The list is an object, where the keys are the values of the list.
 * @param {object} pdfContent
 * @param {string} label
 * @param {object} list
 * @returns {object} - the pdfContent object with the list added
 */
export function listAdd(pdfContent, label, list) {
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
export function createPdfBinary(pdfDoc, callback) {
  var printer = new pdfprinter(fonts);
  var doc = printer.createPdfKitDocument(pdfDoc);

  var chunks = [];
  var result;

  doc.on("data", function (chunk) {
    chunks.push(chunk);
  });
  doc.on("end", function () {
    result = Buffer.concat(chunks);

    callback(result);
  });
  doc.end();
}


