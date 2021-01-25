import { DataType } from '../interfaces/helper';
import Parser, { Input } from "../interfaces/parser";
import { SearchResultsData, SearchResultsItemData } from "../interfaces/parser-data/search";
export declare class AdvancedSearchParser implements Parser {
    parse({ data, options }: Input): any[];
    advancedParseResults({ data, options }: Input, addHighlight: any): SearchResultsData;
    advancedParseResultsItems({ data, options }: Input, addHighlight: any): SearchResultsItemData[];
    buildAdvancedQuery: (data: DataType, conf: any) => any;
}
