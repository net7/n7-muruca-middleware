import Parser, { Input } from "../interfaces/parser";

export class TimelineParser implements Parser {
    parse({ data }: Input) {
      let timeline = {
        dataSet: []
      };
      data.map(item => {
          const dateStart = item.hasOwnProperty('timeline_year_start') ? item.timeline_year_start : item.timeline_date_start;
          const dateEnd = item.hasOwnProperty('timeline_year_end') ? item.timeline_year_end : item.timeline_date_end;

          let missingDate;

          if (!dateStart && !dateEnd) {
            console.log(`Missing date in item ${item.id}. Date set to Jan 1st 3000.`)
            missingDate = '01-01-3000';
          }

        timeline.dataSet.push(
          {
          id: item.id,
          content: item.title,
          start: this.formatDateUtcStandard(dateStart ? dateStart : missingDate),
          end: this.formatDateUtcStandard(dateEnd ? dateEnd : missingDate)
          // end: FIX ME
        })
      })
      return timeline;
    }

    /* format date in YYYY-MM-DDThh:mm:ss */
    formatDateUtcStandard(date: string) {
      if( date && date != "" ){
        var dateArray = date.split("-");       
        let aC = "";
        if(dateArray.length > 3 ){
            dateArray.shift();
            aC = "-00";
        }
        let d =  new Date(+dateArray[2], +dateArray[1] - 1, +dateArray[0]),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate();
        d.setFullYear(+ dateArray[2]);
        let year = '' + d.getFullYear();
        while (year.toString().length < 4 ){
          year = "0" + year                  
        }
      if (month.length < 2) 
          month = '0' + month;
      if (day.length < 2) 
          day = '0' + day;

      return [aC + year, month, day].join('-') + "T00:00:00";
      }



    }
  }