"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetToBase64 = assetToBase64;
const fs = require("fs");
const path = require("path");
function assetToBase64(filePath) {
    const ext = path.extname(filePath).slice(1).toLowerCase();
    const mime = ext === 'svg' ? 'image/svg+xml' : `image/${ext}`;
    return `data:${mime};base64,${fs.readFileSync(filePath).toString('base64')}`;
}
