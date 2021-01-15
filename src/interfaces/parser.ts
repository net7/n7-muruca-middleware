export interface SearchOptions {
  results: { limit: number; offset: number; };
  keyOrder?: string[];
  searchId: string;
  searchGroup: any;
  conf: any;
  limit: number;
  offset: number;
  sort: string;
  total_count: number;
  type: string;
  facets: {
    id: string;
    limit: number;
    offset: number;
    query: string;
  }[];
}

export interface HomeOptions {
  conf: any;
  keyOrder?: string[];
}

export interface ResourceOptions {
  conf: any;
  type: string;
  page?: number;
}

export interface StaticPageOptions {
  slug: string;
}

export interface TranslationOptions {
  lang: string;
}

export interface Input {
  data: any;
  options?: HomeOptions | ResourceOptions | SearchOptions | StaticPageOptions | TranslationOptions;
};

export default interface Parser {
  parse: (input: Input) => object;
}
