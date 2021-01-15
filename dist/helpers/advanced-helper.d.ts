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
export declare const buildQueryString: (term: any, options?: any) => any;
export declare const queryTerm: (termField: any, termValue: any) => {
    term: {
        [x: number]: any;
    };
};
export declare const queryExists: (termField: any) => {
    query: {
        exists: {
            field: any;
        };
    };
};
