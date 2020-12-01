/**
 * Interface for the Timeline component
 */
export interface TimelineData {
    dataSet: TimelineDataset;
}

export interface TimelineDataset {
    id: number;
    content?: string;
    start?: string;
    end?: string;
} []