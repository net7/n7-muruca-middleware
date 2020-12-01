"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineParser = void 0;
class TimelineParser {
    parse({ data }) {
        let timeline = {
            dataSet: []
        };
        data.map(item => {
            timeline.dataSet.push({
                id: item.id,
                content: item.title,
                start: item.timeline_year_start,
                end: item.timeline_year_end
                // end: FIX ME
            });
        });
        return timeline;
    }
}
exports.TimelineParser = TimelineParser;
