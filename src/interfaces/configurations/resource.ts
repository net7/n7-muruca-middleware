export interface ConfigResource {
    [key:string]: ConfBlock
}

export interface ConfBlock{
    title?: string
    type: "title" | "header" | "metadata" | "metadata-size" | "metadata-description" | "collection" | "text-viewer" | "image-viewer" | "map" | "breadcrumb",
    fields: string[],
}
  