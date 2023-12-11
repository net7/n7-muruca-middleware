/**
 * Interface for the Timeline component
 */
export interface MapData {
  dataSet: MapDataset;
}

export interface MapDataset {
  coords: [number, number];
  template?: string;
  title?: string;
}
[];

interface Coords {
  lat: number;
  lng: number;
}

interface Marker extends Coords {
  label: string;
  default_label: string;
}

interface MapItem {
  title: string;
  slug: string;
  zoom: number;
  map_center: Coords;
  markers: Marker[];
}
[];
