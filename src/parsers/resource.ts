import { ConfBlock, ConfBlockTextViewer, ConfBlockTabs, ConfBlockParallelTextViewer } from '../interfaces';
import Parser, { OutputBibliography, OutputBreadcrumbs, OutputCollection, OutputCollectionMap, OutputHeader, OutputImageViewer, OutputImageViewerIIIF, OutputImageViewerItem, OutputMetadata, OutputMetadataItem, OutputParallelTextViewer, OutputTextViewer, ParsedData } from '../interfaces/parser';
import { parseMetadataValue } from '../utils/parseMetadataFunctions';
import { mockParallelTextViewer } from './mock-parallel-text-viewer';

export class ResourceParser implements Parser {

  locale: any;

  parse({ data, options }: any, locale) {
    if (!("type" in options)) {
      return;
    }

    this.locale = locale;

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

        case "metadata-accordion":
          parsed.sections[block] = this.parseMetadataAccordion(conf[block], data, type);
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

        case "image-viewer-iiif":
          parsed.sections[block] = this.parseImageViewerIIIF(conf[block], data);
          break;

        case "text-viewer":
          parsed.sections[block] = this.parseTextViewer(conf[block], data)
          break;

        case "parallel-text-viewer":
          parsed.sections[block] = this.parseParallelTextViewer(conf[block], mockParallelTextViewer)
          break;

        case "collection":
          parsed.sections[block] = this.parseCollection(conf[block], data);
          break;

        case "collection-digital-edition":
          parsed.sections[block] = this.parseCollectionDigitalEdition(conf[block], data);
          break;

        case "collection-places": 
          parsed.sections[block] = this.parseCollectionMaps(conf[block], data);
          break;

        case "bibliography":
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

  parseLocale() {
    return (this.locale === 'it') ? '' : this.locale;
  }

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

  parseMetadataAccordion(block: ConfBlock, data: any, type: string): any {
    const a = {
      data: [],
    };
    block.fields.forEach((field) => {
      if (!data[field] || !data[field].length) return
      data[field].forEach((item) => {
        let accordion = {
          title: item.title,
          group: [],
          accordionId: `${item['record-type']}-${item.id}`,
          options: {
            isOpen: false
          }
        }
        accordion = this.filterAccordionHeader(accordion, item);
        let metadata = {
          title: '',
          items: []
        }
        let metadataList = this.creatMetadataAccordionList(item);
        metadata.items = metadataList.map((field) => {
          if (item[field]) {
            let metadataAccordionItem = {
              label: field.replace(/_/g, " "),
              value: parseMetadataValue(item, field)
            };
            return this.filterMetadataAccordionItem(metadataAccordionItem, field, item);
          }
        })
        accordion.group.push(metadata);
        a.data.push(accordion);
      });
    });
    if (!a.data.length) return;
    return a;
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

  parseImageViewerIIIF(block: ConfBlock, data: any): OutputImageViewerIIIF {
    let iiifViewer = {
      'iiif-manifests': []
    }
    block.fields.forEach((field) => {
      if(data[field] && data[field] != ""){
       iiifViewer['iiif-manifests'].push({ manifestUrl: data[field] })
      }
    });
    if (iiifViewer['iiif-manifests'].length) {
      return this.filterImageViewerIIIF(iiifViewer, block, data);
    }
  }


  parseTextViewer(block: ConfBlockTextViewer, data: any): OutputTextViewer{
    let textViewer = {
      "endpoint": "",
      "docs": []
    };

    if (data[block.field]) {
      if (!data[block.field]["filename"].endsWith("/")) {
        textViewer = {
          endpoint: data[block.field]["teipublisher"] + "/exist/apps/tei-publisher",
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
            baseurl: data[block.field]['facsimile']['baseurl'] ?? data[block.field]['facsimile']['uri'],
            scans: data[block.field]['facsimile']['scans'] ?? []
          }
        }
      }
    } else {
      return;
    }

    return this.filterTextViewer(textViewer, block.field, data);
  }

  parseParallelTextViewer(block: ConfBlockParallelTextViewer, data: any): OutputParallelTextViewer {
    let parallelTextViewer: OutputParallelTextViewer = {
      endpoint: "",
      docs: [],
      mainDoc: {
        odd: "",
        doc_id: "",
      },
    };

    if (data[block.field]) {
      if (!data[block.field]["filename"].endsWith("/")) {
        const panelsList = data[block.field]["panels"];

        parallelTextViewer = {
          endpoint: data[block.field]["teipublisher"],
          mainDoc: {
            doc_id: 'mainDoc',
            odd: data[block.field]["odd"] ?? false,
            view : data[block.field]["view"] ?? false,
            channel: data[block.field]["channel"] ?? false,
            translation : data[block.field]["translation"] ?? false,
            xpath : data[block.field]["xpath"] ?? false,
          },
          docs: [
            {
              xml: data[block.field]["filename"],
              id: 'mainDoc',
            }
          ],
        }

        // Check grid
        if (data[block.field]["grid"]) {
          parallelTextViewer['grid'] = data[block.field]["grid"];
        }

        // Check panels
        if (block.panels && block.panels) {
          parallelTextViewer['panels'] = [];
          let panelIndex = 2;
          block.panels.forEach((panel) => {
            if (panel.type && panel.type === 'facsimile') {
              const panelObj = {
                ...panelsList[panel.field],
                id: panel.id,
                enabled: true,
                type: panel.type,
                title: (panel.title) ? panel.title : null,
              }
              parallelTextViewer['panels'].push(panelObj);
            } else {
              const { filename, ...panelRest } = panelsList[panel.field];
              const panelObj = {
                ...panelRest,
                id: panel.id,
                doc_id: (panelsList[panel.field]['filename']) ? `document${panelIndex}` : 'mainDoc',
                enabled: true,
                type: 'text',
                title: (panel.title) ? panel.title : null,
              }
              parallelTextViewer['panels'].push(panelObj);
              if (panelsList[panel.field]['filename']) {
                parallelTextViewer['docs'].push({
                  xml: (panelsList[panel.field]['filename']) ? panelsList[panel.field]['filename'] : data[block.field]["filename"],
                  id: (panelsList[panel.field]['filename']) ? `document${panelIndex}` : 'mainDoc'
                });
              }
              if (panelsList[panel.field]['filename']) panelIndex++;
            }
          });
        }
      }
    } 

    return this.filterParallelTextViewer(parallelTextViewer, block.field, data);
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

  parseCollectionDigitalEdition(block: ConfBlock, data: any): OutputCollection {
    const collection : OutputCollection = {
      items: [],
    };

    block.fields.map((field: string) => {
      if (data[field]) {
        let collectionItem = {
          title: 'Edizione digitale',
          slug: data.slug,
          id: data.id,
          routeId: 'text',
          metadata: [{
            items: [
              {label: data.title, value: ''}
            ]
          }],
        };
        if(data.thumbnail) {
          collectionItem['image'] = data.thumbnail;
        }
        if (data.params) {
          collectionItem['params'] = this.extractQueryParams(data.params);
        }
        collectionItem =  this.filterCollectionDigitalEditionItem(collectionItem, field, data);
        collection.items.push(collectionItem);
      } else {
        let collectionItem = {
          title: 'Edizione digitale in preparazione',
          slug: data.slug,
          id: data.id,
          routeId: '',
          metadata: [{
            items: [
              {label: data.title, value: ''}
            ]
          }],
        };
        collectionItem = this.filterCollectionDigitalEditionItem(collectionItem, field, data);
        collection.items.push(collectionItem);
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
    if ((data["bibliografia"]) != null || (data["bibliography"]) != null) {
      block.fields.map((field) => {
        data[field].map((rif) => {
          rif['rif_biblio'].map((biblio) => {
            const textItems = [biblio.description, rif.rif_biblio_position]; // Here you can add biblio.title
            const text = textItems.filter(item => item).join(', ');
            let bibliographyItem = {
              payload: {
                id: biblio.id,
                slug: biblio.slug,
                routeId: biblio['record-type'],
                type: 'bibliography',
              },
              text: text
            }
            bibliographyItem = this.filterBibliographyItem(bibliographyItem, rif, field, data);
            c_b.items.push(bibliographyItem);
          });
        });
      });
    }
    if (data["bibliographicCitation"] != null) {
      block.fields.map((field) => {
        data[field].map((rif) => {
          rif["rif_biblio"].map((biblio) => {
            const textItems = [biblio.title, biblio.description, rif.rif_biblio_position];
            const text = textItems.filter(item => item).join(', ');
            let bibliographyItem = {
              payload: {
                // action: "resource-modal",
                id: biblio.id,
                slug: biblio.slug,
                routeId: biblio['record-type'],
                type: 'bibliography',
              },
              text: text
            }
            bibliographyItem = this.filterBibliographyItem(bibliographyItem, rif, field, data);
            c_b.items.push(bibliographyItem);
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
              type: "bibliography",
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

  filterImageViewerIIIF(iiifViewer: OutputImageViewerIIIF, block: ConfBlock, data: any): OutputImageViewerIIIF {
    return iiifViewer;
  }

  filterTextViewer(textViewer: OutputTextViewer, field: string, data: any): OutputTextViewer {
    return textViewer;
  }

  filterParallelTextViewer(parallelTextViewer: OutputParallelTextViewer, field: string, data: any): OutputParallelTextViewer {
    return parallelTextViewer;
  }

  filterMetadataItem(field: string, metadataItem: OutputMetadataItem, recordType: string, data: any ): OutputMetadataItem{
    return metadataItem;
  }

  filterCollectionItem(collectionItem: any, item: any, field: string, data: any): any{
    return collectionItem;
  }

  filterCollectionDigitalEditionItem(collectionItem: any, field: string, data: any) {
    return collectionItem;
  }

  filterBibliographyItem(bibliographyItem: any, rif: any, field: string, data: any): any{
    return bibliographyItem;
  }

  filterAccordionHeader(accordionHeader: any, item: any) {
    return accordionHeader;
  }

  filterMetadataAccordionItem(metadataAccordionItem: any, field: string, data: any): any{
    return metadataAccordionItem;
  }

  creatMetadataAccordionList(item: any) {
    return ['title'];
  }
}
