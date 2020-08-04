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
    buildQuery(data, conf) {
      let { searchId, sort } = data
      // QUERY ELASTICSEARCH
      let main_query: any = {
          query: {
              bool: {
                  must: [
                      { match: { type: searchId } }
                  ]
              }
          },
          sort: sort ? { "title.keyword": sort = sort.split("_")[2] } : [ "_score" ],
          aggregations: {}
      };

      let query_facets = conf[searchId]["facets-aggs"].aggregations;
      for (const key in data) {
          let query_key = conf[searchId].filters[key];
          if (query_key) {
              switch (query_key.type) {
                  case "fulltext":
                      const ft_query = {
                          query_string: {
                              query: query_key.addStar ? "*" + data.query + "*" : data,
                              fields: query_key.field
                          }
                      }
                      main_query.query.bool.must.push(ft_query)
                      break;
                  case "multivalue":
                      data[key].map((value) => {
                          main_query.query.bool.must.push({
                              match: {
                                  [query_key.field]: value
                              }
                          })
                      });
                      break;

                  default:
                      break;
              }
          }
      }
      //facets aggregations
      query_facets.map((f) => {
          for (const key in f) {
              main_query.aggregations[key] = {
                  terms: {
                      field: f[key]
                  }
              }
          }
      })
      return main_query;
  }
}