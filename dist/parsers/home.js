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
var HomeParser = /** @class */ (function () {
    function HomeParser() {
    }
    HomeParser.prototype.parse = function (input) {
        var _a;
        var data = input.data, options = input.options;
        if (options && "keyOrder" in options) {
            var keyOrder = options.keyOrder, conf = options.conf;
        }
        var parsedData = {};
        var _loop_1 = function (block) {
            // for each configured block, "field" contains the 
            // field of the WordPress data object, where
            // the corresponding data is stored.
            var field = conf[block].field;
            // compiling data for the hero blocks
            if (/hero-\w+/i.test(block)) {
                var _a = data[field], title = _a.title, text = _a.text, image = _a.image, button = _a.button;
                var hero = __assign(__assign(__assign({ title: title }, text && { text: text }), image && { image: image }), (button && (button === null || button === void 0 ? void 0 : button.anchor) !== '') && {
                    button: {
                        title: button.title,
                        text: button.text,
                        link: button.anchor
                    }
                });
                parsedData[block] = __assign({}, hero);
            }
            // compiling data for the collection block
            if (/collection-\w+/i.test(block)) {
                var collection_1 = {
                    header: { title: '' },
                    items: []
                };
                // collection header
                collection_1.header.title = data[field].title || null;
                collection_1.header.subtitle = data[field].subtitle || null;
                if (((_a = data[field].button) === null || _a === void 0 ? void 0 : _a.anchor) !== '') { // if there is a button
                    collection_1.header.button = {
                        title: data[field].button.title,
                        text: data[field].button.text,
                        link: data[field].button.anchor
                    };
                }
                // collection items
                if (/collection-works/.test(block)) { // FIXME: Remove project-scoped code
                    data[field].items.map(function (d) {
                        collection_1.items.push({
                            title: d.item[0].title,
                            text: d.item[0].description,
                            link: "/" + d.item[0].type + "/" + d.item[0].id + "/" + d.item[0].slug
                        });
                    });
                }
                else { // FIXME: Remove project-scoped code
                    data[field].items.map(function (d) {
                        collection_1.items.push({
                            title: Object.keys(d.item).map(function (m) { return d.item[m].name; }).join(),
                            text: d.text,
                            image: d.image,
                            link: "/maps?continents=" + Object.keys(d.item).map(function (m) { return d.item[m].key; }).join()
                        });
                    });
                }
                parsedData[block] = __assign({}, collection_1);
            }
        };
        for (var block in conf) {
            _loop_1(block);
        }
        // if a sorting array was provided,
        // sort the final object by keys, following
        // the provided order
        if (keyOrder) {
            var ordered_1 = {};
            keyOrder.map(function (key) {
                ordered_1[key] = parsedData[key];
            });
            parsedData = ordered_1;
        }
        return parsedData;
    };
    return HomeParser;
}());
export { HomeParser };
