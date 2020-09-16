import Parser from "../interfaces/parser";

export class FooterParser implements Parser {
  parse(data: any, options?: { conf: object }) {
    return {
      columns: [
        ...data,
        ...options?.conf ? [{
          classes: 'n7-footer__muruca-promo',
          text: "This project is powered by Muruca, a platform designed and developed by Net7, Pisa, Italy.<br><a href='http://www.muruca.org/' target='_blank'>www.muruca.org</a>, <a href='http://www.netseven.it' target='_blank'>www.netseven.it</a>",
          images: [
            {
              url: '/assets/logo-muruca-footer.png',
              alttext: 'Muruca digital library platform',
              anchor: {
                href: 'https://www.muruca.org'
              }
            },
            {
              url: '/assets/logo-net7.png',
              alttext: 'Net7 Pisa',
              anchor: {
                href: 'https://www.netseven.it'
              }
            }
          ]
        }] : []
      ]};
  }
}
