export interface Input {
  /** Data array from the Wordpress endpoint */
  data: any;
  options?: any;
};

export default interface Parser {
  parse: (input: Input) => object;
}
