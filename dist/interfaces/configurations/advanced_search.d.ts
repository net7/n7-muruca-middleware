export interface ConfigAdvancedSearch {
    advanced_search: {
        lang: {
            query: {
                type: string;
                field: string;
            };
        };
        /** sort fields. Ex: ['slug.keyword', 'sort_title.keyword']*/
        sort?: string[];
        /** a query executed in any case */
        base_query: {
            /** the field to query on. Ex: "record-type" */
            field: string;
            /** the values to search for. Ex: "record" */
            value: string[];
        };
        /** extra options for query */
        options?: {
            /** esclude some fields from result */
            exclude: string[];
        };
        search_groups: {
            [key: string]: TermAdvancedSearch | FulltextAdvancedSearch | ExistsAdvancedSearch;
        };
        search_full_text: {
            search_groups: {
                [key: string]: TextSearch;
            };
            /** options for inner_hits query on nested object */
            inner_hits?: InnerHitsOption;
            /** extra options for query */
            options: {
                /**path of property of xml tranacription object */
                path: string;
            };
        };
        /** enables highlights */
        show_highlights?: boolean;
        /** Options for dynamic options fields */
        dynamic_options?: {
            fields: DynamicOptionField[];
        };
        /**results formatting */
        results: ResultsFormatData[];
    };
}
/** query based on a set of specific terms */
export interface TermAdvancedSearch extends CommonSettingsAdvancedSearch {
    /**
     * term_value: search the input value into the fields
     * term_field_value: search the input value into the input field. Use the "field" as default
    */
    type: "term_value" | "term_field_value";
    /** the fields to query on. Ex: "["record-type", "author.name", "date.range"] */
    field: string;
    /** @default AND */
    operator?: "OR" | "AND";
    /** only for "term_field_value" type */
    query_params?: {
        /**the query_param containing the field to search on */
        "field": string;
        /**the query_param containing the value to search */
        "value": string;
    };
    highlightField?: string;
}
/** fulltext query */
export interface FulltextAdvancedSearch extends TextSettingsAdvancedSearch, CommonSettingsAdvancedSearch {
    type: "fulltext";
    /** the field to query on. Ex: "["title", "description"] */
    field: string[];
}
/** exists query */
export interface ExistsAdvancedSearch extends CommonSettingsAdvancedSearch {
    type: "term_exists";
    /** the field to query */
    field: string;
}
export interface TextSettingsAdvancedSearch {
    /**
     * @default true
     *  add \* to the begininning and end of a string
     *
    */
    addStar?: boolean;
    /**
     * @default false
     *  strips all " characters inside string. Set to true to implement exact match
     *
     */
    stripDoubleQuotes?: boolean;
    /**
     * @default false
     *  allow fuzzy search
     *
     */
    allowFuzziness?: boolean;
}
export interface CommonSettingsAdvancedSearch {
    /**
     *  @default false
     * exclude field from highlights
    */
    noHighlight?: boolean;
}
export interface ResultsFormatData {
    /** label for metadata */
    label: string;
    /** metadata field. If the metadata is a link (see IsLink property) the field may be a string with placeholders like "/{record-type}/{id}/{slug}"  */
    field?: string;
    "max-char"?: number;
    /** the value is a link */
    isLink?: boolean;
    /** set of fields */
    fields?: ResultsFormatData[];
}
export interface DynamicOptionField {
    key: string;
    content_type: string;
}
export interface TextSearch {
    type: "fulltext" | "xml_attribute";
    /** path of nested node */
    path?: string;
    /** the fields to query on */
    fields: String[];
    /** the fields to highlight */
    highlight?: String[] | Object[];
    /** extra options for query */
    options?: {
        /** esclude some fields from result */
        nested: string;
    };
}
export interface InnerHitsOption {
    /** the fields to sort on. Example: ["_doc"] to use the occurences order */
    sort?: String[];
    /** the fields to include in results */
    "source": String[];
    "size": number;
}
