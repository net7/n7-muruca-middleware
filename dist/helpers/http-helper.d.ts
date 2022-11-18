import { HTTPHeaders, HTTPResponse } from "../interfaces/helper";
export declare const HttpHelper: {
    returnOkResponse(data: object | string, headerData?: HTTPHeaders): HTTPResponse;
    returnErrorResponse(message: string, code: number): HTTPResponse;
    doRequest(url: string): Promise<string>;
    doRequestNoJson(url: string): Promise<string>;
    doPostRequest(url: any, data: any): Promise<unknown>;
};
