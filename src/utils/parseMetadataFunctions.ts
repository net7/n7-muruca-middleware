import { OutputMetadataItem } from "../interfaces";

export const parseMetadataValue = (data: any, field: string): string | OutputMetadataItem[][] => {

    if(data[field]){
        let value = data[field];

        if(typeof data[field] === ('string' || 'number')){
            value = data[field];
        }
    
        else if(data[field][0]['record-type']){
          value  = parseMetadataRecord(data, field);
    
        }
        else if(data[field][0]['taxonomy']){
          value  = parseMetadataTaxonomy(data, field);
        }
    
        return value;
    }
  }

export const parseMetadataRecord = (data: any, field: string): OutputMetadataItem => {
    let value;

    if(data[field]){
        value = Object.keys(data[field])
         .map((n) => data[field][n].title)
         .join(", ")
    }
   return value;
  }

export const parseMetadataTaxonomy = (data: any, field: string): OutputMetadataItem => {
    let value;

    if(data[field]){
        value = Object.keys(data[field])
         .map((n) => data[field][n].name)
         .join(", ")
    }
   return value;
  }
