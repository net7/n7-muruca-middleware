import { Author, ConfBlock } from '../interfaces';
import Parser, { OutputBreadcrumbs, OutputCollection, OutputHeader, OutputImageViewer, OutputMetadata, OutputMetadataItem, OutputTextViewer, ParsedData } from '../interfaces/parser';

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
  
          case "image-viewer":
            parsed.sections[block] = this.parseImageViewer(conf[block], data);
            break;
  
          case "breadcrumbs":
            parsed.sections[block] = this.parseBreadcrumbs(conf[block], data, type);
            break;
  
          case "metadata":
            parsed.sections[block] = this.parseMetadata(conf[block], data, type);
            break;

          case "collection":
            parsed.sections[block] = this.parseCollection(conf[block], data);
            break;
  
          case "collection-keywords":
            parsed.sections[block] = {};
            const keywords = {
              header: { title: "Keywords collegate" },
              items: [],
            };
            conf[block].fields.forEach((field: string) => {
              if (data[field]) {
                keywords.items = data[field].map((f: any) => ({
                  title: f.title,
                  link: `/keyword/${f.id}/${f.slug}`,
                  type: field,
                }));
              }
            });
            parsed.sections[block] = keywords; // keywords
            break;
  
          case "collection-toponyms":
            parsed.sections[block] = {};
            const toponyms = {
              header: { title: "Toponimi collegati" },
              items: [],
            };
            conf[block].fields.map((field: string) => {
              if (data[field]) {
                toponyms.items = data[field].map((f: any) => ({
                  title: f.title,
                  link: "/" + type + "/" + f.id + "/" + f.slug,
                  type: field,
                }));
              }
            });
            parsed.sections[block] = toponyms; //toponyms
            break;
  
          case "collection-witnesses":
            parsed.sections[block] = {};
            const witnesses = {
              header: { title: "Testimoni collegati" },
              items: [],
            };
            conf[block].fields.map((field: string) => {
              if (data[field]) {
                witnesses.items = data[field].map((f: any) => ({
                  title: f.title,
                  link: "/" + "testimone" + "/" + f.id + "/" + f.slug,
                  type: field,
                }));
              }
            });
            parsed.sections[block] = witnesses; //witnesses
            break;
  
          case "related_motifs":
            parsed.sections[block] = {};
            const relatedRecord = {
              header: {},
              items: [],
            };
  
            conf[block].fields.map((field: string) => {
              //for (let element in data[field]) {
              if (data[field]) {
                // console.log(data[field]);
  
                //FIX ME
                relatedRecord.items = data[field].map((f: any) => ({
                  title: f.title.replace(/-/g, " "),
                  link: f['record-type'] + "/" + f.id + "/" + f.slug,
                  slug: f.slug,
                  id: f.id,
                  routeId: f['record-type'],
                  //type: f.taxonomy,
                }));
                // }
              }
            });
            parsed.sections[block] = relatedRecord; //taxonomies
            break;
  
          // case "collection-taxonomies":
          // parsed.sections[block] = {};
          // const taxonomies = {
          //   header: { title: "Motivi collegati" },
          //   items: [],
          // };
  
          // conf[block].fields.map((field: string) => {
          //   for (let element in data[field]) {
          //     if (data[field] && data[field][element]) {
          //       //FIX ME
          //       taxonomies.items.push(
          //         data[field][element].map((f: any) => ({
          //           title: f.name.replace(/-/g, " "),
          //           link: "/taxonomy/" + f.id + "/" + f.key,
          //           type: f.taxonomy,
          //         }))
          //       );
          //     }
          //   }
          // });
          // parsed.sections[block] = taxonomies; //taxonomies
          // break;
  
          case "related_records":
            parsed.sections[block] = {};
            const records = {
              header: { title: "Fiabe collegate" },
              items: [],
            };
  
            conf[block].fields.map((field: string) => {
              if (data[field]) {
                records.items = data[field].map((f: any) => ({
                  title: f.title,
                  link: "/" + "record" + "/" + f.id + "/" + f.slug,
                  image: f.image,
                  slug: f.slug,
                  id: f.id,
                  routeId: f['record-type'],
  
                  //type: field,
                }));
              }
            });
            parsed.sections[block] = records;
            break;
  
          case "metadata-size":
            parsed.sections[block] = this.parseMetadataSize(conf[block], data);
            break;
  
          case "metadata-description":
            parsed.sections[block] = this.parseMetadataDescription(conf[block], data);
            break;
  
          case "collection-maps":
            {
              parsed.sections[block] = {};
              const relatedMaps = {
                header: { title: "Second level maps" },
                items: [],
              };
              conf[block].fields.map((field: string) => {
                if (data[field]) {
                  relatedMaps.items = data[field].map((f: any) => ({
                    title: f.title,
                    link: "/" + type + "/" + f.id + "/" + f.slug,
                    image: f.image,
                    type: f.type,
                  }));
                }
              });
              parsed.sections[block] = relatedMaps; //toponyms
            }
            break;
  
          case "bibliography":
            parsed.sections[block] = this.parseBibliography(conf[block], data);
            break;
  
          case "collection-records": //obsoleta
            parsed.sections[block] = {};
            const r_2: any = {
              header: {
                title: "Bibliografia",
              },
              items: [],
            };
            conf[block].fields.forEach((field: string, i: number) => {
              // work collection
              if (data[field]) {
                r_2.items.push({
                  // image: data[field][i].gallery[0].image,
                  image: data[field][i].image,
                  title: data[field][i].title,
                  // text: data[field][i].description,
                  link: `/${type}/${data[field][i].slug}`,
                });
                parsed.sections[block] = { ...r_2 };
              }
            });
            break;
  
          case "collection-works": //obsoleta
            parsed.sections[block] = {};
            const c_2: any = {
              header: {
                title: "Bibliografia",
              },
              items: [],
            };
            conf[block].fields.forEach((field: string, i: number) => {
              // work collection
              if (data[field] && field !== "related_records") {
                // console.log(data[field]);
  
                c_2.items.push({
                  image: data[field][i].gallery[0].image
                    ? data[field][i].gallery[0].image
                    : data[field][i].image,
                  title: data[field][i].title,
                  text: data[field][i].description,
                  link: `/${type}/${data[field][i].slug}`,
                  slug: data[field][i].slug,
                  id: data[field][i].id,
                  routeId: data[field][i]['record-type'],
                  metadata: [
                    {
                      items: [
                        {
                          label: "Autore/i",
                          value: Object.keys(data[field][i].authors)
                            .map((auth) => data[field][i].authors[auth]["name"])
                            .join(", "),
                        },
                        { label: "Lingua", value: data[field][i].language },
                        { label: "Entry ID", value: data[field][i].id },
                        {
                          label: "Livello bibliografico",
                          value: data[field][i].bibliographic_level,
                        },
                        { label: "Anno", value: data[field][i].year },
                      ],
                    },
                  ],
                });
              } else {
  
                  if (data[field] && field === "related_records") {
                    // console.log(data[field]);
                    c_2.header.title = "Fiabe collegate";
                    c_2.items = data[field].map((f: any) => ({
                      title: f.title,
                      link: "/" + f['record-type'] + "/" + f.id + "/" + f.slug,
                      image: f.image,
                      slug: f.slug,
                      id: f.id,
                      routeId: f['record-type'],
  
                      //type: field,
                    }));
                  }
                
              }
              parsed.sections[block] = { ...c_2 };
            });
            break;
  
          case "preview-parent":
            parsed.sections[block] = {};
            conf[block].fields.map((field: string) => {
              // preview parent
              if (data[field]) {
                const previewItem = data[field].map(
                  (f: {
                    title: string;
                    description: string;
                    image: any;
                    id: string;
                    slug: string;
                  }) => ({
                    title: f.title,
                    description: f.description,
                    image: f.image,
                    link: `/${type}/${f.id}/${f.slug}`,
                    classes: "is-fullwidth",
                  })
                );
                parsed.sections[block] = { ...previewItem };
              }
            });
            break;
  
          case "text-viewer":
            parsed.sections[block] = this.parseTextViewer(conf[block], data)
            break;
          
          case "collection-places": // mandare formattata in questo modo
          
            if (data[conf[block].fields]) {
              parsed.sections[block] = [];
              data[conf[block].fields]?.forEach((element) => {
                parsed.sections[block].push({
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
    
  /**
   * Data filters
   */
  filter(data: any, field: string, page) {
     let filter;
     if (/date/.test(field)) {
       filter = { label: field, value: data[field]["range"] };
      }
      if (/edition/.test(field)) {
        filter = {
          label: field,
          value: data[field][0]["title"] + " " + data[field][0]["description"],
        };
      }
      
      if (/contenuti/.test(field)) {
        filter = {
          label: field,
          value: [],
        };
        data[field]
        ? data[field].map((c) =>
        filter.value.push(Object.keys(c).map((f) => ({ value: c[f] })))
        )
        : null;
      }
      
      if (/author|collocation|creator|subject/.test(field)) {
        filter = {
          label: field,
          value: Object.keys(data[field])
          .map((n) => data[field][n].name)
          .join(", "),
        };
      }
      
      if (/authors/.test(field)) {
        filter = [];
        switch (page) {
          case "work":
            Object.keys(data[field]).map((auth) => {
              filter.push({
                label: "author",
                value: data[field][auth].name,
              });
            });
            break;
            case "map":
            data[field].map((auth: Author) => {
              filter.push({
                label: auth.role,
                value: Object.keys(auth.author)
                .map((a) => auth.author[a].name)
                .join(", "),
              });
            });
            break;
          }
        }
        if (/spatialCoverage/.test(field)) {
          filter = {
            label: field,
        value: Object.keys(data[field])
        .map((lang) => data[field][lang].title)
        .join(""),
      };
    }
    if (/temporalCoverage/.test(field)) {
      filter = {
        label: field,
        value: Object.keys(data[field])
        .map((lang) => data[field][lang])
        .join(""),
      };
    }
    
    if (/linguaggio/.test(field)) {
      filter = {
        label: field.replace(/_/g, " "),
        value: Object.keys(data[field])
        .map((lang) => data[field][lang]["name"])
        .join(", "),
      };
    }
    
    if (/primary_sources|external_links/.test(field)) {
      filter = {
        label: field.replace(/_/g, " "),
        value: Object.keys(data[field])
        .map((auth) => data[field][auth]["link"])
        .join(", "),
      };
    }
    if (/riproduzione_link/.test(field)) {
      filter = {
        label: "riproduzione".replace(/_/g, " "),
        value: `<a href="${data[field]}">${
          data["riproduzione"]
          ? data["riproduzione"].map((item) => item.title).join(", ")
          : null || "Vedi riproduzione"
        }</a>`,
      };
    }
    if (/bibliografia/.test(field)) {
      filter = [];
      data[field].map((rif) => {
        rif.rif_biblio.map((bibl) => {
          filter.push({
            label: bibl.title,
            value: `${bibl.description} ${rif.rif_biblio_position}`,
            link: `/${bibl.type}/${bibl.id}/#${bibl.slug}`,
          });
        });
      });
    }
    return filter;
  }
  
  filterMetadata(field: string, metadataItem: OutputMetadataItem, recordType: string ): OutputMetadataItem{
    return metadataItem;
  }
  
  /**
   * Parsers
   */
  parseTitle(block: ConfBlock, data: any): string{
   let title: string = "";
   block.fields.map((field: string) => {
     if (data[field] && data[field] != "") {
       title = data[field];
      }
    });
    return title;
  }

  parseMetadata(block: ConfBlock, data: any, type: string): OutputMetadata{
    const m = {
      group: [
        {
          title: "Metadata",
          items: block.fields.map((field: string) => {
            if (data[field]) {
              
              const metadataItem = {
                  label: field.replace(/_/g, " "),
                  value: data[field],
                };
                return this.filterMetadata(field, metadataItem, type)
              }
            }
          )
        }
      ],
    };
    m.group[0].items = m.group[0].items.filter((n: any) => n); //cancella i null

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
  
  parseImageViewer(block: ConfBlock, data: any): OutputImageViewer{
    let imageViewer = { images: [], thumbs: [] };
    let gallery = block.fields[0]; // "gallery"
    if (typeof data[gallery] === "string") {
      imageViewer.images.push({
        type: "image",
        url: data[gallery],
        description: "",
      });
    } else {
      imageViewer.images = data[gallery].map((g: any) => ({
        type: "image",
        url: g.image,
        description: g.description,
      }));
      imageViewer.thumbs = imageViewer.images;
    }
    return imageViewer;
  }
  
  parseBreadcrumbs(block: ConfBlock, data: any, type:string): OutputBreadcrumbs{
    let breadcrumbs = {link: "", title: ""};
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

  parseCollection(block: ConfBlock, data: any): OutputCollection{
    const header = block.title ? {title: block.title} : {};
    const collection = {
      header: header,
      items: [],
    };

    block.fields.map((field: string) => {
      if (data[field]) {
        collection.items = data[field].map((f: any) => ({
          title: f. title, //f.title.replace(/-/g, " "),
          slug: f.slug,
          id: f.id,
          routeId: f['record-type'],
        }));
        if(data[field]?.image){   //TODO
          collection.items['image'] = data[field].image 
        }
      }
    });
    return collection;
    
  }

  parseBibliography(block: ConfBlock, data: any): OutputCollection{
    const c_b: any = {
      header: {
        title: block.title,
      },
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
            },
            text: `${biblio.title}: ${biblio.description} ${rif["mrc_timeline_rif_biblio_position"]}`,
          });
        });
      });
    }

    return {...c_b};

  }

  parseTextViewer(block: ConfBlock, data: any): OutputTextViewer{

    let t_v = {
      "endpoint": "",
      "docs": []
    };

    if (data["bibliographicCitation"] != null) {
      if (data["transcription"]) {
        if (!data["transcription"]["filename"].endsWith("/")) {
          t_v = {
            endpoint:
              data["transcription"]["teipublisher"] +
              "/exist/apps/tei-publisher",
            docs: [
              {
                xml: data["transcription"]["filename"],
                odd: data["transcription"]["odd"],
                id: data["slug"] + "_" + data["id"],
                channel: data["transcription"]["channel"] ?? false,
                translation : data["transcription"]["translation"] ?? false,
                xpath : data["transcription"]["xpath"] ?? false,
                view : data["transcription"]["view"] 
              },
            ],
          };
        }
      }
    }
    return t_v;
  }


}
