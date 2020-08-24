var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var ResourceParser = /** @class */ (function () {
    function ResourceParser() {
    }
    ResourceParser.prototype.parse = function (_a) {
        var _this = this;
        var data = _a.data, options = _a.options;
        if (options && "page" in options) {
            var conf = options.conf, page = options.page;
        }
        var parsed = {
            title: '',
            sections: {}
        };
        var _loop_1 = function (block) {
            switch (block) {
                case 'title':
                    conf[block].fields.map(function (field) {
                        parsed.title = data[field];
                    });
                    break;
                case 'header':
                    parsed.sections[block] = {};
                    var t = conf[block].fields;
                    parsed.sections[block][t[0]] = data[t[0]]; // title
                    parsed.sections[block][t[1]] = data[t[1]]; // description
                    break;
                case 'image-viewer':
                    parsed.sections[block] = {};
                    var v = { images: [], thumbs: [] };
                    var gallery = conf[block].fields[0]; // "gallery"
                    v.images = data[gallery].map(function (g) { return ({ type: 'image', url: g.image, description: g.description }); });
                    v.thumbs = v.images;
                    parsed.sections[block] = v;
                    break;
                case 'metadata':
                    parsed.sections[block] = {};
                    var m = {
                        group: [{
                                title: 'Metadata',
                                items: conf[block].fields
                                    .map(function (field) {
                                    if (data[field]) {
                                        var filter = [
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
                                            return (_this.filter(data, field)); // metadata
                                        }
                                        else {
                                            return { label: field.replace(/_/g, " "), value: data[field] };
                                        }
                                    }
                                }).flat()
                            }]
                    };
                    m.group[0].items = m.group[0].items.filter(function (n) { return n; });
                    parsed.sections[block] = __assign({}, m);
                    break;
                case "collection-keywords":
                    parsed.sections[block] = {};
                    var keywords_1 = {
                        header: { title: "Kewords collegate" },
                        items: []
                    };
                    conf[block].fields.forEach(function (field) {
                        if (data[field]) {
                            keywords_1.items = data[field].map(function (f) { return ({
                                title: f.title,
                                link: "/" + page + "/" + f.id + "/" + f.slug,
                                type: field
                            }); });
                        }
                    });
                    parsed.sections[block] = keywords_1; // keywords
                    break;
                case "collection-toponyms":
                    parsed.sections[block] = {};
                    var toponyms_1 = {
                        header: { title: "Toponimi collegati" },
                        items: []
                    };
                    conf[block].fields.map(function (field) {
                        if (data[field]) {
                            toponyms_1.items = data[field].map(function (f) { return ({
                                title: f.title,
                                link: "/" + page + "/" + f.id + "/" + f.slug,
                                type: field
                            }); });
                        }
                    });
                    parsed.sections[block] = toponyms_1; //toponyms
                    break;
                case "metadata-size":
                    parsed.sections[block] = {};
                    var m_2 = {
                        group: [{
                                title: 'Dimensioni',
                                items: conf[block].fields // dimension
                                    .map(function (field) { return Object.keys(data[field])
                                    .map(function (f) { return ({
                                    label: f,
                                    value: f === "image" ? "<img src='" + data[field][f] + "'>" : data[field][f]
                                }); }); }).flat()
                            }]
                    };
                    parsed.sections[block] = __assign({}, m_2);
                    break;
                case "metadata-description":
                    parsed.sections[block] = {};
                    var m_3 = {
                        group: [{
                                title: 'Descrizione',
                                items: conf[block].fields // description
                                    .map(function (field) {
                                    return ({ label: field, value: data[field] });
                                })
                            }]
                    };
                    parsed.sections[block] = __assign({}, m_3);
                    break;
                case "collection-works":
                    parsed.sections[block] = {};
                    var c_2_1 = {
                        header: {
                            title: 'Bibliografia',
                        },
                        items: []
                    };
                    conf[block].fields.forEach(function (field, i) {
                        if (data[field]) {
                            c_2_1.items.push({
                                image: data[field][i].gallery[0].image,
                                title: data[field][i].title,
                                text: data[field][i].description,
                                link: "/" + page + "/" + data[field][i].slug,
                                metadata: [{
                                        items: [
                                            { label: 'Autore/i', value: Object.keys(data[field][i].authors).map(function (auth) { return (data[field][i].authors[auth]['name']); }).join(', ') },
                                            { label: 'Lingua', value: data[field][i].language },
                                            { label: 'Entry ID', value: data[field][i].id },
                                            { label: 'Livello bibliografico', value: data[field][i].bibliographic_level },
                                            { label: 'Anno', value: data[field][i].year },
                                        ]
                                    }]
                            });
                            parsed.sections[block] = __assign({}, c_2_1);
                        }
                    });
                    break;
                case "preview-parent":
                    parsed.sections[block] = {};
                    conf[block].fields.map(function (field) {
                        if (data[field]) {
                            var previewItem = data[field].map(function (f) { return ({
                                title: f.title,
                                description: f.description,
                                image: f.image,
                                link: "/" + page + "/" + f.id + "/" + f.slug,
                                classes: 'is-fullwidth'
                            }); });
                            parsed.sections[block] = __assign({}, previewItem);
                        }
                    });
                    break;
                default:
                    break;
            }
        };
        for (var block in conf) {
            _loop_1(block);
        }
        return parsed;
    };
    /**
     * Data filters
     */
    ResourceParser.prototype.filter = function (data, field) {
        var filter;
        if (/date/.test(field)) {
            filter = { label: "Date", value: data[field].year + "-" + data[field]["end_year"] };
        }
        if (/authors/.test(field)) {
            filter = [];
            data[field].map(function (auth) {
                filter.push({
                    label: auth.role,
                    value: Object.keys(auth.author)
                        .map(function (a) { return auth.author[a].name; })
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
                value: data[field].map(function (l) { return l; }).join(', ')
            };
        }
        if (/graphic_variant|morphological_variant|modern_language_equivalence|synonyms/.test(field)) {
            filter = {
                label: field.replace(/_/g, " "),
                value: Object.keys(data[field]).map(function (auth) { return (data[field][auth]["text"]
                    ? data[field][auth]["text"]
                    : data[field][auth]["equivalence"]
                        ? data[field][auth]["equivalence"]
                        : data[field][auth]["synonym"]); }).join(', ')
            };
        }
        if (/primary_sources|external_links/.test(field)) {
            filter = {
                label: field.replace(/_/g, " "),
                value: Object.keys(data[field]).map(function (auth) { return (data[field][auth]["link"]); }).join(', ')
            };
        }
        return filter;
    };
    return ResourceParser;
}());
export { ResourceParser };
