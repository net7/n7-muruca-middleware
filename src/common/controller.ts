'use strict';
import { Client } from '@elastic/elasticsearch';
import { SearchResponse } from "elasticsearch";
import {
  HttpHelper,
  ESHelper
} from '../helpers/index';


export class Controller {

  constructor(
    private projectPath: any,
    private environment: any
  ){

  }

  conf(projectPath:any, env:any) {
    this.projectPath = projectPath;
    this.environment = env.env;
    return;
  }
  /**
   *  MENU - GET
   **/
  getNavigation = async (_event:any, _context:any, _callback:any) => {
    const data = JSON.parse(await HttpHelper.doRequest(this.environment.BASE_URL + "menu"));
    const parser = new this.projectPath.parsers.menu();
    const response = parser.parse(data);
    return HttpHelper.returnOkResponse(response);
  };

  /**
   *  HOME LAYOUT - POST
   **/
  getHomeLayout = async (event:any, _context:any, _callback:any) => {
    const keyOrder = JSON.parse(event.body);
    const data = JSON.parse(await HttpHelper.doRequest(this.environment.BASE_URL + "layout/home"));
    const parser = new this.projectPath.parsers.home();
    const response = parser.parse({
      data,
      options: {
        keyOrder,
        conf: this.projectPath.configurations.home
      }
    });
    return HttpHelper.returnOkResponse(response);
  };

  /**
   *  RESOURCE - POST
   **/
  getResource = async (event:any, _context:any, _callback:any) => {
    // change id whit slug and no un parameters but in the boy request  in POST
    let { type, id, sections } = JSON.parse(event.body);
    const requestURL = this.environment.BASE_URL;
    const url = requestURL + type + "/" + id;
    //remove, only for test
    const data = JSON.parse(await HttpHelper.doRequest(url));
    const parser = new this.projectPath.parsers.resource();
    const response = parser.parse({
      data,
      options: {
        type,
        conf: this.projectPath.configurations.resources[type]
      },
    });
    const sect = sortObj(response.sections, sections); // body sections filters
    response.sections = sect;
    return HttpHelper.returnOkResponse(response);
  }

  /**
   *  SEARCH - POST
   **/
  search = async (event:any, _context:any, _callback:any) => {
    const body = JSON.parse(event.body)
    const { type } = event.pathParameters;
    const params = ESHelper.buildQuery(body, this.projectPath.configurations.search);
    // make query
    const query_res: SearchResponse<any> = await ESHelper.makeSearch(this.environment.SEARCH_INDEX, params, Client, this.environment.ELASTIC_URI);
    const data = type === 'results' ? query_res.hits.hits : query_res.aggregations;
    const parser = new this.projectPath.parsers.search();
    const { searchId, facets } = body;
    const { limit, offset, sort } = body.results ? body.results : "null";
    const total_count = query_res.hits.total['value']; // this fix outdated elasticsearch interface 
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
        conf: this.projectPath.configurations.search
      }
    });
    
    return HttpHelper.returnOkResponse(response);
  }

  /**
   *  FOOTER - GET
   **/
  getFooter = async (_event:any, _context:any, _callback:any) => {
    const data = JSON.parse(await HttpHelper.doRequest(process.env.BASE_URL + "footer"));
    const parser = new this.projectPath.parsers.footer();
    const response = parser.parse(data, { conf: this.projectPath.configurations.footer });
    return HttpHelper.returnOkResponse(response);
  }

  /**
   *  TRANSLATION - POST
   **/
  getTranslation = async (event:any, _context:any, _callback:any) => {
    const { lang } = event.pathParameters;
    const data = JSON.parse(await HttpHelper.doRequest(process.env.BASE_URL + "translations?lang=" + lang));
    const parser = new this.projectPath.parsers.translation();
    const response = parser.parse({
      data,
      options: {
        lang
      },
    });
    return HttpHelper.returnOkResponse(response);
  };


  /**
   *  STATIC_PAGE - GET
   **/
  getStaticPage = async (event:any, _context:any, _callback:any) => {
    const { slug } = event.pathParameters;
    const data = JSON.parse(await HttpHelper.doRequest(this.environment.PAGES));
    const parser = new this.projectPath.parsers.static();
    const response = parser.parse({ data, options: { slug }});
    return HttpHelper.returnOkResponse(response);
  }
}
