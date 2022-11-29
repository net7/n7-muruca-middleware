import { SearchResultsData } from '../interfaces';
export declare class AdvancedSearchService {
    private configurations;
    constructor(configurations: any);
    parseResponse: (query_res: any, query_params: any, teiPublisherUri: any) => Promise<SearchResultsData>;
    extractXmlTextHl: (query_res: any) => any[];
    buildAdvancedQuery: (query_params: any) => any;
    buildXmlTextQuery(advanced_conf: any, data: any): {
        path: string;
        query: any;
    };
    buildSingleTextQuery(query_params: any, id: any, field?: string): void;
}
