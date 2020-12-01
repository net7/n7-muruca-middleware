import Parser, { Input } from "../interfaces/parser";
export declare class TimelineParser implements Parser {
    parse({ data }: Input): {
        dataSet: any[];
    };
}
