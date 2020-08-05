export interface Input {
  options?: {
    /** */
    searchId?: string;
    /** */
    type?: string;
    /** Array of ordered keys to sort the returned object */
    keyOrder?: string[];
    /** */
    page?: string;
    /** Configuration object for the parsed layout */
    conf?: any;
  };
  /** Data array from the Wordpress endpoint */
  data: any;
};

export default interface Parser {
  parse: (input: Input) => object;
}
