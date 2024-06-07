import { getResourceController } from "../../controllers";
import { PDFContent } from "../../interfaces/configurations/getPDF";
import { cleanText, columnsAdd, convertImageToBase64, createPdfBinary, getTextObject } from "./common";

/**
 * Add the content to the pdfContent object. This content will the be transformed into a pdf
 */
async function addContent(motive, pdfContent?: PDFContent) {

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

  pdfContent = await addMetadata(
    sections["metadata"].group[0].items,
    "metadata",
    pdfContent
  );

  pdfContent = await imgViewer(
    sections["image-viewer"],
    "imageViewer",
    pdfContent
  )

  return pdfContent;
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
}

async function addMetadata(metadata, section, pdfContent) {

  pdfContent.content.push({
    text: labels.sections[section],
    style: "subheader",
  });

  console.log(metadata)

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
            pdfContent = await columnsAdd(
              pdfContent,
              metadata[i].value[j][k].label,
              cleanText(metadata[i].value[j][k].value),
              [10, 3]
            );
          }
        }
        if (j < n - 1) {
          // divider image
          pdfContent.content.push({
            image:
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyAAAAAKCAQAAADmpvIuAAAAMElEQVR42u3BQQEAMAgEoIuy/iUWwUp28KlAAAAAAAAAYOSl1NV/AAAAAAAAAIC7GtqVk53qw1CjAAAAAElFTkSuQmCC",
            alignment: "center",
            margin: [0, 0, 38, 0],
          });
        }
      }
    } else {
      pdfContent = await columnsAdd(
        pdfContent,
        metadata[i].label,
        metadata[i].value
      );
    }
  }
    // spacing
    pdfContent.content.push(" ");

    return pdfContent;
}
async function imgViewer(imgViewer, section, pdfContent) {

  try {
    let base64 = await convertImageToBase64(imgViewer["images"][0]["url"]);

    pdfContent.content.push({
      image: base64,
      width: 400,
      alignment: "center",
      margin: [0, 3],
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
  }
    // spacing
    pdfContent.content.push(" ");

    return pdfContent;
}

async function createPDF(req, res, config) {
  module.exports = createPDF;

  const locale = req.query?.locale || '';
  const body = JSON.parse(req.body);
  const controller = new getResourceController();
  let result = await controller.searchResource(body, config, locale as string) 
  console.log(result, config)
  let pdfContent = await addContent(result, config.configurations?.getPDF);
  createPdfBinary(
    pdfContent,
    function (binary) {
      res.contentType("application/pdf");

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" +
          encodeURIComponent(
            result.sections.header.title + ".pdf"
          )
      );
      res.send(binary);
    }
  );
  }

export default createPDF;