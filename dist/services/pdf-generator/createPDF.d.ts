declare function createPDF(req: any, res: any, config: any, labels: any): Promise<import("../../interfaces/helper").HTTPResponse | {
    statusCode: number;
    headers: {
        "Content-Type": string;
        "Content-Disposition": string;
    };
    body: unknown;
    isBase64Encoded: boolean;
}>;
export default createPDF;
