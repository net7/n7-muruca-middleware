import { DataType } from '../interfaces/helper';
import { SearchResponse } from 'elasticsearch';
export declare const ESHelper: {
    bulkIndex(response: string, index: string, Client: any, ELASTIC_URI: string): void;
    makeSearch(index: string, body: string, Client: any, ELASTIC_URI: string): Promise<SearchResponse<any>>;
    buildQuery(data: DataType, conf: any, type: string): any;
    buildSortObj(conf: any, searchId: any, sort: any): any[];
    buildAggs(facets_request: any, query_facets: any): {};
    buildRanges(options: any): any[];
    buildAggsFilter(filterTerm: any, facet_conf: any): {
        bool: {
            must: any[];
            should: any[];
            filter: any[];
            must_not: any[];
        };
    };
    buildNested(terms: any, search: any, title: any, size?: any, filterTerm?: string, filterField?: string, extraFields?: any, minDocCount?: number, sort?: string): {
        nested: {
            path: any;
        };
        aggs: {};
    };
    buildTerm(term: any, size: any, extra?: any, sort?: string, global?: boolean, filterQuery?: any): {};
    distinctTerms(term: any): {
        cardinality: {
            field: any;
        };
    };
};
