import Parser from '../interfaces/parser';

export class ResourceParser implements Parser {
  parse(data: any, locale?: string) {
    return data;
  }
  localeParse(data: any) {
    const locale = data;
    return locale;
  }
}
