import { HttpHelper } from "../helpers";
import { GetPDFService } from "../services/pdf-generator/pdf-generator";

export class getPDFController {

  getPDF = async (req: any, res: any, config?: any, locale?: string, labels?: any) => {
    const service = new GetPDFService();
    let response = await service.createPDF(req, res, config, labels);
    return response
  }

  getLabels = async (req: any, res: any, config?: any, locale?: string) => {
    const { baseUrl, parsers } = config;
    let queryLang = locale;
    if (locale && locale.length < 5) {
      queryLang =
        locale === "en" ? locale + "_US" : locale + "_" + locale.toUpperCase();
    }
    const data = JSON.parse(
      await HttpHelper.doRequest(baseUrl + "translations?lang=" + queryLang)
    );
    const parser = new parsers.translation();
    const response = parser.parse({
      data,
      options: {
        queryLang,
      },
    });
    return response;
  }
}