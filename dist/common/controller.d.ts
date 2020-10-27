export declare class Controller {
    private projectPath;
    private environment;
    constructor(projectPath: any, environment: any);
    conf(projectPath: any, env: any): void;
    /**
     *  MENU - GET
     **/
    getNavigation: (_event: any, _context: any, _callback: any) => Promise<import("../interfaces/helper").HTTPResponse>;
    /**
     *  HOME LAYOUT - POST
     **/
    getHomeLayout: (event: any, _context: any, _callback: any) => Promise<import("../interfaces/helper").HTTPResponse>;
    /**
     *  RESOURCE - POST
     **/
    getResource: (event: any, _context: any, _callback: any) => Promise<import("../interfaces/helper").HTTPResponse>;
    /**
     *  SEARCH - POST
     **/
    search: (event: any, _context: any, _callback: any) => Promise<import("../interfaces/helper").HTTPResponse>;
    /**
     *  FOOTER - GET
     **/
    getFooter: (_event: any, _context: any, _callback: any) => Promise<import("../interfaces/helper").HTTPResponse>;
    /**
     *  TRANSLATION - POST
     **/
    getTranslation: (event: any, _context: any, _callback: any) => Promise<import("../interfaces/helper").HTTPResponse>;
    /**
     *  STATIC_PAGE - GET
     **/
    getStaticPage: (event: any, _context: any, _callback: any) => Promise<import("../interfaces/helper").HTTPResponse>;
}
