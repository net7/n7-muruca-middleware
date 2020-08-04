export default class ResourceParser {
    ;
    parse({ page, data, conf }) {
        let obj = {
            title: '',
            sections: {}
        };
        for (const key in conf) {
            switch (key) {
                case 'title':
                    conf[key].fields.map((field) => {
                        obj.title = data[field];
                    });
                    break;
                case 'header':
                    obj.sections[key] = {};
                    let t = conf[key].fields;
                    obj.sections[key][t[0]] = data[t[0]]; // title
                    obj.sections[key][t[1]] = data[t[1]]; // description
                    break;
                case 'image-viewer':
                    obj.sections[key] = {};
                    let v = { images: [], thumbs: [] };
                    let gallery = conf[key].fields[0]; // "gallery"
                    v.images = data[gallery].map(g => ({ type: 'image', url: g.image, description: g.description }));
                    v.thumbs = v.images;
                    obj.sections[key] = v;
                    break;
                case 'metadata':
                    obj.sections[key] = {};
                    const m = {
                        group: [{
                                title: 'Metadata',
                                items: conf[key].fields
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
                    m.group[0].items = m.group[0].items.filter(n => n);
                    obj.sections[key] = Object.assign({}, m);
                    break;
                case "collection-keywords":
                    obj.sections[key] = {};
                    const keywords = {
                        header: { title: "Kewords collegate" },
                        items: []
                    };
                    conf[key].fields.map((field) => {
                        if (data[field]) {
                            data[field].map(f => {
                                keywords.items.push({ title: f.title, link: `/${page}/${f.id}/${f.slug}`, type: field });
                            });
                        }
                    });
                    obj.sections[key] = keywords; // keywords
                    break;
                case "collection-toponyms":
                    obj.sections[key] = {};
                    const toponyms = {
                        header: { title: "Toponimi collegati" },
                        items: []
                    };
                    conf[key].fields.map((field) => {
                        if (data[field]) {
                            data[field].map(f => {
                                toponyms.items.push({ title: f.title, link: "/" + page + "/" + f.id + "/" + f.slug, type: field });
                            });
                        }
                    });
                    obj.sections[key] = toponyms; //toponyms
                    break;
                case "metadata-size":
                    obj.sections[key] = {};
                    const m_2 = {
                        group: [{
                                title: 'Dimensioni',
                                items: conf[key].fields // dimension
                                    .map((field) => {
                                    return (Object.keys(data[field]).map(f => ({ label: f, value: f === "image" ? "<img src='" + data[field][f] + "'>" : data[field][f] })));
                                }).flat()
                            }]
                    };
                    obj.sections[key] = Object.assign({}, m_2);
                    break;
                case "metadata-description":
                    obj.sections[key] = {};
                    const m_3 = {
                        group: [{
                                title: 'Descrizione',
                                items: conf[key].fields //descriprion
                                    .map((field) => {
                                    return ({ label: field, value: data[field] });
                                })
                            }]
                    };
                    obj.sections[key] = Object.assign({}, m_3);
                    break;
                case "collection-works":
                    obj.sections[key] = {};
                    const c_2 = {
                        header: {
                            title: 'Bibliografia',
                        },
                        items: []
                    };
                    conf[key].fields.map((field, i) => {
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
                        }
                    });
                    obj.sections[key] = Object.assign({}, c_2);
                    break;
                case "preview-parent":
                    obj.sections[key] = {};
                    const p_p = {};
                    conf[key].fields.map(field => {
                        if (data[field]) {
                            data[field].map(f => {
                                p_p["title"] = f.title;
                                p_p["description"] = f.description;
                                p_p["image"] = f.image;
                                p_p["link"] = "/" + page + "/" + f.id + "/" + f.slug;
                                p_p["classes"] = 'is-fullwidth';
                            });
                        }
                    });
                    obj.sections[key] = Object.assign({}, p_p);
                    break;
                default:
                    break;
            }
        }
        return obj;
    }
    // FILTERS
    filter(data, field) {
        let filter;
        if (/date/.test(field)) {
            filter = { label: "Date", value: data[field].year + "-" + data[field]["end_year"] };
        }
        if (/authors/.test(field)) {
            filter = [];
            data[field].map(auth => {
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
                label: field, value: data[field].map(l => l).join(', ')
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
