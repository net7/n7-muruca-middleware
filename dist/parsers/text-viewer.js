"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextViewerParser = void 0;
class TextViewerParser {
    parse({ data }) {
        return {
            endpoint: 'http://staging.teipublisher.netseven.it/exist/apps/tei-publisher',
            doc: {
                xml: ['test/seniles.xml'],
                odd: 'muruca',
                id: ['seniles']
            }
        };
    }
}
exports.TextViewerParser = TextViewerParser;
