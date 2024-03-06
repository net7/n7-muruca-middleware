export interface ConfigResource {
    [key:string]: ConfBlock
}

export interface ConfBlock{
    type: "title" | "metadata" | "collection" | "text-viewer" | "image-viewer" | "map" | "breadcrumb",
    fields: string[],
}
  