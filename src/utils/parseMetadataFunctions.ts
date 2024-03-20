import { OutputMetadataItem } from "../interfaces";

export const parseMetadataCreator = (data, field): OutputMetadataItem => {
    let filter = {
        label: null,
        value: null
    }

    if(data[field]){
        filter = {
         label: field,
         value: Object.keys(data[field])
         .map((n) => data[field][n].title)
         .join(", "),
       };
    }
   return filter;
  }

export const parseMetadataSubject = (data, field): OutputMetadataItem => {
    let filter = {
        label: null,
        value: null
    }

    if(data[field]){
        filter = {
         label: field,
         value: Object.keys(data[field])
         .map((n) => data[field][n].name)
         .join(", "),
       };
    }
   return filter;
  }