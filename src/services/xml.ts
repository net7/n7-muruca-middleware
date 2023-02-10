import {parseHTML, DOMParser} from 'linkedom';
export class XmlService {
    
    constructor(){
    }
    
    replaceHlNodes(xml, nodes){
      /*  const {
            // note, these are *not* globals
            document
        } = parseHTML(xml);
        */
        const {document} =  (new DOMParser).parseFromString(
          xml, 'text/xml'
        ).defaultView;
        
        const nodesToreplace = [];
        nodes.forEach(node => {
            if(node._path){
                var replaceNode:Element = document.querySelectorAll("TEI")[0];               
                node._path.forEach(el => {
                    replaceNode = replaceNode.querySelectorAll(":scope > " + el.node)[el.position || 0];
                });
                    const { document: highlightNode } = parseHTML("<" + node.node + ">" +node.highlight + "</" + node.node + ">");
                    if(replaceNode){
                      nodesToreplace.push([highlightNode, replaceNode]); 
                    }
                    }
                });
        nodesToreplace.forEach(nodes => {
            document.replaceChild(nodes[0].firstChild, nodes[1]);            
        })
        return document.toString()
    }
    
}