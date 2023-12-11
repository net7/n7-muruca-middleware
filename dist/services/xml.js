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
        const { document } = new linkedom_1.DOMParser().parseFromString(xml, 'text/xml').defaultView;
        const nodesToreplace = [];
        nodes.forEach((node) => {
            if (node._path) {
                var replaceNode = document.querySelectorAll('TEI')[0];
                node._path.forEach((el) => {
                    replaceNode = replaceNode.querySelectorAll(':scope > ' + el.node)[el.position || 0];
                });
                const parser = new parsers_1.XmlSearchParser();
                // const { document: highlightNode } = parseHTML(parser.buildXmlNode(node));
                const { document: highlightNode } = new linkedom_1.DOMParser().parseFromString(parser.buildXmlNode(node), 'text/xml').defaultView;
                if (replaceNode) {
                    nodesToreplace.push([highlightNode, replaceNode]);
                }
            }
        });
        nodesToreplace.forEach((nodes) => {
            document.replaceChild(nodes[0].firstChild, nodes[1]);
        });
        return document.toString();
    }
    decodeEntity(str) {
        let txt = new linkedom_1.DOMParser().parseFromString('<tmp>' + str + '</tmp>', 'text/xml');
        return txt.documentElement.innerHTML;
    }
}
exports.XmlService = XmlService;
