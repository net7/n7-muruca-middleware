export interface Input {
  /** Data array from the Wordpress endpoint */
  data: any;
  options?: object;
};

export default interface Parser {
  parse: (input: Input) => object;
}
