import Parser, { Input } from '../interfaces/parser';
import { SearchResultsData } from '../interfaces/parser-data/search';
export declare class AdvancedSearchParser implements Parser {
    apparatus: {
        key: string;
    };
    parse({ data, options }: Input): any[];
    advancedParseResults({ data, options }: any): SearchResultsData;
    advancedParseResultsItems({ data, options }: {
        data: any;
        options: any;
    }): any[];
    parseXmlTextHighlight(hit: any): any[];
    getXmlPathBreadcrumbs(path: any): string;
}
