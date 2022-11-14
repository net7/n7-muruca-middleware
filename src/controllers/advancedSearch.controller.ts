import { Client } from '@elastic/elasticsearch';
import { ESHelper } from '../helpers';
import {AdvancedSearchService, TeipublisherService} from '../services';


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
    
    /** 
     * Search term in text and replaces the highlighted results in original xml file
     * 
     */
    advancedSearchTextSearch = async (body: any, config: any, locale?:string) => {  
        const {
            searchIndex,
            elasticUri,
            teiPublisherUri,
            configurations,
            defaultLang
        } = config;
        const { xml, doc_id, query_params } = body;
        const teipubservice = new TeipublisherService(configurations);  
        const xml_doc = teipubservice.getXmlDocument(xml);
        
        const searchService = new AdvancedSearchService(body, configurations);  
        const results = searchService
        
        return  {error:"error"}
    }
}