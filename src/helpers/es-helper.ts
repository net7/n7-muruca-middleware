import { DataType } from "../interfaces/helper";
import { SearchResponse } from "elasticsearch";

export const ESHelper = {
  bulkIndex(response: string, index: string, Client: any, ELASTIC_URI: string) { // client = const { Client } = require('@elastic/elasticsearch')
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
    let body: object[] = [];
    const dataset = JSON.parse(response);
    dataset.forEach((element: object) => {
      body.push({ index: { _index: index } });
      body.push(element)
    });

    client.bulk({ refresh: true, body },
      (err: string, { body }: any) => {
        if (err) console.log(body.errors)
        const response = {
          statusCode: 200,
          body: JSON.stringify(body),
        };

        return response;
      }
    )
  },
  makeSearch(index: string, body: string, Client: any, ELASTIC_URI: string): Promise<SearchResponse<any>> {
    return new Promise(function (resolve, reject) {
      const client = new Client({
        node: ELASTIC_URI,
      })
      client.search({
        index: index,
        body: body
      }, (err: string, { body }: any) => {
        if (err) console.log(err)
        resolve(body);
      })
    })
  },
  // data = body 
  buildQuery(data: DataType, conf: any) {
    let { searchId, sort, facets } = data
    // QUERY ELASTICSEARCH
    let main_query: any = {
      query: {  
      bool: {
        must: [
          { match: { type: searchId } }
        ]
      }
    },
    sort: sort ? {"title.keyword": sort.split("_")[1]} : ["_score"],
    aggregations: {}
  };

    let query_facets = conf[searchId]["facets-aggs"].aggregations;
    if(facets){
      facets.forEach((facet: { id: string; }) => {
        const { id } = facet;
        let query_key = conf[searchId].filters[id];
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
              if(data[id]){
                data[id].map((value) => {
                  main_query.query.bool.must.push({
                    match: {
                      [query_key.field]: value.id
                    }
                  })
                });
              }
              break;

            default:
              break;
          }
        }
      });
    }else{

    }
    //facets aggregations
    query_facets.map((f: { [x: string]: any; }) => {
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
