export interface ESQuery {
    aggregations?: object;
    hits?: {
        hits: object[];
        total: {
            value: number | null;
        };
    };
}
