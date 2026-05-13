export interface PDFContent {
    content: any[];
    styles: { [key: string]: any };
    defaultStyle: { [key: string]: any };
    labelWidth?: string | number;
    nestedLabelWidth?: string | number;
    noSectionSeparator?: boolean;
    flattenNested?: boolean;
    showTabTitles?: boolean;
    tabs?: { label: string | { [locale: string]: string }; sections: string[] }[];
}
