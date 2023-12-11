import { GetResourceService } from '../services';

export class getResourceController {
  searchResource = async (body: any, config: any, locale?: string) => {
    const service = new GetResourceService();
    const response = await service.getResource(body, config, locale);
    var result = service.buildResource(body, response, config, locale);
    return result;
  };
}
