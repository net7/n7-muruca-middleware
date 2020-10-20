import Parser, { Input, TranslationOptions } from "../interfaces/parser";

export class TranslationParser implements Parser {
  parse({data, options}: Input) {
    let { lang } = options as TranslationOptions;
    return { [lang]: data };
  }
}