"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticPageParser = void 0;
class StaticPageParser {
    parse({ data, options }) {
        if (options && 'slug' in options) {
            if (Array.isArray(data)) {
                return data
                    .filter(d => d.slug === options.slug)
                    .map((d) => ({
                    title: d.title.rendered,
                    date: d.date,
                    content: d.content.rendered,
                    authors: d.author,
                    time_to_read: d.time_to_read,
                    slug: d.slug
                }))[0];
            }
        }
        else {
            if (Array.isArray(data)) {
                return data.map((d) => ({
                    title: d.title.rendered,
                    date: d.date,
                    content: d.content.rendered,
                    authors: d.author,
                    time_to_read: d.time_to_read,
                    slug: d.slug
                }));
            }
        }
        return {};
    }
}
exports.StaticPageParser = StaticPageParser;
