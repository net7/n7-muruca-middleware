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
                case "breadcrumb":
                    parsed.sections[block] = this.parseBreadcrumbs(conf[block], data, type);
                    break;
                case "tabs":
                    parsed.sections[block] = this.parseTabs(conf[block], data);
                    break;
                case "metadata":
                    parsed.sections[block] = this.parseMetadata(conf[block], data, type);
                    break;
                case "metadata-accordion":
                    parsed.sections[block] = this.parseMetadataAccordion(conf[block], data, type);
                    break;
                case "metadata-size":
                    parsed.sections[block] = this.parseMetadataSize(conf[block], data);
                    break;
                case "metadata-description":
                    parsed.sections[block] = this.parseMetadataDescription(conf[block], data);
                    break;
                case "image-viewer":
                    parsed.sections[block] = this.parseImageViewer(conf[block], data);
                    break;
                case "image-viewer-iiif":
                    parsed.sections[block] = this.parseImageViewerIIIF(conf[block], data);
                    break;
                case "text-viewer":
                    parsed.sections[block] = this.parseTextViewer(conf[block], data);
                    break;
                case "collection":
                    parsed.sections[block] = this.parseCollection(conf[block], data);
                    break;
                case "collection-places":
                    parsed.sections[block] = this.parseCollectionMaps(conf[block], data);
                    break;
                case "bibliography":
                    parsed.sections[block] = this.parseBibliography(conf[block], data);
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
    // PARSERS
    // These parsers can be overridden in the parsers section of middleware projects.
    parseTitle(block, data) {
        let title = "";
        block.fields.map((field) => {
            if (data[field] && data[field] != "") {
                title = data[field];
            }
        });
        return title;
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
    parseBreadcrumbs(block, data, type) {
        let breadcrumbs;
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
    parseTabs(block, data) {
        const controller = [];
        block.tabs.forEach((tab) => {
            tab.fields.forEach((field) => {
                if ((!data[field] || data[field] === "") && !controller.includes(tab.id)) {
                    controller.push(tab.id);
                }
            });
        });
        return controller;
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
                                value: (0, parseMetadataFunctions_1.parseMetadataValue)(data, field)
                            };
                            return this.filterMetadataItem(field, metadataItem, type, data);
                        }
                    })
                }
            ],
        };
        m.group[0].items = m.group[0].items.filter((n) => n);
        return m;
    }
    parseMetadataAccordion(block, data, type) {
        const a = {
            data: [],
        };
        block.fields.forEach((field) => {
            if (!data[field] || !data[field].length)
                return;
            data[field].forEach((item) => {
                let accordion = {
                    title: item.title,
                    group: [],
                    accordionId: `${item['record-type']}-${item.id}`,
                    options: {
                        isOpen: false
                    }
                };
                accordion = this.filterAccordionHeader(accordion, item);
                let metadata = {
                    title: '',
                    items: []
                };
                let metadataList = this.creatMetadataAccordionList(item);
                metadata.items = metadataList.map((field) => {
                    if (item[field]) {
                        let metadataAccordionItem = {
                            label: field.replace(/_/g, " "),
                            value: (0, parseMetadataFunctions_1.parseMetadataValue)(item, field)
                        };
                        return this.filterMetadataAccordionItem(metadataAccordionItem, field, data);
                    }
                });
                accordion.group.push(metadata);
                a.data.push(accordion);
            });
        });
        if (!a.data.length)
            return;
        return a;
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
        return this.filterImageViewer(imageViewer, block, data);
    }
    parseImageViewerIIIF(block, data) {
        let iiifViewer = {
            'iiif-manifests': []
        };
        block.fields.forEach((field) => {
            if (data[field] && data[field] != "") {
                iiifViewer['iiif-manifests'].push({ manifestUrl: data[field] });
            }
        });
        if (iiifViewer['iiif-manifests'].length) {
            return this.filterImageViewerIIIF(iiifViewer, block, data);
        }
    }
    parseTextViewer(block, data) {
        var _a, _b, _c, _d, _e;
        let textViewer = {
            "endpoint": "",
            "docs": []
        };
        if (data[block.field]) {
            if (!data[block.field]["filename"].endsWith("/")) {
                textViewer = {
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
                            view: data[block.field]["view"],
                        },
                    ],
                };
                // Check apparatus
                if (data[block.field]['apparatus']) {
                    textViewer.docs[0].apparatus = {
                        odd: data[block.field]['apparatus']['odd'],
                        channel: data[block.field]['apparatus']['channel'],
                        view: data[block.field]['apparatus']["view"]
                    };
                }
                // Check facsimile
                if (data[block.field]['facsimile']) {
                    textViewer['facsimile'] = {
                        baseurl: (_d = data[block.field]['facsimile']['baseurl']) !== null && _d !== void 0 ? _d : data[block.field]['facsimile']['uri'],
                        scans: (_e = data[block.field]['facsimile']['scans']) !== null && _e !== void 0 ? _e : []
                    };
                }
            }
        }
        else {
            return;
        }
        return this.filterTextViewer(textViewer, block.field, data);
    }
    parseCollection(block, data) {
        const collection = {
            items: [],
        };
        block.fields.map((field) => {
            if (data[field]) {
                collection.items = data[field].map((f) => {
                    const collectionItem = {
                        title: f.title, //f.title.replace(/-/g, " "),
                        slug: f.slug,
                        id: f.id,
                        routeId: f['record-type'],
                    };
                    if (f.thumbnail) {
                        collectionItem['image'] = f.thumbnail;
                    }
                    if (f.params) {
                        collectionItem['params'] = this.extractQueryParams(f.params);
                    }
                    return this.filterCollectionItem(collectionItem, f, field, data);
                });
            }
        });
        return collection;
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
    extractQueryParams(queryParams) {
        const params = {};
        queryParams.split('&').forEach((param) => {
            const [key, value] = param.split('=');
            params[key] = value;
        });
        return params;
    }
    ;
    parseBibliography(block, data) {
        const c_b = {
            items: [],
        };
        if ((data["bibliografia"]) != null || (data["bibliography"]) != null) {
            block.fields.map((field) => {
                data[field].map((rif) => {
                    rif['rif_biblio'].map((biblio) => {
                        const textItems = [biblio.description, rif.rif_biblio_position]; // Here you can add biblio.title
                        const text = textItems.filter(item => item).join(', ');
                        let bibliographyItem = {
                            payload: {
                                id: biblio.id,
                                slug: biblio.slug,
                                routeId: biblio['record-type'],
                                type: 'bibliography',
                            },
                            text: text
                        };
                        bibliographyItem = this.filterBibliographyItem(bibliographyItem, rif, field, data);
                        c_b.items.push(bibliographyItem);
                    });
                });
            });
        }
        if (data["bibliographicCitation"] != null) {
            block.fields.map((field) => {
                data[field].map((rif) => {
                    rif["rif_biblio"].map((biblio) => {
                        const textItems = [biblio.title, biblio.description, rif.rif_biblio_position];
                        const text = textItems.filter(item => item).join(', ');
                        let bibliographyItem = {
                            payload: {
                                // action: "resource-modal",
                                id: biblio.id,
                                slug: biblio.slug,
                                routeId: biblio['record-type'],
                                type: 'bibliography',
                            },
                            text: text
                        };
                        bibliographyItem = this.filterBibliographyItem(bibliographyItem, rif, field, data);
                        c_b.items.push(bibliographyItem);
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
                            type: "bibliography",
                            slug: biblio.slug,
                            routeId: biblio['record-type'],
                        },
                        text: `${biblio.title}: ${biblio.description} ${rif["mrc_timeline_rif_biblio_position"]}`,
                    });
                });
            });
        }
        return Object.assign({}, c_b);
    }
    // OVERWRITEABLE FUNCTIONS
    // These filters can be overridden in the parsers section of middleware projects, they allows to modify a specific part of the result of a parser.
    filterImageViewer(imageViewer, block, data) {
        return imageViewer;
    }
    filterImageViewerIIIF(iiifViewer, block, data) {
        return iiifViewer;
    }
    filterTextViewer(textViewer, field, data) {
        return textViewer;
    }
    filterMetadataItem(field, metadataItem, recordType, data) {
        return metadataItem;
    }
    filterCollectionItem(collectionItem, item, field, data) {
        return collectionItem;
    }
    filterBibliographyItem(bibliographyItem, rif, field, data) {
        return bibliographyItem;
    }
    filterAccordionHeader(accordionHeader, item) {
        return accordionHeader;
    }
    filterMetadataAccordionItem(metadataAccordionItem, field, data) {
        return metadataAccordionItem;
    }
    creatMetadataAccordionList(item) {
        return ['title'];
    }
}
exports.ResourceParser = ResourceParser;
