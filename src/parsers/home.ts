import Parser, { Input } from "../interfaces/parser";
import { HeroData, CollectionData, CollectionHeaderData, CollectionItem } from "../interfaces/parser-data/home";

export class HomeParser implements Parser {
  parse(input: Input): object {

    const { data, options } = input;
    if (options && "keyOrder" in options) {
      var { keyOrder, conf } = options;
    }

    let parsedData: any = {};

    for (const block in conf) {
      // for each configured block, "field" contains the 
      // field of the WordPress data object, where
      // the corresponding data is stored.
      const field = conf[block].field

      // compiling data for the hero blocks
      if (/hero-\w+/i.test(block)) {
        parsedData[block] = this.parseHero(data[field], block);
      }

      // compiling data for the collection block
      if (/collection-\w+/i.test(block)) {
        parsedData[block] = this.parseCollection(data[field], block);
        // collection items
        /* if (/collection-works/.test(block)) { // FIXME: Remove project-scoped code
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
        } */
      }
    }

    // if a sorting array was provided,
    // sort the final object by keys, following
    // the provided order
    if (keyOrder) {
      let ordered: any = {};
      keyOrder.map((key: string) => {
        ordered[key] = parsedData[key];
      })
      parsedData = ordered;
    }

    return parsedData;

  }

  protected parseHero(data: any, _: string): HeroData {
    const { title, text, image, button } = data;
    return {
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
  }

  protected parseCollection(data: any, block: string): CollectionData {
    return {
      header: this.parseCollectionHeader(data, block),
      items: this.parseCollectionItems(data, block)
    }
  }

  protected parseCollectionHeader(data: any, _: string): CollectionHeaderData {
    const header = {
      title: data.title || '',
      subtitle: data.subtitle || ''
    } as CollectionHeaderData;

    if (data.button?.anchor) {
      header.button = {
        title: data.button.title,
        text: data.button.text,
        link: data.button.anchor
      };
    }

    return header;
  }

  protected parseCollectionItems(data: any, _: string): CollectionItem[] {
    return data.items;
  }
}
