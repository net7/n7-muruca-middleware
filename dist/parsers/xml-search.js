"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlSearchParser = void 0;
const helpers_1 = require("../helpers");
const services_1 = require("../services");
class XmlSearchParser {
    parseResponse(hit) {
        const hl = [];
        hit.hits.hits.forEach((element) => {
            if (element.highlight) {
                const el = this.parseHighlight(element);
                hl.push(el);
            }
            else if (element.inner_hits && Object.keys(element.inner_hits)) {
                const prop = Object.keys(element.inner_hits)[0];
                hl.push(...this.parseResponse(element.inner_hits[prop]));
            }
        });
        return hl;
    }
    parseHighlight(element) {
        const el = element._source;
        if (element.highlight) {
            for (const property in element.highlight) {
                const hl_array = Object.values(element.highlight[property]);
                if (/xml_text$/.test(property)) {
                    if (hl_array && hl_array[0]) {
                        el['textSnippet'] = hl_array[0];
                    }
                }
                else if (/.*\._attr\.\w*/.test(property)) {
                    const nodes = property.match(/(.*\.)?(\w+)\._attr\.(\w*)/);
                    if (Array.isArray(nodes)) {
                        const node_name = nodes === null || nodes === void 0 ? void 0 : nodes[2];
                        const node_attr = nodes === null || nodes === void 0 ? void 0 : nodes[3];
                        const xmlService = new services_1.XmlService();
                        let xml_text = xmlService.decodeEntity(el.xml_text);
                        const snippet = helpers_1.CommonHelper.HighlightTagInXml(node_name, node_attr, hl_array[0], xml_text);
                        el['highlight'] = snippet;
                    }
                }
            }
            return el;
        }
        return {};
    }
    applyHighlightsToXml(xmlContent, hlSnippet) {
        const terms = [];
        const emRegex = /<em class='mrc__text-emph'>(.*?)<\/em>/g;
        let match;
        while ((match = emRegex.exec(hlSnippet)) !== null) {
            terms.push(match[1]);
        }
        if (terms.length === 0)
            return xmlContent;
        const termPattern = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
        return xmlContent
            .split(/(<[^>]+>)/)
            .map((part) => {
            if (part.startsWith('<'))
                return part;
            return part.replace(termPattern, `<em class='mrc__text-emph'>$1</em>`);
        })
            .join('');
    }
}
exports.XmlSearchParser = XmlSearchParser;
