/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const expect = require('chai').expect;
const nock = require('nock');
import { XmlSearchParser } from '../../src/parsers/xml-search';

describe('XML Text parser', function commonHelpersTest() {
  /*beforeEach(() => {
    nock('http://net7mock.com')
      .post('/advanced_search')
      .reply(200, response);
  })*/

  const parser = new XmlSearchParser();
  const xml_text =
    'Hic, adolescens, materno avo in regnum albanum restituto, ipse sibi <name type="place" key="Roma (Urbe), Palatino">Palatino</name> in monte urbem condidit suoque de nomine <name type="place" key="Roma (Urbe)">Romam</name> dixit primusque ibi regnavit';
  const xml_text2 =
    ' Olim <name type="person" key="Ludwig van Kempen (Socrate)">Socrati</name> meo scribens questus eram quod etatis huius annus ille post millesimum trecentesimum quadragesimus octavus omnibus me prope solatiis vite amicorum mortibus spoliasset; quo dolore – nam memini – questibus et lacrimis cunta compleveram. 2 Quid nunc primo et sexagesimo faciam anno, qui cum cetera ornamenta ferme omnia, tum id quod carissimum unicumque habui, ipsum michi <name type="person" key="Ludwig van Kempen (Socrate)">Socratem</name> eripuit? 3 Nolo per aliorum casus stilum ducere, ne tristis michi fletum renovet memoria et annus hic pestilens – qui illum multis in locis perque hanc maxime <name type="place" key="Gallia Cisalpina">Cisalpinam Galliam</name> non equavit modo, sed vicit quique inter ceteras <name type="place" key="Milano">Mediolanum</name> florentissimam frequentissimamque urbem, his hactenus malis intactam, pene funditus exhausit – me, quod nolim, iterum in querelas neque hac etate neque his studiis neque omnino me dignas cogat. 4 Multa michi tunc permisi que nunc nego. Spero non me flentem cernet amplius fortuna; stabo, si potero; si minus, siccum sternet ac tacitum. Turpior est gemitus quam ruina.';
  const hl_text =
    'Hic, <em class=\'mrc__text-emph\'>adolescens</em>, materno avo in regnum albanum restituto, ipse sibi <name type="place" key="Roma (Urbe), Palatino">Palatino</name> in monte urbem condidit suoque de nomine <name type="place" key="Roma (Urbe)">Romam</name> dixit primusque ibi regnavit';
  const hl_text2 =
    ' Olim <em class=\'mrc__text-emph\'><name type="person" key="Ludwig van Kempen (Socrate)">Socrati</name></em> meo scribens questus eram quod etatis huius annus ille post millesimum trecentesimum quadragesimus octavus omnibus me prope solatiis vite amicorum mortibus spoliasset; quo dolore – nam memini – questibus et lacrimis cunta compleveram. 2 Quid nunc primo et sexagesimo faciam anno, qui cum cetera ornamenta ferme omnia, tum id quod carissimum unicumque habui, ipsum michi <em class=\'mrc__text-emph\'><name type="person" key="Ludwig van Kempen (Socrate)">Socratem</name></em> eripuit? 3 Nolo per aliorum casus stilum ducere, ne tristis michi fletum renovet memoria et annus hic pestilens – qui illum multis in locis perque hanc maxime <name type="place" key="Gallia Cisalpina">Cisalpinam Galliam</name> non equavit modo, sed vicit quique inter ceteras <name type="place" key="Milano">Mediolanum</name> florentissimam frequentissimamque urbem, his hactenus malis intactam, pene funditus exhausit – me, quod nolim, iterum in querelas neque hac etate neque his studiis neque omnino me dignas cogat. 4 Multa michi tunc permisi que nunc nego. Spero non me flentem cernet amplius fortuna; stabo, si potero; si minus, siccum sternet ac tacitum. Turpior est gemitus quam ruina.';
  const xml_source =
    '#livio-ab.urb. 1, 6, 3 | #livio-ab.urb. 1, 7, 3 | #ps.aur.vit.-dvi 1, 4 | #isidoro-orig 15, 1, 55 | #eutropio 1, 1, 1-2';
  const hlNode = {
    _source: {
      node: 'quote',
      xml_text: xml_text,
    },
    highlight: {
      'xml_transcription_texts_json.quote._refs.author': ['Livio'],
      'xml_transcription_texts_json.quote._refs.title': ['Ab urbe cond.'],
      'xml_transcription_texts_json.quote.xml_text': [hl_text],
    },
  };

  const hlNode2 = {
    _source: {
      node: 'p',
      xml_text: xml_text2,
    },
    highlight: {
      'xml_transcription_texts_json.name._attr.key': [
        'Ludwig van Kempen (Socrate)',
        'Ludwig van Kempen (Socrate)',
      ],
    },
  };

  const hit = {
    hits: {
      hits: [hlNode, hlNode],
    },
  };

  const hit2 = {
    hits: {
      hits: [hlNode2, hlNode2],
    },
  };

  const hit3 = {
    hits: {
      hits: [hlNode, hlNode, hlNode2],
    },
  };

  const hit4 = {
    hits: {
      hits: [hlNode, hlNode, {}],
    },
  };

  const innerHits = {
    hits: {
      hits: [
        {
          inner_hits: {
            xml_text: hit,
          },
        },
      ],
    },
  };

  context('Get Highlight texts from ES result', function () {
    it('should return empty array', async function () {
      let hl: {} = parser.parseHighlight({});
      expect(hl).to.not.have.property('highlight');
      expect(hl).to.not.have.property('_source');
    });

    it('should return the xml text value', async function () {
      let hl: {} = parser.parseHighlight(hlNode);
      expect(hl).to.have.property('highlight');
      expect(hl).to.have.property('highlight').eq(hl_text);
    });

    it('should return xml text with attribute highlighted', async function () {
      let hl: {} = parser.parseHighlight(hlNode2);
      expect(hl).to.have.property('highlight');
      expect(hl).to.have.property('highlight').eq(hl_text2);
    });
  });

  context('Get All highlights from ES result', function () {
    it('should return array with 2 values', async function () {
      let hits = parser.parseResponse(hit);
      expect(hits).with.lengthOf(2);
    });
    it('should return array with 2 values', async function () {
      let hits = parser.parseResponse(hit2);
      expect(hits).with.lengthOf(2);
    });
    it('should return array with 2 values', async function () {
      let hits = parser.parseResponse(hit4);
      expect(hits).with.lengthOf(2);
    });
    it('should return array with 2 values', async function () {
      let hits = parser.parseResponse(innerHits);
      expect(hits).with.lengthOf(2);
    });
  });

  context('Get A formatted node', function () {
    it('should return an xml tag with attributes', async function () {
      const node = {
        highlight: hl_text,
        _attr: {
          source: xml_source,
        },
        node: 'quote',
      };
      let xml_node = parser.buildXmlNode(node);
      expect(xml_node).eq(
        "<quote source='" + xml_source + "' >" + hl_text + '</quote>',
      );
    });

    it('should return an xml tag without attributes', async function () {
      const node = {
        highlight: hl_text,
        node: 'quote',
      };
      let xml_node = parser.buildXmlNode(node);
      expect(xml_node).eq('<quote>' + hl_text + '</quote>');
    });

    it('should return an xml tag with more attributes', async function () {
      const node = {
        highlight: hl_text,
        node: 'quote',
        _attr: {
          source: xml_source,
          rend: 'italics',
        },
      };
      let xml_node = parser.buildXmlNode(node);
      expect(xml_node).eq(
        "<quote source='" +
          xml_source +
          "'  rend='italics' >" +
          hl_text +
          '</quote>',
      );
    });

    it('should return an xml tag with xml_text', async function () {
      const node = {
        xml_text: hl_text,
        node: 'quote',
        _attr: {
          source: xml_source,
          rend: 'italics',
        },
      };
      let xml_node = parser.buildXmlNode(node);
      expect(xml_node).eq(
        "<quote source='" +
          xml_source +
          "'  rend='italics'  class='mrc__text-emph' >" +
          hl_text +
          '</quote>',
      );
    });

    it('should return an xml tag with xml_text and mrc_highlight attribute', async function () {
      const node = {
        xml_text: hl_text,
        node: 'quote',
        _attr: {
          source: xml_source,
          rend: 'italics',
        },
      };
      let xml_node = parser.buildXmlNode(node, false);
      expect(xml_node).eq(
        "<quote source='" +
          xml_source +
          "'  rend='italics' >" +
          hl_text +
          '</quote>',
      );
    });
  });
});
