import Parser, { Input } from "../interfaces/parser";
import { SearchResultsData } from "../interfaces/parser-data/search";
export declare class SearchParser implements Parser {
    [x: string]: any;
    parse({ data, options }: Input): any;
    protected parseResults({ data, options }: Input): SearchResultsData;
    protected parseFacets({ data, options }: Input): any;
}
