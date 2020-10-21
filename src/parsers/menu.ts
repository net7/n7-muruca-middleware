import Parser, { Input } from "../interfaces/parser";

export class MenuParser implements Parser {
  parse({data}: Input) {
    data.map((d:any) =>
      d.slug.toLowerCase()
    )
    return data;
  }
}
