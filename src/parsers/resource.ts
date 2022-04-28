import Parser from "../interfaces/parser";

export class ResourceParser implements Parser {
    parse(data: any) {
        let locale = {};
        for (let lang in data) {
            locale[lang] = {
                id: data[lang].id,
                slug: data[lang].slug 
            }
        }
        return locale;
    }
}
