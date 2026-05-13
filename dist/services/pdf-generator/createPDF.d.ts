import { PDFContent } from "../../interfaces/configurations/getPDF";
export declare class PDFGenerator {
    firstSection: boolean;
    afterTabTitle: boolean;
    protected separator(): {
        canvas: {
            type: string;
            x1: number;
            y1: number;
            x2: number;
            y2: number;
            lineWidth: number;
            lineColor: string;
        }[];
        margin: number[];
    };
    protected flatNestedSeparator(): {
        canvas: {
            type: string;
            x1: number;
            y1: number;
            x2: number;
            y2: number;
            lineWidth: number;
            lineColor: string;
        }[];
        margin: number[];
    };
    protected nestedSeparator(pdfContent: any): {
        canvas: {
            type: string;
            x1: number;
            y1: number;
            x2: number;
            y2: number;
            lineWidth: number;
            lineColor: string;
        }[];
        margin: number[];
    };
    protected getLabel(item: any, labels: any): any;
    protected addSpacing(pdfContent: any, top?: number): any;
    protected addSectionSpacing(pdfContent: PDFContent): PDFContent;
    addContent(resource: any, configurations: any, type: any, labels: any, locale?: string): Promise<PDFContent>;
    addTabTitle(label: string, pdfContent: PDFContent): PDFContent;
    addHeader(title: any, pdfContent: any): Promise<any>;
    addSubtitle(items: any, pdfContent: any, labels: any, pdfSectionConfig?: any): Promise<any>;
    addMetadata(items: any, pdfContent: any, labels: any, pdfSectionConfig?: any, locale?: string): Promise<any>;
    addImgViewer(imgViewer: any, pdfContent: any): Promise<any>;
    addIIIF(iiif: any, pdfContent: any): Promise<any>;
    addCollection(collection: any, pdfContent: any): Promise<any>;
    createPDF(req: any, res: any, config: any, labels: any, resource?: any): Promise<import("../../interfaces/helper").HTTPResponse | {
        statusCode: number;
        headers: {
            "Content-Type": string;
            "Content-Disposition": string;
        };
        body: unknown;
        isBase64Encoded: boolean;
    }>;
}
