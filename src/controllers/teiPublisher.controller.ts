import { Client } from '@elastic/elasticsearch';
import { ESHelper, HttpHelper } from '../helpers';
import { AdvancedSearchService, TeipublisherService } from '../services';

export class teiPublisherController {
  private configurations: any;

  constructor(configurations) {
    this.configurations = configurations;
  }

  // teiPubGetNodePath = async (event: any, _context: any, _callback: any) => {
  //     const body = JSON.parse(event.body);
  //     const { locale } = event.queryStringParameters ? event.queryStringParameters : '';
  //     const controller = new controllers.teiPublisherController(this.config);
  //     const response = await controller.getNodePath(body, this.config, locale);
  //     return HttpHelper.returnOkResponse(response);
  // }

  teiPubGetNodePath = async (body: any, locale?: string) => {
    const { teiPublisherUri } = this.configurations;
    const teipubService = new TeipublisherService(teiPublisherUri);
    if (body.xpath && body.doc) {
      const root: any = await teipubService.getNodePath(body.doc, body.xpath);
      if (root) return HttpHelper.returnOkResponse(root);
    }
    return HttpHelper.returnErrorResponse('no xml root found', 400);
  };
}
