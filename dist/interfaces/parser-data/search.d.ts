/**
 * Interface for the Search Results component
 */
export interface SearchResultsData {
    offset: number;
    sort: string;
    limit: number;
    total_count: number;
    results: SearchResultsItemData[];
}
/**
 * Interface for the Search Results items
 */
export interface SearchResultsItemData {
    title: string;
    text?: string;
    image?: string;
    id: number;
    link: string;
    highlightsTitle?: string;
    highlights: Array<{
        link: {
            absolute?: string;
            query_string?: boolean;
        };
        xpath?: string;
        text?: string;
    }>;
    tei_doc?: string;
    routeId?: string;
    slug?: string;
    metadata?: Array<{
        items: Array<{
            label: string;
            value: string;
        }>;
    }>;
}
/**
 * Interface for the Search Facets component
 */
export interface SearchFacetsData {
    headers: FacetsHeader;
    inputs: FacetsInputs;
}
export interface FacetsHeader {
    [key: string]: string;
}
export interface FacetsInputs {
    [key: string]: {
        text: string;
        counter: number;
        payload?: string;
    }[];
}
