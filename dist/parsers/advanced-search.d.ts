import Parser, { Input } from '../interfaces/parser';
export declare class AdvancedSearchParser implements Parser {
    apparatus: {
        key: string;
    };
    text_separator: string;
    parse({ data, options }: Input): any[];
    advancedParseResultsItems({ data, options }: {
        data: any;
        options: any;
    }): Promise<any[]>;
    /**
     * Parse Hits of a document
     * @param inn_hits
     * @param teiPublisherUri
     * @param doc
     * @returns
     */
    parseXmlTextHighlight(inn_hits: any, teiPublisherUri?: string, doc?: string): Promise<any[]>;
    buildFinalHighlightSnippet(el: any): string;
    getTeipublisherNodesRoot(teiPublisherUri: any, doc: any, xpaths: any): Promise<any>;
    /**
     *
     * @param inn_hits inner hits object from ES query. It contains matches for paragraph or other substructures
     * @returns Object with propertites TotCount and matches grouped for div
     */
    buildHighlightObj(inn_hits: any): {
        totCount: number;
        highlights_obj: {};
    };
    parseHighlightNode(hit: any): any[];
    getNodeBreadcrumb(path: any): string;
    parseHighlights(hit: any): any[];
    mergeUniqueSnippets(unique_hl: {
        xml_text: any[];
        attr: any[];
        refs: any[];
    }): any[];
    parseReferences(refs: any): string;
    getXmlPathBreadcrumbs(path: any): string;
    getXmlLastDivPath(path: any): string;
    getNodeXpath(path: any, last_el?: string): string;
    parseAttributeHighlight(hit: any, prop: any): any[];
}
