import { Client } from '@elastic/elasticsearch';
import { ESHelper, HttpHelper } from '../helpers';
import {AdvancedSearchService, TeipublisherService, XmlService} from '../services';


export class advancedSearchController {
    search = async (body: any, config: any, locale?:string) => {        
        const {
            searchIndex,
            elasticUri,
            configurations,
            defaultLang
        } = config;
        const service = new AdvancedSearchService(configurations);        
        const params = service.buildAdvancedQuery(body); 
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
            const response = service.parseResponse(query_res, body);
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
    
        const { xml, id, searchId } = body;        
        const service = new AdvancedSearchService(configurations);                
        const params = service.buildAdvancedQuery(body); 
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
            const xmlService = new XmlService();  
            const teipubservice = new TeipublisherService(teiPublisherUri); 
            const hlNodes = service.extractXmlTextHl(query_res);
            const xml_doc = await teipubservice.getXmlDocument(xml);
            
            const xml_hl = xmlService.replaceHlNodes(xml_doc, hlNodes);
            
            return  HttpHelper.returnOkResponse(xml_hl, 
                {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                    "Access-Control-Allow-Methods":
                    "GET, POST, OPTIONS, PUT, PATCH, DELETE",
                    "Access-Control-Allow-Headers": "X-Requested-With,content-type",
                    "Content-Type": "application/xml"
                });
        } else 
        return HttpHelper.returnErrorResponse("no xml root found", 400);
    }
}