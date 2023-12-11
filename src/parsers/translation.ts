import Parser, { Input, TranslationOptions } from '../interfaces/parser';

export class TranslationParser implements Parser {
  parse({ data }: Input) {
    return data;
  }
}
