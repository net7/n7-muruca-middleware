import Parser, { Input } from '../interfaces/parser';

export class SearchDescriptionParser implements Parser {
  parse({ data }: Input) {
    return data;
  }
}
