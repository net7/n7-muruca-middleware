export declare const CommonHelper: {
    buildLink(linkToParse: any, data: any): any;
    escapeRegExp(string: any): any;
    stripTags(string: any): any;
    stripBrokeTags(string: any): any;
    getSnippetAroundTag(node_attr: any, snippet: any, text: any): any[];
    HighlightTagInXml(node_name: any, node_attr: any, snippet: any, text: any): any;
    makeXmlTextSnippet(xml: any, size?: number, ellipsis?: string): any;
    sanitizeHtml(input: string): string;
};
