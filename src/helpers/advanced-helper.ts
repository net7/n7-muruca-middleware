export const queryBool = (
    mustList = [],
    shouldList = [],
    filterList = [],
    notList = []
) => {
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

export const matchPhrase = (queryField: {
    fields: string;
    value: any;
    distance: number;
}): any => {
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

export const queryString = (
    queryField: { fields: any; value: string },
    default_operator = 'AND',
    boost: number = null
): any => {
    const fields =
        typeof queryField.fields == 'string'
            ? queryField.fields.split(',')
            : queryField.fields;
    const x = {
        query_string: {
            query: queryField.value,
            fields: fields,
            default_operator: default_operator,
            lenient: true,
            // "fuzziness": fuzziness FIXME
        },
    };
    if (boost) {
        x.query_string['boost'] = boost;
    }
    return x;
};

export const simpleQueryString = (
    queryField: { fields: any; value: string },
    default_operator = 'AND',
    replaceBoolean: boolean = true,
    _name: string =""
): any => {
    const fields =
        typeof queryField.fields == 'string'
            ? queryField.fields.split(',')
            : queryField.fields;
            
    _name = _name == "" &&  typeof queryField.fields == 'string' ? queryField.fields : _name;
    
    let term = queryField.value;
    if ( replaceBoolean ){
        term = term.replace(/\sAND\s/g, '+').replace(/\sOR\s/g, '|').replace(/\sNOT\s/g, '-');
    }
    
    const x = {
        simple_query_string: {
            query: term,
            fields: fields,
            default_operator: default_operator,
            _name: _name
        },
    };
    return x;
};

export const spanNear = (queryField: {
    fields: string;
    value: any;
    distance: number;
}): any => {
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

export const buildQueryString = (term: any, options: any = {}) => {
    const allowWildCard =
        options.allowWildCard != 'undefined' ? options.allowWildCard : true,
        splitString = options.splitString ? options.splitString : true,
        stripDoubleQuotes = options.stripDoubleQuotes
            ? options.stripDoubleQuotes
            : false,
        allowFuzziness = options.allowFuzziness ? options.allowFuzziness : false;
    let termToArray: any, queryTerms: any;
    //escape slash ( \ )
    term = term.replace(/\//g, '\\/');

    if (stripDoubleQuotes) {
        term = term.replace(/\\*"/g, '');
    }
    term = term.replace(/-/g, '\\\\-');
    if (splitString) {
        termToArray = term.split(' ');
    } else {
        termToArray = [term];
    }
    if (allowWildCard) {
        queryTerms = termToArray.map((t) => '*' + t + '*');
    } else {
        queryTerms = termToArray;
    }

    queryTerms = queryTerms.join(' ');
    if (allowFuzziness) {
        queryTerms = queryTerms + '~';
    }
    return queryTerms;
};

export const queryTerm = (termField: any, termValue: any) => {
    if (typeof termValue === 'string') {
        return {
            term: {
                [termField]: termValue,
            },
        };
    } else {
        return {
            terms: {
                [termField]: termValue,
            },
        };
    }
};

export const queryRange = (termFields: [], termValue: any) => {
    const ranges = [];
    termFields.forEach((element: any) => {
        ranges.push({
            range: {
                [element.field]: {
                    [element.operator]: termValue,
                },
            },
        });
    });
    return queryBool(ranges).query;
};


export const buildHighlights = (queryField: any, prePostTag: any = null, highlightQuery: boolean = false) => {
    const fields =
        typeof queryField === 'string' ? queryField.split(',') : queryField;
    const highlight = {};
    for (let f of fields) {
        if (Array.isArray(fields)) {
            fields.forEach((element) => {
                if (element.field && element.field != '') {
                    highlight[element.field] = highlightValue(element.field, prePostTag, highlightQuery);
                } else {
                    highlight[element] = highlightValue(element, prePostTag, highlightQuery);;
                }
            });
        } else {
            highlight[f] = highlightValue(f, prePostTag, highlightQuery);;
        }

    }
    return highlight;
};

export const highlightValue = ( field, prePostTag, highlightQuery ) => {
  const highlightValue = {};

  if (prePostTag){
    highlightValue['pre_tags'] = prePostTag[0];
    highlightValue['post_tags'] = prePostTag[1];
  }

  if(highlightQuery) {
    highlightValue['highlight_query'] = {
      "regexp": {
        [field]: {
            "value": ".*"
        }
      }
    }
  }
  return highlightValue;
}

export const buildTeiHeaderResults = (headerResults: any) => {
    let stripped_doc = headerResults.replace(/<!DOCTYPE\s\w+>/g, '');
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
            var _a;
            let div = papercard.div;
            let header_id =
                (_a = div.p['_attributes']) === null || _a === void 0
                    ? void 0
                    : _a['root-id'];
            if (header_id && header_id != '') {
                if (!id_arr.includes(header_id)) {
                    id_arr.push(header_id);
                }
            }
        });
    }
    for (let id of id_arr) {
        matches_result.header_params.push(id);
    }
    return matches_result;
};

export const buildTextViewerResults = (docResults: any) => {
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
            var _a;
            let div = papercard.div;
            let header_id =
                (_a = div.p['_attributes']) === null || _a === void 0
                    ? void 0
                    : _a['root-id'];
            if (header_id && header_id != '') {
                if (!id_arr.includes(header_id)) {
                    id_arr.push(header_id);
                }
            } else {
                let breadcrumbs = papercard.breadcrumbs['_text'].split('body/');
                if (breadcrumbs.length > 1) {
                    breadcrumbs = breadcrumbs[1];
                }
                breadcrumbs = breadcrumbs.split('/');
                let path = '';
                breadcrumbs.forEach((el) => {
                    const regexp = /\[(?:@type|@n) eq "([\w]+)"\]/g;
                    const matches = [...el.matchAll(regexp)];
                    if (path != '') path += ', ';
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
                        } else if (span.length > 0) {
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
                                        } else {
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

export const buildLink = (queryField, sourceField) => {
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

export const queryExists = (termField: any) => {
    return {
        exists: {
            field: termField,
        },
    };
};

export const mergeTeiPublisherResults = () => { };

export const extractNestedFields = (fieldArray, obj) => {
    let firstField = fieldArray.shift();
    if (obj.hasOwnProperty(firstField)) {
        let value = '';
        if (Array.isArray(obj[firstField])) {
            for (let el of obj[firstField]) {
                if (typeof el === 'object') {
                    let tmpVal = exports.extractNestedFields(fieldArray, el);
                    value = value === '' ? tmpVal : value + ', ' + tmpVal;
                    return value;
                } else {
                    return el.join(', ');
                }
            }
        } else if (typeof obj[firstField] === 'object') {
            let tmpVal = exports.extractNestedFields(fieldArray, obj[firstField]);
            value = value === '' ? tmpVal : value + ', ' + tmpVal;
            return value;
        } else {
            return obj[firstField];
        }
    }
};

export const nestedQuery = (path: string, query: any, inner_hits:any = null) => {
    
    const nested = {
        "path": path,
        "query": query
    };
    
    if (inner_hits){
        const ih:any = {
            "size": 30            
        };
        if (inner_hits.highlight){
            ih['highlight'] = {
                "fields": inner_hits.highlight,
                "pre_tags": ["<em class='mrc__text-emph'>"],
                "post_tags": ['</em>'],
                "fragment_size": 500,
                'type': 'plain',
                "order": "none",                
                "number_of_fragments": 30
            }
        }
        if (inner_hits.sort){
            ih.sort = inner_hits.sort
        }        
        if (inner_hits.source){
            ih._source = inner_hits.source
        }
        if (inner_hits.name){
            ih.name = inner_hits.name
        }
        nested['inner_hits'] = ih;
    }
    return nested;    
    
}


