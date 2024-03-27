import { ConfigResource } from "../../src/interfaces";

const editionConfigParseMetadata : ConfigResource = {

  metadata: {
    type: "metadata",
    fields: [
      "description",
      "creator",
      //"contributor",
      "subject",
      "alternative",
      "spatialCoverage",
      "temporalCoverage",
      "abstract",
      "linguaggio",
      "date",
      //"publisher",
      //"audience",
      //"available",
      //"provenance",
      "number",
      "numbers",
      "string",
      "strings",
      "object",
      "emptyCreator"
    ],
  },
};

export default editionConfigParseMetadata;

export const expectedResults =   {
  group: [
    {
      title: 'Metadata',
      items:  [
        { label: 'creator', value: 'Paul Valéry' },
        { label: 'subject', value: 'Filosofia, Testo' },
        { label: 'number', value: 23 },
        { label: 'numbers', value: [ 23, 45, 67 ] },
        { label: 'string', value: 'prova' },
        { label: 'strings', value: [ 'prova', 'array', 'di', 'stringhe' ] },
        { label: 'object', value: { foo: 'bar' } }
      ]
    }
  ]

}