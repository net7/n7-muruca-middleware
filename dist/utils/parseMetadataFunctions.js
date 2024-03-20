"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMetadataSubject = exports.parseMetadataCreator = void 0;
const parseMetadataCreator = (data, field) => {
    let filter = {
        label: null,
        value: null
    };
    if (data[field]) {
        filter = {
            label: field,
            value: Object.keys(data[field])
                .map((n) => data[field][n].title)
                .join(", "),
        };
    }
    return filter;
};
exports.parseMetadataCreator = parseMetadataCreator;
const parseMetadataSubject = (data, field) => {
    let filter = {
        label: null,
        value: null
    };
    if (data[field]) {
        filter = {
            label: field,
            value: Object.keys(data[field])
                .map((n) => data[field][n].name)
                .join(", "),
        };
    }
    return filter;
};
exports.parseMetadataSubject = parseMetadataSubject;
