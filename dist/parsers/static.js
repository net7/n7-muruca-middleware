"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticPageParser = void 0;
class StaticPageParser {
    parse({ data, options }) {
        if (Array.isArray(data)) {
            return data.map((d) => ({
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
                link: options && options.type == "posts" ? "/posts/" + d.slug : "/" + d.slug
            }));
        }
        return {};
    }
}
exports.StaticPageParser = StaticPageParser;
