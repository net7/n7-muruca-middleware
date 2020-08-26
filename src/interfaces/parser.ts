export interface SearchOptions {
  keyOrder?: string[];
  searchId: string;
  conf: any;
  limit: number;
  page: number;
  sort: string;
  total_count: number;
  type: string;
  facets: string[];
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

export interface Input {
  data: any;
  options?: (HomeOptions | ResourceOptions | SearchOptions | StaticPageOptions);
};

export default interface Parser {
  parse: (input: Input) => object;
}
