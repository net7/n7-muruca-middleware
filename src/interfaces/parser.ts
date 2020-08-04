export default interface Parser {
  parse: (input: { order: any, data: any, config?: any }) => any;
}
