import { DataType } from '../interfaces/helper';
import Parser, { Input } from "../interfaces/parser";
import { SearchResultsData } from "../interfaces/parser-data/search";
export declare class AdvancedSearchParser implements Parser {
    parse({ data, options }: Input): any[];
    advancedParseResults({ data, options }: any): SearchResultsData;
    advancedParseResultsItems({ data, options }: {
        data: any;
        options: any;
    }): any[];
    buildTextViewerQuery: (data: DataType, conf: any, doc: any) => any;
    buildAdvancedQuery: (data: DataType, conf: any) => any;
}
