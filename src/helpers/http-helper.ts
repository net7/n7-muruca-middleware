import { HTTPHeaders, HTTPResponse } from "../interfaces/helper";
const axios = require('axios');

export const HttpHelper = {
  returnOkResponse(data: object | string, headerData?: HTTPHeaders): HTTPResponse {
    let headers: HTTPHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Methods":
        "GET, POST, OPTIONS, PUT, PATCH, DELETE",
      "Access-Control-Allow-Headers": "X-Requested-With,content-type"
    };
    if (typeof headerData !== "undefined") {
      (<any>Object).assign(headers, headerData);
    } else {
      headers["Content-Type"] = "application/json";
    }
    let response: HTTPResponse = {
      statusCode: 200,
      body:  headers["Content-Type"] == "application/json" ? JSON.stringify(data) : String(data),
      headers
    };
    return response;
  },


  returnErrorResponse(message: string, code: number): HTTPResponse {
    const headers: HTTPHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Content-Type": "application/json",
      "Access-Control-Allow-Methods":
        "GET, POST, OPTIONS, PUT, PATCH, DELETE",
      "Access-Control-Allow-Headers": "X-Requested-With,content-type"
    };
    const response: HTTPResponse = {
      statusCode: code,
      body: message,
      headers
    };
    return response;
  },


  doRequest(url: string): Promise<string> {
    /*return new Promise(function (resolve, reject) {
      request(url, function (error, res, body) {
        if (!error && res.statusCode == 200) {
          resolve(body);
        } else {
          reject(error);
        }
      });
    });*/
    return new Promise(function (resolve, reject) {
      let res = axios.get(url).then(res => {
          //for legacy with old code
          resolve(JSON.stringify(res.data));
      })
        .catch(error => {
          console.error(error);
      });
    });
  },  
  doRequestNoJson(url: string): Promise<string> {
    return new Promise(function (resolve, reject) {
      let res = axios.get(url).then(res => {
          //for legacy with old code
          resolve(res.data);
      })
        .catch(error => {
          console.error(error);
      });
    });
  },

  doPostRequest(url, data) {
    return new Promise(function (resolve, reject) {
        let res = axios.post(url, data).then(res => {
            resolve(res)
        })
        .catch(error => {
        console.error(error);
        });
        
    });
  }
}
