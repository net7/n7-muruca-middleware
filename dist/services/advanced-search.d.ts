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
    parseQueryGroups(search_groups: any, data: any, inner_hits: any): any[];
    buildGroupQuery(query_conf: any, data: any, groupId: any, inner_hits: any): any[];
    buildTextQuery(data: any, query_conf: any, groupId: any, inner_hits: any): any;
    buildSingleTextQuery(query_params: any, id: any, field?: string): void;
}
