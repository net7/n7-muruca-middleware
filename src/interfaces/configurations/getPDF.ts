export interface PDFContent {
    content: any[];
    styles: { [key: string]: any };
    defaultStyle: { [key: string]: any };
    labelWidth?: string | number;
    nestedLabelWidth?: string | number;
    noSectionSeparator?: boolean;
    showTabTitles?: boolean;
    tabs?: { label: string; sections: string[] }[];
}
