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
    header: {
        title: string;
        subtitle: string;
        button?: {
            title?: string;
            text: string;
            link?: string;
        };
    };
    /** ItemPreview data */
    items: {
        title: string;
        text: string;
        image?: any;
        link: string;
    }[];
}
