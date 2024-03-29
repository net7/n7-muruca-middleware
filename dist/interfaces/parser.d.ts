export interface SearchOptions {
    results: {
        limit: number;
        offset: number;
    };
    keyOrder?: string[];
    searchId: string;
    searchGroup: any;
    conf: any;
    limit: number;
    offset: number;
    sort: string;
    total_count: number;
    type: string;
    facets: {
        id: string;
        limit: number;
        offset: number;
        query: string;
    }[];
}
export interface HomeOptions {
    conf: any;
    keyOrder?: string[];
}
export interface ResourceOptions {
    conf: any;
    type: string;
    page?: number;
}
export interface StaticPageOptions {
    slug?: string;
    type?: string;
}
export interface TranslationOptions {
    lang: string;
}
export interface Input {
    data: any;
    options?: HomeOptions | ResourceOptions | SearchOptions | StaticPageOptions | TranslationOptions;
    conf?: any;
}
export default interface Parser {
    parse: (input: Input, locale: String) => object;
    localeParse?: (input: any) => object;
}
export interface ParsedData {
    title?: string;
    sections?: {
        [key: string]: OutputHeader | OutputBreadcrumbs[] | OutputMetadata | OutputImageViewer | OutputCollection | OutputTextViewer | {};
    };
}
export interface OutputHeader {
    "title": string;
    "description"?: string;
}
export interface OutputBreadcrumbs {
    "link": string;
    "title": string;
}
export interface OutputMetadata {
    "group": OutputMetadataGroup[];
}
export interface OutputMetadataGroup {
    "title"?: string;
    "items": OutputMetadataItem[];
}
export interface OutputMetadataItem {
    "label": string;
    "value": string | Array<Array<OutputMetadataItem>>;
}
export interface OutputImageViewer {
    "images": OutputImageViewerItem[];
    "thumbs": string[];
}
export interface OutputImageViewerItem {
    "type": string;
    "url": string;
    "caption"?: string;
    "description"?: string;
}
export interface OutputCollection {
    "items": OutputCollectionItems[];
}
export interface OutputCollectionItems {
    "title": string;
    "link"?: string;
    "image"?: string;
    "text"?: string;
    "slug": string;
    "id": number;
    "routeId": string;
    "metadata"?: OutputMetadataGroup[];
}
export interface OutputBibliography {
    "items": OutputBibliographyItems[];
}
export interface OutputBibliographyItems {
    "payload": OutputBibliographyPayload;
    "text"?: string;
}
export interface OutputBibliographyPayload {
    "id": string;
    "type": string;
    "action"?: string;
}
export interface OutputTextViewer {
    "endpoint": string;
    "docs": OutputTextViewerDoc[];
}
export interface OutputTextViewerDoc {
    "xml": string;
    "odd": string;
    "id"?: string;
    "channel"?: string;
    "translation"?: boolean;
    "xpath"?: boolean;
    "view"?: string;
}
export interface OutputCollectionMap {
    "title": string;
    "slug": string;
    "text": string;
    "map-center": OutputMapCoordinates;
    "markers": string;
    "zoom": string;
}
export interface OutputMapCoordinates {
    "lng": string;
    "lat": string;
}
export interface AggregationResult {
    total_count: number;
    facets: {
        [key: string]: any;
    };
}
export interface Bucket {
    key: string;
    doc_count: number;
    from?: any;
    to?: any;
}
