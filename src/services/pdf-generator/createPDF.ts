import { getResourceController } from "../../controllers";
import { createPdfBinary, getTextObject } from "./common";

/**
 * Add the content to the pdfContent object. This content will the be transformed into a pdf
 */
async function addContent(motive) {
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
  
 

  return pdfContent;
}

async function createPDF(req, res, config) {
  module.exports = createPDF;

  const locale = req.query?.locale || '';
  const body = JSON.parse(req.body);
  const controller = new getResourceController();
  let result = await controller.searchResource(body, config, locale as string) 
  console.log(result)
  let pdfContent = await addContent(result);
  createPdfBinary(
    pdfContent,
    function (binary) {
      res.contentType("application/pdf");

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" +
          encodeURIComponent(
            res.sections.header.title + ".pdf"
          )
      );
      res.send(binary);
    }
  );
  }

export default createPDF;

