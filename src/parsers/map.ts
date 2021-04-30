import Parser, { Input } from "../interfaces/parser";

export class MapParser implements Parser {
    parse({ data }: Input) {
      let map = {
        dataSet: []
      };
      data.map(item => {
        map.dataSet.push(this.parseMapItem(item));
      })
      return map;
    }

    parseMapItem( map : any ) {
      return {
        title: map.title,
        slug: map.slug,
        text: map.text,
        map_center: {lat: map.coords?.center_lat, lng: map.coords?.center_lng},
        markers: map.coords?.markers,
        zoom: map.coords?.zoom
      }
    }
  }