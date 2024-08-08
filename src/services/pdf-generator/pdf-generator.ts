// import the createPDF function from the utils folder
import createPDF from "./createPDF";


export class GetPDFService {

  createPDF = (req, res, config, labels) => {
    return createPDF( req, res, config, labels);
  };  
}