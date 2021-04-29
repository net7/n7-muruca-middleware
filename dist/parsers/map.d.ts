import Parser, { Input } from "../interfaces/parser";
export declare class MapParser implements Parser {
    parse({ data }: Input): {
        dataSet: any[];
    };
}
