// import the createPDF function from the utils folder
import createPDFCalderon  from "./calderon"
import createPDFAuteso from "./auteso";
import createPDFMemoram from "./memoram";


export class GetPDFService {

  createPDFAuteso = (req, res) => {
    createPDFAuteso( req, res);
  };
  createPDFCalderon = (req, res) => {
    createPDFCalderon( req, res);
  };
  createPDFMemoram = (req, res) => {
    createPDFMemoram( req, res);
  };

  
}
