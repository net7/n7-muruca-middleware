export default class ESHelper {
    bulkIndex(response, index, Client, ELASTIC_URI) { // client = const { Client } = require('@elastic/elasticsearch')
        const client = new Client({ node: ELASTIC_URI }) // ELASTIC_URI  =  serverless "process.env.ELASTIC_URI"

        if (index != "") {
            client.deleteByQuery({
                index: index,
                body: {
                    query: {
                        match_all: {}

                    }
                }
            })
        }
        let body = [];
        const dataset = JSON.parse(response);
        dataset.forEach(element => {
            body.push({ index: { _index: index } });
            body.push(element)
        });

        client.bulk({ refresh: true, body },
            (err, { body }) => {
                if (err) console.log(body.errors)
                const response = {
                    statusCode: 200,
                    body: JSON.stringify(body),
                };

                return response;
            }
        )
    }
    makeSearch(index, body, Client, ELASTIC_URI) {
        return new Promise(function (resolve, reject) {
            const client = new Client({
                node: ELASTIC_URI,
            })
            client.search({
                index: index,
                body: body
            }, (err, { body }) => {
                if (err) console.log(err)
                resolve(body);
            })
        })
    }
}