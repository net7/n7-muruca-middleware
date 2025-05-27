import { ConfBlock, ConfBlockTextViewer, ConfBlockTabs } from '../interfaces';
import Parser, { OutputBibliography, OutputBreadcrumbs, OutputCollection, OutputCollectionMap, OutputHeader, OutputImageViewer, OutputImageViewerItem, OutputMetadata, OutputMetadataItem, OutputTextViewer, ParsedData } from '../interfaces/parser';
import { parseMetadataValue } from '../utils/parseMetadataFunctions';

export class ResourceParser implements Parser {
    parse({ data, options }: any, locale) {
      if (!("type" in options)) {
        return;
      }
  
      const { conf, type } = options;
  
      const parsed: any = {
        title: "",
        sections: {},
      };

      if(data?.error){
        return parsed;
      }

      for (const block in conf) {
        switch (conf[block].type) {
          case "title":
            parsed.title = this.parseTitle(conf[block], data);
            break;
  
          case "header":
            parsed.sections[block] = this.parseHeader(conf[block], data);
            break;

          case "breadcrumb":
            parsed.sections[block] = this.parseBreadcrumbs(conf[block], data, type);
            break;
            
          case "tabs":
            parsed.sections[block] = this.parseTabs(conf[block], data)
            break;
            
          case "metadata":
            parsed.sections[block] = this.parseMetadata(conf[block], data, type);
            break;

          case "metadata-size":
            parsed.sections[block] = this.parseMetadataSize(conf[block], data);
            break;

          case "metadata-description":
            parsed.sections[block] = this.parseMetadataDescription(conf[block], data);
            break;
          
          case "image-viewer":
            parsed.sections[block] = this.parseImageViewer(conf[block], data);
            break;

          case "text-viewer":
            parsed.sections[block] = this.parseTextViewer(conf[block], data)
            break;

          case "collection":
            parsed.sections[block] = this.parseCollection(conf[block], data);
            break;

          case "collection-places": 
            parsed.sections[block] = this.parseCollectionMaps(conf[block], data);
            break;
  
          case "bibliography": // TO CHECK
            parsed.sections[block] = this.parseBibliography(conf[block], data);
            break;
  
          default:
            break;
        }
      }
      return parsed;
    }
    
    localeParse(data: any) {
      const locale = data;
      return locale;
    }
  
  // PARSERS
  // These parsers can be overridden in the parsers section of middleware projects.

  parseTitle(block: ConfBlock, data: any): string{
   let title: string = "";
   block.fields.map((field: string) => {
     if (data[field] && data[field] != "") {
       title = data[field];
      }
    });
    return title;
  }

  parseHeader(block: ConfBlock, data: any): OutputHeader{
    const fields = block.fields;
    const header: OutputHeader = { 
      title: ''
    }
    if(data[fields[0]]){
      header.title = data[fields[0]];
    }
    if(data[fields[1]]){
      header.description = data[fields[1]];
    }
    return header;
  }

  parseBreadcrumbs(block: ConfBlock, data: any, type:string): OutputBreadcrumbs{
    let breadcrumbs;
    block.fields.forEach((field: string) => {
      breadcrumbs = Array.isArray(data[field])
        ? data[field].map(({ id, slug, title }) => ({
            title,
            link: `/${type}/${id}/${slug}`,
          }))
        : [];
    });
    return breadcrumbs;
  }

  parseTabs(block: ConfBlockTabs, data: any): string[] {
    const controller = [];
    block.tabs.forEach((tab) => {
      tab.fields.forEach((field) => {
        if ((!data[field] || data[field] === "") && !controller.includes(tab.id)) {
          controller.push(tab.id);
        }
      });
    });
    return controller
  }

  parseMetadata(block: ConfBlock, data: any, type: string): OutputMetadata{
    const m = {
      group: [
        {
          title: "Metadata",
          items: block.fields.map((field: string) => {
            if (data[field]) {
              let metadataItem = {
                label: field.replace(/_/g, " "),
                value: parseMetadataValue(data, field)
                };
              return this.filterMetadataItem(field, metadataItem, type, data);
            }
          })
        }
      ],
    };
    m.group[0].items = m.group[0].items.filter((n: any) => n); 

    return m;
  }
 
  parseMetadataSize(block: ConfBlock, data: any): OutputMetadata{
    const metadataSize = {
      group: [
        {
          title: "Dimensioni",
          items: [].concat(
            ...block.fields // dimension
              .map((field: string) =>
                Object.keys(data[field]).map((f) => ({
                  label: f,
                  value:
                    f === "image"
                      ? "<img src='" + data[field][f] + "'>"
                      : data[field][f],
                }))
              )
          ),
        },
      ],
    };
   return metadataSize;
  }

  parseMetadataDescription(block: ConfBlock, data: any): OutputMetadata{
    const metadataDescription = {
      group: [
        {
          title: "Descrizione",
          items: block.fields // description
            .map((field: string) => {
              return { label: field, value: data[field] };
            }),
        },
      ],
    };
   return metadataDescription;
  }

  parseImageViewer(block: ConfBlock, data: any): OutputImageViewer{
    let imageViewer = { images: [], thumbs: [] };
    let gallery = block.fields[0]; // "gallery"
    if(!data[gallery]) return
    if (typeof data[gallery] === "string") {
      imageViewer.images.push({
        type: "image",
        url: data[gallery],
        description: "",
      });
    } else {
      imageViewer.images = data[gallery].map((g: OutputImageViewerItem) => ({
        type: g.type,
        url: g.url ? g.url : '',
        description: g.description ? g.description : '',
        caption: g.caption ? g.caption : ''
      }));
      imageViewer.thumbs = data[gallery].map((g: any) => g.sizes.thumbnail);
    }
    return this.filterImageViewer(imageViewer, block, data);
  }

  parseTextViewer(block: ConfBlockTextViewer, data: any): OutputTextViewer{
    let textViewer = {
      "endpoint": "",
      "docs": []
    };

    if (data[block.field]) {
      if (!data[block.field]["filename"].endsWith("/")) {
        textViewer = {
          endpoint:
            data[block.field]["teipublisher"] +
            "/exist/apps/tei-publisher",
          docs: [
            {
              xml: data[block.field]["filename"],
              odd: data[block.field]["odd"],
              id: data["slug"] + "_" + data["id"],
              channel: data[block.field]["channel"] ?? false,
              translation : data[block.field]["translation"] ?? false,
              xpath : data[block.field]["xpath"] ?? false,
              view : data[block.field]["view"],
            },
          ],
        };
        // Check apparatus
        if (data[block.field]['apparatus']) {
          textViewer.docs[0].apparatus = {
            odd: data[block.field]['apparatus']['odd'],
            channel: data[block.field]['apparatus']['channel'],
            view : data[block.field]['apparatus']["view"]
          } 
        }
        // Check facsimile
        if (data[block.field]['facsimile']) {
          textViewer['facsimile'] = {
            baseurl: data[block.field]['facsimile']['baseurl'],
            scans: []
          }
        }
      }
    } else {
      return;
    }

    return this.filterTextViewer(textViewer, block.field, data);
  }

  parseCollection(block: ConfBlock, data: any): OutputCollection {
    const collection : OutputCollection = {
      items: [],
    };

    block.fields.map((field: string) => {
      if (data[field]) {
        collection.items = data[field].map((f: any) => {
          const collectionItem = {
          title: f.title, //f.title.replace(/-/g, " "),
          slug: f.slug,
          id: f.id,
          routeId: f['record-type'],
        };
        if(f.thumbnail) {
          collectionItem['image'] = f.thumbnail;
        }
        if (f.params) {
          collectionItem['params'] = this.extractQueryParams(f.params);
        }
        return this.filterCollectionItem(collectionItem, f, field, data);
        });
      }
    });
    return collection;
  }

  parseCollectionMaps(block: ConfBlock, data: any):  OutputCollectionMap[] {
    const collectionMaps = [];
    block?.fields?.forEach((field) => {
      if (data[field]) {
        data[field]?.forEach((element) => {
          collectionMaps.push({
            title: element.title,
            slug: element.slug,
            text: element.text,
            map_center: {
              lat: element.coords.center_lat,
              lng: element.coords.center_lng,
            },
            markers: element.coords.markers,
            zoom: element.coords.zoom,
          });
        });
      }
    });
    return collectionMaps;
  }

  extractQueryParams (queryParams: string) {
    const params = {};
    queryParams.split('&').forEach((param) => {
      const [key, value] = param.split('=');
      params[key] = value;
    });
    return params;
  };

  parseBibliography(block: ConfBlock, data: any): OutputBibliography{
    const c_b: OutputBibliography = {
      items: [],
    };

    if (data["bibliographicCitation"] != null) {
      block.fields.map((field) => {
        data[field].map((rif) => {
          rif["rif_biblio"].map((biblio) => {
            const text =
              biblio.title != ""
                ? `${biblio.title} ${biblio.description} ${rif.rif_biblio_position}`
                : `${biblio.description}: ${rif.rif_biblio_position}`;
            c_b.items.push({
              payload: {
                // action: "resource-modal",
                id: biblio.id,
                slug: biblio.slug,
                routeId: biblio['record-type'],
                type: "bibliography_wit",
              },
              text: `${biblio.title} ${biblio.description} ${rif.rif_biblio_position}`,
            });
          });
        });
      });
    } else if (data["timeline_bibliografia"] != null) {
      data["timeline_bibliografia"].map((rif) => {
        rif["mrc_timeline_bibliografia_rif_biblio"].map((biblio) => {
          c_b.items.push({
            payload: {
              action: "resource-modal",
              id: biblio.id,
              type: "bibliography_wit",
              slug: biblio.slug,
              routeId: biblio['record-type'],
            },
            text: `${biblio.title}: ${biblio.description} ${rif["mrc_timeline_rif_biblio_position"]}`,
          });
        });
      });
    }
    return {...c_b};
  }

  // OVERWRITEABLE FUNCTIONS
  // These filters can be overridden in the parsers section of middleware projects, they allows to modify a specific part of the result of a parser.

  filterImageViewer(imageViewer: OutputImageViewer, block: ConfBlock, data: any): OutputImageViewer {
    return imageViewer;
  }

  filterTextViewer(textViewer: OutputTextViewer, field: string, data: any): OutputTextViewer {
    return textViewer;
  }

  filterMetadataItem(field: string, metadataItem: OutputMetadataItem, recordType: string, data: any ): OutputMetadataItem{
    return metadataItem;
  }

  filterCollectionItem(collectionItem: any, item: any, field: string, data: any): any{
    return collectionItem;
  }
}
