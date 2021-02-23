import Parser, { Input } from "../interfaces/parser";

export class StaticPageParser implements Parser {
  parse({ data, options }: Input) {
      if (Array.isArray(data)) {
        return data.map((d: any) => ({
            title: d.title.rendered,
            date: d.date,
            content: d.content.rendered,
            authors: d.author,
            time_to_read: d.time_to_read,
            slug: d.slug
          }))[0];         
      }
    return {};
  }

  parseList({ data, options }: any) {    
      if (Array.isArray(data)) {
        return data.map((d: any) => ({
            title: d.title.rendered,
            date: d.date,
            content: d.content.rendered,
            authors: d.author,
            time_to_read: d.time_to_read,
            slug: d.slug,
            image: d.image || "",
            link: options && options.type == "posts" ? "/post/" + d.slug : "/" +d.slug
          }));
      }    
    return {};
  }
}
