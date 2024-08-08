export declare class Controller {
    private config;
    constructor(config: any);
    postTest: (event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse>;
    getTest: (event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse>;
    getNavigation: (_event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse>;
    getHomeLayout: (event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse>;
    getSearchDescription: (event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse>;
    getTimeline: (event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse>;
    getMap: (event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse>;
    getResource: (event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse>;
    getPDF: (event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse | {
        statusCode: number;
        headers: {
            "Content-Type": string;
            "Content-Disposition": string;
        };
        body: unknown;
        isBase64Encoded: boolean;
    }>;
    search: (event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse>;
    advancedSearch: (event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse>;
    advancedSearchTextSearch: (event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse>;
    teiPubGetNodePath: (event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse>;
    advancedSearchOptions: (event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse>;
    getFooter: (_event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse>;
    getTranslation: (event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse>;
    getStaticPage: (event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse>;
    getStaticPost: (event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse>;
    getTypeList: (event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse>;
    getItineraries: (event: any, _context: any, _callback: any) => Promise<void>;
    getItinerary: (event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse>;
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
        getTypeList: any;
        getItinerary: any;
        getItineraries: any;
        advancedSearchOptions: any;
        teiPubGetNodePath: any;
        advancedSearchTextSearch: any;
        getPDF: any;
    };
}
