export const mockParallelTextViewer = {
  transcription: {
    filename: "petrarca/testo.xml",
    odd: "parallel_text",
    teipublisher: "https://teipublisher.petrarcaonline.it",
    view: "page",
    panels: {
      postille_xml : {
        filename: "petrarca/postille.xml",
        odd: "postille_odd",
        view:"page"
      },
      autorities_xml: {
        odd: "autorities_text",
        view:"page"
      },
      facsimile: {
        baseurl: "https://gallica.bnf.fr/iiif/ark:/12148/btv1b8438623f/"
      }
    }
  }
}