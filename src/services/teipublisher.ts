import { DataType } from '../interfaces/helper';
import * as ASHelper from '../helpers/advanced-helper';
import { ESHelper, HttpHelper } from '../helpers';
import { Client } from '@elastic/elasticsearch';
import { AdvancedSearchParser } from '../parsers';

export class TeipublisherService {
    private body:any;
    private teiPublisherUri:any;
    
    constructor(teiPublisherUri){
        this.teiPublisherUri = teiPublisherUri;
    }
    
    getXmlDocument = (xml: string) => {
        
    }
    
    getNodePath = async (doc: string, path: string) => {
        //doc_root_id/petrarca%2Fde-viris_i_23_3_2022_1648127195.xml
        const api_url = this.teiPublisherUri + 'doc_root_id' + encodeURIComponent(doc);
        const res = await HttpHelper.doRequest(
            //qui devono arrivare già i params per il teiHeader
            api_url + '?path=' + path
        );
        return res;
    }

}