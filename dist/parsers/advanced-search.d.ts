import Parser, { Input } from '../interfaces/parser';
export declare class AdvancedSearchParser implements Parser {
    apparatus: {
        key: string;
    };
    parse({ data, options }: Input): any[];
    advancedParseResultsItems({ data, options }: {
        data: any;
        options: any;
    }): Promise<any[]>;
    parseXmlTextHighlight(inn_hits: any, teiPublisherUri?: string, doc?: string): Promise<any[]>;
    getXmlPathBreadcrumbs(path: any): string;
    getXmlLastDivPath(path: any): string;
    getNodeXpath(path: any, last_el?: string): string;
}
