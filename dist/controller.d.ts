import { Request, Response } from 'express';
export declare class Controller {
    private config;
    constructor(config: any);
    /**
     * Test if the post request is working.
     * @param request POST request
     * @param res  Response
     */
    postTest: (request: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * Test if the get request is working.
     * @param request GET request
     * @param res  Response
     */
    getTest: (request: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * Fetch the main menu of the app.
     * @param request GET request
     * @param res  Response
     */
    getNavigation: (request: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * Fetch data for the home layout components.
     * @param request POST request
     * @param res  Response
     */
    getHomeLayout: (request: Request, res: Response) => Promise<import("./interfaces/helper").HTTPResponse | Response<any, Record<string, any>>>;
    /**
     * Fetch the description content of the search page.
     * @param request GET request
     * @param res  Response
     */
    getSearchDescription: (request: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * Fetch data for the timeline component.
     * @param request GET request
     * @param res  Response
     */
    getTimeline: (request: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * Fetch data for the map component.
     * @param request GET request
     * @param res  Response
     */
    getMap: (request: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * Fetch data for the resource layout.
     * @param request POST request
     * @param res  Response
     * @param res response
     */
    getResource: (request: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * Submit a query and fetch the results.
     * @param request POST request
     * @param res  Response
     */
    getPDF: (event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse | {
        statusCode: number;
        headers: {
            "Content-Type": string;
            "Content-Disposition": string;
        };
        body: unknown;
        isBase64Encoded: boolean;
    }>;
    search: (request: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * Submit a query and fetch the results.
     * @param request POST request
     * @param res  Response
     */
    advancedSearch: (request: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * Submit a text query and fetch the results.
     * @param request POST request
     * @param res  Response
     */
    advancedSearchTextSearch: (request: Request, res: Response) => Promise<import("./interfaces/helper").HTTPResponse>;
    /**
     * Fetch data for tei-publisher component.
     * @param request POST request
     * @param res  Response
     */
    teiPubGetNodePath: (request: Request, res: Response) => Promise<import("./interfaces/helper").HTTPResponse>;
    /**
     * Fetch the available filters for the search page.
     * @param request GET request
     * @param res  Response
     */
    advancedSearchOptions: (request: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * Fetch data for the footer component.
     * @param request GET request
     * @param res  Response
     */
    getFooter: (request: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * Fetch the translation strings in the language specified by the "?lang" query parameter.
     * @param request GET request
     * @param res  Response
     */
    getTranslation: (request: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * Fetch the content of a static resource.
     * @param request GET request
     * @param res  Response
     */
    getStaticPage: (request: Request, res: Response) => Promise<import("./interfaces/helper").HTTPResponse | Response<any, Record<string, any>>>;
    /**
     * Fetch the content of a static post.
     * @param request GET request
     * @param res  Response
     */
    getStaticPost: (request: Request, res: Response) => Promise<import("./interfaces/helper").HTTPResponse | Response<any, Record<string, any>>>;
    /**
     * Get a list of objects of the defined type.
     * @param request POST request
     * @param res  Response
     */
    getObjectsByType: (request: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * Fetch the list of available itineraries for geographic datasets.
     * @param request GET request
     * @param res  Response
     */
    getItineraries: (request: Request, res: Response) => Promise<void>;
    /**
     * Fetch the data of a specific itinerary.
     * @param request GET request
     * @param res  Response
     */
    getItinerary: (request: Request, res: Response) => Promise<import("./interfaces/helper").HTTPResponse | Response<any, Record<string, any>>>;
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
        getPDF: any;
    };
}
