"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItineraryParser = void 0;
class ItineraryParser {
    parse({ data, options }) {
        const default_fields = {
            'title': 'title',
            'content': "content",
            "slug": "slug",
            "subtitle": "subtitle",
            "author": "author",
            "time_to_read": "time_to_read",
            "image": "image"
        };
        const itinerary = {};
        for (const field in default_fields) {
            itinerary[field] = data[default_fields[field]];
        }
        for (const restField in data) {
            if (!default_fields[restField]) {
                itinerary[restField] = data[restField];
            }
        }
        return itinerary;
    }
    parseList({ data, options }) {
        if (Array.isArray(data)) {
            return data.map((d) => ({
                title: d.title.rendered,
                date: d.date,
                content: d.content.rendered,
                authors: d.author,
                time_to_read: d.time_to_read,
                slug: d.slug,
                image: d.image || "",
                link: options && options.type == "posts" ? "/post/" + d.slug : "/" + d.slug
            }));
        }
        return {};
    }
}
exports.ItineraryParser = ItineraryParser;
