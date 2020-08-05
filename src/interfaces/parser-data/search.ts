/**
 * Interface for the Search Results component
 */
export interface SearchResultsData {
    page: number;
    sort: string;
    limit: number;
    total_count: number;
    results: ResultsData[];
}

export interface ResultsData {
    title: string;
    text?: string;
    image?: string;
    id: number;
    link: string;
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
    [key: string]: Facets[];
}

export interface Facets {
    tesx: string;
    counter: number;
    payload?: string;
}