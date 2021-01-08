export declare class Controller {
    private config;
    constructor(config: any);
    getNavigation: (_event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse>;
    getHomeLayout: (event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse>;
    getSearchDescription: (event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse>;
    getTimeline: (event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse>;
    getResource: (event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse>;
    search: (event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse>;
    getFooter: (_event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse>;
    getTranslation: (event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse>;
    getStaticPage: (event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse>;
    getStaticPost: (event: any, _context: any, _callback: any) => Promise<import("./interfaces/helper").HTTPResponse>;
    getSlsMethods(): {
        getNavigation: any;
        getFooter: any;
        getHomeLayout: any;
        getSearchDescription: any;
        getTimeline: any;
        getResource: any;
        search: any;
        getTranslation: any;
        getStaticPage: any;
        getStaticPost: any;
    };
}
