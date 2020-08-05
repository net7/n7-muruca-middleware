export class ResourceParser {
    parse({ data, options }) {
        if (options) {
            var { conf, page } = options;
        }
        const parsed = {
            title: '',
            sections: {}
        };
        for (const block in conf) {
            switch (block) {
                case 'title':
                    conf[block].fields.map((field) => {
                        parsed.title = data[field];
                    });
                    break;
                case 'header':
                    parsed.sections[block] = {};
                    let t = conf[block].fields;
                    parsed.sections[block][t[0]] = data[t[0]]; // title
                    parsed.sections[block][t[1]] = data[t[1]]; // description
                    break;
                case 'image-viewer':
                    parsed.sections[block] = {};
                    let v = { images: [], thumbs: [] };
                    let gallery = conf[block].fields[0]; // "gallery"
                    v.images = data[gallery].map((g) => ({ type: 'image', url: g.image, description: g.description }));
                    v.thumbs = v.images;
                    parsed.sections[block] = v;
                    break;
                case 'metadata':
                    parsed.sections[block] = {};
                    const m = {
                        group: [{
                                title: 'Metadata',
                                items: conf[block].fields
                                    .map((field) => {
                                    if (data[field]) {
                                        const filter = [
                                            "date",
                                            "authors",
                                            "size",
                                            "graphic_variant",
                                            "morphological_variant",
                                            "primary_sources",
                                            "modern_language_equivalence",
                                            "synonyms",
                                            "external_links",
                                            "loan"
                                        ];
                                        if (filter.indexOf(field) > -1) {
                                            return (this.filter(data, field)); // metadata
                                        }
                                        else {
                                            return { label: field.replace(/_/g, " "), value: data[field] };
                                        }
                                    }
                                }).flat()
                            }]
                    };
                    m.group[0].items = m.group[0].items.filter((n) => n);
                    parsed.sections[block] = Object.assign({}, m);
                    break;
                case "collection-keywords":
                    parsed.sections[block] = {};
                    const keywords = {
                        header: { title: "Kewords collegate" },
                        items: []
                    };
                    conf[block].fields.forEach((field) => {
                        if (data[field]) {
                            keywords.items = data[field].map((f) => ({
                                title: f.title,
                                link: `/${page}/${f.id}/${f.slug}`,
                                type: field
                            }));
                        }
                    });
                    parsed.sections[block] = keywords; // keywords
                    break;
                case "collection-toponyms":
                    parsed.sections[block] = {};
                    const toponyms = {
                        header: { title: "Toponimi collegati" },
                        items: []
                    };
                    conf[block].fields.map((field) => {
                        if (data[field]) {
                            toponyms.items = data[field].map((f) => ({
                                title: f.title,
                                link: "/" + page + "/" + f.id + "/" + f.slug,
                                type: field
                            }));
                        }
                    });
                    parsed.sections[block] = toponyms; //toponyms
                    break;
                case "metadata-size":
                    parsed.sections[block] = {};
                    const m_2 = {
                        group: [{
                                title: 'Dimensioni',
                                items: conf[block].fields // dimension
                                    .map((field) => Object.keys(data[field])
                                    .map(f => ({
                                    label: f,
                                    value: f === "image" ? "<img src='" + data[field][f] + "'>" : data[field][f]
                                }))).flat()
                            }]
                    };
                    parsed.sections[block] = Object.assign({}, m_2);
                    break;
                case "metadata-description":
                    parsed.sections[block] = {};
                    const m_3 = {
                        group: [{
                                title: 'Descrizione',
                                items: conf[block].fields // description
                                    .map((field) => {
                                    return ({ label: field, value: data[field] });
                                })
                            }]
                    };
                    parsed.sections[block] = Object.assign({}, m_3);
                    break;
                case "collection-works":
                    parsed.sections[block] = {};
                    const c_2 = {
                        header: {
                            title: 'Bibliografia',
                        },
                        items: []
                    };
                    conf[block].fields.forEach((field, i) => {
                        if (data[field]) {
                            c_2.items.push({
                                image: data[field][i].gallery[0].image,
                                title: data[field][i].title,
                                text: data[field][i].description,
                                link: `/${page}/${data[field][i].slug}`,
                                metadata: [{
                                        items: [
                                            { label: 'Autore/i', value: Object.keys(data[field][i].authors).map(auth => (data[field][i].authors[auth]['name'])).join(', ') },
                                            { label: 'Lingua', value: data[field][i].language },
                                            { label: 'Entry ID', value: data[field][i].id },
                                            { label: 'Livello bibliografico', value: data[field][i].bibliographic_level },
                                            { label: 'Anno', value: data[field][i].year },
                                        ]
                                    }]
                            });
                            parsed.sections[block] = Object.assign({}, c_2);
                        }
                    });
                    break;
                case "preview-parent":
                    parsed.sections[block] = {};
                    conf[block].fields.map((field) => {
                        if (data[field]) {
                            const previewItem = data[field].map((f) => ({
                                title: f.title,
                                description: f.description,
                                image: f.image,
                                link: `/${page}/${f.id}/${f.slug}`,
                                classes: 'is-fullwidth'
                            }));
                            parsed.sections[block] = Object.assign({}, previewItem);
                        }
                    });
                    break;
                default:
                    break;
            }
        }
        return parsed;
    }
    /**
     * Data filters
     */
    filter(data, field) {
        let filter;
        if (/date/.test(field)) {
            filter = { label: "Date", value: data[field].year + "-" + data[field]["end_year"] };
        }
        if (/authors/.test(field)) {
            filter = [];
            data[field].map((auth) => {
                filter.push({
                    label: auth.role,
                    value: Object.keys(auth.author)
                        .map(a => auth.author[a].name)
                        .join(', ')
                });
            });
        }
        if (/sizes/.test(field)) {
            filter = { label: "Size", value: data[field].size };
        }
        if (/loan/.test(field)) {
            filter = {
                label: field,
                value: data[field].map((l) => l).join(', ')
            };
        }
        if (/graphic_variant|morphological_variant|modern_language_equivalence|synonyms/.test(field)) {
            filter = {
                label: field.replace(/_/g, " "),
                value: Object.keys(data[field]).map(auth => (data[field][auth]["text"]
                    ? data[field][auth]["text"]
                    : data[field][auth]["equivalence"]
                        ? data[field][auth]["equivalence"]
                        : data[field][auth]["synonym"])).join(', ')
            };
        }
        if (/primary_sources|external_links/.test(field)) {
            filter = {
                label: field.replace(/_/g, " "),
                value: Object.keys(data[field]).map(auth => (data[field][auth]["link"])).join(', ')
            };
        }
        return filter;
    }
}
