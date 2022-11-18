export declare class AdvancedSearchService {
    private configurations;
    constructor(configurations: any);
    parseResponse: (query_res: any, query_params: any) => import("..").SearchResultsData;
    extractXmlTextHl: (query_res: any) => any[];
    buildAdvancedQuery: (query_params: any) => any;
    buildXmlTextQuery(advanced_conf: any, data: any): {
        path: string;
        query: any;
    };
    buildSingleTextQuery(query_params: any, id: any, field?: string): void;
}
