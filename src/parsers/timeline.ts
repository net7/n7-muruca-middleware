import Parser, { Input } from "../interfaces/parser";

export class TimelineParser implements Parser {
    parse({ data }: Input) {
      let timeline = {
        dataSet: []
      };
      data.map(item => {
        const dateStart = item.hasOwnProperty('timeline_year_start') ? item.timeline_year_start : item.timeline_date_start;
        const dateEnd = item.hasOwnProperty('timeline_year_end') ? item.timeline_year_end : item.timeline_date_end;



        timeline.dataSet.push(
          {
          id: item.id,
          content: item.title,
          start: this.formatDateUtcStandard(dateStart),
          end: this.formatDateUtcStandard(dateEnd)
          // end: FIX ME
        })
      })
      return timeline;
    }

    /* format date in YYYY-MM-DDThh:mm:ss */
    formatDateUtcStandard(date: string) {
      if( date && date != "" ){       
        var dateArray = date.split("-");       
        let d =  new Date(+dateArray[2], +dateArray[1] - 1, +dateArray[0]),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) 
          month = '0' + month;
      if (day.length < 2) 
          day = '0' + day;

      return [year, month, day].join('-') + "T00:00:00";
      }



    }
  }