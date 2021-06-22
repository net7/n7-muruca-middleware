"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeTeiPublisherResults = exports.queryExists = exports.buildLink = exports.buildTextViewerResults = exports.buildTeiHeaderResults = exports.buildHighlights = exports.queryRange = exports.queryTerm = exports.buildQueryString = exports.spanNear = exports.queryString = exports.matchPhrase = exports.queryBool = void 0;
exports.queryBool = (mustList = [], shouldList = [], filterList = [], notList = []) => {
    const x = {
        query: {
            bool: {
                must: mustList,
                should: shouldList,
                filter: filterList,
                must_not: notList,
            },
        },
    };
    return x;
};
exports.matchPhrase = (queryField) => {
    const x = {
        match_phrase: {
            [queryField.fields]: {
                query: queryField.value,
                slop: queryField.distance || 1,
            },
        },
    };
    return x;
};
exports.queryString = (queryField, default_operator = 'AND', boost = null) => {
    const fields = typeof queryField.fields == 'string'
        ? queryField.fields.split(',')
        : queryField.fields;
    const x = {
        query_string: {
            query: queryField.value,
            fields: fields,
            default_operator: default_operator,
            lenient: true,
        },
    };
    if (boost) {
        x.query_string['boost'] = boost;
    }
    return x;
};
exports.spanNear = (queryField) => {
    const x = {
        span_near: {
            clauses: [],
            slop: queryField.distance,
            in_order: true,
        },
    };
    const words = queryField.value.split(' ');
    words.forEach((element) => {
        x.span_near.clauses.push({
            span_multi: {
                match: {
                    wildcard: {
                        [queryField.fields]: element,
                    },
                },
            },
        });
    });
    return x;
};
exports.buildQueryString = (term, options = {}) => {
    const allowWildCard = options.allowWildCard != 'undefined' ? options.allowWildCard : true, splitString = options.splitString ? options.splitString : true, stripDoubleQuotes = options.stripDoubleQuotes
        ? options.stripDoubleQuotes
        : false, allowFuzziness = options.allowFuzziness ? options.allowFuzziness : false;
    let termToArray, queryTerms;
    //escape slash ( \ )
    term = term.replace(/\//g, '\\/');
    if (stripDoubleQuotes) {
        term = term.replace(/\\*"/g, '');
    }
    term = term.replace(/-/g, '\\\\-');
    if (splitString) {
        termToArray = term.split(' ');
    }
    else {
        termToArray = [term];
    }
    if (allowWildCard) {
        queryTerms = termToArray.map((t) => '*' + t + '*');
    }
    else {
        queryTerms = termToArray;
    }
    queryTerms = queryTerms.join(' ');
    if (allowFuzziness) {
        queryTerms = queryTerms + '~';
    }
    return queryTerms;
};
exports.queryTerm = (termField, termValue) => {
    if (typeof termValue === 'string') {
        return {
            term: {
                [termField]: termValue,
            },
        };
    }
    else {
        return {
            terms: {
                [termField]: termValue,
            },
        };
    }
};
exports.queryRange = (termFields, termValue) => {
    const ranges = [];
    termFields.forEach((element) => {
        ranges.push({
            range: {
                [element.field]: {
                    [element.operator]: termValue,
                },
            },
        });
    });
    return exports.queryBool(ranges).query;
};
exports.buildHighlights = (queryField) => {
    const fields = typeof queryField === 'string' ? queryField.split(',') : queryField;
    const highlight = {};
    for (let f of fields) {
        if (Array.isArray(fields)) {
            fields.forEach((element) => {
                if (element.field && element.field != '') {
                    highlight[element.field] = {};
                }
                else {
                    highlight[element] = {};
                }
            });
        }
        else {
            highlight[f] = {};
        }
    }
    return highlight;
};
exports.buildTeiHeaderResults = (idArray) => { };
exports.buildTextViewerResults = (docResults) => {
    let stripped_doc = docResults.replace(/<!DOCTYPE\s\w+>/g, '');
    let wrapped_doc = '<body>' + stripped_doc + '</body>';
    let convert = require('xml-js');
    let expandedResult = convert.xml2js(wrapped_doc, {
        // ignoreDoctype: true,
        // ignoreDeclaration: true,
        compact: true,
        spaces: 4,
    });
    let matches_result = {
        header_params: [],
    };
    let id_arr = [];
    if (expandedResult['body']['paper-card']) {
        const cards = Array.isArray(expandedResult['body']['paper-card'])
            ? expandedResult['body']['paper-card']
            : [expandedResult['body']['paper-card']];
        cards.map((papercard) => {
            let div = papercard.div;
            let header_id = div.p['_attributes']['root-id'];
            if (header_id) {
                if (!id_arr.includes(header_id)) {
                    id_arr.push(header_id);
                }
            }
            else {
                let breadcrumbs = papercard.breadcrumbs['_text'].split('body/');
                if (breadcrumbs.length > 1) {
                    breadcrumbs = breadcrumbs[1];
                }
                breadcrumbs = breadcrumbs.split('/');
                let path = '';
                breadcrumbs.forEach((el) => {
                    const regexp = /\[(?:@type|@n) eq "([\w]+)"\]/g;
                    const matches = [...el.matchAll(regexp)];
                    if (path != '')
                        path += ', ';
                    for (const match of matches) {
                        path += match[1] + ' ';
                    }
                });
                let id = papercard['_attributes'].id;
                let href = div['_attributes'] ? div['_attributes']['ref'] : '';
                let text_highlight = '';
                if (path != '') {
                    text_highlight =
                        "<span class='mrc__text-breadcrumbs'>" + path + '</span>';
                }
                /*if(div.a.span && Array.isArray(div.a.span)){
                              div.a.span.forEach(element => {
                                  if(element['_attributes'] && element['_attributes']['class'] === "mrc__text-emph"){
                                      text_highlight += "<em class='mrc__text-emph'>" + element['_text'] + "</em>"
                                  } else {
                                      text_highlight += element['_text'] + " "
                                  }
                              });
                          }*/
                if (div.p) {
                    let paragraphs = Array.isArray(div.p) ? div.p : [div.p];
                    paragraphs.forEach((p) => {
                        let texts;
                        if (p._text) {
                            texts = Array.isArray(p._text) ? p._text : [p._text];
                        }
                        const span = Array.isArray(p.span) ? p.span : [p.span];
                        if (texts && texts.length == span.length) {
                            for (let i = 0; i < span.length; i++) {
                                text_highlight +=
                                    texts[i] +
                                        "<em class='mrc__text-emph'>" +
                                        span[i]['_text'] +
                                        '</em>';
                            }
                        }
                        if (texts && texts.length > span.length) {
                            for (let i = 0; i < texts.length; i++) {
                                text_highlight += texts[i];
                                if (span[i]) {
                                    text_highlight +=
                                        "<em class='mrc__text-emph'>" + span[i]['_text'] + '</em>';
                                }
                            }
                        }
                        else if (span.length > 0) {
                            span.forEach((el1) => {
                                if (el1.span) {
                                    el1.span.forEach((el) => {
                                        if (el['_attributes']['class']) {
                                            text_highlight +=
                                                "<span class='" +
                                                    el['_attributes']['class'] +
                                                    "'>" +
                                                    el['_text'] +
                                                    '</span> ';
                                        }
                                        else {
                                            text_highlight += el['_text'] + ' ';
                                        }
                                    });
                                }
                                text_highlight +=
                                    "<span class='mrc__text-emph'>" + el1['_text'] + '</em>';
                            });
                        }
                    });
                }
                if (!matches_result[id]) {
                    matches_result[id] = {
                        matches: [],
                    };
                }
                matches_result[id].matches.push({
                    link: '?root=' + href,
                    text: text_highlight,
                });
            }
        });
    }
    for (let id of id_arr) {
        matches_result.header_params.push(id);
    }
    return matches_result;
};
exports.buildLink = (queryField, sourceField) => {
    const linkToParse = queryField;
    const regExpUrl = /{(.*?)}/g;
    const matchUrl = linkToParse.match(regExpUrl);
    let url = queryField;
    matchUrl.forEach((slug, i) => {
        const key = slug.replace(/[{}]/g, '');
        if (sourceField[key]) {
            url = url.replace(slug, sourceField[key]);
        } //url += sourceField[matchUrl[i]] + '/';
    });
    return url;
};
exports.queryExists = (termField) => {
    return {
        exists: {
            field: termField,
        },
    };
};
exports.mergeTeiPublisherResults = () => { };
