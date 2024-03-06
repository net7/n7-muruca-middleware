import Parser from '../interfaces/parser';
export declare class ResourceParser implements Parser {
    parse({ data, options }: any, locale: any): any;
    localeParse(data: any): any;
    /**
    * Data filters
    */
    filter(data: any, field: string, page: any): any;
}
