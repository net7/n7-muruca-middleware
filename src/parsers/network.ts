import Parser, { Input } from '../interfaces/parser';

export class NetworkParser implements Parser {
  parse({ data }: Input) {
    return data;
  }
}