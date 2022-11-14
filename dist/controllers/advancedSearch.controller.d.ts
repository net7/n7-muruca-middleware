export declare class advancedSearchController {
    search: (body: any, config: any, locale?: string) => Promise<import("..").SearchResultsData | {
        error: string;
    }>;
    /**
     * Search term in text and replaces the highlighted results in original xml file
     *
     */
    advancedSearchTextSearch: (body: any, config: any, locale?: string) => Promise<{
        error: string;
    }>;
}
