import { capitalize } from "lodash";
import { getResourceController } from "../../controllers";
import { HttpHelper } from "../../helpers";
import { PDFContent } from "../../interfaces/configurations/getPDF";
import { columnsAdd, convertImageToBase64, createPdfBinary, getTextObject } from "./common";

/**
 * Add the content to the pdfContent object. This content will the be transformed into a pdf
 */
async function addContent(resource, configurations, type, labels) {

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
          text: await getTextObject(
            data.title,
            pdfContent
          ),
          style: "header",
        });
        // spacing
        pdfContent.content.push(" ");
        break;

      case 'editor-metadata':
        if (!data) {
          break;
        }
        pdfContent = await addEditor(
          data.group[0].items,
          pdfContent,
          labels
        );
        break;

      case 'metadata':
        if (!data) {
          break;
        }
        pdfContent = await addMetadata(
          data.group[0].items,
          pdfContent,
          labels
        );
        break;

      case 'image-viewer':
        if (!data) {
          break;
        }
        pdfContent = await addImgViewer(
          data,
          pdfContent
        )
        break;
        
      case 'image-viewer-iiif':
        if (!data) {
          break;
        }
        await addIIIF(
          data,
          pdfContent
        )
        break;

      case 'collection':
        if (!data) {
          break;
        }
        pdfContent = await addCollection(
          data,
          pdfContent
        )
        break;
    }
  }
  return pdfContent;
}

async function addEditor(editor, pdfContent, labels){
  for (let i = 0, n = editor?.length; i < n; i++) {
    pdfContent = await columnsAdd(
      pdfContent,
      (labels[editor[i].label]) ? capitalize(labels[editor[i].label]) : capitalize(editor[i].label),
      editor[i].value
    );
  }

  return pdfContent;
};

async function addImgViewer(imgViewer, pdfContent) {
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
    // spacing
    pdfContent.content.push(" ");
  } catch (error) {
    console.error("Error converting image to base64:", error);
  }

  return pdfContent;
}

async function addIIIF(iiif, pdfContent) {
  const{ manifestUrl } = iiif["iiif-manifests"][0];
  if (manifestUrl) {
    pdfContent = await columnsAdd(
      pdfContent,
      'Link IIIF',
      manifestUrl.replaceAll("\n", "").replaceAll("\r", ""),
    );
  }

  return pdfContent;
}

async function addMetadata(metadata, pdfContent, labels) {
  for (let i = 0, n = metadata?.length; i < n; i++) {
    if (Array.isArray(metadata[i].value)) {
      let jStart = 0;
      let kStart = 0;

      if (!(metadata[i].value[0][0].label)) {
        // se i dati annidati non hanno label si affiancano al livello del label principale
        if (metadata[i].value[0]?.length > 1) {
          kStart = 1;
        } else {
          jStart = 1;
        }
        pdfContent = await columnsAdd(
          pdfContent,
          (labels[metadata[i].label]) ? capitalize(labels[metadata[i].label]) : capitalize(metadata[i].label),
          metadata[i].value[0][0].value
        );
        if (metadata[i].value?.length > 1) {
          // divider image
          pdfContent.content.push({
            image:
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyAAAAAKCAQAAADmpvIuAAAAMElEQVR42u3BQQEAMAgEoIuy/iUWwUp28KlAAAAAAAAAYOSl1NV/AAAAAAAAAIC7GtqVk53qw1CjAAAAAElFTkSuQmCC",
            alignment: "right",
            margin: [0, 0, -40, 0],
            opacity: 0.4,
            width: 595
          });
        }  
      } else {
        // se i dati annidati hanno label si lascia uno spazio vuoto accanto al label principale
        pdfContent.content.push({
          text: (labels[metadata[i].label]) ? capitalize(labels[metadata[i].label]) : capitalize(metadata[i].label),
          bold: true,
          // margin: [0, 3, 0, 0],
        });
      }

      for (let j = jStart, n = metadata[i].value.length; j < n; j++) {
        for (let k = kStart, m = metadata[i].value[j].length; k < m; k++) {
          if (metadata[i].value[j][k].value !== "") {
            pdfContent = await columnsAdd(
              pdfContent,
              (labels[metadata[i].value[j][k].label]) ? capitalize(labels[metadata[i].value[j][k].label]) : capitalize(metadata[i].value[j][k].label),
              metadata[i].value[j][k].value
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
            width: 595
          });
        }
      }
    } else {
      pdfContent = await columnsAdd(
        pdfContent,
        (labels[metadata[i].label]) ? capitalize(labels[metadata[i].label]) : capitalize(metadata[i].label),
        metadata[i].value
      );
    }
  }

  return pdfContent;
}

async function addCollection(collection, pdfContent) {

  const items = collection["items"];
  if (items.length) {
    // aggiunge primo elemento accanto al label principale
    pdfContent = await columnsAdd(
      pdfContent,
      capitalize(collection["header"].title),
      (items[0].text) ? items[0].text : (items[0].title) ? items[0].title : ""
    );

    for (let i = 1, n = items?.length; i < n; i++) {
      pdfContent = await columnsAdd(
        pdfContent,
        "",
        (items[i].text) ? items[i].text : (items[i].title) ? items[i].title : ""
      );
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