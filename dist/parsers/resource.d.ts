import Parser from '../interfaces/parser';
export declare class ResourceParser implements Parser {
    parse(data: any, locale?: string): any;
    localeParse(data: any): any;
}
