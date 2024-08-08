import { cleanText, columnsAdd, createPdfBinary, getTextObject, listAdd, simpleAdd } from "./common";


const labels = {
  title: "Título",
  authorship: "Autoría",
  part: "Parte",
  notes_datos_bibliografico: "Notas",
  type: "Tipo",
  location: "Loc.",
  notes: "Notas",
  bibliographicReference: "Ref.",
  bibliographic_reference: "Ref.",
  url: "URL",
  collection: "Colección",
  suelta: "Suelta",
  edition: "Colección",
  author: "Autor",
  language: "Lengua",
  authors: "Autor",
  sinossi: "Sinopsis argumental",
  proposalNotes: "Notas",
  computableCharacters: "Personajes computables",
  notComputableCharacters: "Personajes no computables",
  data: "Fecha",
  numberOfVerses: "N. de versos",
  metric: "Forma métrica",
  verses: "Versos",
  manuscripts: "Manuscrito/s",
  oldEditions: "Otras ediciones del siglo XVII y XVIII",
  collections: "Colecciones modernas (desde el siglo XIX)",
  editions: "Ediciones singulares modernas",
  refunds: "Refundiciones, adaptaciones, arreglos, traducciones",
  secondaryBibliographies: "Bibliografía secundaria",
  socialUniverse: "Universo Social",
  period: "Periodo",
  chronologicalSettings: "Ambientación cronológica",
  dramaticSpaceFirstDay: "Espacios dramáticos I jornada",
  dramaticSpaceSecondDay: "Espacios dramáticos II jornada",
  dramaticSpaceThirdDay: "Espacios dramáticos III jornada",
  muruca_work_first_day_toponym: "Topónimo",
  muruca_work_second_day_toponym: "Topónimo",
  muruca_work_third_day_toponym: "Topónimo",
  muruca_work_first_day_space: "Espacio",
  muruca_work_second_day_space: "Espacio",
  muruca_work_third_day_space: "Espacio",
  durationFirstActPeriod: "I acto",
  durationFirstSecondPeriod: "Entreacto I-II",
  durationSecondActPeriod: "II acto",
  durationSecondThirdPeriod: "Entreacto II-III",
  durationThirdActPeriod: "III acto",
  durationFirstActNote: "Notas I acto",
  durationFirstSecondNote: "Entreacto I-II notas",
  durationSecondActNote: "Notas II acto",
  durationSecondThirdNote: "Entreacto II-III notas",
  durationThirdActNote: "Notas III acto",
  primaryProposal: "Propuesta de adscripción genérica",
  secondaryProposal: "Propuesta de adscripción genérica (secundaria)",
};

/**
 * Add the content of the nested collections to the pdfContent object.
 * @param {object} pdfContent
 * @param {object} metadata
 * @param {string[]} keys
 * @param {string[]} collectionTypes
 * @returns {object} - the pdfContent object with the nested collections added
 */
async function nestedCollections(pdfContent, metadata, keys, collectionTypes) {
  for (const collection of collectionTypes) {
    pdfContent.content.push({
      text: labels[collection],
      bold: true,
      margin: [0, 10, 0, 0],
      color: "#cb5432",
    });
    for (let i = 0, n = metadata[collection].length; i < n; i++) {
      for (const key of keys) {
        if (
          key in metadata[collection][i] &&
          metadata[collection][i][key] !== ""
        ) {
          pdfContent = await columnsAdd(
            pdfContent,
            labels[key],
            metadata[collection][i][key],
            [10, 3],
            key === "url"
          );
        }
      }
      if (i < n - 1) {
        // divider image
        pdfContent.content.push({
          image:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyAAAAAKCAQAAADmpvIuAAAAMElEQVR42u3BQQEAMAgEoIuy/iUWwUp28KlAAAAAAAAAYOSl1NV/AAAAAAAAAIC7GtqVk53qw1CjAAAAAElFTkSuQmCC",
          alignment: "center",
          margin: [0, 0, 38, 0],
        });
      }
    }
  }

  return pdfContent;
}

async function biblioMain(metadata, pdfContent) {
  pdfContent.content.push({
    text: "Datos bibliográficos",
    style: "subheader",
  });

  pdfContent = await columnsAdd(pdfContent, labels.title, metadata.title);
  pdfContent = await columnsAdd(
    pdfContent,
    labels.authorship,
    metadata.authorship
  );

  pdfContent.content.push({
    text: "Parte",
    bold: true,
    margin: [0, 3, 0, 0],
  });
  pdfContent.content.push(await getTextObject(metadata.parts.part, pdfContent));
  pdfContent.content.push(
    await getTextObject(metadata.parts.description, pdfContent)
  );
  pdfContent.content.push({
    text: metadata.parts.url_parte,
    link: metadata.parts.url_parte,
  });

  pdfContent = await simpleAdd(
    pdfContent,
    labels.notes_datos_bibliografico,
    metadata.notes_datos_bibliografico
  );

  let keys = [
    "title",
    "authors",
    "language",
    "collection",
    "edition",
    "attribution",
    "suelta",
    "location",
    "notes",
    "bibliographicReference",
    "bibliographic_reference",
    "type",
    "url",
  ];

  let collectionTypes = [
    "manuscripts",
    "oldEditions",
    "collections",
    "editions",
    "refunds",
    "secondaryBibliographies",
  ];

  pdfContent = await nestedCollections(
    pdfContent,
    metadata,
    keys,
    collectionTypes
  );

  // spacing
  pdfContent.content.push(" ");

  return pdfContent;
}

async function fechaComputoEstrofas(metadata, pdfContent) {
  pdfContent.content.push({
    text: "Fecha, cómputo de versos y estrofas",
    style: "subheader",
  });

  pdfContent = await columnsAdd(pdfContent, labels.data, metadata.data);
  pdfContent = await columnsAdd(pdfContent, labels.notes, metadata.notes);

  pdfContent.content.push({
    text: "Cómputo métrico",
    bold: true,
    margin: [0, 10, 0, 0],
    color: "#cb5432",
  });
  pdfContent = await columnsAdd(
    pdfContent,
    labels.numberOfVerses,
    metadata.numberOfVerses
  );

  let keys = ["metric", "verses", "notes"];
  for (let i = 0, n = metadata.metricComposition.length; i < n; i++) {
    for (const key of keys) {
      pdfContent = await columnsAdd(
        pdfContent,
        labels[key],
        metadata.metricComposition[i][key],
        [10, 3]
      );
    }
    if (i < n - 1) {
      pdfContent.content.push({
        image:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyAAAAAKCAQAAADmpvIuAAAAMElEQVR42u3BQQEAMAgEoIuy/iUWwUp28KlAAAAAAAAAYOSl1NV/AAAAAAAAAIC7GtqVk53qw1CjAAAAAElFTkSuQmCC",
        alignment: "center",
        margin: [0, 0, 38, 0],
      });
    }
  }

  // spacing
  pdfContent.content.push(" ");

  return pdfContent;
}

async function personajesEspacioTiempo(metadata, pdfContent) {
  pdfContent.content.push({
    text: "Personajes, espacio y tiempo",
    style: "subheader",
  });

  pdfContent = await simpleAdd(
    pdfContent,
    labels.computableCharacters,
    metadata.computableCharacters
  );
  pdfContent = await simpleAdd(
    pdfContent,
    labels.notComputableCharacters,
    metadata.notComputableCharacters.join("\n")
  );
  pdfContent = await simpleAdd(
    pdfContent,
    labels.socialUniverse,
    metadata.socialUniverse.join("\n")
  );

  let subSections = [
    "chronologicalSettings",
    "dramaticSpaceFirstDay",
    "dramaticSpaceSecondDay",
    "dramaticSpaceThirdDay",
  ];

  let keysSubSections = [
    "period",
    "notes",
    "muruca_work_first_day_toponym",
    "muruca_work_second_day_toponym",
    "muruca_work_third_day_toponym",
    "muruca_work_first_day_space",
    "muruca_work_second_day_space",
    "muruca_work_third_day_space",
  ];

  pdfContent = await nestedCollections(
    pdfContent,
    metadata,
    keysSubSections,
    subSections
  );

  pdfContent.content.push({
    text: "Duración de la acción",
    bold: true,
    margin: [0, 10, 0, 0],
    color: "#cb5432",
  });
  pdfContent.content.push(
    `${metadata.durationDuration} ${metadata.durationWork}`
  );
  pdfContent.content.push(cleanText(metadata.durationWorkNote));

  let keys = [
    "durationFirstActPeriod",
    "durationFirstActNote",
    "durationFirstSecondPeriod",
    "durationFirstSecondNote",
    "durationSecondActPeriod",
    "durationSecondActNote",
    "durationSecondThirdPeriod",
    "durationSecondThirdNote",
    "durationThirdActPeriod",
    "durationThirdActNote",
  ];
  for (let i = 0, n = keys.length; i < n; i += 2) {
    let key = keys[i];
    pdfContent = await columnsAdd(
      pdfContent,
      labels[key],
      metadata[key],
      [0, 3]
    );
    pdfContent = await simpleAdd(
      pdfContent,
      labels[keys[i + 1]],
      metadata[keys[i + 1]]
    );
  }

  // spacing
  pdfContent.content.push(" ");

  return pdfContent;
}

async function generoSinopsis(metadata, pdfContent) {
  pdfContent.content.push({
    text: "Género y sinopsis",
    style: "subheader",
  });

  pdfContent = listAdd(
    pdfContent,
    labels.primaryProposal,
    metadata.primaryProposal
  );
  pdfContent = listAdd(
    pdfContent,
    labels.secondaryProposal,
    metadata.secondaryProposal
  );

  pdfContent = await simpleAdd(
    pdfContent,
    labels.proposalNotes,
    metadata.proposalNotes
  );

  pdfContent = await simpleAdd(pdfContent, labels.sinossi, metadata.sinossi);

  return pdfContent;
}

function addHeader(pdfContent, motive) {
  pdfContent.content.push({
    text: motive.title,
    style: "header",
  });

  const doi = cleanText(motive.doi);

  let link = motive.doi.match(/href='([^']*)/);

  if (link) {
    pdfContent.content.push({ text: doi, link: link[1], margin: [0, 3] });
  } else {
    pdfContent.content.push({ text: doi, margin: [0, 3] });
  }

  pdfContent.content.push(" ");

  return pdfContent;
}

async function addContent(motive) {
  // setup the pdf content
  let pdfContent = {
    content: [],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        color: "#cb5432",
      },
      subheader: {
        fontSize: 15,
        bold: true,
        color: "#cb5432",
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

  pdfContent = addHeader(pdfContent, motive);

  pdfContent = await biblioMain(motive, pdfContent);

  pdfContent = await fechaComputoEstrofas(motive, pdfContent);

  pdfContent = await personajesEspacioTiempo(motive, pdfContent);

  pdfContent = await generoSinopsis(motive, pdfContent);

  return pdfContent;
}

// async function createPDFCalderon(req, res) {
//   // get the opera from the server
//   await fetch(
//     "https://admin.calderondigital.tespasiglodeoro.it/wp-json/v1/works/" +
//       req.params.id
//   )
//     .then((response) => response.json())
//     .then(async (motive) => {
//       if (motive.error) {
//         res.status(404).send({
//           status: 404,
//           message: motive.error,
//         });
//         return;
//       }

//       let pdfContent = await addContent(motive);

//       // create the pdf and send it to the client
//       createPdfBinary(
//         pdfContent,
//         function (binary) {
//           res.contentType("application/pdf");
//           // use the name of the motive as the name of the file
//           res.setHeader(
//             "Content-Disposition",
//             "attachment; filename=" +
//               encodeURIComponent("Motivo - " + motive.title + ".pdf")
//           );
//           res.send(binary);
//         }
//       );
//     })
//     .catch(() => {
//       res.status(404).send({
//         status: 404,
//         message: "Resource not found.",
//       });
//     });
// }

// export default createPDFCalderon;