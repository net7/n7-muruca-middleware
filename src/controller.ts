import { HttpHelper } from './helpers';
import { SearchResultsData } from './interfaces';
import * as controllers from './controllers';
import { Request } from 'express';

export class Controller {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  postTest = async (request: Request) => {
    const body = JSON.parse(request.body); //la richiesta che arriva all'API
    const response: any = body;
    return HttpHelper.returnOkResponse(response);
  };

  getTest = async (request: Request) => {
    const response: any = 'Hello from getTest!';
    return HttpHelper.returnOkResponse(response);
  };

  getNavigation = async (request: Request) => {
    const { baseUrl, parsers } = this.config;
    const locale = request.query?.locale || '';
    const path = locale ? 'menu?lang=' + locale : 'menu';
    const data = JSON.parse(await HttpHelper.doRequest(baseUrl + path));
    const parser = new parsers.menu();
    const response = parser.parse(data);
    return HttpHelper.returnOkResponse(response);
  };

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

  getSearchDescription = async (request: Request) => {
    const { baseUrl, parsers } = this.config;
    const { searchId } = request.params;
    const locale = request.query?.locale || '';
    const path = locale ? '?lang=' + locale : '';
    const data = JSON.parse(
      await HttpHelper.doRequest(baseUrl + 'layout/' + searchId + path)
    );
    const parser = new parsers.searchDescription();
    const response = parser.parse({ data });
    return HttpHelper.returnOkResponse(response);
  };

  getTimeline = async (request: Request) => {
    const { baseUrl, parsers } = this.config;
    const { id } = request.params;
    const locale = request.query?.locale || '';
    const path = locale ? '?lang=' + locale : '';
    const data = JSON.parse(
      await HttpHelper.doRequest(baseUrl + 'views/' + id + path)
    );
    const parser = new parsers.timeline();
    const response = parser.parse({ data });
    return HttpHelper.returnOkResponse(response);
  };

  getMap = async (request: Request) => {
    const { baseUrl, parsers } = this.config;
    const { id } = request.params;
    const locale = request.query?.locale || '';
    const path = locale ? '?lang=' + locale : '';
    const data = JSON.parse(
      await HttpHelper.doRequest(baseUrl + 'views/' + id + path)
    );
    const parser = new parsers.map();
    const response = parser.parse({ data });
    return HttpHelper.returnOkResponse(response);
  };

  getResource = async (request: Request) => {
    const locale = request.query?.locale || '';
    const controller = new controllers.getResourceController();
    const body = JSON.parse(request.body);
    const response = await controller.searchResource(
      body,
      this.config,
      locale as string
    );
    return HttpHelper.returnOkResponse(response);
  };

  search = async (request: Request) => {
    const { type } = request.params;
    const locale = request.query?.locale || '';
    const body = JSON.parse(request.body);
    const controller = new controllers.searchController();
    const response = await controller.search(
      body,
      this.config,
      type,
      locale as string
    );
    return HttpHelper.returnOkResponse(response);
  };

  advancedSearch = async (request: Request) => {
    const body = JSON.parse(request.body); // cf. SEARCH-RESULTS in Postman
    const locale = request.query?.locale || '';
    const controller = new controllers.advancedSearchController();

    const response = await controller.search(
      body,
      this.config,
      locale as string
    );

    return HttpHelper.returnOkResponse(response);
  };

  advancedSearchTextSearch = async (request: Request) => {
    // const body = JSON.parse(request.body); // cf. SEARCH-RESULTS in Postman
    const locale = request.query?.locale || '';
    const controller = new controllers.advancedSearchController();
    return controller.advancedSearchTextSearch(
      request.query,
      this.config,
      locale as string
    );
  };

  teiPubGetNodePath = async (request: Request) => {
    const body = JSON.parse(request.body);
    const locale = request.query?.locale || '';
    const controller = new controllers.teiPublisherController(this.config);
    return controller.teiPubGetNodePath(body, locale as string);
  };

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
        advanced_search_options
      );
      const options = data.data;
      for (const key in options) {
        options[key].options.map(
          (option) => (option.value = option.value.toString())
        );
      }
      return HttpHelper.returnOkResponse(options);
    }
  };

  getFooter = async (request: Request) => {
    const { baseUrl, parsers, configurations } = this.config;
    const locale = request.query?.locale || '';
    const path = locale ? 'footer?lang=' + locale : 'footer';
    const data = JSON.parse(await HttpHelper.doRequest(baseUrl + path));
    const parser = new parsers.footer();
    const response = parser.parse(data, { conf: configurations.footer });
    return HttpHelper.returnOkResponse(response);
  };

  getTranslation = async (request: Request) => {
    const { baseUrl, parsers } = this.config;
    const { lang } = request.params;
    let queryLang = lang;
    if (lang && lang.length < 5) {
      queryLang =
        lang === 'en' ? lang + '_US' : lang + '_' + lang.toUpperCase();
    }
    const data = JSON.parse(
      await HttpHelper.doRequest(baseUrl + 'translations?lang=' + queryLang)
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

  getStaticPage = async (request: Request) => {
    const { parsers, staticUrl } = this.config;
    const { slug } = request.params;
    const data = JSON.parse(
      await HttpHelper.doRequest(staticUrl + 'pages?' + 'slug=' + slug)
    );
    const parser = new parsers.static();
    const response = parser.parse({ data });
    if (response) {
      return HttpHelper.returnOkResponse(response);
    } else {
      return HttpHelper.returnErrorResponse('page not found', 404);
    }
  };

  getStaticPost = async (request: Request) => {
    const { parsers, staticUrl } = this.config;
    const { slug } = request.params;
    const data = JSON.parse(
      await HttpHelper.doRequest(staticUrl + 'posts?' + 'slug=' + slug)
    );
    const parser = new parsers.static();
    const response = parser.parse({ data });
    if (response) {
      return HttpHelper.returnOkResponse(response);
    } else {
      return HttpHelper.returnErrorResponse('page not found', 404);
    }
  };

  getTypeList = async (request: Request) => {
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

  getItinerary = async (request: Request) => {
    const { parsers, baseUrl, configurations } = this.config;
    const { id } = request.params;
    const locale = request.query?.locale || '';
    const path = locale ? '?lang=' + locale : '';
    const data = JSON.parse(
      await HttpHelper.doRequest(baseUrl + 'itinerary/' + id + path)
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
      getTypeList: this.getTypeList.bind(this),
      getItinerary: this.getItinerary.bind(this),
      getItineraries: this.getItineraries.bind(this),
      advancedSearchOptions: this.advancedSearchOptions.bind(this),
      teiPubGetNodePath: this.teiPubGetNodePath.bind(this),
      advancedSearchTextSearch: this.advancedSearchTextSearch.bind(this),
    };
  }
}
