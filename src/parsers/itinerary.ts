import Parser, { Input } from "../interfaces/parser";

export class ItineraryParser implements Parser {
  parse({ data, options }: Input) {
    const default_fields = {
      'id': 'id',
      'title': 'title',
      'content': "content", 
      "slug": "slug", 
      "subtitle": "subtitle",
      "author": "author",
      "time_to_read": "time_to_read",
      "image": "image"
    };

    const itinerary = { sections: {}};
    for (const field in default_fields) {
      itinerary[field] = data[default_fields[field]];
    }

    for (const restField in data) {
      if (!default_fields[restField] ) {
        itinerary.sections[restField] = data[restField];
      }
    }

    return itinerary;
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
