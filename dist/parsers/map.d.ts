import Parser, { Input } from '../interfaces/parser';
export declare class MapParser implements Parser {
    parse({ data }: Input): {
        dataSet: any[];
    };
    parseMapItem(map: any): {
        title: any;
        slug: any;
        id: any;
        text: any;
        map_center: {
            lat: any;
            lng: any;
        };
        markers: any;
        zoom: any;
    };
}
