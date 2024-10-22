import { testDocument } from './test-document';

export const testSearchBodies = {
  textSimple: {
    body: {
      "mrc_post_type": "work",
      "query-text": "triginta argenteis",
      "query-text-authority": "1",
      "searchId": "advanced_search",
      "results": { "limit": 12, "offset": 0, "sort": "sort_ASC" }
    },
    expectedResponse: {
      "limit": 12,
      "offset": 0,
      "sort": "sort_ASC",
      "total_count": 1,
      "results": [
        {
          "highlights": [
            {
              "link": {
                "absolute": "/testo/140/test-quote-in-quote?",
                "query_string": false
              },
              "xpath": "tei:text/tei:body[1]/tei:div[1]",
              "text": "<span class='mrc__text-breadcrumbs'>libro I</span> 11 <quote source=\"#gen 37, 28 | #flavio-ant.iud. 2, 33\">Venditur ergo  hismaelitis mercatoribus petentibus, \n           <quote source=\"#origene-in.exod 1, 4, 14 | #ambrogio-ioseph 3, 14\"><em class='mrc__text-emph'>triginta</em>\n            <em class='mrc__text-emph'>argenteis</em></quote></quote>: o exiguum precium magni viri, sed maioris imago pari precio\n          vendendi! 12 <quote source=\"#gen 39, 1-4\">Delatus in <name type=\"place\" key=\"Egitto\">Egiptum</name> venalisque iterum, emptus est ab eunucho regio, qui dux exercitus et\n            militie<span class=\"mrc__text-divider\"></span> magister erat. Sed nec ipse sui immemor nec divine opis expers sua servitus\n            fuit: in oculis domini sui incredibilem invenit gratiam, ita ut illum domui sue totique\n            familie preficeret</quote>. 13 In uno gratiosior fuit, VENDITUR ERGO quam <em class='mrc__text-emph'>TRIGINTA</em> <em class='mrc__text-emph'>ARGENTEIS</em> preter virtutis experimentum\n\t\t\t<quote source=\"#petrarca-fam 1, 1\">Olim <name type=\"person\" key=\"Ludwig van Kempen (Socrate)\">Socrati</name> Venditur ergo meo scribens\n                            questus eram quod etatis"
            }
          ],
          "highlightsTitle": "Occorrenze: 2",
          "tei_doc": "playground/test_index_quote_in_quote_1729252599.xml",
          "title": "test quote in quote",
          "risorsa": "work",
          "metadata": [
            {
              "items": [
                {
                  "label": "sezione",
                  "value": "work"
                }
              ]
            }
          ],
          "type": "work",
          "routeId": "work",
          "slug": "test-quote-in-quote",
          "id": 140
        }
      ]
    }
  },
  quoteSimple: {
    body: {
      "mrc_post_type": "work",
      "query-text-authority": "1",
      "query-bibl": "hismaelitis mercatoribus",
      "searchId": "advanced_search",
      "results": { "limit": 12, "offset": 0, "sort": "sort_ASC" }
    },
    expectedResponse: {
      "limit": 12,
      "offset": 0,
      "sort": "sort_ASC",
      "total_count": 1,
      "results": [
        {
          "highlights": [
            {
              "link": {
                "absolute": "/testo/140/test-quote-in-quote?",
                "query_string": false
              },
              "xpath": "tei:text/tei:body[1]/tei:div[1]",
              "text": "<span class='mrc__text-breadcrumbs'>libro I</span> <span class='mrc__text-attr_value'>Bibbia, Gen.; Flavio Giuseppe, Ant. iud.</span> Venditur ergo  <em class='mrc__text-emph'>hismaelitis</em> <em class='mrc__text-emph'>mercatoribus</em> petentibus, \n           <quote source=\"#origene-in.exod 1, 4, 14 | #ambrogio-ioseph 3, 14\">triginta\n            argenteis</quote>"
            }
          ],
          "highlightsTitle": "Occorrenze: 1",
          "tei_doc": "playground/test_index_quote_in_quote_1729612003.xml",
          "title": "test quote in quote",
          "risorsa": "work",
          "metadata": [
            {
              "items": [
                {
                  "label": "sezione",
                  "value": "work"
                }
              ]
            }
          ],
          "type": "work",
          "routeId": "work",
          "slug": "test-quote-in-quote",
          "id": 140
        }
      ]
    }
  },
  quoteInQuote: {
    body: {
      "mrc_post_type": "work",
      "query-text-authority": "1",
      "query-bibl": "triginta argenteis",
      "searchId": "advanced_search",
      "results": { "limit": 12, "offset": 0, "sort": "sort_ASC" }
    },
    expectedResponse: {
      "limit": 12,
      "offset": 0,
      "sort": "sort_ASC",
      "total_count": 1,
      "results": [
        {
          "highlights": [
            {
              "link": {
                "absolute": "/testo/140/test-quote-in-quote?",
                "query_string": false
              },
              "xpath": "tei:text/tei:body[1]/tei:div[1]",
              "text": "<span class='mrc__text-breadcrumbs'>libro I</span> <span class='mrc__text-attr_value'>Bibbia, Gen.; Flavio Giuseppe, Ant. iud.</span> Venditur ergo  hismaelitis mercatoribus petentibus, \n           <quote source=\"#origene-in.exod 1, 4, 14 | #ambrogio-ioseph 3, 14\"><em class='mrc__text-emph'>triginta</em>\n            <em class='mrc__text-emph'>argenteis</em></quote>"
            }
          ],
          "highlightsTitle": "Occorrenze: 1",
          "tei_doc": "playground/test_index_quote_in_quote_1729612003.xml",
          "title": "test quote in quote",
          "risorsa": "work",
          "metadata": [
            {
              "items": [
                {
                  "label": "sezione",
                  "value": "work"
                }
              ]
            }
          ],
          "type": "work",
          "routeId": "work",
          "slug": "test-quote-in-quote",
          "id": 140
        }
      ]
    }
  },
  quoteInBetweenQuote: {
    body: {
      "mrc_post_type": "work",
      "query-text-authority": "1",
      "query-bibl": "hismaelitis triginta",
      "searchId": "advanced_search",
      "results": { "limit": 12, "offset": 0, "sort": "sort_ASC" }
    },
    expectedResponse: {
      "limit": 12,
      "offset": 0,
      "sort": "sort_ASC",
      "total_count": 1,
      "results": [
        {
          "highlights": [
            {
              "link": {
                "absolute": "/testo/140/test-quote-in-quote?",
                "query_string": false
              },
              "xpath": "tei:text/tei:body[1]/tei:div[1]",
              "text": "<span class='mrc__text-breadcrumbs'>libro I</span> <span class='mrc__text-attr_value'>Bibbia, Gen.; Flavio Giuseppe, Ant. iud.</span> Venditur ergo  <em class='mrc__text-emph'>hismaelitis</em> mercatoribus petentibus, \n           <quote source=\"#origene-in.exod 1, 4, 14 | #ambrogio-ioseph 3, 14\"><em class='mrc__text-emph'>triginta</em>\n            argenteis</quote>"
            }
          ],
          "highlightsTitle": "Occorrenze: 1",
          "tei_doc": "playground/test_index_quote_in_quote_1729612003.xml",
          "title": "test quote in quote",
          "risorsa": "work",
          "metadata": [
            {
              "items": [
                {
                  "label": "sezione",
                  "value": "work"
                }
              ]
            }
          ],
          "type": "work",
          "routeId": "work",
          "slug": "test-quote-in-quote",
          "id": 140
        }
      ]
    }
  },
  multipleQuotes: {
    body: {
      "mrc_post_type": "work",
      "query-text-authority": "1",
      "query-bibl": "Venditur ergo",
      "searchId": "advanced_search",
      "results": { "limit": 12, "offset": 0, "sort": "sort_ASC" }
    },
    expectedResponse: {
      "limit": 12,
      "offset": 0,
      "sort": "sort_ASC",
      "total_count": 1,
      "results": [
        {
          "highlights": [
            {
              "link": {
                "absolute": "/testo/140/test-quote-in-quote?",
                "query_string": false
              },
              "xpath": "tei:text/tei:body[1]/tei:div[1]",
              "text": "<span class='mrc__text-breadcrumbs'>libro I</span> <span class='mrc__text-attr_value'>Bibbia, Gen.; Flavio Giuseppe, Ant. iud.</span> <em class='mrc__text-emph'>Venditur</em> <em class='mrc__text-emph'>ergo</em>  hismaelitis mercatoribus petentibus, \n           <quote source=\"#origene-in.exod 1, 4, 14 | #ambrogio-ioseph 3, 14\">triginta\n            argenteis</quote><span class=\"mrc__text-divider\"></span><span class='mrc__text-attr_value'>Petrarca, Fam.</span> Olim <name type=\"person\" key=\"Ludwig van Kempen (Socrate)\">Socrati</name> <em class='mrc__text-emph'>Venditur</em> <em class='mrc__text-emph'>ergo</em> meo scribens\n                            questus eram quod etatis huius annus ille post millesimum trecentesimum\n                            quadragesimus octavus omnibus me prope solatiis vite amicorum mortibus\n                            spoliasset"
            }
          ],
          "highlightsTitle": "Occorrenze: 2",
          "tei_doc": "playground/test_index_quote_in_quote_1729612003.xml",
          "title": "test quote in quote",
          "risorsa": "work",
          "metadata": [
            {
              "items": [
                {
                  "label": "sezione",
                  "value": "work"
                }
              ]
            }
          ],
          "type": "work",
          "routeId": "work",
          "slug": "test-quote-in-quote",
          "id": 140
        }
      ]
    }
  },
  quoteInSource: {
    body: {
      "mrc_post_type": "work",
      "mrc_work_mrc_tei_bibliography": "Bibbia, Gen.",
      "query-bibl": "Venditur ergo",
      "query-text-authority": "1",
      "results": {
        "limit": 12,
        "offset": 0,
        "sort": "sort_ASC"
      },
      "searchId": "advanced_search"
    },
    expectedResponse: {
      "limit": 12,
      "offset": 0,
      "sort": "sort_ASC",
      "total_count": 1,
      "results": [
        {
          "highlights": [
            {
              "link": {
                "absolute": "/testo/140/test-quote-in-quote?",
                "query_string": false
              },
              "xpath": "tei:text/tei:body[1]/tei:div[1]",
              "text": "<span class='mrc__text-breadcrumbs'>libro I</span> <span class='mrc__text-attr_value'>Bibbia, Gen.; Flavio Giuseppe, Ant. iud.</span> <em class='mrc__text-emph'>Venditur</em> <em class='mrc__text-emph'>ergo</em>  hismaelitis mercatoribus petentibus, \n           <quote source=\"#origene-in.exod 1, 4, 14 | #ambrogio-ioseph 3, 14\">triginta\n            argenteis</quote>"
            }
          ],
          "highlightsTitle": "Occorrenze: 1",
          "tei_doc": "playground/test_index_quote_in_quote_1729612003.xml",
          "title": "test quote in quote",
          "risorsa": "work",
          "metadata": [
            {
              "items": [
                {
                  "label": "sezione",
                  "value": "work"
                }
              ]
            }
          ],
          "type": "work",
          "routeId": "work",
          "slug": "test-quote-in-quote",
          "id": 140
        }
      ]
    }
  },
  quotesInSource: {
    body: {
      "mrc_post_type": "work",
      "mrc_work_mrc_tei_bibliography": "Bibbia, Gen.",
      "query-text-authority": "1",
      "results": {
        "limit": 12,
        "offset": 0,
        "sort": "sort_ASC"
      },
      "searchId": "advanced_search"
    },
    expectedResponse: {
      "limit": 12,
      "offset": 0,
      "sort": "sort_ASC",
      "total_count": 1,
      "results": [
        {
          "highlights": [
            {
              "link": {
                "absolute": "/testo/140/test-quote-in-quote?",
                "query_string": false
              },
              "xpath": "tei:text/tei:body[1]/tei:div[1]",
              "text": "<span class='mrc__text-breadcrumbs'>libro I</span> <span class='mrc__text-attr_value'>Bibbia, Gen.; Flavio Giuseppe, Ant. iud.</span> Venditur ergo  hismaelitis mercatoribus petentibus, \n           triginta\n            argenteis<span class=\"mrc__text-divider\"></span><span class='mrc__text-attr_value'>Bibbia, Gen.</span> Delatus in Egiptum venalisque iterum, emptus est ab eunucho regio, qui dux exercitus et\n            militie magister erat. Sed nec ipse sui immemor nec divine opis expers sua servitus\n            fuit: in oculis domini sui incredibilem invenit gratiam, ita ut illum domui sue totique\n            familie preficeret<span class=\"mrc__text-divider\"></span><span class='mrc__text-attr_value'>Bibbia, Gen.; Flavio Giuseppe, Ant. iud.</span> uxor forme dulcedine capitur; erat\n            enim minime servili habitu, sed vultu insignis et etate florens et ingenuo suavis\n            aspectu. 14 Itaque cecis flammis inardescens mulier, quas etas,\n            otium, delitie et servi sui species et spadonis mariti satietas excitarent, non diu lesi\n            animi vulnus occuluit; quin amorem fassa integerrimi adolescentis amplexus petit. 15 Negat ille et, castitatis et fidei non oblitus, utriusque\n            clarissimum fit exemplum. 16 Illa cum sepe retentatis precibus\n            nil ageret, nequid intentatum linqueret, ad extremum vi manuque consensum extorquere\n            meditata est. 17 Igitur solum nacta secreta domus in parte,\n            improvisum arripit immiscetque vim precibus. Ille perhorrescens facinus animumque et\n            corpus intactum auferens, relicto pallio cuius oram impudica manus apprehenderat, abiit.\n              18 Mulier prefervida, se delusam cernens et contemptam rata,\n            muliebri desiderio vindicte mestitiaque repulse et pudore ac furiis animum\n            exagitantibus, amorem subito in odium vertit: questa familie, questa viro quod servus\n            hebreus genialem thalamum introgressus pudicitiam sibi paulominus extorsisset. Aderat et\n            ficto crimini astipulabatur pallium, quod clamore eius exterritum reliquisse illum\n            affirmabat"
            }
          ],
          "highlightsTitle": "Occorrenze: 3",
          "tei_doc": "playground/test_index_quote_in_quote_1729612003.xml",
          "title": "test quote in quote",
          "risorsa": "work",
          "metadata": [
            {
              "items": [
                {
                  "label": "sezione",
                  "value": "work"
                }
              ]
            }
          ],
          "type": "work",
          "routeId": "work",
          "slug": "test-quote-in-quote",
          "id": 140
        }
      ]
    }
  },
  invalidSearch: {
    body: {
      // Aggiungi qui un corpo di ricerca non valido
    },
    expectedResponse: {
      error: "error"
    }
  }
};
