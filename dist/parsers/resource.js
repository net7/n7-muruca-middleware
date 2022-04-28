"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceParser = void 0;
class ResourceParser {
    parse(data) {
        let locale = {};
        for (let lang in data) {
            locale[lang] = {
                id: data[lang].id,
                slug: data[lang].slug
            };
        }
        return locale;
    }
}
exports.ResourceParser = ResourceParser;
