import Parser, { Input } from "../interfaces/parser";
export declare class TranslationParser implements Parser {
    parse({ data, options }: Input): {
        [x: string]: any;
    };
}
