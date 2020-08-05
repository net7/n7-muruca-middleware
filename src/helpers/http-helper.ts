import * as request from 'request';
import { HTTPHeaders, HTTPResponse } from "../interfaces/helper";

export const HttpHelper = {
  returnOkResponse(data: string, headerData: HTTPHeaders): HTTPResponse {
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
      body: JSON.stringify(data),
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


  doRequest(url: string) {
    return new Promise(function (resolve, reject) {
      request(url, function (error, res, body) {
        if (!error && res.statusCode == 200) {
          resolve(body);
        } else {
          reject(error);
        }
      });
    });
  }
}
