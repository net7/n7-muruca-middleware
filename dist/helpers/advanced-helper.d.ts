export declare const queryBool: (mustList?: any[], shouldList?: any[], filterList?: any[], notList?: any[]) => {
    query: {
        bool: {
            must: any[];
            should: any[];
            filter: any[];
            must_not: any[];
        };
    };
};
export declare const matchPhrase: (queryField: {
    fields: string;
    value: any;
    distance: number;
}) => any;
export declare const queryString: (queryField: {
    fields: any;
    value: string;
}, default_operator?: string, boost?: number) => any;
export declare const simpleQueryString: (queryField: {
    fields: any;
    value: string;
}, default_operator?: string, replaceBoolean?: boolean, _name?: string) => any;
export declare const spanNear: (queryField: {
    fields: string;
    value: any;
    distance: number;
    in_order?: boolean;
}) => any;
export declare const buildQueryString: (term: any, options?: any) => any;
export declare const queryTerm: (termField: string, termValue: any, _name?: string) => {
    terms: {
        [x: string]: any;
        _name: string;
    };
};
export declare const queryRange: (termFields: [], termValue: any) => {
    bool: {
        must: any[];
        should: any[];
        filter: any[];
        must_not: any[];
    };
};
export declare const buildHighlights: (queryField: any, noHighlightFields?: string[]) => {};
export declare const highlightValue: (field: any, prePostTag: any, highlightQuery: any) => {};
export declare const buildTeiHeaderResults: (headerResults: any) => {
    header_params: any[];
};
export declare const buildTextViewerResults: (docResults: any) => {
    header_params: any[];
};
export declare const buildLink: (queryField: any, sourceField: any) => any;
export declare const queryExists: (termField: any) => {
    exists: {
        field: any;
    };
};
export declare const mergeTeiPublisherResults: () => void;
export declare const extractNestedFields: (fieldArray: any, obj: any) => any;
export declare const nestedQuery: (path: string, query: any, inner_hits?: any) => {
    path: string;
    query: any;
};
export declare const checkMatchedQuery: (prop: any, matched_queries: any) => boolean;
export declare const buildSortParam: (sort: string, sort_conf: any) => {};
