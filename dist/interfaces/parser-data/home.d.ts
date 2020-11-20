/**
 * Interface for the Hero component
 */
export interface HeroData {
    title: string;
    text?: string;
    input?: {
        placeholder: string;
        icon: string;
        payload: any;
    };
    button?: {
        title?: string;
        text: string;
        link?: any;
        anchor?: string;
    };
    image?: string;
    backgroundImage?: string;
    classes?: string;
    payload?: any;
}
/**
 * Interface for a collection of
 * Item-Preview components
 */
export interface CollectionData {
    /** InnerTitle data */
    header: CollectionHeaderData;
    /** ItemPreview data */
    items: CollectionItem[];
}
/**
 * Interface for a collection of
 * Item-Preview components
 */
export interface SliderData {
    /** InnerTitle data */
    /** ItemPreview data */
    slides: SliderItem[];
}
export interface CollectionHeaderData {
    title: string;
    subtitle?: string;
    button?: {
        title?: string;
        text: string;
        link?: string;
    };
}
export interface CollectionItem {
    title: string;
    text: string;
    image?: any;
    link: string;
}
export interface SliderItem {
    title: string;
    text: string;
    image?: any;
}
