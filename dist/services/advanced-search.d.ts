import { DataType } from '../interfaces/helper';
export declare class AdvancedSearchService {
    runAdvancedSearch: (body: DataType, conf: any, locale: string) => Promise<import("..").SearchResultsData>;
    buildAdvancedQuery: (data: DataType, conf: any) => any;
    buildXmlTextQuery(advanced_conf: any, data: any): {
        path: string;
        query: any;
    };
}
