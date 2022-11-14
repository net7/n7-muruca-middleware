import { DataType } from '../interfaces/helper';
import * as ASHelper from '../helpers/advanced-helper';
import { CommonHelper } from '../helpers';
import Parser, { Input, SearchOptions } from '../interfaces/parser';
import {
    SearchResultsData,
    SearchResultsItemData,
} from '../interfaces/parser-data/search';
import Helpers from '@elastic/elasticsearch/lib/Helpers';

export class AdvancedSearchParser implements Parser {
    
    apparatus = {
        key: "alias"
    }
    
    parse({ data, options }: Input) {
        const { type } = options as SearchOptions;
        return [];
    }

    // protected parseResultsItems({ data, options }: Input): SearchResultsItemData[];

    advancedParseResults({ data, options }: any) {
        //forEach dei resulsts, controlla se esiste data.valore di conf e costruisci l'oggetto
        if (options && 'limit' in options) {
            var { offset, limit, sort, total_count } = options;
        }
        const search_result: SearchResultsData = {
            limit,
            offset,
            sort,
            total_count,
            results: [],
        };
        search_result.results = this.advancedParseResultsItems({ data, options });

        return search_result;
    }

    advancedParseResultsItems({ data, options }) {
        var { searchId, conf } = options;
        let items = [];

        data.forEach(({ _source: source, highlight, inner_hits, matched_queries }) => {
            let itemResult = {
                highlights: [],
            };
            if (highlight) {
                for (let prop in highlight) {                   
                    //this check is for results coming from teipublisher. Not used after version 2.4.0
                    if (prop != 'text_matches') {
                        itemResult.highlights.push([prop, highlight[prop]]);
                    } else {
                        highlight[prop].forEach((el) => itemResult.highlights.push(el));
                    }            
                }
            }
            if( inner_hits && inner_hits.xml_text ){
                const inn_hits = inner_hits.xml_text.hits.hits;
                inn_hits.forEach(hit => {
                    const hh = this.parseXmlTextHighlight(hit);
                    if( hh != null){
                        itemResult.highlights = itemResult.highlights.concat(hh);               
                    }
                });
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
        });
        return items;
    }
    
    parseXmlTextHighlight(hit){
        if( hit.highlight ){
            const highlights = [];
            for (let prop in hit.highlight) {
                if(hit.matched_queries){
                    ASHelper.checkMatchedQuery(prop, hit.matched_queries);
                    if( hit.matched_queries.filter( q => {
                        const test = new RegExp(".*\." + q + "$", 'g');
                        return test.test(prop);
                    } ).length <= 0 ){
                        continue;                        
                    }
                }
                let breadcrumbs = "";
                let xpath = "";
                if(hit._source?._path){
                    breadcrumbs = this.getXmlPathBreadcrumbs(hit._source._path)
                    xpath = this.getNodeXpath(hit._source._path)
                    if (breadcrumbs != ""){
                        breadcrumbs = "<span class='mrc__text-breadcrumbs'>" + breadcrumbs + "</span> ";
                    }
                }
                
                
                
                if(/xml_text$/.test(prop)){
                    let h_snippet = breadcrumbs;
                    hit.highlight[prop].forEach(snippet => {
                        h_snippet += snippet +'<span class="mrc__text-divider"></span>' ;
                    });
                    highlights.push({
                        link: "",
                        text:h_snippet,
                        xpath: xpath
                    });
                } 
                else if(/.*\._attr\.\w*/.test(prop)){
                    const nodes = prop.match(/(.*\.)?(\w+)\._attr\.(\w*)/);
                    if(Array.isArray(nodes)){                        
                        const node_name = nodes?.[2];
                        const node_attr = nodes?.[3];
                        let xml_text = hit._source?.xml_text;                        
                        
                        const attr_parsed = [];
                        hit.highlight[prop].forEach(snippet => {
                            if (!attr_parsed.includes(snippet)){
                                attr_parsed.push(snippet);
                                //const regex_str = '<' + node_name + '.*?' + CommonHelper.escapeRegExp(node_attr) + '=["\']' + CommonHelper.escapeRegExp(snippet) + '["\'].*?>.+?<\/'+node_name + '>';
                             //   const regex_str = '(?:(?:\s?[^\s\n\r\t]+\s){0,30})' + '<' + node_name + '.*?' + CommonHelper.escapeRegExp(node_attr) + '=["\']' + CommonHelper.escapeRegExp(snippet) + '["\'].*?>.+?<\/'+node_name + '>' + '(?:(?:\s?[^\s\n\r\t]+\s){0,30})';
                            //   const regex = new RegExp(regex_str, 'g');
                                
                               // const snippets = xml_text.match(regex);
                                const snippets = CommonHelper.getSnippetAroundTag(node_name, node_attr, snippet, xml_text);
                                
                                
                                if(snippets){
                                    snippets.forEach(element => {
                                        const value = "<span class='mrc__text-attr_value'>"+ this.apparatus[node_attr] + ": " + snippet + "</span>"
                                        highlights.push(  {
                                            link: "",
                                            text: breadcrumbs+ " " + value + " " + element
                                        })
                                    });
                                }
                            }
                        })
                    }
                }
            }
            return highlights;
        }
    }
    
    getXmlPathBreadcrumbs(path){
        let breadcrumbs = "";
        path.forEach(node => {
            if(node.label) {
                breadcrumbs += breadcrumbs == "" ? node.label : " > " + node.label
            }
        });
        return breadcrumbs;
    }
    
    getNodeXpath(path){
        let xpath = "";
        const ns = "tei:";
        path.forEach(node => {
            if(node.node) {
                let elem = node.position ? ns + node.node + "[" + node.position + "]" : ns + node.node;
                
                xpath += xpath == "" ? elem : "/" + elem
            }
        });
        return xpath;
    }
}
