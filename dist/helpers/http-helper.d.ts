declare const _default: {
    returnOkResponse(data: any, headerData: any): {
        statusCode: number;
        body: string;
    };
    returnErrorResponse(message: any, code: any): {
        statusCode: any;
        body: any;
    };
    doRequest(url: any): Promise<unknown>;
};
export default _default;
