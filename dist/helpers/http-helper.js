import * as request from 'request';
export default {
    returnOkResponse(data, headerData) {
        let response = {
            statusCode: 200,
            body: JSON.stringify(data)
        };
        let headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
            "Access-Control-Allow-Headers": "X-Requested-With,content-type"
        };
        if (typeof headerData !== "undefined") {
            Object.assign(headers, headerData);
        }
        else {
            headers["Content-Type"] = "application/json";
        }
        response["headers"] = headers;
        return response;
    },
    returnErrorResponse(message, code) {
        let response = {
            statusCode: code,
            body: message
        };
        let headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
            "Content-Type": "application/json",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
            "Access-Control-Allow-Headers": "X-Requested-With,content-type"
        };
        response["headers"] = headers;
        return response;
    },
    doRequest(url) {
        return new Promise(function (resolve, reject) {
            request(url, function (error, res, body) {
                if (!error && res.statusCode == 200) {
                    resolve(body);
                }
                else {
                    reject(error);
                }
            });
        });
    }
};
