import { HttpHelper } from './helpers';
import { SearchResultsData } from './interfaces';
import * as controllers from './controllers';
import { Request } from 'express';

export class Controller {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  /**
   * Test if the post request is working.
   * @param request POST request
   */
  postTest = async (request: Request) => {
    const body = JSON.parse(request.body); //la richiesta che arriva all'API
    const response: any = body;
    return HttpHelper.returnOkResponse(response);
  };

  /**
   * Test if the get request is working.
   * @param request GET request
   */
  getTest = async (request: Request) =>
    HttpHelper.returnOkResponse('Hello from getTest!');

  /**
   * Fetch the main menu of the app.
   * @param request GET request
   */
  getNavigation = async (request: Request) => {
    const { baseUrl, parsers } = this.config;
    const locale = request.query?.locale || '';
    const path = locale ? 'menu?lang=' + locale : 'menu';
    const data = JSON.parse(await HttpHelper.doRequest(baseUrl + path));
    const parser = new parsers.menu();
    const response = parser.parse(data);
    return HttpHelper.returnOkResponse(response);
  };

  /**
   * Fetch data for the home layout components.
   * @param request POST request
   */
  getHomeLayout = async (request: Request) => {
    const { baseUrl, parsers, configurations } = this.config;
    if (!request || !request?.body) {
      return HttpHelper.returnErrorResponse('Empty body from request', 400);
    }
    const keyOrder = JSON.parse(request.body);
    const locale = request.query?.locale || '';
    const path = locale ? 'layout/home?lang=' + locale : 'layout/home';
    const data = JSON.parse(await HttpHelper.doRequest(baseUrl + path));
    const parser = new parsers.home();
    const response = parser.parse({
      data,
      options: {
        keyOrder,
        conf: configurations.home,
      },
    });
    return HttpHelper.returnOkResponse(response);
  };

  /**
   * Fetch the description content of the search page.
   * @param request GET request
   */
  getSearchDescription = async (request: Request) => {
    const { baseUrl, parsers } = this.config;
    const { searchId } = request.params;
    const locale = request.query?.locale || '';
    const path = locale ? '?lang=' + locale : '';
    const data = JSON.parse(
      await HttpHelper.doRequest(baseUrl + 'layout/' + searchId + path),
    );
    const parser = new parsers.searchDescription();
    const response = parser.parse({ data });
    return HttpHelper.returnOkResponse(response);
  };

  /**
   * Fetch data for the timeline component.
   * @param request GET request
   */
  getTimeline = async (request: Request) => {
    const { baseUrl, parsers } = this.config;
    const { id } = request.params;
    const locale = request.query?.locale || '';
    const path = locale ? '?lang=' + locale : '';
    const data = JSON.parse(
      await HttpHelper.doRequest(baseUrl + 'views/' + id + path),
    );
    const parser = new parsers.timeline();
    const response = parser.parse({ data });
    return HttpHelper.returnOkResponse(response);
  };

  /**
   * Fetch data for the map component.
   * @param request GET request
   */
  getMap = async (request: Request) => {
    const { baseUrl, parsers } = this.config;
    const { id } = request.params;
    const locale = request.query?.locale || '';
    const path = locale ? '?lang=' + locale : '';
    const data = JSON.parse(
      await HttpHelper.doRequest(baseUrl + 'views/' + id + path),
    );
    const parser = new parsers.map();
    const response = parser.parse({ data });
    return HttpHelper.returnOkResponse(response);
  };

  /**
   * Fetch data for the resource layout.
   * @param request POST request
   */
  getResource = async (request: Request) => {
    const locale = request.query?.locale || '';
    const controller = new controllers.getResourceController();
    const body = JSON.parse(request.body);
    const response = await controller.searchResource(
      body,
      this.config,
      locale as string,
    );
    return HttpHelper.returnOkResponse(response);
  };

  /**
   * Submit a query and fetch the results.
   * @param request POST request
   */
  search = async (request: Request) => {
    const { type } = request.params;
    const locale = request.query?.locale || '';
    const body = JSON.parse(request.body);
    const controller = new controllers.searchController();
    const response = await controller.search(
      body,
      this.config,
      type,
      locale as string,
    );
    return HttpHelper.returnOkResponse(response);
  };

  /**
   * Submit a query and fetch the results.
   * @param request POST request
   */
  advancedSearch = async (request: Request) => {
    const body = JSON.parse(request.body); // cf. SEARCH-RESULTS in Postman
    const locale = request.query?.locale || '';
    const controller = new controllers.advancedSearchController();
    const response = await controller.search(
      body,
      this.config,
      locale as string,
    );
    return HttpHelper.returnOkResponse(response);
  };

  /**
   * Submit a text query and fetch the results.
   * @param request POST request
   */
  advancedSearchTextSearch = async (request: Request) => {
    // const body = JSON.parse(request.body); // cf. SEARCH-RESULTS in Postman
    const locale = request.query?.locale || '';
    const controller = new controllers.advancedSearchController();
    return controller.advancedSearchTextSearch(
      request.query,
      this.config,
      locale as string,
    );
  };

  /**
   * Fetch data for tei-publisher component.
   * @param request POST request
   */
  teiPubGetNodePath = async (request: Request) => {
    const body = JSON.parse(request.body);
    const locale = request.query?.locale || '';
    const controller = new controllers.teiPublisherController(this.config);
    return controller.teiPubGetNodePath(body, locale as string);
  };

  /**
   * Fetch the available filters for the search page.
   * @param request GET request
   */
  advancedSearchOptions = async (request: Request) => {
    const { configurations, baseUrl, advancedSearchParametersPath } =
      this.config;

    const advanced_search_options =
      configurations.advanced_search.advanced_search?.dynamic_options;

    if (advanced_search_options) {
      const requestURL = baseUrl + advancedSearchParametersPath;
      const locale = request.query?.locale || '';
      const path = locale ? '?lang=' + locale : '';
      const data: any = await HttpHelper.doPostRequest(
        requestURL + path,
        advanced_search_options,
      );
      const options = data.data;
      for (const key in options) {
        options[key].options.map(
          (option) => (option.value = option.value.toString()),
        );
      }
      return HttpHelper.returnOkResponse(options);
    }
  };

  /**
   * Fetch data for the footer component.
   * @param request GET request
   */
  getFooter = async (request: Request) => {
    const { baseUrl, parsers, configurations } = this.config;
    const locale = request.query?.locale || '';
    const path = locale ? 'footer?lang=' + locale : 'footer';
    const data = JSON.parse(await HttpHelper.doRequest(baseUrl + path));
    const parser = new parsers.footer();
    const response = parser.parse(data, { conf: configurations.footer });
    return HttpHelper.returnOkResponse(response);
  };

  /**
   * Fetch the translation strings in the language specified by the "?lang" query parameter.
   * @param request GET request
   */
  getTranslation = async (request: Request) => {
    const { baseUrl, parsers } = this.config;
    const { lang } = request.params;
    let queryLang = lang;
    if (lang && lang.length < 5) {
      queryLang =
        lang === 'en' ? lang + '_US' : lang + '_' + lang.toUpperCase();
    }
    const data = JSON.parse(
      await HttpHelper.doRequest(baseUrl + 'translations?lang=' + queryLang),
    );
    const parser = new parsers.translation();
    const response = parser.parse({
      data,
      options: {
        queryLang,
      },
    });
    return HttpHelper.returnOkResponse(response);
  };

  /**
   * Fetch the content of a static resource.
   * @param request GET request
   */
  getStaticPage = async (request: Request) => {
    const { parsers, staticUrl } = this.config;
    const { slug } = request.params;
    const data = JSON.parse(
      await HttpHelper.doRequest(staticUrl + 'pages?' + 'slug=' + slug),
    );
    const parser = new parsers.static();
    const response = parser.parse({ data });
    if (response) {
      return HttpHelper.returnOkResponse(response);
    } else {
      return HttpHelper.returnErrorResponse('page not found', 404);
    }
  };

  /**
   * Fetch the content of a static post.
   * @param request GET request
   */
  getStaticPost = async (request: Request) => {
    const { parsers, staticUrl } = this.config;
    const { slug } = request.params;
    const data = JSON.parse(
      await HttpHelper.doRequest(staticUrl + 'posts?' + 'slug=' + slug),
    );
    const parser = new parsers.static();
    const response = parser.parse({ data });
    if (response) {
      return HttpHelper.returnOkResponse(response);
    } else {
      return HttpHelper.returnErrorResponse('page not found', 404);
    }
  };

  /**
   * Get a list of objects of the defined type.
   * @param request POST request
   */
  getObjectsByType = async (request: Request) => {
    const { parsers, staticUrl } = this.config;
    const { type } = request.params;
    const body = JSON.parse(request.body);
    let params = '';
    if (body.results && body.results.limit) {
      params = 'per_page=' + body.results.limit;
    }
    if (body.results && body.results.offset) {
      params +=
        params == ''
          ? 'offset=' + body.results.offset
          : '&offset=' + body.results.offset;
    }
    const apiUrl =
      params != '' ? staticUrl + type + '?' + params : staticUrl + type;
    const data = JSON.parse(await HttpHelper.doRequest(apiUrl));
    const parser = new parsers.static();

    const response: SearchResultsData = {
      results: parser.parseList({ data, options: { type } }),
      limit: body.results.limit || 10,
      offset: body.results.offset || 0,
      total_count: data.length,
      sort: '',
    };
    return HttpHelper.returnOkResponse(response);
  };

  /**
   * Fetch the list of available itineraries for geographic datasets.
   * @param request GET request
   */
  getItineraries = async (request: Request) => {
    const { parsers, baseUrl, configurations } = this.config;
    const data = JSON.parse(await HttpHelper.doRequest(baseUrl + 'itinerary'));
    /* const parser = new parsers.itineraries();
    const response = parser.parse({ data });
    if ( response ){
      return HttpHelper.returnOkResponse(response);
    } else {
      return HttpHelper.returnErrorResponse("page not found", 404);
    }*/
  };

  /**
   * Fetch the data of a specific itinerary.
   * @param request GET request
   */
  getItinerary = async (request: Request) => {
    const { parsers, baseUrl, configurations } = this.config;
    const { id } = request.params;
    const locale = request.query?.locale || '';
    const path = locale ? '?lang=' + locale : '';
    const data = JSON.parse(
      await HttpHelper.doRequest(baseUrl + 'itinerary/' + id + path),
    );
    const parser = new parsers.itinerary(configurations?.itineraries);
    const response = parser.parse({ data });
    if (response) {
      return HttpHelper.returnOkResponse(response);
    } else {
      return HttpHelper.returnErrorResponse('page not found', 404);
    }
  };

  getSlsMethods() {
    return {
      postTest: this.postTest.bind(this),
      getTest: this.getTest.bind(this),
      getNavigation: this.getNavigation.bind(this),
      getFooter: this.getFooter.bind(this),
      getHomeLayout: this.getHomeLayout.bind(this),
      getSearchDescription: this.getSearchDescription.bind(this),
      getTimeline: this.getTimeline.bind(this),
      getMap: this.getMap.bind(this),
      getResource: this.getResource.bind(this),
      search: this.search.bind(this),
      advancedSearch: this.advancedSearch.bind(this),
      getTranslation: this.getTranslation.bind(this),
      getStaticPage: this.getStaticPage.bind(this),
      getStaticPost: this.getStaticPost.bind(this),
      getObjectsByType: this.getObjectsByType.bind(this),
      getItinerary: this.getItinerary.bind(this),
      getItineraries: this.getItineraries.bind(this),
      advancedSearchOptions: this.advancedSearchOptions.bind(this),
      teiPubGetNodePath: this.teiPubGetNodePath.bind(this),
      advancedSearchTextSearch: this.advancedSearchTextSearch.bind(this),
    };
  }
}
