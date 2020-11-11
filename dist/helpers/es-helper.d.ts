import { DataType } from '../interfaces/helper';
import { SearchResponse } from 'elasticsearch';
export declare const ESHelper: {
    bulkIndex(response: string, index: string, Client: any, ELASTIC_URI: string): void;
    makeSearch(index: string, body: string, Client: any, ELASTIC_URI: string): Promise<SearchResponse<any>>;
    buildQuery(data: DataType, conf: any): any;
};
