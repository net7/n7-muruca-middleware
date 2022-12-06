"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedSearchParser = void 0;
const ASHelper = require("../helpers/advanced-helper");
const helpers_1 = require("../helpers");
const services_1 = require("../services");
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
    advancedParseResultsItems({ data, options }) {
        return __awaiter(this, void 0, void 0, function* () {
            var { searchId, conf, teiPublisherUri } = options;
            let items = [];
            yield Promise.all(data.map(({ _source: source, highlight, inner_hits, matched_queries }) => __awaiter(this, void 0, void 0, function* () {
                let itemResult = {
                    highlights: [],
                };
                if (highlight) {
                    for (let prop in highlight) {
                        //this check is for results coming from teipublisher. Not used after version 2.4.0
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
                    const hh = yield this.parseXmlTextHighlight(inn_hits, teiPublisherUri, source['xml_filename']);
                    if (hh != null) {
                        itemResult.highlights = itemResult.highlights.concat(hh);
                        itemResult['tei_doc'] = source['xml_filename'] || null;
                    }
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
            })));
            return items;
        });
    }
    parseXmlTextHighlight(inn_hits, teiPublisherUri = "", doc = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const highlights_obj = [];
            const xpaths = new Set();
            inn_hits.forEach(hit => {
                var _a, _b;
                if (hit.highlight) {
                    for (let prop in hit.highlight) {
                        if (hit.matched_queries) {
                            ASHelper.checkMatchedQuery(prop, hit.matched_queries);
                            if (hit.matched_queries.filter(q => {
                                const test = new RegExp(".*\." + q + "$", 'g');
                                return test.test(prop);
                            }).length <= 0) {
                                continue;
                            }
                        }
                        let breadcrumbs = "";
                        let xpath = "";
                        let last_div_path = "";
                        if ((_a = hit._source) === null || _a === void 0 ? void 0 : _a._path) {
                            breadcrumbs = this.getXmlPathBreadcrumbs(hit._source._path);
                            xpath = this.getNodeXpath(hit._source._path, "p");
                            if (xpath)
                                xpaths.add(xpath);
                            last_div_path = this.getXmlLastDivPath(hit._source._path);
                            if (breadcrumbs != "") {
                                breadcrumbs = "<span class='mrc__text-breadcrumbs'>" + breadcrumbs + "</span> ";
                            }
                        }
                        if (/xml_text$/.test(prop)) {
                            let h_snippet = "";
                            hit.highlight[prop].forEach(snippet => {
                                h_snippet = h_snippet == "" ? snippet : h_snippet + '<span class="mrc__text-divider"></span>' + snippet;
                            });
                            if (!highlights_obj[last_div_path]) {
                                highlights_obj[last_div_path] =
                                    {
                                        text: breadcrumbs + h_snippet,
                                        xpath: xpath
                                    };
                            }
                            else {
                                highlights_obj[last_div_path]["text"] = highlights_obj[last_div_path]["text"] + '<span class="mrc__text-divider"></span>' + h_snippet;
                            }
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
                                        const snippets = helpers_1.CommonHelper.getSnippetAroundTag(node_name, node_attr, snippet, xml_text);
                                        if (snippets) {
                                            snippets.forEach(element => {
                                                const value = "<span class='mrc__text-attr_value'>" + this.apparatus[node_attr] + ": " + snippet + "</span>";
                                                if (!highlights_obj[last_div_path]) {
                                                    highlights_obj[last_div_path] = {
                                                        text: breadcrumbs + " " + value + " " + element,
                                                        xpath: xpath
                                                    };
                                                }
                                                else {
                                                    highlights_obj[last_div_path]["text"] = highlights_obj[last_div_path]["text"] + '<span class="mrc__text-divider"></span>' + value + " " + element;
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            });
            const highlights = [];
            let xpath_root_id;
            if (xpaths.size > 0) {
                const teipub = new services_1.TeipublisherService(teiPublisherUri);
                xpath_root_id = JSON.parse(yield teipub.getNodePaths(doc, xpaths));
                if (!Array.isArray(xpath_root_id))
                    xpath_root_id = [xpath_root_id];
            }
            for (let el in highlights_obj) {
                if (highlights_obj[el]) {
                    const root = xpath_root_id.find(x => x.xpath === highlights_obj[el].xpath).root_id;
                    highlights_obj[el]["link"] = {
                        "params": "root=" + root,
                        "query_string": true
                    };
                    highlights.push(highlights_obj[el]);
                }
            }
            return highlights;
        });
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
    getXmlLastDivPath(path) {
        let lastdiv = "";
        for (let i = path.length - 1; i >= 0; i--) {
            if (path[i] && path[i].node != "p") {
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
                if (foundlast)
                    return;
                let elem = node.position || node.position === 0 ? ns + node.node + "[" + (node.position + 1) + "]" : ns + node.node;
                xpath += xpath == "" ? elem : "/" + elem;
            }
        });
        return xpath;
    }
}
exports.AdvancedSearchParser = AdvancedSearchParser;
