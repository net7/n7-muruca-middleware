import { capitalize } from "lodash";
import { getResourceController } from "../../controllers";
import { HttpHelper } from "../../helpers";
import { PDFBanner, PDFBannerText, PDFContent } from "../../interfaces/configurations/getPDF";
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

  protected flatNestedSeparator() {
    return {
      canvas: [{
        type: 'line',
        x1: 0, y1: 0,
        x2: 515, y2: 0,
        lineWidth: 0.5,
        lineColor: '#dddddd',
      }],
      margin: [0, 10, 0, 10],
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
        nestedTitle: {
          fontSize: 12,
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
        bannerLink: {
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
        bannerLink: { ...defaults.styles.bannerLink, ...config.pdf?.styles?.bannerLink },
      },
      defaultStyle: { ...defaults.defaultStyle, ...config.pdf?.defaultStyle },
    };

    const tabMap: Record<string, string> = {};
    if (pdfContent.showTabTitles && pdfContent.tabs) {
      for (const tab of pdfContent.tabs) {
        const label = typeof tab.label === 'string'
          ? tab.label
          : (tab.label[locale] ?? tab.label[Object.keys(tab.label)[0]] ?? '');
        for (const sectionId of tab.sections) {
          tabMap[sectionId] = label;
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
          const rawItems = item.value[g]
            .filter((subItem: any) => subItem.value && subItem.value !== '');
          if (rawItems.length) {
            // Annidato flat
            if (pdfContent.flattenNested) {
              if (g === 0) {
                const outerLabel = this.getLabel(item, labels);
                if (outerLabel) {
                  pdfContent.content.push({ text: outerLabel, style: 'nestedTitle', margin: [0, isFirst ? 0 : 5, 0, 5] });
                }
              }
              for (let s = 0; s < rawItems.length; s++) {
                const subItem = rawItems[s];
                const subMargin = s === 0 ? [0, 0, 0, 0] : [0, 5, 0, 0];
                pdfContent = await columnsAdd(pdfContent, this.getLabel(subItem, labels), subItem.value, pdfSectionConfig, undefined, false, subMargin);
              }
            } else {
              // Annidato incolonnato
              const filteredItems = rawItems
                .map((subItem: any) => ({ label: this.getLabel(subItem, labels), value: subItem.value }));
              const outerLabel = g === 0 ? this.getLabel(item, labels) : '';
              pdfContent = await columnsAdd(pdfContent, outerLabel, filteredItems, { ...pdfSectionConfig, nestedMargin }, "nestedMetadata", false);
            }
            isFirst = false;
          }
          if (g < item.value.length - 1) {
            pdfContent.content.push(
              pdfContent.flattenNested ? this.flatNestedSeparator() : this.nestedSeparator(pdfContent)
            );
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

  protected async buildBannerContent(banner: PDFBanner, locale: string, isFooter = false, pdfContent?: PDFContent): Promise<any[]> {
    const resolveText = (t: PDFBannerText) =>
      typeof t === 'string' ? t : (t[locale] ?? t[Object.keys(t)[0]] ?? '');

    const bannerLinkStyle = pdfContent?.styles?.bannerLink ?? { color: '#5397c7', decoration: '' };
    const contentCtx = { styles: { link: bannerLinkStyle }, content: [] };

    const alignment = banner.align ?? 'left';
    const logoWidth = banner.logoWidth ?? 40;
    const textStack: any[] = [];
    if (banner.title) {
      const parsed = await getTextObject(resolveText(banner.title), contentCtx);
      textStack.push({ text: parsed.text, bold: true });
    }
    if (banner.text) {
      const parsed = await getTextObject(resolveText(banner.text), contentCtx);
      textStack.push({ text: parsed.text, fontSize: 9 });
    }

    let block: any;
    if (banner.logoPosition === 'top') {
      // Logo sopra, testo sotto — stack verticale
      const items: any[] = [];
      if (banner.logo) items.push({ image: banner.logo, width: logoWidth, alignment, margin: [0, 0, 0, 5] });
      if (textStack.length) {
        const textCol = { stack: textStack, width: banner.textWidth, alignment: 'center' };
        if (banner.textWidth) {
          if (alignment === 'center') {
            items.push({ columns: [{ width: '*', text: '' }, textCol, { width: '*', text: '' }] });
          } else if (alignment === 'right') {
            items.push({ columns: [{ width: '*', text: '' }, textCol] });
          } else {
            items.push(textCol);
          }
        } else {
          items.push({ stack: textStack, alignment: 'center' });
        }
      }
      block = items.length ? { stack: items } : null;
    } else {
      // Logo a sinistra, testo a destra — colonne (default)
      const innerColumns: any[] = [];
      if (banner.logo) innerColumns.push({ image: banner.logo, width: logoWidth, margin: [0, banner.logoMarginTop ?? 0, 0, 0] });
      if (textStack.length) innerColumns.push({ stack: textStack, width: banner.textWidth ?? 'auto' });
      if (!innerColumns.length) return [];
      const innerBlock = { columns: innerColumns, width: 'auto', columnGap: 10 };
      if (alignment === 'center') {
        block = { columns: [{ width: '*', text: '' }, innerBlock, { width: '*', text: '' }] };
      } else if (alignment === 'right') {
        block = { columns: [{ width: '*', text: '' }, innerBlock] };
      } else {
        block = innerBlock;
      }
    }

    if (!block) return [];
    const margin = [40, 20, 40, 10];
    return [{ ...block, margin }];
  }

  async createPDF(req, res, config, labels, resource?) {
    try {
      const locale = req.query?.locale || '';
      const body = JSON.parse(req.body);
      const result = resource ?? await new getResourceController().searchResource(body, config, locale as string);
      const pdfContent = await this.addContent(result, config, body.type, labels, locale as string);

      let headerFn: ((page: number, pageCount: number, pageSize: any) => any) | undefined;
      let footerFn: ((page: number, pageCount: number, pageSize: any) => any) | undefined;
      const banner = pdfContent.pageBanner;
      if (banner) {
        const makeFn = (content: any[], isFooter: boolean) => (page: number, _: number, pageSize: any) => {
          if (banner.pages === 'first' && page !== 1) return null;
          const contentClone: any[] = JSON.parse(JSON.stringify(content));
          if (banner.separator) {
            const sep = { canvas: [{ type: 'line', x1: 0, y1: 0, x2: pageSize.width, y2: 0, lineWidth: 0.5, lineColor: '#000000' }], margin: isFooter ? [0, 0, 0, 0] : [0, 8, 0, 0] };
            return { stack: isFooter ? [sep, ...contentClone] : [...contentClone, sep] };
          }
          return { stack: contentClone };
        };
        if (banner.position === 'top'    || banner.position === 'both') {
          headerFn = makeFn(await this.buildBannerContent(banner, locale as string, false, pdfContent), false);
        }
        if (banner.position === 'bottom' || banner.position === 'both') {
          footerFn = makeFn(await this.buildBannerContent(banner, locale as string, true, pdfContent), true);
        }
      }

      const binary = await createPdfBinary(pdfContent, headerFn, footerFn, banner?.bannerHeight, banner?.footerBannerHeight);
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
