"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedSearchParser = void 0;
const ASHelper = require("../helpers/advanced-helper");
const helpers_1 = require("../helpers");
class AdvancedSearchParser {
    constructor() {
        this.apparatus = {
            key: "alias"
        };
    }
    parse({ data, options }) {
        const { type } = options;
        return [];
    }
    // protected parseResultsItems({ data, options }: Input): SearchResultsItemData[];
    advancedParseResults({ data, options }) {
        //forEach dei resulsts, controlla se esiste data.valore di conf e costruisci l'oggetto
        if (options && 'limit' in options) {
            var { offset, limit, sort, total_count } = options;
        }
        const search_result = {
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
        data.forEach(({ _source: source, highlight, inner_hits }) => {
            let itemResult = {
                highlights: [],
            };
            if (highlight) {
                for (let prop in highlight) {
                    if (prop != 'text_matches') {
                        itemResult.highlights.push([prop, highlight[prop]]);
                    }
                    else {
                        highlight[prop].forEach((el) => itemResult.highlights.push(el));
                    }
                }
            }
            if (inner_hits && inner_hits.xml_text) {
                const inn_hits = inner_hits.xml_text.hits.hits;
                inn_hits.forEach(hit => {
                    const hh = this.parseXmlTextHighlight(hit);
                    if (hh != null) {
                        itemResult.highlights = itemResult.highlights.concat(hh);
                    }
                });
            }
            conf[searchId].results.forEach((val) => {
                if (source.hasOwnProperty(val.field)) {
                    itemResult[val.label] = source[val.field];
                }
                else if (val.field) {
                    if (!Array.isArray(val.field)) {
                        if (val.isLink === true) {
                            itemResult[val.label] = ASHelper.buildLink(val.field, source);
                        }
                        else {
                            //check for nested properties
                            let obj = source;
                            let fieldArray = val.field.split('.');
                            for (let i = 0; i < fieldArray.length; i++) {
                                let prop = fieldArray[i];
                                if (!obj || !obj.hasOwnProperty(prop)) {
                                    return false;
                                }
                                else {
                                    obj = obj[prop];
                                }
                            }
                            itemResult[val.label] = obj;
                        }
                    }
                    else {
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
    parseXmlTextHighlight(hit) {
        var _a, _b;
        if (hit.highlight) {
            const highlights = [];
            for (let prop in hit.highlight) {
                if (hit.matched_queries) {
                    if (hit.matched_queries.filter(q => {
                        const test = new RegExp(".*\." + q + "$", 'g');
                        return test.test(prop);
                    }).length <= 0) {
                        continue;
                    }
                }
                let breadcrumbs = "";
                if ((_a = hit._source) === null || _a === void 0 ? void 0 : _a._path) {
                    breadcrumbs = this.getXmlPathBreadcrumbs(hit._source._path);
                    if (breadcrumbs != "") {
                        breadcrumbs = "<span class='mrc__text-breadcrumbs'>" + breadcrumbs + "</span> ";
                    }
                }
                if (/xml_text$/.test(prop)) {
                    let h_snippet = breadcrumbs;
                    hit.highlight[prop].forEach(snippet => {
                        h_snippet += snippet + '<span class="mrc__text-divider"></span>';
                    });
                    highlights.push({
                        link: "",
                        text: h_snippet
                    });
                }
                else if (/.*\._attr\.\w*/.test(prop)) {
                    const nodes = prop.match(/(.*\.)?(\w+)\._attr\.(\w*)/);
                    if (Array.isArray(nodes)) {
                        const node_name = nodes === null || nodes === void 0 ? void 0 : nodes[2];
                        const node_attr = nodes === null || nodes === void 0 ? void 0 : nodes[3];
                        let xml_text = (_b = hit._source) === null || _b === void 0 ? void 0 : _b.xml_text;
                        const attr_parsed = [];
                        hit.highlight[prop].forEach(snippet => {
                            if (!attr_parsed.includes(snippet)) {
                                attr_parsed.push(snippet);
                                //const regex_str = '<' + node_name + '.*?' + CommonHelper.escapeRegExp(node_attr) + '=["\']' + CommonHelper.escapeRegExp(snippet) + '["\'].*?>.+?<\/'+node_name + '>';
                                //   const regex_str = '(?:(?:\s?[^\s\n\r\t]+\s){0,30})' + '<' + node_name + '.*?' + CommonHelper.escapeRegExp(node_attr) + '=["\']' + CommonHelper.escapeRegExp(snippet) + '["\'].*?>.+?<\/'+node_name + '>' + '(?:(?:\s?[^\s\n\r\t]+\s){0,30})';
                                //   const regex = new RegExp(regex_str, 'g');
                                // const snippets = xml_text.match(regex);
                                const snippets = helpers_1.CommonHelper.getSnippetAroundTag(node_name, node_attr, snippet, xml_text);
                                if (snippets) {
                                    snippets.forEach(element => {
                                        const value = "<span class='mrc__text-attr_value'>" + this.apparatus[node_attr] + ": " + snippet + "</span>";
                                        highlights.push({
                                            link: "",
                                            text: breadcrumbs + " " + value + " " + element
                                        });
                                    });
                                }
                            }
                        });
                    }
                }
            }
            return highlights;
        }
    }
    getXmlPathBreadcrumbs(path) {
        let breadcrumbs = "";
        path.forEach(node => {
            if (node.label) {
                breadcrumbs += breadcrumbs == "" ? node.label : " > " + node.label;
            }
        });
        return breadcrumbs;
    }
}
exports.AdvancedSearchParser = AdvancedSearchParser;
