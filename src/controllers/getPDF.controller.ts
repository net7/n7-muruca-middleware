import { GetPDFService } from '../services';

export class getPDFController {

  getPDF = async (req: any, res: any, config?: any, locale?: string) => {
    const service = new GetPDFService();
      service.createPDF(req, res, config);
  }
}
