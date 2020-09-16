import Parser from "../interfaces/parser";
export declare class FooterParser implements Parser {
    parse(data: any, options?: {
        conf: {
            poweredby: boolean;
        };
    }): {
        columns: any[];
    };
}
