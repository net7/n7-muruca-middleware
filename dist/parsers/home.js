export class HomeParser {
    parse(input) {
        var _a;
        const { data, options } = input;
        if (options) {
            var { keyOrder, conf } = options;
        }
        let parsedData = {};
        for (const block in conf) {
            // for each configured block, "field" contains the 
            // field of the WordPress data object, where
            // the corresponding data is stored.
            const field = conf[block].field;
            // compiling data for the hero blocks
            if (/hero-\w+/i.test(block)) {
                const { title, text, image, button } = data[field];
                let hero = Object.assign(Object.assign(Object.assign({ title }, text && { text }), image && { image }), (button && (button === null || button === void 0 ? void 0 : button.anchor) !== '') && {
                    button: {
                        title: button.title,
                        text: button.text,
                        link: button.anchor
                    }
                });
                parsedData[block] = Object.assign({}, hero);
            }
            // compiling data for the collection block
            if (/collection-\w+/i.test(block)) {
                let collection = {
                    header: { title: '' },
                    items: []
                };
                // collection header
                collection.header.title = data[field].title || null;
                collection.header.subtitle = data[field].subtitle || null;
                if (((_a = data[field].button) === null || _a === void 0 ? void 0 : _a.anchor) !== '') { // if there is a button
                    collection.header.button = {
                        title: data[field].button.title,
                        text: data[field].button.text,
                        link: data[field].button.anchor
                    };
                }
                // collection items
                if (/collection-works/.test(block)) { // FIXME: Remove project-scoped code
                    data[field].items.map((d) => {
                        collection.items.push({
                            title: d.item[0].title,
                            text: d.item[0].description,
                            link: `/${d.item[0].type}/${d.item[0].id}/${d.item[0].slug}`
                        });
                    });
                }
                else { // FIXME: Remove project-scoped code
                    data[field].items.map((d) => {
                        collection.items.push({
                            title: Object.keys(d.item).map(m => d.item[m].name).join(),
                            text: d.text,
                            image: d.image,
                            link: `/maps?continents=${Object.keys(d.item).map(m => d.item[m].key).join()}`
                        });
                    });
                }
                parsedData[block] = Object.assign({}, collection);
            }
        }
        // if a sorting array was provided,
        // sort the final object by keys, following
        // the provided order
        if (keyOrder) {
            let ordered = {};
            keyOrder.map((key) => {
                ordered[key] = parsedData[key];
            });
            parsedData = ordered;
        }
        return parsedData;
    }
}
