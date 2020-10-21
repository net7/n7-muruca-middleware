import Parser from "../interfaces/parser";

export class MenuParser implements Parser {
  parse(data: any) {
    data.map((p:any) => p.slug = p.slug.toLowerCase())  
    return data;
  }
}
