import { ConfBlock, ConfBlockTextViewer, ConfBlockTabs } from '../interfaces';
import Parser, { OutputBibliography, OutputBreadcrumbs, OutputCollection, OutputCollectionMap, OutputHeader, OutputImageViewer, OutputImageViewerIIIF, OutputMetadata, OutputMetadataItem, OutputTextViewer } from '../interfaces/parser';
export declare class ResourceParser implements Parser {
    parse({ data, options }: any, locale: any): any;
    localeParse(data: any): any;
    parseTitle(block: ConfBlock, data: any): string;
    parseHeader(block: ConfBlock, data: any): OutputHeader;
    parseBreadcrumbs(block: ConfBlock, data: any, type: string): OutputBreadcrumbs;
    parseTabs(block: ConfBlockTabs, data: any): string[];
    parseMetadata(block: ConfBlock, data: any, type: string): OutputMetadata;
    parseMetadataSize(block: ConfBlock, data: any): OutputMetadata;
    parseMetadataDescription(block: ConfBlock, data: any): OutputMetadata;
    parseImageViewer(block: ConfBlock, data: any): OutputImageViewer;
    parseImageViewerIIIF(block: ConfBlock, data: any): OutputImageViewerIIIF;
    parseTextViewer(block: ConfBlockTextViewer, data: any): OutputTextViewer;
    parseCollection(block: ConfBlock, data: any): OutputCollection;
    parseCollectionMaps(block: ConfBlock, data: any): OutputCollectionMap[];
    extractQueryParams(queryParams: string): {};
    parseBibliography(block: ConfBlock, data: any): OutputBibliography;
    filterImageViewer(imageViewer: OutputImageViewer, block: ConfBlock, data: any): OutputImageViewer;
    filterImageViewerIIIF(iiifViewer: OutputImageViewerIIIF, block: ConfBlock, data: any): OutputImageViewerIIIF;
    filterTextViewer(textViewer: OutputTextViewer, field: string, data: any): OutputTextViewer;
    filterMetadataItem(field: string, metadataItem: OutputMetadataItem, recordType: string, data: any): OutputMetadataItem;
    filterCollectionItem(collectionItem: any, item: any, field: string, data: any): any;
    filterBibliographyItem(bibliographyItem: any, rif: any, field: string, data: any): any;
}
