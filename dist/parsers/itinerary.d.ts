import Parser, { Input } from '../interfaces/parser';
export declare class ItineraryParser implements Parser {
    private config;
    constructor(config: any);
    parse({ data, options }: Input): {
        sections: {};
    };
    parseList({ data, options }: any): {};
}
