import Parser, { Input } from "../interfaces/parser";
import { ParsedData } from "../interfaces/parser-data/resource";
export default class ResourceParser implements Parser {
    parse({ data, options }: Input): ParsedData;
    /**
     * Data filters
     */
    filter(data: any, field: string): any[] | {
        label: string;
        value: any;
    } | undefined;
}
