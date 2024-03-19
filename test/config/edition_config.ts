import { ConfigResource } from "../../src/interfaces";

const editionConfig : ConfigResource = {
  title: {
    type: 'title',
    fields: ["title"]
  },
  header: {
    type: "header",
    fields: ["title"],
  },
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
    ],
  },
  "breadcrumb": {
    type: "breadcrumb",
    fields: ["breadcrumb"]
  },
  "image-viewer": {
    type: "image-viewer",
    fields: ["images"]
  },
  "collection-bibliography": {
    type: "bibliography",
    fields: ["bibliographicCitation"],
  },
  "text-viewer": {
    type: "text-viewer",
    field: "transcription",
  },
  "collection-referencedBy": {
    type: "collection",
    fields: ["isReferencedBy"]
  },
  "collection-isPartOf": {
    type: "collection",
    fields: ["isPartOf"]
  },
  "collection-references": {
    type: "collection",
    fields: ["references"]
  }
};

export default editionConfig;