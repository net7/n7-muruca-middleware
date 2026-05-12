"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlService = void 0;
const linkedom_1 = require("linkedom");
const parsers_1 = require("../parsers");
class XmlService {
    constructor() { }
    replaceHlNodes(xml, nodes) {
        /*  const {
                // note, these are *not* globals
                document
            } = parseHTML(xml);
            */
        // &nbsp; and other named HTML entities are not valid in XML.
        // Applied both on input (before DOMParser) and on output (document.toString re-introduces them).
        const namedEntities = {
            nbsp: '&#160;', ensp: '&#8194;', emsp: '&#8195;', thinsp: '&#8201;',
            ndash: '&#8211;', mdash: '&#8212;', lsquo: '&#8216;', rsquo: '&#8217;',
            ldquo: '&#8220;', rdquo: '&#8221;', laquo: '&#171;', raquo: '&#187;',
            hellip: '&#8230;', bull: '&#8226;', middot: '&#183;',
        };
        const sanitizeEntities = (str) => str.replace(/&(?!lt;|gt;|amp;|quot;|apos;)(\w+);/g, (match, name) => { var _a; return (_a = namedEntities[name]) !== null && _a !== void 0 ? _a : match; });
        const sanitized = sanitizeEntities(xml);
        const { document } = new linkedom_1.DOMParser().parseFromString(sanitized, 'text/xml').defaultView;
        const parser = new parsers_1.XmlSearchParser();
        // deepest nodes first: children are modified before their parents,
        // so parent innerHTML updates preserve child changes
        const sorted = [...nodes]
            .filter((node) => node._path)
            .sort((a, b) => b._path.length - a._path.length);
        sorted.forEach((node) => {
            let targetNode = document.querySelectorAll('TEI')[0];
            for (const el of node._path) {
                if (!targetNode)
                    break;
                targetNode = targetNode.querySelectorAll(':scope > ' + el.node)[el.position || 0];
            }
            if (!targetNode)
                return;
            if (node.textSnippet) {
                // text match: apply highlights to current innerHTML to preserve child changes
                targetNode.innerHTML = parser.applyHighlightsToXml(targetNode.innerHTML, node.textSnippet);
            }
            else if (node.highlight) {
                // attribute match: pre-computed highlight replaces inner content
                targetNode.innerHTML = node.highlight;
            }
            else {
                // other matches (refs, etc.): mark the node visually
                const existingClass = targetNode.getAttribute('class');
                targetNode.setAttribute('class', existingClass ? existingClass + ' mrc__text-emph' : 'mrc__text-emph');
            }
        });
        return sanitizeEntities(document.toString());
    }
    decodeEntity(str) {
        let txt = new linkedom_1.DOMParser().parseFromString('<tmp>' + str + '</tmp>', 'text/xml');
        return txt.documentElement.innerHTML;
    }
}
exports.XmlService = XmlService;
