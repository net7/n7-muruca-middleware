import { ConfigResource } from "../../src/interfaces";

const editionConfig : ConfigResource = {

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

export default editionConfig;