import Parser, { Input, AggregationResult } from '../interfaces/parser';
import { SearchResultsData, SearchResultsItemData } from '../interfaces';
export declare abstract class SearchParser implements Parser {
    parse({ data, options }: Input, queryParams?: any): AggregationResult | SearchResultsData;
    protected searchResultsMetadata(source: any, field: any, label: any): any[];
    protected parseResults({ data, options }: Input, queryParams?: any): SearchResultsData;
    protected parseResultsItems({ data, options }: Input, queryParams?: any): SearchResultsItemData[];
    protected parseFacets({ data, options }: Input): AggregationResult;
    private createFacet;
    private addExtraArgsToFacet;
    private addRangeToFacet;
    private sortFacetValues;
    private getBucket;
    protected applyFacetFilter(facet: any): any;
    protected applyFacetResultsFilter(result: AggregationResult): AggregationResult;
}
