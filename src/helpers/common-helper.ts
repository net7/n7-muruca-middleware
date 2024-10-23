import {DOMParser} from 'linkedom';

export const CommonHelper = {
    buildLink (linkToParse, data){
        const regExpUrl = /{(.*?)}/g;
        const matchUrl = linkToParse.match(regExpUrl);
        let url = linkToParse;
    
        matchUrl.forEach((slug, i) => {
            const key = slug.replace(/[{}]/g, "");
            if (data[key]) {
                url = url.replace( slug, data[key] );            
            }
            
        });
        return url;
    }, 
        
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
    },
        
    stripTags(string) {
        return string.replace(/(<([^>]+)>)/gi, "");
    },
    
    stripBrokeTags(string) {
        return string.replace(/<[^>]+(?!>)$/gi, "").replace(/^(?!<)[^>]+?>([^<>]+?)<\/[^>]+?>/gi,"$1");
        
    },    
    getSnippetAroundTag(node_attr, snippet, text){
        const tag_regex = '<[^>]+?' + this.escapeRegExp(node_attr) + '=["\'][^>]*?' + this.escapeRegExp(snippet) + '[^>]*?["\'][^>]*?>[^<>]+?<\/[^>]+?>';
        const regex_str = '(?:(?:\\s?[^\\s\\n\\r\\t]+\\s+){0,30})' + tag_regex + '(?:(?:\\s*[^\\s\\n\\r\\t]+\\s){0,30})';
        const regex = new RegExp(regex_str, 'g');                                
        const matches = text.match(regex);
        const snippets = [];
        if(matches){
            matches.forEach(element => {
                const regex = new RegExp('(<[^>]+?' + this.escapeRegExp(node_attr) + '=["\'][^>]*?' + this.escapeRegExp(snippet) + '[^>]*?["\'].*?>)(.+?)(<\/[^>]+?>)', 'g');
                element= element.replace(regex, "$1<em class='mrc__text-emph'>$2</em>$3");
                snippets.push(this.stripBrokeTags(element));
            });
        } else {
            snippets.push(snippet);
        }
        return snippets;
    },
    HighlightTagInXml(node_name, node_attr, snippet, text){
        const regex_str = '(<' + node_name + '[^>]*?' + this.escapeRegExp(node_attr) + '=["\']' + this.escapeRegExp(snippet) + '["\'][^>]*?>[^<>]+?<\/' + node_name + '>)';
        const regex = new RegExp(regex_str, 'g');            
        const text_hl  = text.replace(regex,"<em class='mrc__text-emph'>$1</em>" );        
        return text_hl ;
    },
    
    makeXmlTextSnippet(xml, size = 100, ellipsis = "") {
      let text = this.stripTags(xml);
      const regex_str = '^(.{' + size + '}[^\\s]*).*';
      const regex = new RegExp(regex_str, 'g');   
      let snippet = text.replace(regex, "$1");  
      if(ellipsis !== "" && snippet.length < text.length ){
        snippet += " " + ellipsis;
      }     
      return snippet
    },
    
    sanitizeHtml(input: string): string {
        if (!input.trim()) {
            return "<p>Contenuto vuoto.</p>";
        }

        const openTags: string[] = [];
        
        // Funzione per correggere i tag non chiusi
        const fixUnclosedTags = (html: string) => {
            return html.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (tag, tagName) => {
                tagName = tagName.toLowerCase();
                if (tag.charAt(1) !== '/') {  // Tag di apertura
                    openTags.push(tagName);
                    return tag;
                } else {  // Tag di chiusura
                    if (openTags.length > 0 && openTags[openTags.length - 1] === tagName) {
                        openTags.pop();
                        return tag;
                    }
                    // Se il tag di chiusura non corrisponde all'ultimo tag aperto, lo ignoriamo
                    return '';
                }
            });
        };

        // Applica la correzione dei tag
        let sanitized = fixUnclosedTags(input);
        
        // Chiudi eventuali tag rimasti aperti
        while (openTags.length > 0) {
            sanitized += `</${openTags.pop()}>`;
        }

        return sanitized || "";
    }
}
