import { cleanText, columnsAdd, createPdfBinary, getTextObject, simpleAdd } from "./common";


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
  codicologico: {
    conservation: "Estado de conservación",
    "phisical description": "Descripción externa",
    "cover page": "Portada",
    "dramatis personae": "Dramatis personae",
    "ph desc signature": "Firma",
    "ph desc date": "Fecha",
    "other hand": "Otras grafías",
    "analytics description": "Descripción analítica",
    "manuscript characteristics": "Características del manuscrito",
  },
  composicion: {
    "is draft": "Borrador",
    "first writing": "Primera redacción",
    revisions: "Revisión",
    "is revision marginalia": "Añadidos en los márgenes",
    "revision marginalia": "Añadidos en los márgenes (descripcion)",
    "external intervention company": "Intervenciones ajenas (companía teatral)",
    "is deleted fragments": "Fragmentos tachados o enjaulados",
    "deleted fragments": "Fragmentos tachados o enjaulados (descripcion)",
  },
};

async function bibliografiaCitada(metadata, pdfContent) {
  pdfContent.content.push({
    text: "Bibliografía citada",
    style: "subheader",
  });

  for (let i = 0, n = metadata.length; i < n; i++) {
    pdfContent.content.push(
      await getTextObject(
        metadata[i].text.replaceAll("\n", "").replaceAll("\r", ""),
        pdfContent
      )
    );
  }

  return pdfContent;
}

async function biblioMain(metadata, pdfContent) {
  pdfContent.content.push({
    text: "Datos bibliográficos",
    style: "subheader",
  });

  for (let i = 0, n = metadata.length; i < n; i++) {
    if (metadata[i].label === "facsimile") {
      pdfContent.content.push({
        columns: [
          {
            width: 150,
            text: labels.bibliographyData[metadata[i].label],
            bold: true,
          },
          {
            width: "*",
            text: metadata[i].value,
            link: metadata[i].value,
          },
        ],
        margin: [0, 3],
      });
    } else if (metadata[i].label === "censors licenses") {
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
              labels.licenses[metadata[i].value[j][k].label],
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
        labels.bibliographyData[metadata[i].label],
        metadata[i].value
      );
    }
  }

  // spacing
  pdfContent.content.push(" ");

  return pdfContent;
}

/**
 * This function is applied to both the 'codicologico', 'composicion'
 * and 'composicion other' sections.
 * @param {Array} metadata
 * @param {object} pdfContent
 * @param {string} headerText
 * @param {Set} simpleLabels
 * @param {object} labelsConversion - subset of the 'labels' object
 * @returns
 */
async function codicologicoYComposicion(
  metadata,
  pdfContent,
  headerText,
  simpleLabels,
  labelsConversion
) {
  pdfContent.content.push({
    text: headerText,
    style: "subheader",
  });

  for (let i = 0, n = metadata.length; i < n; i++) {
    if (simpleLabels.has(metadata[i].label)) {
      pdfContent = await simpleAdd(
        pdfContent,
        labelsConversion[metadata[i].label],
        metadata[i].value
      );
    } else {
      pdfContent = await columnsAdd(
        pdfContent,
        labelsConversion[metadata[i].label],
        cleanText(metadata[i].value)
      );
    }
  }

  // spacing
  pdfContent.content.push(" ");

  return pdfContent;
}

async function addHeader(pdfContent, sections) {
  pdfContent.content.push({
    text: sections.header.title,
    style: "header",
  });

  const scientificEditor = sections.metadata.group[0].items[0].value;
  const sourceEditor = sections.metadata.group[0].items[1]
    ? cleanText(sections.metadata.group[0].items[1].value).replace("\n", "")
    : "";
  const doi = sections.metadata.group[0].items[2]
    ? cleanText(sections.metadata.group[0].items[2].value).replace("\n", "")
    : "";

  pdfContent = await columnsAdd(
    pdfContent,
    "Editor científico",
    scientificEditor
  );

  if (sourceEditor !== "") {
    pdfContent = await columnsAdd(
      pdfContent,
      "Editor de la fuente",
      sourceEditor
    );
  }

  if (doi !== "") {
    pdfContent = await columnsAdd(pdfContent, "DOI", doi);
  }

  pdfContent.content.push(" ");

  return pdfContent;
}

async function addContent(opera) {
  // setup the pdf content
  let pdfContent = {
    content: [],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        color: "#5397c7",
      },
      subheader: {
        fontSize: 15,
        bold: true,
        color: "#5397c7",
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

  const { sections } = opera;

  pdfContent = await addHeader(pdfContent, sections);

  // The following async functions are used to add the content to the pdf.
  // The content is added in the order of the sections in the opera object.
  // Each function handles the section differently, therefore the need for separation.

  pdfContent = await biblioMain(
    sections["metadata-datos-bibliograficos"].group[0].items,
    pdfContent
  );

  pdfContent = await codicologicoYComposicion(
    sections["metadata-datos-codicologicos"].group[0].items,
    pdfContent,
    "Datos codicológicos",
    new Set([
      "phisical description",
      "analytics description",
      "manuscript characteristics",
    ]),
    labels.codicologico
  );

  pdfContent = await codicologicoYComposicion(
    sections["metadata-proceso-composicion"].group[0].items,
    pdfContent,
    "Proceso de composición - Redacción autógrafa",
    new Set(["first writing", "revisions", "revision marginalia"]),
    labels.composicion
  );

  pdfContent = await codicologicoYComposicion(
    sections["metadata-proceso-composicion-other"].group[0].items,
    pdfContent,
    "Proceso de composición - Intervenciones ajenas",
    new Set(["external intervention company", "deleted fragments"]),
    labels.composicion
  );

  pdfContent = await bibliografiaCitada(
    sections["collection-bibliografia-citada"].items,
    pdfContent
  );

  return pdfContent;
}

async function createPDFAuteso(req, res) {module.exports = createPDFAuteso;
  // get the opera from the server
  await fetch("https://theatheor-sls.netseven.it/get_resource", {
    method: "post",
    body: JSON.stringify({
      id: req.params.id,
      type: "work",
      sections: [
        "header",
        "metadata",
        "tab-bar",
        "metadata-datos-bibliograficos",
        "collection-bibliography",
        "metadata-datos-codicologicos",
        "metadata-proceso-composicion",
        "metadata-proceso-composicion-other",
        "collection-bibliografia-citada",
      ],
    }),
  })
    .then((response) => response.json())
    .then(async (opera) => {
      if (!opera.title) {
        res.status(404).send({
          status: 404,
          message: "Resource not found.",
        });
        return;
      }

      let pdfContent = await addContent(opera);

      // create the pdf and send it to the client
      createPdfBinary(
        pdfContent,
        function (binary) {
          res.contentType("application/pdf");
          // use the name of the opera as the name of the file
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=" +
              encodeURIComponent(
                "Obra - " + opera.sections.header.title + ".pdf"
              )
          );
          res.send(binary);
        }
      );
    })
    .catch(() => {
      res.status(404).send({
        status: 404,
        message: "Resource not found.",
      });
    });
}

export default createPDFAuteso;

