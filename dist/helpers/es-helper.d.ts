import { DataType } from "../interfaces/helper";
export declare const ESHelper: {
    bulkIndex(response: string, index: string, Client: any, ELASTIC_URI: string): void;
    makeSearch(index: string, body: string, Client: any, ELASTIC_URI: string): Promise<unknown>;
    buildQuery(data: DataType, conf: any): any;
};
