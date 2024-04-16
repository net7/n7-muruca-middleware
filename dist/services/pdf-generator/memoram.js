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
const common_1 = require("./common");
/**
 * Add the content to the pdfContent object. This content will the be transformed into a pdf
 */
function addContent(motive) {
    return __awaiter(this, void 0, void 0, function* () {
        // setup the pdf content
        let pdfContent = {
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
        let sections = motive.sections;
        // add the title of the motive and the description of the information
        pdfContent.content.push({
            text: sections.header.title,
            style: "header",
        });
        pdfContent.content.push(sections.occurrences.group[0].items[0].value.replace(" seleccionado", ""));
        let operas = sections.occurrences.group[1].items;
        // add an empty line for spacing
        pdfContent.content.push(" ");
        // add all the info for each opera
        for (let i = 0, n1 = operas.length; i < n1; i++) {
            pdfContent.content.push({
                text: operas[i].label,
                style: "subheader",
            });
            let chapters = operas[i].value[0];
            for (let j = 0, n2 = chapters.length; j < n2; j++) {
                if (chapters[j].label !== "") {
                    // add spacing
                    pdfContent.content.push({
                        text: " ",
                        fontSize: 4,
                    });
                    // add label
                    pdfContent.content.push({
                        text: chapters[j].label,
                        style: "bold",
                    });
                    // add clean text
                    pdfContent.content.push(yield (0, common_1.getTextObject)(chapters[j].value, {}, false, true));
                }
            }
            //spacing
            pdfContent.content.push(" ");
        }
        return pdfContent;
    });
}
function createPDFMemoram(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // get the opera from the server
        yield fetch("https://memoram-sls.mappingchivalry.dlls.univr.it/get_resource?locale=es", {
            method: "post",
            body: JSON.stringify({
                id: req.params.id,
                type: "motif",
                sections: ["header", "metadata", "occurrences"],
            }),
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((motive) => __awaiter(this, void 0, void 0, function* () {
            if (motive.title === "") {
                res.status(404).send({
                    status: 404,
                    message: "Resource not found.",
                });
                return;
            }
            // add the content to the pdf
            let pdfContent = yield addContent(motive);
            // create the pdf and send it to the client
            (0, common_1.createPdfBinary)(pdfContent, function (binary) {
                res.contentType("application/pdf");
                // use the name of the motive as the name of the file
                res.setHeader("Content-Disposition", "attachment; filename=" +
                    encodeURIComponent("Motivo - " + motive.sections.header.title + ".pdf"));
                res.send(binary);
            });
        }))
            .catch(() => {
            res.status(404).send({
                status: 404,
                message: "Resource not found.",
            });
        });
    });
}
exports.default = createPDFMemoram;
