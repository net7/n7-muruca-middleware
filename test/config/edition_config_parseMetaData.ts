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
        { label: 'creator', value: 'Paul Valéry', anchorId: 'creator' },
        { label: 'subject', value: 'Filosofia, Testo', anchorId: 'subject' },
        { label: 'number', value: 23, anchorId: 'number' },
        { label: 'numbers', value: [ 23, 45, 67 ], anchorId: 'numbers' },
        { label: 'string', value: 'prova', anchorId: 'string' },
        { label: 'strings', value: [ 'prova', 'array', 'di', 'stringhe' ], anchorId: 'strings' },
        { label: 'object', value: { foo: 'bar' }, anchorId: 'object' }
      ]
    }
  ]

}