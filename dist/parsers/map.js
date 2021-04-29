"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapParser = void 0;
class MapParser {
    parse({ data }) {
        let map = {
            dataSet: []
        };
        data.map(item => {
            const zoom = item.views_place_coords.zoom;
            const markers = item.views_place_coords.markers.map(coord => [coord.lat, coord.lng]);
            const center = [item.views_place_coords.center_lat, item.views_place_coords.center_lng,];
            map.dataSet.push({
                id: item.id,
                content: item.title,
                slug: item.slug,
                map_center: center,
                zoom: zoom,
                markers: markers
            });
        });
        return map;
    }
}
exports.MapParser = MapParser;
