"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMetadataObject = exports.parseMetadataTaxonomy = exports.parseMetadataRecord = exports.parseMetadataValue = void 0;
const parseMetadataValue = (data, field) => {
    if (data[field]) {
        let value = data[field];
        if ((typeof data[field] === 'object') && ('value' in data[field]) && ('label' in data[field])) {
            value = (0, exports.parseMetadataObject)(data, field);
        }
        else if (typeof data[field] === ('string' || 'number')) {
            value = data[field];
        }
        else if (Array.isArray(data[field])) {
            if (data[field][0]['record-type']) {
                value = (0, exports.parseMetadataRecord)(data, field);
            }
            else if (data[field][0]['taxonomy']) {
                value = (0, exports.parseMetadataTaxonomy)(data, field);
            }
        }
        return value;
    }
};
exports.parseMetadataValue = parseMetadataValue;
const parseMetadataRecord = (data, field) => {
    let value;
    if (data[field]) {
        value = Object.keys(data[field])
            .map((n) => data[field][n].title)
            .join(", ");
    }
    return value;
};
exports.parseMetadataRecord = parseMetadataRecord;
const parseMetadataTaxonomy = (data, field) => {
    let value;
    if (data[field]) {
        value = Object.keys(data[field])
            .map((n) => data[field][n].name)
            .join(", ");
    }
    return value;
};
exports.parseMetadataTaxonomy = parseMetadataTaxonomy;
const parseMetadataObject = (data, field) => {
    let value;
    if (data[field]) {
        value = data[field].label;
    }
    return value;
};
exports.parseMetadataObject = parseMetadataObject;
