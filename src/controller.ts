import { Client } from '@elastic/elasticsearch';
import * as sortObj from 'sort-object';
import { HttpHelper, ESHelper } from './helpers';

export class Controller {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  getNavigation = async (_event: any, _context: any, _callback: any) => {
    const { baseUrl, parsers } = this.config;
    const data = JSON.parse(await HttpHelper.doRequest(baseUrl + "menu"));
    const parser = new parsers.menu();
    const response = parser.parse(data);
    return HttpHelper.returnOkResponse(response);
  }

  getHomeLayout = async (event: any, _context: any, _callback: any) => {
    const { baseUrl, parsers, configurations } = this.config;
    const keyOrder = JSON.parse(event.body);
    const data = JSON.parse(await HttpHelper.doRequest(baseUrl + "layout/home"));
    const parser = new parsers.home();
    const response = parser.parse({
      data,
      options: {
        keyOrder,
        conf: configurations.home
      }
    });
    return HttpHelper.returnOkResponse(response);
  }

  getSearchDescription = async (event: any, _context: any, _callback: any) => {
    const { baseUrl, parsers } = this.config;
    const { searchId } = event.pathParameters;
    const data = JSON.parse(await HttpHelper.doRequest(baseUrl + "layout/" + searchId));
    const parser = new parsers.searchDescription();
    const response = parser.parse({ data });
    return HttpHelper.returnOkResponse(response);
  }

  getTimeline = async (event: any, _context: any, _callback: any) => {
    const { baseUrl, parsers } = this.config;
    const { id } = event.pathParameters;
    const data = JSON.parse(await HttpHelper.doRequest(baseUrl + "views/" + id));
    const parser = new parsers.timeline();
    const response = parser.parse({ data });
    return HttpHelper.returnOkResponse(response);
  }

  getResource = async (event: any, _context: any, _callback: any) => {
    const { baseUrl, parsers, configurations } = this.config;
    // change id whit slug and no un parameters but in the boy request  in POST
    let { type, id, sections } = JSON.parse(event.body);
    const requestURL = baseUrl;
    const url = requestURL + type + "/" + id;
    //remove, only for test
    const data = JSON.parse(await HttpHelper.doRequest(url));
    const parser = new parsers.resource();
    const response = parser.parse({
      data,
      options: {
        type,
        conf: configurations.resources[type]
      },
    });
    const sect = sortObj(response.sections, sections); // body sections filters
    response.sections = sect;
    return HttpHelper.returnOkResponse(response);
  }

  search = async (event: any, _context: any, _callback: any) => {
    const { parsers, searchIndex, elasticUri, configurations } = this.config;
    const body = JSON.parse(event.body)
    const { type } = event.pathParameters;
    const params = ESHelper.buildQuery(body, configurations.search);
    // make query
    const query_res: any = await ESHelper.makeSearch(searchIndex, params, Client, elasticUri);
    const data = type === 'results' ? query_res.hits.hits : query_res.aggregations;
    const parser = new parsers.search();
    const { searchId, facets } = body;
    const { limit, offset, sort } = body.results ? body.results : "null";
    let total_count = query_res.hits.total.value; 
    const response = parser.parse({
      data,
      options: {
        type,
        offset,
        sort,
        limit,
        total_count,
        searchId,
        facets,
        conf: configurations.search
      }
    });
    
    return HttpHelper.returnOkResponse(response);
  }

  getFooter = async (_event: any, _context: any, _callback: any) => {
    const { baseUrl, parsers, configurations } = this.config;
    const data = JSON.parse(await HttpHelper.doRequest(baseUrl + "footer"));
    const parser = new parsers.footer();
    const response = parser.parse(data, { conf: configurations.footer });
    return HttpHelper.returnOkResponse(response);
  }

  getTranslation = async (event: any, _context: any, _callback: any) => {
    const { baseUrl, parsers } = this.config;
    const { lang } = event.pathParameters;
    const data = JSON.parse(await HttpHelper.doRequest(baseUrl + "translations?lang=" + lang));
    const parser = new parsers.translation();
    const response = parser.parse({
      data,
      options: {
        lang
      },
    });
    return HttpHelper.returnOkResponse(response);
  }

  getStaticPage = async (event: any, _context: any, _callback: any) => {
    const { parsers, staticUrl } = this.config;
    const { slug } = event.pathParameters;
    const data = JSON.parse(await HttpHelper.doRequest(staticUrl + 'pages/'));
    const parser = new parsers.static();
    const response = parser.parse({ data, options: { slug }});
    return HttpHelper.returnOkResponse(response);
  }

  getStaticPost = async (event: any, _context: any, _callback: any) => {
    const { parsers, staticUrl } = this.config;
    const { slug } = event.pathParameters;
    const data = JSON.parse(await HttpHelper.doRequest(staticUrl + 'posts/'));
    const parser = new parsers.static();
    const response = parser.parse({ data, options: { slug }});
    return HttpHelper.returnOkResponse(response);
  }

  getSlsMethods() {
    return {
      getNavigation: this.getNavigation.bind(this),
      getFooter: this.getFooter.bind(this),
      getHomeLayout: this.getHomeLayout.bind(this),
      getSearchDescription: this.getSearchDescription.bind(this),
      getTimeline: this.getTimeline.bind(this),
      getResource: this.getResource.bind(this),
      search: this.search.bind(this),
      getTranslation: this.getTranslation.bind(this),
      getStaticPage: this.getStaticPage.bind(this),
      getStaticPost: this.getStaticPost.bind(this)
    }
  }
}
