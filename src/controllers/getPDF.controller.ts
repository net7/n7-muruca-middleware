import { GetPDFService } from '../services';

export class getPDFController {

  getPDF = async (req: any, res: any, config?: any, locale?: string) => {
    const service = new GetPDFService();
    if (req.params.siteName === "auteso") {
      service.createPDFAuteso(req, res);
    } else if (req.params.siteName === "calderon") {
      service.createPDFCalderon(req, res);
    } else if (req.params.siteName === "memoram") {
      service.createPDFMemoram(req, res);
    }
  }
}
