export interface ConfigSearch {
    /** the list of search keys to configure. Use "results" to add the results settings */
    [key:string]: SearchStruct | SearchResults[]
    
}

export interface SearchStruct {
    /** a query executed in any case */
    base_query?: {
        /** the field to query on. Ex: "record-type" */
        field?: string
        /** the values to search for. Ex: "record" */
        value?: string
    },
    /** sort fields. Ex: ['slug.keyword', 'sort_title.keyword']*/
    sort: string[]
    lang: {
        query: {
            type: string,
            field: string
        }
    }
    /** extra options for query */
    options? : {
        /** esclude some fields from result */
        exclude?: string[],
        /** esclude some fields from result */
        include?: string[]
    }
    /** list of facets. The keys must be the same received from the request */
    "facets-aggs": {
        type: 'obj'
        aggregations: {
            [key:string]: SearchAggregation
        }
    }
    /** list of filters to apply on query. The keys must be the same received from the request and used in "facets-aggs" field */
    filters: {
        [key:string]: SearchFilter
    }    
}

export interface SearchAggregation {
    /** @default false set to true if aggregation is made on a nested field */
    nested: boolean
    /** The list of parent fields of a nested field. Ex: ["taxonomies", "place"] */
    nestedFields?: string[],
    /**the field to use for aggregation. Ex: autore.name.keyword */
    search: string
    /**the field to display as label. Ex: autore.name.keyword */
    title: string
    /** set the alphatical sort order on aggregation term */
    sort?: "term"
    /** set manual order for facets. Ex: ["not defined", "before 1600", "1600-1650" ] */
    sortValues?: string[]
    /** The fields used for search inside the facet. Ex: ["taxonomies.place.name"] */
    innerFilterField?: string[]
    /** Apply a general filter to the aggregation*/
    generalFilter?: {
      /** fields to filter on */
      fields: string[],
      /** value to filter */
      value: string
    }
    /** an object of extra properties to send in response made by a pair of key:field_to_send. Ex: {"lat": "cadastral_unit.geolocation.markers.lat", "lon": "cadastral_unit.geolocation.markers.lng"}  */
    extra?: {
        [key:string]: string
    }
    /** gives a set of ranges to use for aggragations. Ex: [{from: 1200, to: 1225}, {from: 1225, to: 1250}]  */
    ranges?: RangeAggregation[]
    /** @default false sets if the aggregations is global (not based on current query) */
    global?: boolean
}

export interface SearchFilter {
    /** Sets filter type. use "fulltext" for free search filters, "multivalue" for facet, "range" for search inside ranges */
    type: "fulltext" | "multivalue" | "range"
    /** add \* characters at beginning and end of the term */
    addStar?: boolean
    /** the field to query on. Ex: "author.keyword" */
    field: string | string[]
    /** @default AND */
    operator?: "OR" | "AND"
    /** @default false set to true if aggregation is made on a nested field */
    nested?: boolean
    /** The list of parent fields of a nested field. Ex: ["taxonomies", "place"] */
    nestedFields?: string[],
    
}

export interface RangeAggregation {
    from: number
    to: number
}

export interface SearchResults {
    /** the label to show in results list
     * "title": used to show the title of the record
     * "text": used to show a short description of the record
     * "metadata": used to show a set of metadata of the record
     * "metadata": used to show a set of highlights terms of the record
     * "link": used to build the link to the record
     * "image": used to show a thumbnail of the record
     * "id": the id of the record
     * "routeId": id used to build the link to the record
     * "slug": the slug of the record
     */
    label: "title" | "text" | "metadata" | "highlights" | "id" | "link" | "image" | "routeId" | "slug"
    /** the field value to return. 
     * label: "metadata" it may be an array of fields. Ex.  ['curator', 'autore']
     * label:"link" the fields value are used to build the link to the record.Ex: field: ['id', 'slug']*/
    field: string | string[]
    /** the max number of chars to return */
    'max-char'?: number
}
