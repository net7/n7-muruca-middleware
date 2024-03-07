export interface ConfigResource {
    [key:string]: ConfBlock
}

export interface ConfBlock{
    title?: string
    type: "title" | "metadata" | "collection" | "text-viewer" | "image-viewer" | "map" | "breadcrumb",
    fields: string[],
}
  