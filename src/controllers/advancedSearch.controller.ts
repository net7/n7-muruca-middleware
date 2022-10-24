import { Client } from '@elastic/elasticsearch';
import { ESHelper } from '../helpers';
import {AdvancedSearchService} from '../services';


export class advancedSearchController {
    search = async (body: any, config: any, locale?:string) => {        
        const {
            searchIndex,
            elasticUri,
            configurations,
            defaultLang
        } = config;
        const service = new AdvancedSearchService(body, configurations);        
        const params = service.buildAdvancedQuery(); 
        let searchLangIndex = searchIndex;
        if (locale && defaultLang && locale != defaultLang) {
            searchLangIndex = searchIndex + '_' + locale
        }
        //console.log(JSON.stringify(params));
        const query_res: any = await ESHelper.makeSearch(
            searchLangIndex,
            params,
            Client,
            elasticUri
        );
        if(query_res){
            const response = service.parseResponse(query_res);
            return response;
        } else 
            return {error:"error"}
        
    }
}