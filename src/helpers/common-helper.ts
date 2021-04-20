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
    }      
}