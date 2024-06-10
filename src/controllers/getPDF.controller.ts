import { GetPDFService } from "../services/pdf-generator/pdf-generator";

export class getPDFController {

  getPDF = async (req: any, res: any, config?: any, locale?: string) => {
    const service = new GetPDFService();
      service.createPDF(req, res, config);
  }
}