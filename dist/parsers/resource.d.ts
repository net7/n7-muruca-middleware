import { ConfBlock, ConfBlockTextViewer } from '../interfaces';
import Parser, { OutputBibliography, OutputBreadcrumbs, OutputCollection, OutputCollectionMap, OutputHeader, OutputImageViewer, OutputMetadata, OutputMetadataItem, OutputTextViewer } from '../interfaces/parser';
export declare class ResourceParser implements Parser {
    parse({ data, options }: any, locale: any): any;
    localeParse(data: any): any;
    /**
     * Data filters
     */
    filter(data: any, field: string, page: any): any;
    filterMetadata(field: string, metadataItem: OutputMetadataItem, recordType: string): OutputMetadataItem;
    /**
     * Parsers
     */
    parseTitle(block: ConfBlock, data: any): string;
    parseMetadata(block: ConfBlock, data: any, type: string): OutputMetadata;
    parseMetadataSize(block: ConfBlock, data: any): OutputMetadata;
    parseMetadataDescription(block: ConfBlock, data: any): OutputMetadata;
    parseHeader(block: ConfBlock, data: any): OutputHeader;
    parseImageViewer(block: ConfBlock, data: any): OutputImageViewer;
    parseBreadcrumbs(block: ConfBlock, data: any, type: string): OutputBreadcrumbs;
    parseCollection(block: ConfBlock, data: any): OutputCollection;
    parseBibliography(block: ConfBlock, data: any): OutputBibliography;
    parseTextViewer(block: ConfBlockTextViewer, data: any): OutputTextViewer;
    parseCollectionMaps(block: ConfBlock, data: any): OutputCollectionMap[];
}
