"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlService = void 0;
const linkedom_1 = require("linkedom");
class XmlService {
    constructor() {
    }
    replaceHlNodes(xml, nodes) {
        const { 
        // note, these are *not* globals
        document } = linkedom_1.parseHTML(xml);
        const nodesToreplace = [];
        nodes.forEach(node => {
            if (node._path) {
                var replaceNode = document.querySelectorAll("TEI")[0];
                node._path.forEach(el => {
                    replaceNode = replaceNode.querySelectorAll(":scope > " + el.node)[el.position || 0];
                });
                const { document: highlightNode } = linkedom_1.parseHTML("<" + node.node + ">" + node.highlight + "</" + node.node + ">");
                nodesToreplace.push([highlightNode, replaceNode]);
            }
        });
        nodesToreplace.forEach(nodes => {
            document.replaceChild(nodes[0].firstChild, nodes[1]);
        });
        return document.toString();
    }
}
exports.XmlService = XmlService;
