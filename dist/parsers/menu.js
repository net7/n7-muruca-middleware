"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuParser = void 0;
class MenuParser {
    parse(data) {
        data.map((p) => p.slug.toLowerCase());
        return data;
    }
}
exports.MenuParser = MenuParser;
