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
    // &nbsp; and other named HTML entities are not valid in XML: replace before strict parsing
    const sanitized = xml.replace(/&(?!lt;|gt;|amp;|quot;|apos;)(\w+);/g, (match, name) => {
      const entities: Record<string, string> = {
        nbsp: '&#160;', ensp: '&#8194;', emsp: '&#8195;', thinsp: '&#8201;',
        ndash: '&#8211;', mdash: '&#8212;', lsquo: '&#8216;', rsquo: '&#8217;',
        ldquo: '&#8220;', rdquo: '&#8221;', laquo: '&#171;', raquo: '&#187;',
        hellip: '&#8230;', bull: '&#8226;', middot: '&#183;',
      };
      return entities[name] ?? match;
    });
    const { document } = new DOMParser().parseFromString(
      sanitized,
      'text/xml',
    ).defaultView;

    const parser = new XmlSearchParser();

    // deepest nodes first: children are modified before their parents,
    // so parent innerHTML updates preserve child changes
    const sorted = [...nodes]
      .filter((node) => node._path)
      .sort((a, b) => b._path.length - a._path.length);

    sorted.forEach((node) => {
      let targetNode: Element = document.querySelectorAll('TEI')[0];
      for (const el of node._path) {
        if (!targetNode) break;
        targetNode = targetNode.querySelectorAll(':scope > ' + el.node)[
          el.position || 0
        ];
      }
      if (!targetNode) return;

      if (node.textSnippet) {
        // text match: apply highlights to current innerHTML to preserve child changes
        targetNode.innerHTML = parser.applyHighlightsToXml(
          targetNode.innerHTML,
          node.textSnippet,
        );
      } else if (node.highlight) {
        // attribute match: pre-computed highlight replaces inner content
        targetNode.innerHTML = node.highlight;
      } else {
        // other matches (refs, etc.): mark the node visually
        const existingClass = targetNode.getAttribute('class');
        targetNode.setAttribute(
          'class',
          existingClass ? existingClass + ' mrc__text-emph' : 'mrc__text-emph',
        );
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
