import Parser, { Input } from "../interfaces/parser";
import { HeroData, CollectionData } from "../interfaces/parser-data/home";

export default class HeaderParser implements Parser {
  parse(input: Input): object {

    const { keyOrder, data, conf } = input;
    let parsedData: any = {};

    for (const block in conf) {
      // for each configured block, "f" contains the 
      // field of the WordPress data object, where
      // the corresponding data is stored.
      const field = conf[block].field

      // compiling data for the hero blocks
      if (/hero-\w+/i.test(block)) {
        const { title, text, image, button } = data[field];
        let hero: HeroData = {
          title, // the title must exist.
          // add additional properties only if they exist in Wordpress data
          ...text && { text },
          ...image && { image },
          ...(button && button?.anchor !== '') && {
            button: {
              title: button.title,
              text: button.text,
              link: button.anchor
            }
          }
        };
        parsedData[block] = { ...hero }
      }

      // compiling data for the collection block
      if (/collection-\w+/i.test(block)) {
        let collection: CollectionData = {
          header: { title: '' },
          items: []
        };
        // collection header
        collection.header.title = data[field].title || null
        collection.header.subtitle = data[field].subtitle || null
        if (data[field].button?.anchor !== '') { // if there is a button
          collection.header.button = {
            title: data[field].button.title,
            text: data[field].button.text,
            link: data[field].button.anchor
          }
        }
        // collection items
        if (/collection-works/.test(block)) { // FIXME: Remove project-scoped code
          data[field].items.map((d: any) => {
            collection.items.push(
              {
                title: d.item[0].title,
                text: d.item[0].description,
                link: `/${d.item[0].type}/${d.item[0].id}/${d.item[0].slug}`
              }
            )
          })
        } else { // FIXME: Remove project-scoped code
          data[field].items.map((d: any) => {
            collection.items.push(
              {
                title: Object.keys(d.item).map(m => d.item[m].name).join(),
                text: d.text,
                image: d.image,
                link: `/maps?continents=${Object.keys(d.item).map(m => d.item[m].key).join()}`
              }
            )
          })
        }
        parsedData[block] = { ...collection }
      }
    }

    // if a sorting array was provided,
    // sort the final object by keys, following
    // the provided order
    if (keyOrder) {
      let ordered: any = {};
      keyOrder.map(key => {
        ordered[key] = parsedData[key];
      })
      parsedData = ordered;
    }

    return parsedData;

  }
}
