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
    },
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },
    stripTags(string) {
        return string.replace(/(&lt;([^>]+)>)/gi, "");
    },
    stripBrokeTags(string) {
        return string.replace(/<[^>]+(?!>)$/gi, "").replace(/^(?!<)[^>]+?>([^<>]+?)<\/[^>]+?>/gi, "$1");
    },
    getSnippetAroundTag(node_name, node_attr, snippet, text) {
        const tag_regex = '<' + node_name + '[^>]*?' + this.escapeRegExp(node_attr) + '=["\']' + this.escapeRegExp(snippet) + '["\'][^>]*?>[^<>]+?<\/' + node_name + '>';
        const regex_str = '(?:(?:\\s?[^\\s\n\r\t]+\\s+){0,30})' + tag_regex + '(?:(?:\\s*[^\\s\n\r\t]+\\s){0,30})';
        const regex = new RegExp(regex_str, 'g');
        const matches = text.match(regex);
        const snippets = [];
        if (matches) {
            matches.forEach(element => {
                const regex = new RegExp('(<' + node_name + '.*?' + this.escapeRegExp(node_attr) + '=["\']' + this.escapeRegExp(snippet) + '["\'].*?>)(.+?)(<\/' + node_name + '>)', 'g');
                element = element.replace(regex, "$1<em class='mrc__text-emph'>$2</em>$3");
                snippets.push(this.stripBrokeTags(element));
            });
        }
        else {
            snippets.push(snippet);
        }
        return snippets;
    }
};
