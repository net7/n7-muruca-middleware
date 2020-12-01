import Parser, { Input } from '../interfaces/parser';
export declare class TextViewerParser implements Parser {
    parse({ data }: Input): {
        endpoint: string;
        doc: {
            xml: string[];
            odd: string;
            id: string[];
        };
    };
}
