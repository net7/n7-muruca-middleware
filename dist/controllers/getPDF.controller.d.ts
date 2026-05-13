import { PDFGenerator } from "../services/pdf-generator/createPDF";
export declare class getPDFController {
    getPDF: (req: any, res: any, config?: any, labels?: any, resource?: any, generator?: PDFGenerator) => Promise<import("../interfaces/helper").HTTPResponse | {
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
