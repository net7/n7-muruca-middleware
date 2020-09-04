"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchParser = void 0;
class SearchParser {
    parse({ data, options }) {
        const { type } = options;
        return type === 'results'
            ? this.parseResults({ data, options })
            : this.parseFacets({ data, options });
    }
}
exports.SearchParser = SearchParser;
