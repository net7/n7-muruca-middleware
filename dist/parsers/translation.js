"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationParser = void 0;
class TranslationParser {
    parse({ data, options }) {
        let { lang } = options;
        return { [lang]: data };
    }
}
exports.TranslationParser = TranslationParser;
