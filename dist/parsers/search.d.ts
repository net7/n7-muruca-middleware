import Parser, { Input } from "../interfaces/parser";
import { SearchResultsData, SearchResultsItemData } from "../interfaces/parser-data/search";
export declare class SearchParser implements Parser {
    parse({ data, options }: Input): any;
    protected parseResults({ data, options }: Input): SearchResultsData;
    protected parseFacets({ data, options }: Input): any;
    protected parseResultsItems(_a: any, _b: any): SearchResultsItemData[];
}
