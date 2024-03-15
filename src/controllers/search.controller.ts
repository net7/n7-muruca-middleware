import { Client } from '@elastic/elasticsearch';
import { ESHelper } from '../helpers';

export class searchController {
  search = async (body: any, config: any, type: string, locale?: string) => {
    const { parsers, searchIndex, elasticUri, configurations, defaultLang } =
      config;
    let searchLangIndex = searchIndex;
    if (locale && defaultLang && locale != defaultLang) {
      searchLangIndex = searchIndex + '_' + locale;
    }
    const params = ESHelper.buildQuery(body, configurations.search, type); // return main_query (cf. Basic Query Theatheor body JSON su Postman)
    // make query
    //console.log(JSON.stringify(params));
    const query_res: any = await ESHelper.makeSearch(
      searchLangIndex,
      params,
      Client,
      elasticUri,
    );
    const data =
      type === 'results' ? query_res.hits.hits : query_res.aggregations;
    if(!data) return {}
    const parser = new parsers.search();
    const { searchId, facets } = body;
    const { limit, offset, sort } = body.results ? body.results : 'null';
    let total_count = query_res.hits.total.value;
    const response = parser.parse(
      {
        data,
        options: {
          type,
          offset,
          sort,
          limit,
          total_count,
          searchId,
          facets,
          conf: configurations.search,
        },
      },
      body,
    );
    return response;
  };
}
