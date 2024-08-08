export declare class getPDFController {
    getPDF: (req: any, res: any, config?: any, locale?: string, labels?: any) => Promise<import("../interfaces/helper").HTTPResponse | {
        statusCode: number;
        headers: {
            "Content-Type": string;
            "Content-Disposition": string;
        };
        body: unknown;
        isBase64Encoded: boolean;
    }>;
    getLabels: (req: any, res: any, config?: any, locale?: string) => Promise<any>;
}
