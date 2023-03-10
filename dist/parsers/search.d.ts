import Parser, { Input } from "../interfaces/parser";
import { SearchResultsData, SearchResultsItemData } from "../interfaces/parser-data/search";
export declare abstract class SearchParser implements Parser {
    parse({ data, options }: Input, queryParams?: any): any;
    protected abstract parseResultsItems({ data, options }: Input, queryParams?: any): SearchResultsItemData[];
    protected searchResultsMetadata(source: any, field: any, label: any): any[];
    protected parseResults({ data, options }: Input, queryParams?: any): SearchResultsData;
    protected parseFacets({ data, options }: Input): any;
}
