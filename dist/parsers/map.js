"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapParser = void 0;
class MapParser {
    parse({ data }) {
        let map = {
            dataSet: []
        };
        data.map(item => {
            map.dataSet.push(this.parseMapItem(item));
        });
        return map;
    }
    parseMapItem(map) {
        var _a, _b, _c, _d;
        return {
            title: map.title,
            slug: map.slug,
            id: map.id,
            text: map.content,
            map_center: { lat: (_a = map.coords) === null || _a === void 0 ? void 0 : _a.center_lat, lng: (_b = map.coords) === null || _b === void 0 ? void 0 : _b.center_lng },
            markers: (_c = map.coords) === null || _c === void 0 ? void 0 : _c.markers,
            zoom: (_d = map.coords) === null || _d === void 0 ? void 0 : _d.zoom
        };
    }
}
exports.MapParser = MapParser;
