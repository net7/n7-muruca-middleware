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
        const tag_regex = '<[^>]+?' + this.escapeRegExp(node_attr) + '=["\']' + this.escapeRegExp(snippet) + '["\'][^>]*?>[^<>]+?<\/[^>]+?>';
        const regex_str = '(?:(?:\\s?[^\\s\n\r\t]+\\s+){0,30})' + tag_regex + '(?:(?:\\s*[^\\s\n\r\t]+\\s){0,30})';
        const regex = new RegExp(regex_str, 'g');                                
        const matches = text.match(regex);
        const snippets = [];
        if(matches){
            matches.forEach(element => {
                const regex = new RegExp('(<[^>]+?' + this.escapeRegExp(node_attr) + '=["\']' + this.escapeRegExp(snippet) + '["\'].*?>)(.+?)(<\/[^>]+?>)', 'g');
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
    
    makeXmlTextSnippet(xml, size = 100) {
      let text = this.stripTags(xml);
      const regex_str = '^(.{' + size + '}[^\\s]*).*';
      const regex = new RegExp(regex_str, 'g');            
      return text.replace(regex, "$1");     
    },
    
    sanitizeHtml(input: string): string {
      const parser = new DOMParser();
      // Tenta di parsare il contenuto HTML come documento
      const doc = parser.parseFromString(input, 'text/html');
      
      // Restituisce solo il contenuto "sanificato", privo di HTML non valido
      return doc.body.innerHTML;
    }
}