import Parser, { Input, AggregationResult, Bucket, OutputMetadataItem } from '../interfaces/parser';
import { SearchResultsData, SearchResultsItemData } from '../interfaces';
export declare class SearchParser implements Parser {
    parse({ data, options }: Input, queryParams?: any): AggregationResult | SearchResultsData;
    parseResults({ data, options }: Input, queryParams: any, type: any): SearchResultsData;
    parseResultsItems({ data, options }: Input, type: any, queryParams?: any): SearchResultsItemData[];
    parseResultsDefault(source: any, field: string): any;
    searchResultsMetadata(source: any, field: any): any[];
    filterResultsMetadata(field: string, metadataItem: OutputMetadataItem, source?: any): OutputMetadataItem;
    parseFacets({ data, options }: Input): AggregationResult;
    createFacet(bucket: Bucket, text: string, payload: string, queryFacet: any): {
        text: string;
        counter: number;
        payload: string;
    };
    addExtraArgsToFacet(facet: any, bucket: Bucket, extra?: any): void;
    addRangeToFacet(facet: any, bucket: Bucket, ranges?: any[]): void;
    sortFacetValues(values: any[], sortValues?: any): void;
    getBucket(data: any, docCount?: any, distinctDocCount?: any): any;
    applyFacetFilter(facet: any): any;
    applyFacetResultsFilter(result: AggregationResult): AggregationResult;
}
