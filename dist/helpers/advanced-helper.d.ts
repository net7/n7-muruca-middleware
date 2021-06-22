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
export declare const spanNear: (queryField: {
    fields: string;
    value: any;
    distance: number;
}) => any;
export declare const buildQueryString: (term: any, options?: any) => any;
export declare const queryTerm: (termField: any, termValue: any) => {
    term: {
        [x: number]: string;
    };
    terms?: undefined;
} | {
    terms: {
        [x: number]: any;
    };
    term?: undefined;
};
export declare const queryRange: (termFields: [], termValue: any) => {
    bool: {
        must: any[];
        should: any[];
        filter: any[];
        must_not: any[];
    };
};
export declare const buildHighlights: (queryField: any) => {};
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
