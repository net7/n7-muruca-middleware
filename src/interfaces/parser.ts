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

export interface Input {
  /** Data array from the Wordpress endpoint */
  data: any;
  options?: (HomeOptions | ResourceOptions | SearchOptions);
};

export default interface Parser {
  parse: (input: Input) => object;
}
