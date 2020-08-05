export interface Input {
  options?: any;
  searchId?: string;
  type?: string;
  /** Array of ordered keys to sort the returned object */
  keyOrder?: string[];
  page?: string;
  /** Data array from the Wordpress endpoint */
  data: any;
  /** Configuration object for the parsed layout */
  conf?: any;
};

export default interface Parser {
  parse: (input: Input) => object;
}
