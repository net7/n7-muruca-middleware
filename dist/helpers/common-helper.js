"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonHelper = void 0;
exports.CommonHelper = {
    buildLink(linkToParse, data) {
        const regExpUrl = /{(.*?)}/g;
        const matchUrl = linkToParse.match(regExpUrl);
        let url = linkToParse;
        matchUrl.forEach((slug, i) => {
            const key = slug.replace(/[{}]/g, "");
            if (data[key]) {
                url = url.replace(slug, data[key]);
            }
        });
        return url;
    }
};
