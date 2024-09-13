import * as ASHelper from '../helpers/advanced-helper';
import { CommonHelper } from '../helpers';
import Parser, { Input, SearchOptions } from '../interfaces/parser';
import { TeipublisherService, XmlService } from '../services';
import _ = require('lodash');

export class AdvancedSearchParser implements Parser {

  apparatus = {
    key: "Voci di autorità"
  }

  text_separator = "<span class=\"mrc__text-divider\"></span>";
  xml_json_property = "xml_transcription_texts_json";

  parse({ data, options }: Input) {
    const { type } = options as SearchOptions;
    return [];
  }

  // protected parseResultsItems({ data, options }: Input): SearchResultsItemData[];

  async advancedParseResultsItems({ data, options }) {
    var { searchId, conf, teiPublisherUri } = options;
    let items = [];
    await Promise.all(
      data.map(async ({ _source: source, highlight, inner_hits, matched_queries }) => {
        let itemResult = {
          highlights: [],
        };
        if (highlight) {
          for (let prop in highlight) {
            //this check is for results coming from teipublisher. Not used after version 2.4.0
            if (prop != 'text_matches') {
              if (conf[searchId]['noHighlightLabels'] && conf[searchId]['noHighlightLabels'].includes(prop)) {
                itemResult.highlights.push(["", highlight[prop]]);
              } else {
                itemResult.highlights.push([prop, highlight[prop]]);
              }
            } else {
              highlight[prop].forEach((el) => itemResult.highlights.push(el));
            }
          }
        }
        if( inner_hits && Object.keys(inner_hits) ){
          for (var prop in inner_hits) {       
            const inn_hits = inner_hits[prop].hits.hits;
            const xml_filename = conf[searchId]?.xml_search_options?.field_filename || "xml_filename";
            const doc = xml_filename.split('.').reduce((a, b) => a[b], source);
            if (doc) {
              const hh = await this.parseXmlTextHighlight(inn_hits, teiPublisherUri, doc);
              if (hh.length > 0 && hh[0]?.isTitle) {
                itemResult["highlightsTitle"] = hh.shift().text;
              }
              if (hh != null) {
                itemResult.highlights = itemResult.highlights.concat(hh);
                itemResult['tei_doc'] = doc || null;
              }
            }
          }

        }

        conf[searchId].results.forEach((val) => {
          if (source.hasOwnProperty(val.field)) {
            itemResult[val.label] = source[val.field];
          } else if (val.field) {
            if (!Array.isArray(val.field)) {
              if (val.isLink === true) {
                itemResult[val.label] = ASHelper.buildLink(val.field, source);
              } else {
                //check for nested properties
                let obj = source;
                let fieldArray = val.field.split('.');
                for (let i = 0; i < fieldArray.length; i++) {
                  let prop = fieldArray[i];
                  if (!obj || !obj.hasOwnProperty(prop)) {
                    return false;
                  } else {
                    obj = obj[prop];
                  }
                }
                itemResult[val.label] = obj;
              }
            } else {
              for (let e of val.field) {
                if (source.hasOwnProperty(e)) {
                  itemResult[val.label] = source[val.field];
                }
              }
            }
          }
          else if (val.fields) {
            let fields = val.fields;
            itemResult[val.label] = [];
            let items = [];
            fields.forEach((item) => {
              let obj = source;
              if (obj && obj.hasOwnProperty(item.field)) {
                obj = obj[item.field];
              }
              else {
                let fieldArray = item.field.split('.'); // [source, work, title]
                obj = ASHelper.extractNestedFields(fieldArray, obj);
              }
              items.push({
                label: obj ? item.label : '',
                value: obj,
              });
            });
            itemResult[val.label].push({ items: items });
          }
        });
        items.push(itemResult);
      })
    )
    return items;
  }

  /**
   * Parse Hits of a document
   * @param inn_hits 
   * @param teiPublisherUri 
   * @param doc 
   * @returns 
   */
  async parseXmlTextHighlight(inn_hits: any, teiPublisherUri = "", doc = "") {
    const highlights = [];

    const highlights_obj: any = this.buildHighlightObj(inn_hits);
    if (highlights_obj.totCount > 0) {
      highlights.push({
        "isTitle": true,
        "text": "Occorrenze: " + highlights_obj.totCount,
        "link": ""
      })
    }
    const objects = highlights_obj.highlights_obj;
    let xpath_root_id = [];
    const xpaths: string[] = Object.values(objects).map(obj => obj['xpath']);
    if (xpaths.length > 0 && doc != "") {
      xpath_root_id = await this.getTeipublisherNodesRoot(teiPublisherUri, doc, [... new Set(xpaths)]);
    }
    for (let el in objects) {
      if (objects[el]) {
        let hl = {
          "link": {
            "params": "",
            "query_string": false
          }
        };
        
        if( xpath_root_id!= null ){
          const root = xpath_root_id.find(x => x.xpath === objects[el].xpath).root_id;
          hl["link"] = {
            "params": "root=" + root + "&hq=1",
            "query_string": true
          };          
        }
        hl["xpath"] = objects[el]["xpath"];
        hl["text"] = this.buildFinalHighlightSnippet(objects[el]);
        highlights.push(hl);
      }
    }
    return highlights;
  }

  buildFinalHighlightSnippet(el) {
    let finaltext = "";
    el.texts.forEach(text => {
      finaltext = finaltext == "" ? text : finaltext + this.text_separator + text;
    });

    if (el["breadcrumb"]) {
      finaltext = el["breadcrumb"] + finaltext;
    }
    return finaltext;
  }


  async getTeipublisherNodesRoot(teiPublisherUri, doc, xpaths) {
    const teipub = new TeipublisherService(teiPublisherUri);
    try {
      const teipubResponse = await teipub.getNodePaths(doc, xpaths);
      let xpath_root_id = JSON.parse(teipubResponse);
      if (xpath_root_id != null && !Array.isArray(xpath_root_id)){
        xpath_root_id = [xpath_root_id];
      }
      return xpath_root_id;
    } catch (error) {
      return []
    }

  }

  /**
   * 
   * @param inn_hits inner hits object from ES query. It contains matches for paragraph or other substructures
   * @returns Object with propertites TotCount and matches grouped for div
   */
  buildHighlightObj(inn_hits) {
    let totCount = 0;
    let highlights_obj = {};
    inn_hits.forEach(hit => {
      //array di tutti i testi evidenziati nel nodo
      const result = this.parseHighlightNode(hit);

      //qui mi serve l'xpath per unire i risultati simili
      if (result.length > 0 && hit._source?._path) {
        const last_div_path = this.getXmlLastDivPath(hit._source._path)
        if (!highlights_obj[last_div_path]) {
          highlights_obj[last_div_path] = {
            texts: [],
            breadcrumb: this.getNodeBreadcrumb(hit._source._path),
            xpath: this.getNodeXpath(hit._source._path, hit._source.node)
          }
        }
        totCount += result.length;
        highlights_obj[last_div_path].texts.push(...result);
      }
    });

    return {
      totCount: totCount,
      highlights_obj: highlights_obj
    }
  }




  //parse Highlights of a single node (es: a `p` node )
  parseHighlightNode(hit) {

    if (hit.highlight) {
      return this.parseHighlights(hit);
    } else if (hit.inner_hits && Object.keys(hit.inner_hits) ) {
      const prop:string = Object.keys(hit.inner_hits)[0];
      let inn_hits = hit.inner_hits[prop].hits.hits;
      let res = [];
      inn_hits.forEach(hit => {
        if (hit.highlight) {
          res.push(...this.parseHighlights(hit));
        }
      })
      return res;
    }
  }

  getNodeBreadcrumb(path) {
    let breadcrumbs = "";
    if (path) {
      breadcrumbs = this.getXmlPathBreadcrumbs(path)
      if (breadcrumbs != "") {
        breadcrumbs = "<span class='mrc__text-breadcrumbs'>" + breadcrumbs + "</span> ";
      }
    }
    return breadcrumbs;
  }

  /* 
    parse ES highlight property (may be an array of strings)  
  */
  parseHighlights(hit) {
    const unique_hl = {
      xml_text: [],
      attr: [],
      refs:[]
    };
    
    for (let prop in hit.highlight) {
      if (hit.matched_queries && !ASHelper.checkMatchedQuery(prop, hit.matched_queries)) {
        continue;
      }
      
      if (/xml_text$/.test(prop)) {
        hit.highlight[prop].forEach(snippet => {
          let prefix = "";
          if (hit._source?._refs) {
            const references = this.parseReferences(hit._source._refs);
            prefix = "<span class='mrc__text-attr_value'>In: " + references + "</span> ";
          }
          unique_hl.xml_text.push(prefix + snippet);
          //h_snippets.push(prefix + snippet);
        });
      }
      else if (/.*\._attr\.\w*/.test(prop)) {
        unique_hl.attr.push(...this.parseAttributeHighlight(hit, prop));
        //h_snippets.push(...this.parseAttributeHighlight(hit, prop));
      } else if(/.*\._refs\.\w*/.test(prop)) {
        
        const quotes = this.findXmlTextByPath(hit, prop);
        let prefix = "";
        
        if(quotes && quotes.length > 0){
          quotes.forEach(  quote => {
            if (quote._refs) {
              const references = this.parseReferences(quote['_refs']);
              prefix = "<span class='mrc__text-attr_value'>In: " + references + "</span> ";
            }
            unique_hl.refs.push(prefix + CommonHelper.makeXmlTextSnippet(quote['xml_text'], 250, "[...]"));             
          })
          //h_snippets.push(CommonHelper.makeXmlTextSnippet(hit._source.xml_text))*/
        }
      }      
    }
    
    return this.mergeUniqueSnippets(unique_hl);
  }
  mergeUniqueSnippets(unique_hl: { xml_text:any[], attr:any[],  refs:any[] }){
    
    if( unique_hl.attr.length > 0){
      return unique_hl.attr;
    }
    if( unique_hl.xml_text.length > 0){
      return unique_hl.xml_text;
    }
    if( unique_hl.refs.length > 0){
      return unique_hl.refs;
    }
  }
  
  parseReferences(refs){    
    let references = "";
    refs.forEach(element => {
      let r = "";
      if(element['label']){
        r = element['label'];
      } else {
        for( const prop in element ){
          r = r == "" ? element[prop] : r + ", " + element[prop];
        }        
      }
      references = references == "" ? r : references +"; " + r;       
    });
    return references;
  }

  getXmlPathBreadcrumbs(path) {
    let breadcrumbs = "";
    path.forEach(node => {
      if (node.label) {
        breadcrumbs += breadcrumbs == "" ? node.label : " > " + node.label
      }
    });
    return breadcrumbs;
  }

  getXmlLastDivPath(path) {
    let lastdiv = "";
    let divFound = false;
    for (let i = path.length - 1; i >= 0; i--) {
      if (path[i] && path[i].node == "div" || divFound) {
        divFound = true;
        const node = typeof path[i].position !== "undefined" ? path[i].node + "_" + path[i].position : path[i].node;
        lastdiv = lastdiv == "" ? node : node + "." + lastdiv;
      }
    }
    return lastdiv;
  }

  getNodeXpath(path, last_el = "p") {
    let xpath = "";
    const ns = "tei:";
    let foundlast = false;
    path.forEach(node => {
      if (node.node) {
        foundlast = last_el == node.node;
        if (foundlast) return;
        let elem = node.position || node.position === 0 ? ns + node.node + "[" + (node.position + 1) + "]" : ns + node.node;
        xpath += xpath == "" ? elem : "/" + elem;
      }
    });
    return xpath;
  }
    
  parseAttributeHighlight(hit, prop) {
    const nodes = prop.match(/(.*\.)?(\w+)\._attr\.(\w*)/);
    let uniqueSnippets = [];
    if (Array.isArray(nodes)) {
      const node_attr = nodes?.[3];
      let xml_text = hit._source?.xml_text;
      const attr_parsed = [];
      hit.highlight[prop].forEach(snippet => {
        if (!attr_parsed.includes(snippet)) {
          attr_parsed.push(snippet);
          let xmlService = new XmlService();
          let decoded_text = xmlService.decodeEntity(xml_text);
          const snippets = CommonHelper.getSnippetAroundTag(node_attr, snippet, decoded_text);

          if (snippets) {
            snippets.forEach(element => {
              uniqueSnippets.push("<span class='mrc__text-attr_value'>" + this.apparatus[node_attr] + ": " + snippet + "</span>" + element)
            });
          }
        }
      })
    }
    return uniqueSnippets;

  }
  
  findXmlTextByPath(data,  prop: string) {
  const keys = prop.substring("xml_transcription_texts_json.".length).split(".");  
  
  //tolgo il primo elemento perché corrisponde alla root
  keys.shift();
  const targetValue = data['highlight'][prop][0].toString();
  
    let elem = data["_source"];
    
    function recursiveSearch(currentData, remainingKeys: string[]): string[] | null {
      let results = [];
      
      if (remainingKeys.length === 0) {
        return null;
      }
  
      // Se currentData è un array, itero su ciascun elemento dell'array
      if (Array.isArray(currentData)) {
        for (const item of currentData) {
          results = results.concat(recursiveSearch(item, remainingKeys));
        }
        return results;
      }
      
      if (!remainingKeys.length) {
        return results;
      }
      
      const key = remainingKeys[0];
      
      // Se siamo al livello in cui si trova _refs, cerco il targetValue
      if (key === "_refs" && Array.isArray(currentData[key])) {
        for (const item of currentData[key]) {
          if (item.label === targetValue) {
            // Se corrisponde, aggiungiamo il valore di xml_text
            if (currentData.xml_text) {
              results.push(currentData);
            }
          }
        }
      }
  
      // Continua a cercare ricorsivamente se non siamo ancora all'ultima chiave
      if (remainingKeys.length > 1 && currentData[key]) {
        results = results.concat(recursiveSearch(currentData[key], remainingKeys.slice(1)));
      }
  
      return results;
    }
  
    return recursiveSearch(elem, keys);  
    
  
  }
  
  
}
