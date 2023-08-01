import { CommonHelper } from "../helpers";
import { XmlService } from "../services";


export class XmlSearchParser {

  parseResponse(hit) {
    const hl = [];
    hit.hits.hits.forEach(element => {
      if (element.highlight) {
        const el = this.parseHighlight(element)
        hl.push(el);
      } else if (element.inner_hits && Object.keys(element.inner_hits)) {
        const prop: string = Object.keys(element.inner_hits)[0];
        hl.push(... this.parseResponse(element.inner_hits[prop]));
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
            el['highlight'] = hl_array[0];
          }
        } else if (/.*\._attr\.\w*/.test(property)) {
          const nodes = property.match(/(.*\.)?(\w+)\._attr\.(\w*)/);
          if (Array.isArray(nodes)) {
            const node_name = nodes?.[2];
            const node_attr = nodes?.[3];
            const xmlService = new XmlService();  
            let xml_text = xmlService.decodeEntity(el.xml_text);
            const snippet = CommonHelper.HighlightTagInXml(node_name, node_attr, hl_array[0], xml_text);
            el['highlight'] = snippet;
          }
        }
      }
      return el;
    }
    return {};
  }

  buildXmlNode(node, hl = true) {
    let node_str = "";
    let attrs = "";
    if (node._attr) {
      for (const attr in node._attr) {
        attrs += " " + attr + "='" + node._attr[attr] + "' ";
      }
    }
    if (node.node && node.highlight) {
      node_str = "<" + node.node + attrs + ">" + node.highlight + "</" + node.node + ">"
    } else if( node.xml_text ){
      if(hl) {
        attrs += " class='mrc__text-emph' ";
      }
      node_str = "<" + node.node + attrs + ">" + node.xml_text + "</" + node.node + ">"
    }
    return node_str;
  }


}