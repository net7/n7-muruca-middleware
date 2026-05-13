import { PDFGenerator } from "./createPDF";

export class GetPDFService {

  createPDF = (req, res, config, labels, resource?, generator?: PDFGenerator) => {
    const gen = generator ?? new PDFGenerator();
    return gen.createPDF(req, res, config, labels, resource);
  };
}