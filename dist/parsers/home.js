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
            if (/hero-?\w*/i.test(block)) {
                parsedData[block] = this.parseHero(data[field], block);
            }
            // compiling data for the collection block
            if (/collection-?\w*/i.test(block)) {
                parsedData[block] = this.parseCollection(data[field], block);
            }
            if (/content/i.test(block)) {
                parsedData[block] = this.parseContent(data[field], block);
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
    parseContent(data, _) {
        return data;
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
        var _c;
        const header = {
            title: data.title || '',
            subtitle: data.subtitle || ''
        };
        if ((_c = data.button) === null || _c === void 0 ? void 0 : _c.anchor) {
            header.button = {
                title: data.button.title,
                text: data.button.text,
                link: data.button.anchor
            };
        }
        return header;
    }
    parseCollectionItems(_a, _b) {
        // to be implemented on project
        return [];
    }
}
exports.HomeParser = HomeParser;
