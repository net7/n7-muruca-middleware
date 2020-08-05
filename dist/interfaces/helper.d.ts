/**
 * HTTP HELPER
 */
export interface HTTPHeaders {
    "Access-Control-Allow-Origin": string;
    "Access-Control-Allow-Credentials": boolean;
    "Access-Control-Allow-Methods": string;
    "Access-Control-Allow-Headers": string;
    "Content-Type"?: string;
}
export interface HTTPResponse {
    statusCode: number;
    headers: HTTPHeaders;
    body: string;
}
/**
 * ELASTICSEARCH HELPER
 */
export interface DataType {
    [x: string]: any[];
    query?: any;
    searchId?: any;
    sort?: any;
}
