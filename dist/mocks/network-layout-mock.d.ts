export declare const NETWORK_MOCK: {
    containerID: string;
    nodes: ({
        id: number;
        label: string;
        group: string;
        payload: string;
    } | {
        id: number;
        label: string;
        group: string;
        payload: {
            link: {
                routeId: string;
                id: number;
                slug: string;
            };
        };
    } | {
        id: number;
        label: string;
        group: string;
        payload?: undefined;
    })[];
    edges: {
        id: number;
        from: number;
        to: number;
        label: string;
    }[];
    libOptions: {
        nodes: {
            shape: string;
            size: number;
            font: {
                size: number;
                color: string;
            };
        };
        edges: {
            arrows: {
                to: {
                    enabled: boolean;
                    scaleFactor: number;
                };
            };
            width: number;
            font: {
                size: number;
                align: string;
                color: string;
            };
            color: {
                color: string;
                highlight: string;
            };
        };
        groups: {
            Fulmine: {
                color: string;
                shape: string;
                icon: {
                    face: string;
                    code: string;
                    size: number;
                    color: string;
                };
            };
            'Altro (Claudio)': {
                color: string;
                shape: string;
                icon: {
                    face: string;
                    code: string;
                    size: number;
                    color: string;
                };
            };
            Cognizione: {
                color: string;
                shape: string;
                icon: {
                    face: string;
                    code: string;
                    size: number;
                    color: string;
                };
            };
        };
        physics: {
            stabilization: boolean;
            barnesHut: {
                gravitationalConstant: number;
                springLength: number;
                springConstant: number;
            };
        };
        interaction: {
            hover: boolean;
            tooltipDelay: number;
            zoomView: boolean;
            dragView: boolean;
        };
        layout: {
            improvedLayout: boolean;
        };
    };
};
