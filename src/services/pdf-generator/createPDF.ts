import { capitalize } from "lodash";
import { getPDFController, getResourceController } from "../../controllers";
import { HttpHelper } from "../../helpers";
import { PDFContent } from "../../interfaces/configurations/getPDF";
import { cleanText, columnsAdd, convertImageToBase64, createPdfBinary, getTextObject } from "./common";
import { Controller } from "../../controller";

/**
 * Add the content to the pdfContent object. This content will the be transformed into a pdf
 */
async function addContent(resource, configurations, type, labels) {
  // console.log(labels);

  const config = configurations.configurations.resources[type];

  let pdfContent: PDFContent = config.configurations?.getPDF;

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
  
  let sections = resource.sections;
  for (let section in sections) {
    const data = sections[section];
    if (config[section]?.excludePDF && config[section]?.excludePDF === true ) {
      continue;
    }
    switch(config[section]?.type) {
      
      case 'header':
        if (!data) {
          break;
        }
        pdfContent.content.push({
          text: data.title,
          style: "header",
        });
        // spacing
        pdfContent.content.push(" ");
        break;

      case 'metadata':
        if (!data) {
          break;
        }
        pdfContent = await addMetadata(
          data.group[0].items, 
          "metadata", 
          pdfContent,
        labels);
        break;

      case 'image-viewer':
        if (!data) {
          break;
        }
        pdfContent = await imgViewer(
          data,
          "imageViewer",
          pdfContent)
        break;
        
      case 'image-viewer-iiif':
        if (!data) {
          break;
        }
        await addIIIF(
          data,
          "image-viewer-iiif",
          pdfContent)
        break;

      case 'collection':
        if (!data) {
          break;
        }
        pdfContent = await addCollection(
          data,
          "collection",
          pdfContent)
        break;
    }
  }
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

async function addMetadata(metadata, section, pdfContent, labels) {

  if (metadata.length) {
    pdfContent.content.push({
      text: 'Metadata',
      style: "subheader",
      margin: [0, 10, 0, 0]
    });
  }

  for (let i = 0, n = metadata?.length; i < n; i++) {
    if (Array.isArray(metadata[i].value)) {
      pdfContent.content.push({
        text: (labels[metadata[i].label]) ? labels[metadata[i].label] : metadata[i].label,
        bold: true,
        margin: [0, 3, 0, 0],
      });

      for (let j = 0, n = metadata[i].value.length; j < n; j++) {
        for (let k = 0, m = metadata[i].value[j].length; k < m; k++) {
          if (metadata[i].value[j][k].value !== "") {
            pdfContent = await columnsAdd(
              pdfContent,
              (labels[metadata[i].value[j][k].label]) ? labels[metadata[i].value[j][k].label] : metadata[i].value[j][k].label,
              // metadata[i].value[j][k].label,
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
            alignment: "right",
            margin: [0, 0, -40, 0],
            opacity: 0.4,
            width: 580
          });
        }
      }
    } else {
      pdfContent = await columnsAdd(
        pdfContent,
        // metadata[i].label,
        (labels[metadata[i].label]) ? labels[metadata[i].label] : metadata[i].label,
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
    for (let image of imgViewer["images"]) {
      let base64 = await convertImageToBase64(image["url"]);
      pdfContent.content.push({
        image: base64,
        width: 250,
        alignment: "center",
        margin: [0, 3],
      });
    }
  } catch (error) {
    console.error("Error converting image to base64:", error);
  }
    // spacing
    pdfContent.content.push(" ");

    return pdfContent;
}

async function addCollection(collection, section, pdfContent) {
  const items = collection["items"];

  if (items.length) {
    pdfContent.content.push({
      text: capitalize(collection["header"].title),
      style: "subheader",
      margin: [0, 10, 0, 0]
    });
  }

  for (let i = 0, n = items?.length; i < n; i++) {
    pdfContent.content.push(
      await getTextObject(
        items[i].text.replaceAll("\n", "").replaceAll("\r", ""),
        pdfContent
      )
    );
  }

  // spacing
  pdfContent.content.push(" ");

  return pdfContent;
}

async function addIIIF(iiif, section, pdfContent) {

  const{ manifestUrl } = iiif["iiif-manifests"][0];

  if (manifestUrl) {
    pdfContent.content.push({
      text: 'Link IIIF',
      style: "subheader",
      margin: [0, 10, 0, 0]
    });

    pdfContent.content.push(
      await getTextObject(
        manifestUrl.replaceAll("\n", "").replaceAll("\r", ""),
        pdfContent
      )
    );
  }

  // spacing
  pdfContent.content.push(" ");

  return pdfContent;
}

async function createPDF(req, res, config, labels) {
  try{
    module.exports = createPDF;
  
    const locale = req.query?.locale || '';
    const body = JSON.parse(req.body);
    const controller = new getResourceController();
    let result = await controller.searchResource(body, config, locale as string);
    let pdfContent = await addContent(result, config, body.type, labels);
    const binary = await createPdfBinary(pdfContent);
  
    const headerData = {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=" + encodeURIComponent("Metadata.pdf"),
    };
  
    const response = {
      statusCode: 200,
      headers: headerData,
      body: binary,
      isBase64Encoded: true,
    }
    //const response = HttpHelper.returnOkResponse(binary as any, headerData);
    return response;
  } catch (error) {
    return HttpHelper.returnErrorResponse(error, 502);
  }
}

export default createPDF;