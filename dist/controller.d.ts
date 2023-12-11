import { Request } from 'express';
export declare class Controller {
    private config;
    constructor(config: any);
    /**
     * Test if the post request is working.
     * @param request POST request
     */
    postTest: (request: Request) => Promise<import("./interfaces/helper").HTTPResponse>;
    /**
     * Test if the get request is working.
     * @param request GET request
     */
    getTest: (request: Request) => Promise<import("./interfaces/helper").HTTPResponse>;
    /**
     * Fetch the main menu of the app.
     * @param request GET request
     */
    getNavigation: (request: Request) => Promise<import("./interfaces/helper").HTTPResponse>;
    /**
     * Fetch data for the home layout components.
     * @param request POST request
     */
    getHomeLayout: (request: Request) => Promise<import("./interfaces/helper").HTTPResponse>;
    /**
     * Fetch the description content of the search page.
     * @param request GET request
     */
    getSearchDescription: (request: Request) => Promise<import("./interfaces/helper").HTTPResponse>;
    /**
     * Fetch data for the timeline component.
     * @param request GET request
     */
    getTimeline: (request: Request) => Promise<import("./interfaces/helper").HTTPResponse>;
    /**
     * Fetch data for the map component.
     * @param request GET request
     */
    getMap: (request: Request) => Promise<import("./interfaces/helper").HTTPResponse>;
    /**
     * Fetch data for the resource layout.
     * @param request POST request
     */
    getResource: (request: Request) => Promise<import("./interfaces/helper").HTTPResponse>;
    /**
     * Submit a query and fetch the results.
     * @param request POST request
     */
    search: (request: Request) => Promise<import("./interfaces/helper").HTTPResponse>;
    /**
     * Submit a query and fetch the results.
     * @param request POST request
     */
    advancedSearch: (request: Request) => Promise<import("./interfaces/helper").HTTPResponse>;
    /**
     * Submit a text query and fetch the results.
     * @param request POST request
     */
    advancedSearchTextSearch: (request: Request) => Promise<import("./interfaces/helper").HTTPResponse>;
    /**
     * Fetch data for tei-publisher component.
     * @param request POST request
     */
    teiPubGetNodePath: (request: Request) => Promise<import("./interfaces/helper").HTTPResponse>;
    /**
     * Fetch the available filters for the search page.
     * @param request GET request
     */
    advancedSearchOptions: (request: Request) => Promise<import("./interfaces/helper").HTTPResponse>;
    /**
     * Fetch data for the footer component.
     * @param request GET request
     */
    getFooter: (request: Request) => Promise<import("./interfaces/helper").HTTPResponse>;
    /**
     * Fetch the translation strings in the language specified by the "?lang" query parameter.
     * @param request GET request
     */
    getTranslation: (request: Request) => Promise<import("./interfaces/helper").HTTPResponse>;
    /**
     * Fetch the content of a static resource.
     * @param request GET request
     */
    getStaticPage: (request: Request) => Promise<import("./interfaces/helper").HTTPResponse>;
    /**
     * Fetch the content of a static post.
     * @param request GET request
     */
    getStaticPost: (request: Request) => Promise<import("./interfaces/helper").HTTPResponse>;
    /**
     * Get a list of objects of the defined type.
     * @param request POST request
     */
    getObjectsByType: (request: Request) => Promise<import("./interfaces/helper").HTTPResponse>;
    /**
     * Fetch the list of available itineraries for geographic datasets.
     * @param request GET request
     */
    getItineraries: (request: Request) => Promise<void>;
    /**
     * Fetch the data of a specific itinerary.
     * @param request GET request
     */
    getItinerary: (request: Request) => Promise<import("./interfaces/helper").HTTPResponse>;
    getSlsMethods(): {
        postTest: any;
        getTest: any;
        getNavigation: any;
        getFooter: any;
        getHomeLayout: any;
        getSearchDescription: any;
        getTimeline: any;
        getMap: any;
        getResource: any;
        search: any;
        advancedSearch: any;
        getTranslation: any;
        getStaticPage: any;
        getStaticPost: any;
        getObjectsByType: any;
        getItinerary: any;
        getItineraries: any;
        advancedSearchOptions: any;
        teiPubGetNodePath: any;
        advancedSearchTextSearch: any;
    };
}
