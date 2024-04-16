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
            key: 'Voci di autorità',
        };
        this.text_separator = '<span class="mrc__text-divider"></span>';
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
                var _a, _b, _c;
                let itemResult = {
                    highlights: [],
                };
                if (highlight) {
                    for (let prop in highlight) {
                        //this check is for results coming from teipublisher. Not used after version 2.4.0
                        if (prop != 'text_matches') {
                            if (conf[searchId]['noHighlightLabels'] &&
                                conf[searchId]['noHighlightLabels'].includes(prop)) {
                                itemResult.highlights.push(['', highlight[prop]]);
                            }
                            else {
                                itemResult.highlights.push([prop, highlight[prop]]);
                            }
                        }
                        else {
                            highlight[prop].forEach((el) => itemResult.highlights.push(el));
                        }
                    }
                }
                if (inner_hits && Object.keys(inner_hits)) {
                    for (var prop in inner_hits) {
                        const inn_hits = inner_hits[prop].hits.hits;
                        const xml_filename = ((_b = (_a = conf[searchId]) === null || _a === void 0 ? void 0 : _a.xml_search_options) === null || _b === void 0 ? void 0 : _b.field_filename) ||
                            'xml_filename';
                        const doc = xml_filename
                            .split('.')
                            .reduce((a, b) => a[b], source);
                        if (doc) {
                            const hh = yield this.parseXmlTextHighlight(inn_hits, teiPublisherUri, doc);
                            if (hh.length > 0 && ((_c = hh[0]) === null || _c === void 0 ? void 0 : _c.isTitle)) {
                                itemResult['highlightsTitle'] = hh.shift().text;
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
    /**
     * Parse Hits of a document
     * @param inn_hits
     * @param teiPublisherUri
     * @param doc
     * @returns
     */
    parseXmlTextHighlight(inn_hits, teiPublisherUri = '', doc = '') {
        return __awaiter(this, void 0, void 0, function* () {
            const highlights = [];
            const highlights_obj = this.buildHighlightObj(inn_hits);
            if (highlights_obj.totCount > 0) {
                highlights.push({
                    isTitle: true,
                    text: 'Occorrenze: ' + highlights_obj.totCount,
                    link: '',
                });
            }
            const objects = highlights_obj.highlights_obj;
            let xpath_root_id = [];
            const xpaths = Object.values(objects).map((obj) => obj['xpath']);
            if (xpaths.length > 0 && doc != '') {
                xpath_root_id = yield this.getTeipublisherNodesRoot(teiPublisherUri, doc, [...new Set(xpaths)]);
            }
            for (let el in objects) {
                if (objects[el]) {
                    let hl = {
                        link: {
                            params: '',
                            query_string: false,
                        },
                    };
                    if (xpath_root_id != null) {
                        const root = xpath_root_id.find((x) => x.xpath === objects[el].xpath).root_id;
                        hl['link'] = {
                            params: 'root=' + root + '&hq=1',
                            query_string: true,
                        };
                    }
                    hl['xpath'] = objects[el]['xpath'];
                    hl['text'] = this.buildFinalHighlightSnippet(objects[el]);
                    highlights.push(hl);
                }
            }
            return highlights;
        });
    }
    buildFinalHighlightSnippet(el) {
        let finaltext = '';
        el.texts.forEach((text) => {
            finaltext =
                finaltext == '' ? text : finaltext + this.text_separator + text;
        });
        if (el['breadcrumb']) {
            finaltext = el['breadcrumb'] + finaltext;
        }
        return finaltext;
    }
    getTeipublisherNodesRoot(teiPublisherUri, doc, xpaths) {
        return __awaiter(this, void 0, void 0, function* () {
            const teipub = new services_1.TeipublisherService(teiPublisherUri);
            try {
                const teipubResponse = yield teipub.getNodePaths(doc, xpaths);
                let xpath_root_id = JSON.parse(teipubResponse);
                if (xpath_root_id != null && !Array.isArray(xpath_root_id)) {
                    xpath_root_id = [xpath_root_id];
                }
                return xpath_root_id;
            }
            catch (error) {
                return [];
            }
        });
    }
    /**
     *
     * @param inn_hits inner hits object from ES query. It contains matches for paragraph or other substructures
     * @returns Object with propertites TotCount and matches grouped for div
     */
    buildHighlightObj(inn_hits) {
        let totCount = 0;
        let highlights_obj = {};
        inn_hits.forEach((hit) => {
            var _a;
            //array di tutti i testi evidenziati nel nodo
            const result = this.parseHighlightNode(hit);
            //qui mi serve l'xpath per unire i risultati simili
            if (result.length > 0 && ((_a = hit._source) === null || _a === void 0 ? void 0 : _a._path)) {
                const last_div_path = this.getXmlLastDivPath(hit._source._path);
                if (!highlights_obj[last_div_path]) {
                    highlights_obj[last_div_path] = {
                        texts: [],
                        breadcrumb: this.getNodeBreadcrumb(hit._source._path),
                        xpath: this.getNodeXpath(hit._source._path, hit._source.node),
                    };
                }
                totCount += result.length;
                highlights_obj[last_div_path].texts.push(...result);
            }
        });
        return {
            totCount: totCount,
            highlights_obj: highlights_obj,
        };
    }
    //parse Highlights of a single node (es: a `p` node )
    parseHighlightNode(hit) {
        if (hit.highlight) {
            return this.parseHighlights(hit);
        }
        else if (hit.inner_hits && Object.keys(hit.inner_hits)) {
            const prop = Object.keys(hit.inner_hits)[0];
            let inn_hits = hit.inner_hits[prop].hits.hits;
            let res = [];
            inn_hits.forEach((hit) => {
                if (hit.highlight) {
                    res.push(...this.parseHighlights(hit));
                }
            });
            return res;
        }
    }
    getNodeBreadcrumb(path) {
        let breadcrumbs = '';
        if (path) {
            breadcrumbs = this.getXmlPathBreadcrumbs(path);
            if (breadcrumbs != '') {
                breadcrumbs =
                    "<span class='mrc__text-breadcrumbs'>" + breadcrumbs + '</span> ';
            }
        }
        return breadcrumbs;
    }
    /*
      parse ES highlight property (may be an array of strings)
    */
    parseHighlights(hit) {
        var _a;
        const unique_hl = {
            xml_text: [],
            attr: [],
            refs: [],
        };
        for (let prop in hit.highlight) {
            if (hit.matched_queries &&
                !ASHelper.checkMatchedQuery(prop, hit.matched_queries)) {
                continue;
            }
            if (/xml_text$/.test(prop)) {
                hit.highlight[prop].forEach((snippet) => {
                    var _a;
                    let prefix = '';
                    if ((_a = hit._source) === null || _a === void 0 ? void 0 : _a._refs) {
                        const references = this.parseReferences(hit._source._refs);
                        prefix =
                            "<span class='mrc__text-attr_value'>In: " +
                                references +
                                '</span> ';
                    }
                    unique_hl.xml_text.push(prefix + snippet);
                    //h_snippets.push(prefix + snippet);
                });
            }
            else if (/.*\._attr\.\w*/.test(prop)) {
                unique_hl.attr.push(...this.parseAttributeHighlight(hit, prop));
                //h_snippets.push(...this.parseAttributeHighlight(hit, prop));
            }
            else if (/.*\._refs\.\w*/.test(prop)) {
                if ((_a = hit._source) === null || _a === void 0 ? void 0 : _a.xml_text) {
                    unique_hl.refs.push(helpers_1.CommonHelper.makeXmlTextSnippet(hit._source.xml_text, 250));
                    //h_snippets.push(CommonHelper.makeXmlTextSnippet(hit._source.xml_text))
                }
            }
        }
        return this.mergeUniqueSnippets(unique_hl);
    }
    mergeUniqueSnippets(unique_hl) {
        if (unique_hl.attr.length > 0) {
            return unique_hl.attr;
        }
        if (unique_hl.xml_text.length > 0) {
            return unique_hl.xml_text;
        }
        if (unique_hl.refs.length > 0) {
            return [unique_hl.refs[0]];
        }
    }
    parseReferences(refs) {
        let references = '';
        refs.forEach((element) => {
            let r = '';
            for (const prop in element) {
                r = r == '' ? element[prop] : r + ', ' + element[prop];
            }
            references = references == '' ? r : references + '; ' + r;
        });
        return references;
    }
    getXmlPathBreadcrumbs(path) {
        let breadcrumbs = '';
        path.forEach((node) => {
            if (node.label) {
                breadcrumbs += breadcrumbs == '' ? node.label : ' > ' + node.label;
            }
        });
        return breadcrumbs;
    }
    getXmlLastDivPath(path) {
        let lastdiv = '';
        let divFound = false;
        for (let i = path.length - 1; i >= 0; i--) {
            if ((path[i] && path[i].node == 'div') || divFound) {
                divFound = true;
                const node = typeof path[i].position !== 'undefined'
                    ? path[i].node + '_' + path[i].position
                    : path[i].node;
                lastdiv = lastdiv == '' ? node : node + '.' + lastdiv;
            }
        }
        return lastdiv;
    }
    getNodeXpath(path, last_el = 'p') {
        let xpath = '';
        const ns = 'tei:';
        let foundlast = false;
        path.forEach((node) => {
            if (node.node) {
                foundlast = last_el == node.node;
                if (foundlast)
                    return;
                let elem = node.position || node.position === 0
                    ? ns + node.node + '[' + (node.position + 1) + ']'
                    : ns + node.node;
                xpath += xpath == '' ? elem : '/' + elem;
            }
        });
        return xpath;
    }
    parseAttributeHighlight(hit, prop) {
        var _a;
        const nodes = prop.match(/(.*\.)?(\w+)\._attr\.(\w*)/);
        let uniqueSnippets = [];
        if (Array.isArray(nodes)) {
            const node_attr = nodes === null || nodes === void 0 ? void 0 : nodes[3];
            let xml_text = (_a = hit._source) === null || _a === void 0 ? void 0 : _a.xml_text;
            const attr_parsed = [];
            hit.highlight[prop].forEach((snippet) => {
                if (!attr_parsed.includes(snippet)) {
                    attr_parsed.push(snippet);
                    let xmlService = new services_1.XmlService();
                    let decoded_text = xmlService.decodeEntity(xml_text);
                    const snippets = helpers_1.CommonHelper.getSnippetAroundTag(node_attr, snippet, decoded_text);
                    if (snippets) {
                        snippets.forEach((element) => {
                            uniqueSnippets.push("<span class='mrc__text-attr_value'>" +
                                this.apparatus[node_attr] +
                                ': ' +
                                snippet +
                                '</span>' +
                                element);
                        });
                    }
                }
            });
        }
        return uniqueSnippets;
    }
}
exports.AdvancedSearchParser = AdvancedSearchParser;
