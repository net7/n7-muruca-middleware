export type PDFBannerText = string | {
    [locale: string]: string;
};
export interface PDFBanner {
    position: 'top' | 'bottom' | 'both';
    pages?: 'first' | 'all';
    align?: 'left' | 'center' | 'right';
    logoPosition?: 'left' | 'top';
    separator?: boolean;
    bannerHeight?: number;
    footerBannerHeight?: number;
    logo?: string;
    logoWidth?: number;
    logoMarginTop?: number;
    textWidth?: number;
    title?: PDFBannerText;
    text?: PDFBannerText;
}
export interface PDFContent {
    content: any[];
    styles: {
        [key: string]: any;
    };
    defaultStyle: {
        [key: string]: any;
    };
    labelWidth?: string | number;
    nestedLabelWidth?: string | number;
    noSectionSeparator?: boolean;
    flattenNested?: boolean;
    showTabTitles?: boolean;
    tabs?: {
        label: string | {
            [locale: string]: string;
        };
        sections: string[];
    }[];
    pageBanner?: PDFBanner;
}
