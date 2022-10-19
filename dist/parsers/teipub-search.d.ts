import { DataType } from '../interfaces/helper';
import Parser, { Input } from '../interfaces/parser';
export declare class TeipubSearchParser implements Parser {
    parse({ data, options }: Input): any[];
    buildTextViewerQuery: (data: DataType, conf: any, doc: any) => Promise<any>;
    buildTeiHeaderQuery: (data: any, conf: any, doc: any, id_array: any) => any;
}
