"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeParser = void 0;
class HomeParser {
    parse(input) {
        const { data, options } = input;
        if (options && "keyOrder" in options) {
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
                parsedData[block] = this.parseHero(data[field], block);
            }
            // compiling data for the collection block
            if (/collection-\w+/i.test(block)) {
                parsedData[block] = this.parseCollection(data[field], block);
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
    parseHero(data, _) {
        const { title, text, image, button } = data;
        return Object.assign(Object.assign(Object.assign({ title }, text && { text }), image && { image }), (button && (button === null || button === void 0 ? void 0 : button.anchor) !== '') && {
            button: {
                title: button.title,
                text: button.text,
                link: button.anchor
            }
        });
    }
    parseCollection(data, block) {
        return {
            header: this.parseCollectionHeader(data, block),
            items: this.parseCollectionItems(data, block)
        };
    }
    parseCollectionHeader(data, _) {
        var _a;
        const header = {
            title: data.title || '',
            subtitle: data.subtitle || ''
        };
        if ((_a = data.button) === null || _a === void 0 ? void 0 : _a.anchor) {
            header.button = {
                title: data.button.title,
                text: data.button.text,
                link: data.button.anchor
            };
        }
        return header;
    }
    parseCollectionItems(data, _) {
        return data.items;
    }
}
exports.HomeParser = HomeParser;
