/**
 * Interface for the Search Results component
 */
export interface SearchResultsData {
    page: number;
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