import Filter from '../interfaces/filter';

export default class TestFilter implements Filter {
  filter(input: any) {
    return input;
  }
}
