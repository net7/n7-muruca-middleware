import Parser from "../interfaces/parser";
export default class SearchParser implements Parser {
    parse({ type, searchId, options, data, order, config }: {
        type: any;
        searchId: any;
        options: any;
        data: any;
        order: any;
        config: any;
    }): any;
    protected parseResults({ searchId, options, data, config }: {
        searchId: any;
        options: any;
        data: any;
        config: any;
    }): any;
    protected parseFacets({ order, data }: {
        order: any;
        data: any;
    }): {
        headers: {};
        inputs: {};
    };
}
