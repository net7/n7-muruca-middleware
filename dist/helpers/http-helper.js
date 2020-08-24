import * as request from 'request';
export var HttpHelper = {
    returnOkResponse: function (data, headerData) {
        var headers = {
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
        var response = {
            statusCode: 200,
            body: JSON.stringify(data),
            headers: headers
        };
        return response;
    },
    returnErrorResponse: function (message, code) {
        var headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
            "Content-Type": "application/json",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
            "Access-Control-Allow-Headers": "X-Requested-With,content-type"
        };
        var response = {
            statusCode: code,
            body: message,
            headers: headers
        };
        return response;
    },
    doRequest: function (url) {
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
