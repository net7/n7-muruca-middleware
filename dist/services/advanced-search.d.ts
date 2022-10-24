export declare class AdvancedSearchService {
    private body;
    private configurations;
    constructor(body: any, configurations: any);
    parseResponse: (query_res: any) => import("..").SearchResultsData;
    buildAdvancedQuery: () => any;
    buildXmlTextQuery(advanced_conf: any, data: any): {
        path: string;
        query: any;
    };
}
