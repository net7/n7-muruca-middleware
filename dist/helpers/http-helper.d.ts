import { HTTPHeaders, HTTPResponse } from "../interfaces/helper";
export declare const HttpHelper: {
    returnOkResponse(data: string, headerData: HTTPHeaders): HTTPResponse;
    returnErrorResponse(message: string, code: number): HTTPResponse;
    doRequest(url: string): Promise<unknown>;
};
