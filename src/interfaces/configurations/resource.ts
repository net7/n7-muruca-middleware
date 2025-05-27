export interface ConfigResource {
    [key:string]: ConfBlock | ConfBlockTextViewer | ConfBlockTabs
}

export interface ConfBlock{
    title?: string
    type: "title" | "header" | "metadata" | "metadata-size" | "metadata-description" | "collection" | "bibliography" |  "text-viewer" | "image-viewer" | "map" | "breadcrumb",
    /** The field to read resource API
     * if type = header{
     * first field is title
     * second field is description
     * }
     */
    fields: string[],
    /** @default TRUE show thumbnail in collection row. */
    hasImage?: boolean
    /** @default FALSE open item in a modals. */
    openModal?: boolean
}

export interface ConfBlockTextViewer{
    type: "text-viewer" ,
    field: string,
}

export interface ConfBlockTabs{
    type: "tabs" ,
    tabs: {
        id: string,
        fields: string[]
    }[]
}
  