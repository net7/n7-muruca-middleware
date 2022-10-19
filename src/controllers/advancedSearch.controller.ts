import {AdvancedSearchService} from '../services';


export class advancedSearchController {
    search = async (body: any, config: any, locale?:string) => {        
        const service = new AdvancedSearchService();        
        const response =  await service.runAdvancedSearch(body, config, locale); // return main_query (cf. Basic Query Theatheor body JSON su Postman)
        return response;
    }
}