export declare class TeipublisherService {
    private body;
    private teiPublisherUri;
    constructor(teiPublisherUri: any);
    getXmlDocument: (xml: string) => void;
    getNodePath: (doc: string, path: string) => Promise<string>;
}
