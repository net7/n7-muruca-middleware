"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeTeiPublisherResults = exports.queryExists = exports.buildLink = exports.buildHighlights = exports.queryTerm = exports.buildQueryString = exports.spanNear = exports.queryString = exports.matchPhrase = exports.queryBool = void 0;
exports.queryBool = (mustList = [], shouldList = [], filterList = [], notList = []) => {
    const x = {
        query: {
            bool: {
                must: mustList,
                should: shouldList,
                filter: filterList,
                must_not: notList
            }
        }
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
exports.queryString = (queryField, default_operator = "AND", boost = null) => {
    const fields = typeof queryField.fields == "string" ? queryField.fields.split(',') : queryField.fields;
    const x = {
        query_string: {
            query: queryField.value,
            fields: fields,
            default_operator: default_operator,
            lenient: true,
        }
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
            in_order: true
        },
    };
    const words = queryField.value.split(" ");
    words.forEach(element => {
        x.span_near.clauses.push({
            "span_multi": {
                "match": {
                    "wildcard": {
                        [queryField.fields]: element
                    }
                }
            }
        });
    });
    return x;
};
exports.buildQueryString = (term, options = {}) => {
    const allowWildCard = options.allowWildCard != "undefined" ? options.allowWildCard : true, splitString = options.splitString ? options.splitString : true, stripDoubleQuotes = options.stripDoubleQuotes ? options.stripDoubleQuotes : false, allowFuzziness = options.allowFuzziness ? options.allowFuzziness : false;
    let termToArray, queryTerms;
    //escape slash ( \ )
    term = term.replace(/\//g, "\\/");
    if (stripDoubleQuotes) {
        term = term.replace(/\\*"/g, "");
    }
    term = term.replace(/-/g, "\\\\-");
    if (splitString) {
        termToArray = term.split(" ");
    }
    else {
        termToArray = [term];
    }
    if (allowWildCard) {
        queryTerms = termToArray.map(t => "*" + t + "*");
    }
    else {
        queryTerms = termToArray;
    }
    queryTerms = queryTerms.join(" ");
    if (allowFuzziness) {
        queryTerms = queryTerms + "~";
    }
    return queryTerms;
};
exports.queryTerm = (termField, termValue) => {
    if (typeof termValue === "string") {
        return {
            term: {
                [termField]: termValue
            }
        };
    }
    else {
        return {
            terms: {
                [termField]: termValue
            }
        };
    }
};
exports.buildHighlights = (queryField) => {
    const fields = typeof queryField === "string" ? queryField.split(',') : queryField;
    const highlight = {};
    for (let f of fields) {
        highlight[f] = {};
    }
    return highlight;
};
exports.buildLink = (queryField, sourceField) => {
    const linkToParse = queryField;
    const regExpUrl = /{(.*?)}/g;
    const matchUrl = linkToParse.match(regExpUrl);
    let url = queryField;
    matchUrl.forEach((slug, i) => {
        const key = slug.replace(/[{}]/g, "");
        if (sourceField[key]) {
            url = url.replace(slug, sourceField[key]);
        } //url += sourceField[matchUrl[i]] + '/';
    });
    return url;
};
exports.queryExists = (termField) => {
    return {
        exists: {
            field: termField
        }
    };
};
exports.mergeTeiPublisherResults = () => {
};
