"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCustomHandler = exports.routeHandler = exports.initController = exports.neffRouter = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
let controller;
// Function to initialize the controller with options
function initController(options) {
    controller = new controller_1.Controller(options);
    return controller;
}
exports.initController = initController;
/**
 * Override a handler for a pre-defined route.
 *
 * @example
 * ```ts
 * setCustomHandler('/get_test', (req, res) => {
 *    res.send('Custom handler for GET test');
 * });
 * ```
 */
function setCustomHandler(
// route must override one of the available default handlers
route, handler) {
    defaultHandlers[route] = handler;
}
exports.setCustomHandler = setCustomHandler;
/**
 * Create a route handler middleware that handles common logic for controller methods.
 * @param {Function} callback - The controller method to be executed.
 * @returns {Function} - The middleware function for the specified controller method.
 */
const routeHandler = (req, res, callback) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body) {
            req.body = JSON.stringify(req.body);
        }
        const result = yield callback(req, res);
        /*     if (!res.headersSent) {
              if (result?.body) {
                res.json(JSON.parse(result.body));
              } else {
                // Handle the case where the callback didn't provide a response
                res.status(500).send('Internal Server Error');
              }
            } */
        return result;
    }
    catch (error) {
        console.error('Error in routeHandler:', error);
        if (!res.headersSent) {
            res.status(500).send('Internal Server Error');
        }
    }
});
exports.routeHandler = routeHandler;
/**
 * Default routes used by NEFF projects.
 * It's possible to override these handlers inside the project.
 */
const defaultHandlers = {
    getTest: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield routeHandler(req, res, controller.getTest);
    }),
    postTest: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield routeHandler(req, res, controller.postTest);
    }),
    getNavigation: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield routeHandler(req, res, controller.getNavigation);
    }),
    getHomeLayout: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield routeHandler(req, res, controller.getHomeLayout);
    }),
    getSearchDescription: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield routeHandler(req, res, controller.getSearchDescription);
    }),
    getTimeline: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield routeHandler(req, res, controller.getTimeline);
    }),
    getMap: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield routeHandler(req, res, controller.getMap);
    }),
    getResource: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield routeHandler(req, res, controller.getResource);
    }),
    search: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield routeHandler(req, res, controller.search);
    }),
    advancedSearch: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield routeHandler(req, res, controller.advancedSearch);
    }),
    advancedSearchTextSearch: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield routeHandler(req, res, controller.advancedSearchTextSearch);
    }),
    teiPubGetNodePath: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield routeHandler(req, res, controller.teiPubGetNodePath);
    }),
    advancedSearchOptions: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield routeHandler(req, res, controller.advancedSearchOptions);
    }),
    getFooter: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield routeHandler(req, res, controller.getFooter);
    }),
    getTranslation: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield routeHandler(req, res, controller.getTranslation);
    }),
    getStaticPage: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield routeHandler(req, res, controller.getStaticPage);
    }),
    getStaticPost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield routeHandler(req, res, controller.getStaticPost);
    }),
    getObjectsByType: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield routeHandler(req, res, controller.getObjectsByType);
    }),
    getItineraries: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield routeHandler(req, res, controller.getItineraries);
    }),
    getItinerary: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield routeHandler(req, res, controller.getItinerary);
    }),
    getPDF: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield routeHandler(req, res, controller.getPDF);
    }),
};
/* -------------- *
 * DEFAULT ROUTES
 * -------------- */
// test routes
router.get('/get_test', (req, res) => defaultHandlers.getTest(req, res));
router.post('/post_test', (req, res) => defaultHandlers.postTest(req, res));
// main routes
router.get('/get_menu', (req, res) => defaultHandlers.getNavigation(req, res));
router.get('/get_footer', (req, res) => defaultHandlers.getFooter(req, res));
router.post('/get_home', (req, res) => defaultHandlers.getHomeLayout(req, res));
router.post('/get_resource', (req, res) => defaultHandlers.getResource(req, res));
router.get('/get_static/:slug', (req, res) => defaultHandlers.getStaticPage(req, res));
router.get('/get_search_description/:searchId', defaultHandlers.getSearchDescription);
router.get('/get_static_post/:slug', (req, res) => defaultHandlers.getStaticPost(req, res));
router.get('/get_itineraries', (req, res) => defaultHandlers.getItineraries(req, res));
router.get('/get_itinerary/:id', (req, res) => defaultHandlers.getItinerary(req, res));
router.get('/get_map/:id', (req, res) => defaultHandlers.getMap(req, res));
router.get('/get_timeline/:id', (req, res) => defaultHandlers.getTimeline(req, res));
router.get('/get_translation/:lang', (req, res) => defaultHandlers.getTranslation(req, res));
router.post('/search/:type', (req, res) => defaultHandlers.search(req, res));
router.post('/advanced_search', (req, res) => defaultHandlers.advancedSearch(req, res));
router.get('/advanced_search_options', (req, res) => defaultHandlers.advancedSearchOptions(req, res));
router.post('/list/:type', (req, res) => defaultHandlers.getObjectsByType(req, res));
router.get('/getPDF/:siteName/:id', (req, res) => defaultHandlers.getPDF(req, res));
// Exports
exports.neffRouter = router;
