export declare class XmlSearchParser {
    parseResponse(hit: any): any[];
    parseHighlight(element: any): any;
    applyHighlightsToXml(xmlContent: string, hlSnippet: string): string;
}
