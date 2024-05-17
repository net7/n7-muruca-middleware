// import the createPDF function from the utils folder
import createPDFCalderon  from "./calderon"
import createPDFAuteso from "./auteso";
import createPDFMemoram from "./memoram";
import createPDF from "./createPDF";


export class GetPDFService {

  createPDF = (req, res, config) => {
    createPDF( req, res, config);
  };
  createPDFAuteso = (req, res) => {
    createPDFAuteso( req, res);
  };
  createPDFCalderon = (req, res) => {
    createPDFCalderon( req, res);
  };
  createPDFMemoram = (req, res, config) => {
    createPDFMemoram( req, res, config);
  };

  
}
