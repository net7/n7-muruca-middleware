export default {
  _source: {
    node: "quote",
    quote: [
      {
        node: "quote",
        xml_text: "triginta argenteis",
        _refs: [
          {
            id: "origene-in.exod",
            author: "Origene",
            title: "In Exod.",
            label: "Origene, In Exod.",
          },
          {
            id: "ambrogio-ioseph",
            author: "Ambrogio",
            title: "Ioseph",
            label: "Ambrogio, Ioseph",
          },
        ],
      },
    ],
    xml_text: "Venditur ergo hismaelitis mercatoribus petentibus, <quote source=\"#origene-in.exod 1, 4, 14 | #ambrogio-ioseph 3, 14\">triginta argenteis</quote>",
    _refs: [
      {
        id: "gen",
        title: "Bibbia, Gen.",
        label: "Gen.",
      },
      {
        id: "flavio-ant.iud.",
        author: "Flavio Giuseppe",
        title: "Ant. iud.",
        label: "Flavio Giuseppe, Ant. iud.",
      },
    ],
  },
  highlight: {
    "xml_transcription_texts_json.quote.quote._refs.label.keyword": [
      "Ambrogio, Ioseph",
    ],
  }
}