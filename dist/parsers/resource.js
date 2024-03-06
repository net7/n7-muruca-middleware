"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceParser = void 0;
class ResourceParser {
    parse({ data, options }, locale) {
        var _a, _b, _c, _d;
        if (!("type" in options)) {
            return;
        }
        const { conf, type } = options;
        const parsed = {
            title: "",
            sections: {},
        };
        for (const block in conf) {
            switch (block['type']) {
                case "title":
                    parsed.title = "";
                    conf[block].fields.map((field) => {
                        if (data[field] && data[field] != "") {
                            parsed.title = data[field];
                        }
                    });
                    break;
                case "header":
                    parsed.sections[block] = {};
                    let t = conf[block].fields;
                    parsed.sections[block][t[0]] = data[t[0]]; // title
                    parsed.sections[block][t[1]] = data[t[1]]; // description
                    break;
                case "image-viewer":
                    parsed.sections[block] = {};
                    let v = { images: [], thumbs: [] };
                    let gallery = conf[block].fields[0]; // "gallery"
                    if (typeof data[gallery] === "string") {
                        v.images.push({
                            type: "image",
                            url: data[gallery],
                            description: "",
                        });
                    }
                    else {
                        v.images = data[gallery].map((g) => ({
                            type: "image",
                            url: g.image,
                            description: g.description,
                        }));
                        v.thumbs = v.images;
                    }
                    parsed.sections[block] = v;
                    break;
                case "breadcrumbs":
                    parsed.sections[block] = {};
                    conf[block].fields.forEach((field) => {
                        parsed.sections[block] = Array.isArray(data[field])
                            ? data[field].map(({ id, slug, title }) => ({
                                title,
                                link: `/${type}/${id}/${slug}`,
                            }))
                            : [];
                    });
                    break;
                case "metadata":
                    parsed.sections[block] = {};
                    const m = {
                        group: [
                            {
                                title: "Metadata",
                                items: conf[block].fields.map((field) => {
                                    if (data[field]) {
                                        const filter = [
                                            "date",
                                            "author",
                                            "creator",
                                            "subject",
                                            "collocation",
                                            "linguaggio",
                                            "spatialCoverage",
                                            "temporalCoverage",
                                            "contenuti",
                                            "riproduzione_link",
                                            "riproduzione_link_2",
                                            "riproduzione",
                                            "edition",
                                        ];
                                        if (filter.indexOf(field) > -1) {
                                            return this.filter(data, field, type); // metadata
                                        }
                                        else {
                                            return {
                                                label: field.replace(/_/g, " "),
                                                value: data[field],
                                            };
                                        }
                                    }
                                }),
                            },
                        ],
                    };
                    m.group[0].items = m.group[0].items.filter((n) => n);
                    parsed.sections[block] = Object.assign({}, m);
                    break;
                case "collection-keywords":
                    parsed.sections[block] = {};
                    const keywords = {
                        header: { title: "Keywords collegate" },
                        items: [],
                    };
                    conf[block].fields.forEach((field) => {
                        if (data[field]) {
                            keywords.items = data[field].map((f) => ({
                                title: f.title,
                                link: `/keyword/${f.id}/${f.slug}`,
                                type: field,
                            }));
                        }
                    });
                    parsed.sections[block] = keywords; // keywords
                    break;
                case "collection-toponyms":
                    parsed.sections[block] = {};
                    const toponyms = {
                        header: { title: "Toponimi collegati" },
                        items: [],
                    };
                    conf[block].fields.map((field) => {
                        if (data[field]) {
                            toponyms.items = data[field].map((f) => ({
                                title: f.title,
                                link: "/" + type + "/" + f.id + "/" + f.slug,
                                type: field,
                            }));
                        }
                    });
                    parsed.sections[block] = toponyms; //toponyms
                    break;
                case "collection-witnesses":
                    parsed.sections[block] = {};
                    const witnesses = {
                        header: { title: "Testimoni collegati" },
                        items: [],
                    };
                    conf[block].fields.map((field) => {
                        if (data[field]) {
                            witnesses.items = data[field].map((f) => ({
                                title: f.title,
                                link: "/" + "testimone" + "/" + f.id + "/" + f.slug,
                                type: field,
                            }));
                        }
                    });
                    parsed.sections[block] = witnesses; //witnesses
                    break;
                case "related_motifs":
                    parsed.sections[block] = {};
                    const relatedRecord = {
                        header: {},
                        items: [],
                    };
                    conf[block].fields.map((field) => {
                        //for (let element in data[field]) {
                        if (data[field]) {
                            // console.log(data[field]);
                            //FIX ME
                            relatedRecord.items = data[field].map((f) => ({
                                title: f.title.replace(/-/g, " "),
                                link: f['record-type'] + "/" + f.id + "/" + f.slug,
                                slug: f.slug,
                                id: f.id,
                                routeId: f['record-type'],
                                //type: f.taxonomy,
                            }));
                            // }
                        }
                    });
                    parsed.sections[block] = relatedRecord; //taxonomies
                    break;
                // case "collection-taxonomies":
                // parsed.sections[block] = {};
                // const taxonomies = {
                //   header: { title: "Motivi collegati" },
                //   items: [],
                // };
                // conf[block].fields.map((field: string) => {
                //   for (let element in data[field]) {
                //     if (data[field] && data[field][element]) {
                //       //FIX ME
                //       taxonomies.items.push(
                //         data[field][element].map((f: any) => ({
                //           title: f.name.replace(/-/g, " "),
                //           link: "/taxonomy/" + f.id + "/" + f.key,
                //           type: f.taxonomy,
                //         }))
                //       );
                //     }
                //   }
                // });
                // parsed.sections[block] = taxonomies; //taxonomies
                // break;
                case "related_records":
                    parsed.sections[block] = {};
                    const records = {
                        header: { title: "Fiabe collegate" },
                        items: [],
                    };
                    conf[block].fields.map((field) => {
                        if (data[field]) {
                            records.items = data[field].map((f) => ({
                                title: f.title,
                                link: "/" + "record" + "/" + f.id + "/" + f.slug,
                                image: f.image,
                                slug: f.slug,
                                id: f.id,
                                routeId: f['record-type'],
                                //type: field,
                            }));
                        }
                    });
                    parsed.sections[block] = records;
                    break;
                case "metadata-size":
                    parsed.sections[block] = {};
                    const m_2 = {
                        group: [
                            {
                                title: "Dimensioni",
                                items: [].concat(...conf[block].fields // dimension
                                    .map((field) => Object.keys(data[field]).map((f) => ({
                                    label: f,
                                    value: f === "image"
                                        ? "<img src='" + data[field][f] + "'>"
                                        : data[field][f],
                                })))),
                            },
                        ],
                    };
                    parsed.sections[block] = Object.assign({}, m_2);
                    break;
                case "metadata-description":
                    parsed.sections[block] = {};
                    const m_3 = {
                        group: [
                            {
                                title: "Descrizione",
                                items: conf[block].fields // description
                                    .map((field) => {
                                    return { label: field, value: data[field] };
                                }),
                            },
                        ],
                    };
                    parsed.sections[block] = Object.assign({}, m_3);
                    break;
                case "collection-maps":
                    {
                        parsed.sections[block] = {};
                        const relatedMaps = {
                            header: { title: "Second level maps" },
                            items: [],
                        };
                        conf[block].fields.map((field) => {
                            if (data[field]) {
                                relatedMaps.items = data[field].map((f) => ({
                                    title: f.title,
                                    link: "/" + type + "/" + f.id + "/" + f.slug,
                                    image: f.image,
                                    type: f.type,
                                }));
                            }
                        });
                        parsed.sections[block] = relatedMaps; //toponyms
                    }
                    break;
                case "collection-bibliography":
                    parsed.sections[block] = {};
                    const c_b = {
                        header: {
                            title: "Bibliografie",
                        },
                        items: [],
                    };
                    if (data["bibliographicCitation"] != null) {
                        conf[block].fields.map((field) => {
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
                    parsed.sections[block] = Object.assign({}, c_b);
                    break;
                case "collection-records":
                    parsed.sections[block] = {};
                    const r_2 = {
                        header: {
                            title: "Bibliografia",
                        },
                        items: [],
                    };
                    conf[block].fields.forEach((field, i) => {
                        // work collection
                        if (data[field]) {
                            r_2.items.push({
                                // image: data[field][i].gallery[0].image,
                                image: data[field][i].image,
                                title: data[field][i].title,
                                // text: data[field][i].description,
                                link: `/${type}/${data[field][i].slug}`,
                            });
                            parsed.sections[block] = Object.assign({}, r_2);
                        }
                    });
                    break;
                case "collection-works":
                    parsed.sections[block] = {};
                    const c_2 = {
                        header: {
                            title: "Bibliografia",
                        },
                        items: [],
                    };
                    conf[block].fields.forEach((field, i) => {
                        // work collection
                        if (data[field] && field !== "related_records") {
                            // console.log(data[field]);
                            c_2.items.push({
                                image: data[field][i].gallery[0].image
                                    ? data[field][i].gallery[0].image
                                    : data[field][i].image,
                                title: data[field][i].title,
                                text: data[field][i].description,
                                link: `/${type}/${data[field][i].slug}`,
                                slug: data[field][i].slug,
                                id: data[field][i].id,
                                routeId: data[field][i]['record-type'],
                                metadata: [
                                    {
                                        items: [
                                            {
                                                label: "Autore/i",
                                                value: Object.keys(data[field][i].authors)
                                                    .map((auth) => data[field][i].authors[auth]["name"])
                                                    .join(", "),
                                            },
                                            { label: "Lingua", value: data[field][i].language },
                                            { label: "Entry ID", value: data[field][i].id },
                                            {
                                                label: "Livello bibliografico",
                                                value: data[field][i].bibliographic_level,
                                            },
                                            { label: "Anno", value: data[field][i].year },
                                        ],
                                    },
                                ],
                            });
                        }
                        else {
                            if (data[field] && field === "related_records") {
                                // console.log(data[field]);
                                c_2.header.title = "Fiabe collegate";
                                c_2.items = data[field].map((f) => ({
                                    title: f.title,
                                    link: "/" + f['record-type'] + "/" + f.id + "/" + f.slug,
                                    image: f.image,
                                    slug: f.slug,
                                    id: f.id,
                                    routeId: f['record-type'],
                                    //type: field,
                                }));
                            }
                        }
                        parsed.sections[block] = Object.assign({}, c_2);
                    });
                    break;
                case "preview-parent":
                    parsed.sections[block] = {};
                    conf[block].fields.map((field) => {
                        // preview parent
                        if (data[field]) {
                            const previewItem = data[field].map((f) => ({
                                title: f.title,
                                description: f.description,
                                image: f.image,
                                link: `/${type}/${f.id}/${f.slug}`,
                                classes: "is-fullwidth",
                            }));
                            parsed.sections[block] = Object.assign({}, previewItem);
                        }
                    });
                    break;
                case "text-viewer":
                    if (data["transcription"]) {
                        if (!data["transcription"]["filename"].endsWith("/")) {
                            parsed.sections[block] = {
                                endpoint: data["transcription"]["teipublisher"] +
                                    "/exist/apps/tei-publisher",
                                docs: [
                                    {
                                        xml: data["transcription"]["filename"],
                                        odd: data["transcription"]["odd"],
                                        id: data["slug"] + "_" + data["id"],
                                        channel: (_a = data["transcription"]["channel"]) !== null && _a !== void 0 ? _a : false,
                                        translation: (_b = data["transcription"]["translation"]) !== null && _b !== void 0 ? _b : false,
                                        xpath: (_c = data["transcription"]["xpath"]) !== null && _c !== void 0 ? _c : false,
                                        view: data["transcription"]["view"]
                                    },
                                ],
                            };
                        }
                    }
                    break;
                case "collection-places": // mandare formattata in questo modo
                    if (data[conf[block].fields]) {
                        parsed.sections[block] = [];
                        (_d = data[conf[block].fields]) === null || _d === void 0 ? void 0 : _d.forEach((element) => {
                            parsed.sections[block].push({
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
}
exports.ResourceParser = ResourceParser;
