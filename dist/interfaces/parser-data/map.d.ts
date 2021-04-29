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
