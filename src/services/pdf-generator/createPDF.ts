import { capitalize } from "lodash";
import { getResourceController } from "../../controllers";
import { HttpHelper } from "../../helpers";
import { PDFContent } from "../../interfaces/configurations/getPDF";
import { columnsAdd, convertImageToBase64, createPdfBinary, getTextObject } from "./common";

export class PDFGenerator {

  firstSection = true;
  afterTabTitle = false;

  protected separator() {
    return {
      canvas: [{
        type: 'line',
        x1: 0, y1: 0,
        x2: 515 , y2: 0,
        lineWidth: 1.5,
        lineColor: '#dddddd',
      }],
      margin: [0, 0, 0, 0],
    };
  }

  protected nestedSeparator(pdfContent) {
    const lw = pdfContent.labelWidth;
    const offsetPx = typeof lw === 'number' ? lw + 5 : Math.round(parseFloat(lw) / 100 * 515) + 5;
    return {
      canvas: [{
        type: 'line',
        x1: 0, y1: 0,
        x2: 515 - offsetPx, y2: 0,
        lineWidth: 0.5,
        lineColor: '#dddddd',
      }],
      margin: [offsetPx, 10, 0, 10],
    };
  }

  protected getLabel(item, labels) {
    return labels[item.label] ? capitalize(labels[item.label]) : capitalize(item.label);
  }

  protected addSpacing(pdfContent, top = 10) {
    pdfContent.content.push({ text: '', margin: [0, top, 0, 0] });
    return pdfContent;
  }

  protected addSectionSpacing(pdfContent: PDFContent): PDFContent {
    if (this.firstSection) {
      this.firstSection = false;
      pdfContent = this.addSpacing(pdfContent, 20);
    } else if (this.afterTabTitle) {
      this.afterTabTitle = false;
      pdfContent = this.addSpacing(pdfContent, 5);
    } else {
      pdfContent = this.addSpacing(pdfContent, 5);
      if (!pdfContent.noSectionSeparator) pdfContent.content.push(this.separator());
      pdfContent = this.addSpacing(pdfContent, 5);
    }
    return pdfContent;
  }

  async addContent(resource, configurations, type, labels, locale = ''): Promise<PDFContent> {
    const config = configurations.configurations.resources[type];

    const defaults: PDFContent = {
      content: [],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
        },
        subtitle: {
          fontSize: 10,
        },
        sectionTitle: {
          fontSize: 12,
          color: '#7e8f9b',
          bold: true,
        },
        tabTitle: {
          fontSize: 14,
          bold: true,
        },
        nestedMetadata: {
          fontSize: 11,
        },
        bold: {
          bold: true,
        },
        link: {
          color: '#5397c7',
          decoration: '',
        },
      },
      defaultStyle: {
        font: "OpenSans",
        fontSize: 11,
        lineHeight: 1,
      },
      labelWidth: '20%',
      nestedLabelWidth: '20%',
      noSectionSeparator: false
    };

    let pdfContent: PDFContent = {
      ...defaults,
      ...config.pdf,
      styles: {
        ...defaults.styles,
        ...config.pdf?.styles,
        link: { ...defaults.styles.link, ...config.pdf?.styles?.link },
      },
      defaultStyle: { ...defaults.defaultStyle, ...config.pdf?.defaultStyle },
    };

    const tabMap: Record<string, string> = {};
    if (pdfContent.showTabTitles && pdfContent.tabs) {
      for (const tab of pdfContent.tabs) {
        for (const sectionId of tab.sections) {
          tabMap[sectionId] = tab.label;
        }
      }
    }
    let currentTabLabel: string | null = null;

    const sections = resource.sections;
    for (let section in sections) {
      const data = sections[section];
      if (config[section]?.excludePDF && config[section]?.excludePDF === true) {
        continue;
      }
      if (tabMap[section] && tabMap[section] !== currentTabLabel) {
        currentTabLabel = tabMap[section];
        pdfContent = this.addTabTitle(currentTabLabel, pdfContent);
      }
      switch (config[section]?.type) {

        case 'header':
          if (!data) break;
          pdfContent = await this.addHeader(data.title, pdfContent);
          break;

        case 'metadata-subtitle':
          if (!data) break;
          pdfContent = await this.addSubtitle(data.group[0].items, pdfContent, labels, config[section]?.pdf);
          break;

        case 'metadata':
          if (!data) break;
          pdfContent = await this.addMetadata(data.group[0].items, pdfContent, labels, config[section]?.pdf, locale);
          break;

        // case 'image-viewer':
        //   if (!data) break;
        //   pdfContent = await this.addImgViewer(data, pdfContent);
        //   break;

        // case 'image-viewer-iiif':
        //   if (!data) break;
        //   await this.addIIIF(data, pdfContent);
        //   break;

        // case 'collection':
        //   if (!data) break;
        //   pdfContent = await this.addCollection(data, pdfContent);
        //   break;
      }
    }
    return pdfContent;
  }

  addTabTitle(label: string, pdfContent: PDFContent): PDFContent {
    this.addSectionSpacing(pdfContent);
    pdfContent.content.push({ text: label, style: 'tabTitle' });
    this.afterTabTitle = true;
    return pdfContent;
  }

  async addHeader(title, pdfContent) {
    pdfContent.content.push({
      text: await getTextObject(title, pdfContent),
      style: "header",
    });
    return pdfContent;
  }

  async addSubtitle(items, pdfContent, labels, pdfSectionConfig?) {
    pdfContent = this.addSpacing(pdfContent, -10);
    for (const item of items ?? []) {
      pdfContent = await columnsAdd(pdfContent, this.getLabel(item, labels), item.value, pdfSectionConfig, "subtitle");
    }
    return pdfContent;
  }

  async addMetadata(items, pdfContent, labels, pdfSectionConfig?, locale = '') {
    pdfContent = this.addSectionSpacing(pdfContent);
    // Section title
    const titleConfig = pdfSectionConfig?.title;
    const sectionTitle = titleConfig
      ? (titleConfig[locale] ?? titleConfig[Object.keys(titleConfig)[0]] ?? '')
      : '';
    if (sectionTitle) {
      pdfContent.content.push({
        text: sectionTitle,
        style: "sectionTitle",
        margin: [0, 0, 0, 5]
      });
    }
    let isFirst = true;
    for (const item of items ?? []) {
      const margin = (rowMargin: boolean) => rowMargin ? [0, 0, 0, 0] : [0, 5, 0, 0];
      const nestedMargin = [0, 5, 0, 0];
      if (!Array.isArray(item.value)) {
        // Metadato piatto
        pdfContent = await columnsAdd(pdfContent, this.getLabel(item, labels), item.value, pdfSectionConfig, undefined, false, margin(isFirst));
        isFirst = false;
      } else {
        // Metadato annidato
        for (let g = 0; g < item.value.length; g++) {
          const filteredItems = item.value[g]
            .filter((subItem: any) => subItem.value && subItem.value !== '')
            .map((subItem: any) => ({ label: this.getLabel(subItem, labels), value: subItem.value }));
          if (filteredItems.length) {
            const outerLabel = g === 0 ? this.getLabel(item, labels) : '';
            pdfContent = await columnsAdd(pdfContent, outerLabel, filteredItems, { ...pdfSectionConfig, nestedMargin }, "nestedMetadata", false);
            isFirst = false;
          }
          if (g < item.value.length - 1) {
            pdfContent.content.push(this.nestedSeparator(pdfContent));
          }
        }
      }
    }

    return pdfContent;
  }

  async addImgViewer(imgViewer, pdfContent) {
    try {
      for (let image of imgViewer["images"]) {
        let base64 = await convertImageToBase64(image["url"]);
        pdfContent.content.push({
          image: base64,
          width: 250,
          alignment: "center",
          margin: [0, 3],
        });
      }
      pdfContent.content.push(" ");
    } catch (error) {
      console.error("Error converting image to base64:", error);
    }
    return pdfContent;
  }

  async addIIIF(iiif, pdfContent) {
    const { manifestUrl } = iiif["iiif-manifests"][0];
    if (manifestUrl) {
      pdfContent = await columnsAdd(
        pdfContent,
        'Link IIIF',
        manifestUrl.replaceAll("\n", "").replaceAll("\r", ""),
      );
    }
    return pdfContent;
  }

  async addCollection(collection, pdfContent) {
    const items = collection["items"];
    if (items.length) {
      pdfContent = await columnsAdd(
        pdfContent,
        capitalize(collection["header"].title),
        items[0].text || items[0].title || ""
      );
      if (items.length > 1) {
        pdfContent.content.push(this.separator);
      }
      for (let i = 1, n = items?.length; i < n; i++) {
        pdfContent = await columnsAdd(
          pdfContent,
          "",
          items[i].text || items[i].title || ""
        );
        if (i < n - 1) {
          pdfContent.content.push(this.separator);
        }
      }
    }
    return pdfContent;
  }

  async createPDF(req, res, config, labels, resource?) {
    try {
      const locale = req.query?.locale || '';
      const body = JSON.parse(req.body);
      const result = resource ?? await new getResourceController().searchResource(body, config, locale as string);
      const pdfContent = await this.addContent(result, config, body.type, labels, locale as string);
      const binary = await createPdfBinary(pdfContent);
      const title = result.sections?.header?.title || 'Scheda PDF';
      const encodedTitle = encodeURIComponent(`${title}.pdf`);

      const headerData = {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${title}.pdf"; filename*=UTF-8''${encodedTitle}`,
      };

      return {
        statusCode: 200,
        headers: headerData,
        body: binary,
        isBase64Encoded: true,
      };
    } catch (error) {
      return HttpHelper.returnErrorResponse(error, 502);
    }
  }
}
