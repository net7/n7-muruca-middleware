export const queryBool = (mustList = [], shouldList = [], filterList = [], notList = []) => {
	const x = {
		query: {
			bool: {
				must: mustList,
				should: shouldList,
				filter: filterList,
				must_not: notList
			}
		}
	}
	return x
}

export const matchPhrase = (queryField: { fields: string, value: any, distance: number }):any => {
	const x = {
        match_phrase: {
            [queryField.fields]: {
            query: queryField.value,
            slop: queryField.distance || 1,
          },
        },
      };
​
	return x
}


export const queryString = (queryField: { fields: any, value: string }, default_operator = "AND", boost:number = null):any => {
  const fields = typeof queryField.fields == "string" ? queryField.fields.split(',') : queryField.fields;
	const x = {
		query_string: {
			query: queryField.value,
      fields: fields,
      default_operator: default_operator,
      lenient: true,
      // "fuzziness": fuzziness FIXME
		}
  }
​
  if (boost) {
    x.query_string['boost'] = boost;
  }
​
	return x
}

export const spanNear = (queryField: { fields: string, value: any, distance: number }):any => {
	const x = {
        span_near: {
          clauses: [],
          slop: queryField.distance,
          in_order: true
        },
      };

  const words = queryField.value.split(" ");
  words.forEach(element => {
    x.span_near.clauses.push(
      {
        "span_multi": {
            "match": {
                "wildcard": {
                    [queryField.fields]: element
                }
            }
        }
      }
    )
  });
​
	return x
}

export const buildQueryString = (term: any, options: any = {}) => {
  ​
    const allowWildCard = options.allowWildCard != "undefined" ? options.allowWildCard : true,
          splitString = options.splitString ? options.splitString : true,
          stripDoubleQuotes = options.stripDoubleQuotes ? options.stripDoubleQuotes : false,
          allowFuzziness = options.allowFuzziness ? options.allowFuzziness : false;
  ​
    let termToArray:any,
        queryTerms:any;
  ​
   //escape slash ( \ )
   term = term.replace(/\//g, "\\/");
   
    if ( stripDoubleQuotes ){
      term = term.replace(/\\*"/g,"");
    }
  ​
    term = term.replace(/-/g,"\\\\-");
  ​
    if( splitString ) {
      termToArray = term.split(" ");
    } else {
      termToArray = [term];
    }
  ​
    if ( allowWildCard ) {
      queryTerms = termToArray.map( t => "*" + t + "*");
    } else {
      queryTerms = termToArray;
    }
    
    queryTerms =  queryTerms.join(" ");
    if( allowFuzziness ) {
      queryTerms = queryTerms + "~";
    }
  ​
    return queryTerms;
  ​
  }

  export const queryTerm = (termField: any, termValue: any) => {
    if( typeof termValue === "string"){
      return {
        term: {
          [termField]: termValue
        }
      } 
    } else  {
      return {
        terms: {
          [termField]: termValue
        }
      } 
    }    ​
  }

  export const queryRange = (termFields: [], termValue: any, ) => {

    const ranges = [];
    termFields.forEach( (element:any) => {
      ranges.push(
        {
          range: {
            [element.field]: {
              [element.operator]: termValue
            }
          }
        }
      )
    });
    return queryBool(ranges).query;      ​
  }

  export const buildHighlights = (queryField: any) => {
    const fields = typeof queryField === "string" ? queryField.split(',') : queryField;
    const highlight = {};
    for (let f of fields) {
      if(Array.isArray(fields)){
        fields.forEach(element => {
            if(element.field && element.field != ""){
                highlight[element.field ] = {};
            } else {
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

export const buildLink = (queryField, sourceField) => {
  const linkToParse = queryField;
    const regExpUrl = /{(.*?)}/g;
    const matchUrl = linkToParse.match(regExpUrl);
    let url = queryField;

    matchUrl.forEach((slug, i) => {
      const key = slug.replace(/[{}]/g, "");
      if (sourceField[key]) {
          url = url.replace( slug, sourceField[key] );            
      }            //url += sourceField[matchUrl[i]] + '/';
        
    }); 
    return url;
};

  export const queryExists = (termField: any) => {
    return {
        exists: {
          field: termField
        }
    }
  ​
  }

  export const mergeTeiPublisherResults = () => {
    
  }