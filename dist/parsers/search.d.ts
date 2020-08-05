import Parser, { Input } from "../interfaces/parser";
export declare class SearchParser implements Parser {
    parse({ data, options }: Input): any;
    protected parseResults({ data, options }: Input): {
        limit: number;
        page: number;
        sort: string;
        total_count: number;
        results: {
            title?: string | undefined;
            text?: string | undefined;
            image?: string | null | undefined;
            link?: string | undefined;
            id?: string | number | undefined;
        }[];
    };
    protected parseFacets({ data, options }: Input): any;
}
