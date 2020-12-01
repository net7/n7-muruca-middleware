/**
 * Interface for the Text Viewer component
 */
export interface TextViewerData {
    endpoint: string;
    doc: TextViewerDocument;
    facsimile?: TextViewerFacsimile;
}

export interface TextViewerDocument {
    xml: string[];
    odd: string;
    id: string[];
}

export interface TextViewerFacsimile {
    uri: string;
    scans: string[];
}