import Parser, { Input } from '../interfaces/parser';
import { CommonHelper } from './../helpers';

export class ItineraryParser implements Parser {
  private config;

  constructor(config) {
    this.config = config;
  }

  parse({ data, options }: Input) {
    const default_fields = {
      id: 'id',
      title: 'title',
      content: 'content',
      slug: 'slug',
      subtitle: 'subtitle',
      author: 'author',
      time_to_read: 'time_to_read',
      image: 'image',
    };
    const itinerary = { sections: {} };
    for (const field in default_fields) {
      itinerary[field] = data[default_fields[field]];
    }

    for (const restField in data) {
      if (!default_fields[restField]) {
        if (this.config.collections[restField]) {
          itinerary.sections[restField] = {};
          itinerary.sections[restField]['items'] = data[restField].map(
            (d: any) => ({
              title: d.title,
              text: d.description,
              link: CommonHelper.buildLink(
                this.config.collections[restField]?.link,
                d,
              ),
              image: d.thumbnail || null,
              slug: d.slug,
              id: d.id,
              routeId: d['record-type'],
            }),
          );
        }
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
        image: d.image || '',
        link:
          options && options.type == 'posts' ? '/post/' + d.slug : '/' + d.slug,
      }));
    }
    return {};
  }
}
