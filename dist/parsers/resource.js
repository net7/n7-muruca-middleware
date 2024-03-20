"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceParser = void 0;
const parseMetadataFunctions_1 = require("../utils/parseMetadataFunctions");
class ResourceParser {
    parse({ data, options }, locale) {
        if (!("type" in options)) {
            return;
        }
        const { conf, type } = options;
        const parsed = {
            title: "",
            sections: {},
        };
        if (data === null || data === void 0 ? void 0 : data.error) {
            return parsed;
        }
        for (const block in conf) {
            switch (conf[block].type) {
                case "title":
                    parsed.title = this.parseTitle(conf[block], data);
                    break;
                case "header":
                    parsed.sections[block] = this.parseHeader(conf[block], data);
                    break;
                case "image-viewer":
                    parsed.sections[block] = this.parseImageViewer(conf[block], data);
                    break;
                case "breadcrumb":
                    parsed.sections[block] = this.parseBreadcrumbs(conf[block], data, type);
                    break;
                case "metadata":
                    parsed.sections[block] = this.parseMetadata(conf[block], data, type);
                    break;
                case "collection":
                    parsed.sections[block] = this.parseCollection(conf[block], data);
                    break;
                case "metadata-size":
                    parsed.sections[block] = this.parseMetadataSize(conf[block], data);
                    break;
                case "metadata-description":
                    parsed.sections[block] = this.parseMetadataDescription(conf[block], data);
                    break;
                case "bibliography":
                    parsed.sections[block] = this.parseBibliography(conf[block], data);
                    break;
                case "text-viewer":
                    parsed.sections[block] = this.parseTextViewer(conf[block], data);
                    break;
                case "collection-places":
                    parsed.sections[block] = this.parseCollectionMaps(conf[block], data);
                    break;
                default:
                    break;
            }
        }
        return parsed;
    }
    localeParse(data) {
        const locale = data;
        return locale;
    }
    /**
     * Data filters
     */
    filter(data, field, page) {
        let filter;
        if (/date/.test(field)) {
            filter = { label: field, value: data[field]["range"] };
        }
        if (/edition/.test(field)) {
            filter = {
                label: field,
                value: data[field][0]["title"] + " " + data[field][0]["description"],
            };
        }
        if (/contenuti/.test(field)) {
            filter = {
                label: field,
                value: [],
            };
            data[field]
                ? data[field].map((c) => filter.value.push(Object.keys(c).map((f) => ({ value: c[f] }))))
                : null;
        }
        if (/author|collocation|creator|subject/.test(field)) {
            filter = {
                label: field,
                value: Object.keys(data[field])
                    .map((n) => data[field][n].name)
                    .join(", "),
            };
        }
        if (/authors/.test(field)) {
            filter = [];
            switch (page) {
                case "work":
                    Object.keys(data[field]).map((auth) => {
                        filter.push({
                            label: "author",
                            value: data[field][auth].name,
                        });
                    });
                    break;
                case "map":
                    data[field].map((auth) => {
                        filter.push({
                            label: auth.role,
                            value: Object.keys(auth.author)
                                .map((a) => auth.author[a].name)
                                .join(", "),
                        });
                    });
                    break;
            }
        }
        if (/spatialCoverage/.test(field)) {
            filter = {
                label: field,
                value: Object.keys(data[field])
                    .map((lang) => data[field][lang].title)
                    .join(""),
            };
        }
        if (/temporalCoverage/.test(field)) {
            filter = {
                label: field,
                value: Object.keys(data[field])
                    .map((lang) => data[field][lang])
                    .join(""),
            };
        }
        if (/linguaggio/.test(field)) {
            filter = {
                label: field.replace(/_/g, " "),
                value: Object.keys(data[field])
                    .map((lang) => data[field][lang]["name"])
                    .join(", "),
            };
        }
        if (/primary_sources|external_links/.test(field)) {
            filter = {
                label: field.replace(/_/g, " "),
                value: Object.keys(data[field])
                    .map((auth) => data[field][auth]["link"])
                    .join(", "),
            };
        }
        if (/riproduzione_link/.test(field)) {
            filter = {
                label: "riproduzione".replace(/_/g, " "),
                value: `<a href="${data[field]}">${data["riproduzione"]
                    ? data["riproduzione"].map((item) => item.title).join(", ")
                    : null || "Vedi riproduzione"}</a>`,
            };
        }
        if (/bibliografia/.test(field)) {
            filter = [];
            data[field].map((rif) => {
                rif.rif_biblio.map((bibl) => {
                    filter.push({
                        label: bibl.title,
                        value: `${bibl.description} ${rif.rif_biblio_position}`,
                        link: `/${bibl.type}/${bibl.id}/#${bibl.slug}`,
                    });
                });
            });
        }
        return filter;
    }
    filterMetadata(field, metadataItem, recordType) {
        return metadataItem;
    }
    /**
     * Parsers
     */
    parseTitle(block, data) {
        let title = "";
        block.fields.map((field) => {
            if (data[field] && data[field] != "") {
                title = data[field];
            }
        });
        return title;
    }
    parseMetadata(block, data, type) {
        const m = {
            group: [
                {
                    title: "Metadata",
                    items: block.fields.map((field) => {
                        if (data[field]) {
                            let metadataItem = {
                                label: field.replace(/_/g, " "),
                                value: data[field],
                            };
                            if (field === "creator") {
                                metadataItem = (0, parseMetadataFunctions_1.parseMetadataCreator)(data, field);
                            }
                            else if (field === "subject") {
                                metadataItem = (0, parseMetadataFunctions_1.parseMetadataSubject)(data, field);
                            }
                            return this.filterMetadata(field, metadataItem, type);
                        }
                    })
                }
            ],
        };
        m.group[0].items = m.group[0].items.filter((n) => n);
        return m;
    }
    parseMetadataSize(block, data) {
        const metadataSize = {
            group: [
                {
                    title: "Dimensioni",
                    items: [].concat(...block.fields // dimension
                        .map((field) => Object.keys(data[field]).map((f) => ({
                        label: f,
                        value: f === "image"
                            ? "<img src='" + data[field][f] + "'>"
                            : data[field][f],
                    })))),
                },
            ],
        };
        return metadataSize;
    }
    parseMetadataDescription(block, data) {
        const metadataDescription = {
            group: [
                {
                    title: "Descrizione",
                    items: block.fields // description
                        .map((field) => {
                        return { label: field, value: data[field] };
                    }),
                },
            ],
        };
        return metadataDescription;
    }
    parseHeader(block, data) {
        const fields = block.fields;
        const header = {
            title: ''
        };
        if (data[fields[0]]) {
            header.title = data[fields[0]];
        }
        if (data[fields[1]]) {
            header.description = data[fields[1]];
        }
        return header;
    }
    parseImageViewer(block, data) {
        let imageViewer = { images: [], thumbs: [] };
        let gallery = block.fields[0]; // "gallery"
        if (!data[gallery])
            return;
        if (typeof data[gallery] === "string") {
            imageViewer.images.push({
                type: "image",
                url: data[gallery],
                description: "",
            });
        }
        else {
            imageViewer.images = data[gallery].map((g) => ({
                type: g.type,
                url: g.url ? g.url : '',
                description: g.description ? g.description : '',
                caption: g.caption ? g.caption : ''
            }));
            imageViewer.thumbs = data[gallery].map((g) => g.sizes.thumbnail);
        }
        return imageViewer;
    }
    parseBreadcrumbs(block, data, type) {
        let breadcrumbs = { link: "", title: "" };
        block.fields.forEach((field) => {
            breadcrumbs = Array.isArray(data[field])
                ? data[field].map(({ id, slug, title }) => ({
                    title,
                    link: `/${type}/${id}/${slug}`,
                }))
                : [];
        });
        return breadcrumbs;
    }
    parseCollection(block, data) {
        const collection = {
            items: [],
        };
        block.fields.map((field) => {
            var _a;
            if (data[field]) {
                collection.items = data[field].map((f) => ({
                    title: f.title, //f.title.replace(/-/g, " "),
                    slug: f.slug,
                    id: f.id,
                    routeId: f['record-type'],
                }));
                if ((_a = data[field]) === null || _a === void 0 ? void 0 : _a.image) { //TODO
                    collection.items['image'] = data[field].image;
                }
            }
        });
        return collection;
    }
    parseBibliography(block, data) {
        const c_b = {
            items: [],
        };
        if (data["bibliographicCitation"] != null) {
            block.fields.map((field) => {
                data[field].map((rif) => {
                    rif["rif_biblio"].map((biblio) => {
                        const text = biblio.title != ""
                            ? `${biblio.title} ${biblio.description} ${rif.rif_biblio_position}`
                            : `${biblio.description}: ${rif.rif_biblio_position}`;
                        c_b.items.push({
                            payload: {
                                // action: "resource-modal",
                                id: biblio.id,
                                type: "bibliography_wit",
                            },
                            text: `${biblio.title} ${biblio.description} ${rif.rif_biblio_position}`,
                        });
                    });
                });
            });
        }
        else if (data["timeline_bibliografia"] != null) {
            data["timeline_bibliografia"].map((rif) => {
                rif["mrc_timeline_bibliografia_rif_biblio"].map((biblio) => {
                    c_b.items.push({
                        payload: {
                            action: "resource-modal",
                            id: biblio.id,
                            type: "bibliography_wit",
                        },
                        text: `${biblio.title}: ${biblio.description} ${rif["mrc_timeline_rif_biblio_position"]}`,
                    });
                });
            });
        }
        return Object.assign({}, c_b);
    }
    parseTextViewer(block, data) {
        var _a, _b, _c;
        let t_v = {
            "endpoint": "",
            "docs": []
        };
        if (data[block.field]) {
            if (!data[block.field]["filename"].endsWith("/")) {
                t_v = {
                    endpoint: data[block.field]["teipublisher"] +
                        "/exist/apps/tei-publisher",
                    docs: [
                        {
                            xml: data[block.field]["filename"],
                            odd: data[block.field]["odd"],
                            id: data["slug"] + "_" + data["id"],
                            channel: (_a = data[block.field]["channel"]) !== null && _a !== void 0 ? _a : false,
                            translation: (_b = data[block.field]["translation"]) !== null && _b !== void 0 ? _b : false,
                            xpath: (_c = data[block.field]["xpath"]) !== null && _c !== void 0 ? _c : false,
                            view: data[block.field]["view"]
                        },
                    ],
                };
            }
        }
        else
            return;
        return t_v;
    }
    parseCollectionMaps(block, data) {
        var _a;
        const collectionMaps = [];
        (_a = block === null || block === void 0 ? void 0 : block.fields) === null || _a === void 0 ? void 0 : _a.forEach((field) => {
            var _a;
            if (data[field]) {
                (_a = data[field]) === null || _a === void 0 ? void 0 : _a.forEach((element) => {
                    collectionMaps.push({
                        title: element.title,
                        slug: element.slug,
                        text: element.text,
                        map_center: {
                            lat: element.coords.center_lat,
                            lng: element.coords.center_lng,
                        },
                        markers: element.coords.markers,
                        zoom: element.coords.zoom,
                    });
                });
            }
        });
        return collectionMaps;
    }
}
exports.ResourceParser = ResourceParser;
