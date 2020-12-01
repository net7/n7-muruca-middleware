import Parser, { Input } from "../interfaces/parser";

export class TimelineParser implements Parser {
    parse({ data }: Input) {
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
        })
      })
      return timeline;
    }
  }