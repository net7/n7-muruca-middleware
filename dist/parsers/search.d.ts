import Parser, { Input, AggregationResult, Bucket, OutputMetadataItem } from '../interfaces/parser';
import { SearchResultsData, SearchResultsItemData } from '../interfaces';
export declare abstract class SearchParser implements Parser {
    parse({ data, options }: Input, queryParams?: any): AggregationResult | SearchResultsData;
    protected parseResults({ data, options }: Input, queryParams: any, type: any): SearchResultsData;
    protected parseResultsItems({ data, options }: Input, type: any, queryParams?: any): SearchResultsItemData[];
    protected parseResultsDefault(source: any, field: string): any;
    protected searchResultsMetadata(source: any, field: any, label: any, type: any): any[];
    protected filterResultsMetadata(field: string, metadataItem: OutputMetadataItem, source?: any): OutputMetadataItem;
    protected parseFacets({ data, options }: Input): AggregationResult;
    private createFacet;
    private addExtraArgsToFacet;
    addRangeToFacet(facet: any, bucket: Bucket, ranges?: any[]): void;
    private sortFacetValues;
    private getBucket;
    protected applyFacetFilter(facet: any): any;
    protected applyFacetResultsFilter(result: AggregationResult): AggregationResult;
}
