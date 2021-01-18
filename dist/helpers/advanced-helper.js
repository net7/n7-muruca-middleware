"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryExists = exports.queryTerm = exports.buildQueryString = exports.queryString = exports.matchPhrase = exports.queryBool = void 0;
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
exports.buildQueryString = (term, options = {}) => {
    const allowWildCard = options.allowWildCard != "undefined" ? options.allowWildCard : true, splitString = options.splitString ? options.splitString : true, stripDoubleQuotes = options.stripDoubleQuotes ? options.stripDoubleQuotes : false, allowFuzziness = options.allowFuzziness ? options.allowFuzziness : false;
    let termToArray, queryTerms;
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
    return {
        term: {
            [termField]: termValue
        }
    };
};
exports.queryExists = (termField) => {
    return {
        query: {
            exists: {
                field: termField
            }
        }
    };
};
