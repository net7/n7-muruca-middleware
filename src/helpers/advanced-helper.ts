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
    return {
      term: {
        [termField]: termValue
      }
    }
  ​
  ​
  }

  export const queryExists = (termField: any) => {
    return {
        exists: {
          field: termField
        }
    }
  ​
  ​
  }