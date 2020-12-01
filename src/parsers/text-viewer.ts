import Parser, { Input } from '../interfaces/parser';

export class TextViewerParser implements Parser {
  parse({ data }: Input) {
    return {
      endpoint: 'http://staging.teipublisher.netseven.it/exist/apps/tei-publisher',
      doc: {
        xml: ['test/seniles.xml'],
        odd: 'muruca',
        id: ['seniles']
      }
    }
  }
}
