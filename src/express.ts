import { Request, Response, Router } from 'express';
import { Controller } from './controller';

const router = Router();

let controller: Controller;

// Function to initialize the controller with options
function initController(options: any): Controller {
  controller = new Controller(options);
  return controller;
}

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
  route: keyof typeof defaultHandlers,
  handler: (req: Request, res: Response) => void,
) {
  defaultHandlers[route] = handler;
}

/**
 * Create a route handler middleware that handles common logic for controller methods.
 * @param {Function} callback - The controller method to be executed.
 * @returns {Function} - The middleware function for the specified controller method.
 */
const routeHandler = async (req, res, callback) => {
  try {
    if (req.body) {
      req.body = JSON.stringify(req.body);
    }
    const result = await callback(req);
    if (result?.body) {
      res.send(result.body);
    } else {
      // Handle the case where the callback didn't provide a response
      res.status(500).send('Internal Server Error');
    }
    return result;
  } catch (error) {
    console.error('Error in routeHandler:', error);
    res.status(500).send('Internal Server Error');
  }
};

/**
 * Default routes used by NEFF projects.
 * It's possible to override these handlers inside the project.
 */
const defaultHandlers: {
  [key: string]: (req: Request, res: Response) => void;
} = {
  getTest: async (req, res) => {
    routeHandler(req, res, controller.getTest);
  },
  postTest: async (req, res) => {
    routeHandler(req, res, controller.postTest);
  },
  getNavigation: async (req, res) => {
    routeHandler(req, res, controller.getNavigation);
  },
  getHomeLayout: async (req, res) => {
    routeHandler(req, res, controller.getHomeLayout);
  },
  getSearchDescription: async (req, res) => {
    routeHandler(req, res, controller.getSearchDescription);
  },
  getTimeline: async (req, res) => {
    routeHandler(req, res, controller.getTimeline);
  },
  getMap: async (req, res) => {
    routeHandler(req, res, controller.getMap);
  },
  getResource: async (req, res) => {
    routeHandler(req, res, controller.getResource);
  },
  search: async (req, res) => {
    routeHandler(req, res, controller.search);
  },
  advancedSearch: async (req, res) => {
    routeHandler(req, res, controller.advancedSearch);
  },
  advancedSearchTextSearch: async (req, res) => {
    routeHandler(req, res, controller.advancedSearchTextSearch);
  },
  teiPubGetNodePath: async (req, res) => {
    routeHandler(req, res, controller.teiPubGetNodePath);
  },
  advancedSearchOptions: async (req, res) => {
    routeHandler(req, res, controller.advancedSearchOptions);
  },
  getFooter: async (req, res) => {
    routeHandler(req, res, controller.getFooter);
  },
  getTranslation: async (req, res) => {
    routeHandler(req, res, controller.getTranslation);
  },
  getStaticPage: async (req, res) => {
    routeHandler(req, res, controller.getStaticPage);
  },
  getStaticPost: async (req, res) => {
    routeHandler(req, res, controller.getStaticPost);
  },
  getObjectsByType: async (req, res) => {
    routeHandler(req, res, controller.getObjectsByType);
  },
  getItineraries: async (req, res) => {
    routeHandler(req, res, controller.getItineraries);
  },
  getItinerary: async (req, res) => {
    routeHandler(req, res, controller.getItinerary);
  },
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
router.post('/get_resource', (req, res) =>
  defaultHandlers.getResource(req, res),
);
router.get('/get_static/:slug', (req, res) =>
  defaultHandlers.getStaticPage(req, res),
);
router.get(
  '/get_search_description/:searchId',
  defaultHandlers.getSearchDescription,
);
router.get('/get_static_post/:slug', (req, res) =>
  defaultHandlers.getStaticPost(req, res),
);
router.get('/get_itineraries', (req, res) =>
  defaultHandlers.getItineraries(req, res),
);
router.get('/get_itinerary/:id', (req, res) =>
  defaultHandlers.getItinerary(req, res),
);
router.get('/get_map/:id', (req, res) => defaultHandlers.getMap(req, res));
router.get('/get_timeline/:id', (req, res) =>
  defaultHandlers.getTimeline(req, res),
);
router.get('/get_translation/:lang', (req, res) =>
  defaultHandlers.getTranslation(req, res),
);
router.post('/search/:type', (req, res) => defaultHandlers.search(req, res));
router.post('/advanced_search', (req, res) =>
  defaultHandlers.advancedSearch(req, res),
);
router.post('/list/:type', (req, res) =>
  defaultHandlers.getObjectsByType(req, res),
);

// Exports
export const neffRouter = router;
export { initController, routeHandler, setCustomHandler };
