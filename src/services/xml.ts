import { parseHTML, DOMParser } from 'linkedom';
import { XmlSearchParser } from '../parsers';
export class XmlService {
  constructor() {}

  replaceHlNodes(xml, nodes) {
    /*  const {
            // note, these are *not* globals
            document
        } = parseHTML(xml);
        */
    const { document } = new DOMParser().parseFromString(
      xml,
      'text/xml',
    ).defaultView;

    const nodesToreplace = [];
    nodes.forEach((node) => {
      if (node._path) {
        var replaceNode: Element = document.querySelectorAll('TEI')[0];
        node._path.forEach((el) => {
          replaceNode = replaceNode.querySelectorAll(':scope > ' + el.node)[
            el.position || 0
          ];
        });
        const parser = new XmlSearchParser();
        // const { document: highlightNode } = parseHTML(parser.buildXmlNode(node));
        const { document: highlightNode } = new DOMParser().parseFromString(
          parser.buildXmlNode(node),
          'text/xml',
        ).defaultView;
        if (replaceNode) {
          nodesToreplace.push([highlightNode, replaceNode]);
        }
      }
    });
    nodesToreplace.forEach((nodes) => {
      const newNode = nodes[0].documentElement;
      if (!newNode) return;
      const parent = nodes[1].parentNode;
      if (parent) {
        parent.replaceChild(newNode, nodes[1]);
      } else {
        document.replaceChild(newNode, nodes[1]);
      }
    });
    return document.toString();
  }

  decodeEntity(str) {
    let txt = new DOMParser().parseFromString(
      '<tmp>' + str + '</tmp>',
      'text/xml',
    );

    return txt.documentElement.innerHTML;
  }
}
