import Parser from "../interfaces/parser";
export default class ResourceParser implements Parser {
    parse({ page, data, conf }: {
        page: any;
        data: any;
        conf: any;
    }): {
        title: string;
        sections: {};
    };
    filter(data: any, field: any): any;
}
