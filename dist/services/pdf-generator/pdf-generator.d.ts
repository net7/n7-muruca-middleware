import { PDFGenerator } from "./createPDF";
export declare class GetPDFService {
    createPDF: (req: any, res: any, config: any, labels: any, resource?: any, generator?: PDFGenerator) => Promise<import("../../interfaces/helper").HTTPResponse | {
        statusCode: number;
        headers: {
            "Content-Type": string;
            "Content-Disposition": string;
        };
        body: unknown;
        isBase64Encoded: boolean;
    }>;
}
