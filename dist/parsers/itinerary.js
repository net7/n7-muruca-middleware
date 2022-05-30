"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItineraryParser = void 0;
const helpers_1 = require("./../helpers");
class ItineraryParser {
    constructor(config) {
        this.config = config;
    }
    parse({ data, options }) {
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
        const itinerary = { sections: {} };
        for (const field in default_fields) {
            itinerary[field] = data[default_fields[field]];
        }
        for (const restField in data) {
            if (!default_fields[restField]) {
                if (this.config.collections[restField]) {
                    itinerary.sections[restField] = {};
                    itinerary.sections[restField]['items'] = data[restField].map((d) => {
                        var _a;
                        return ({
                            title: d.title,
                            text: d.description,
                            link: helpers_1.CommonHelper.buildLink((_a = this.config.collections[restField]) === null || _a === void 0 ? void 0 : _a.link, d),
                            image: d.thumbnail || null,
                            slug: d.slug,
                            id: d.id
                        });
                    });
                }
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
