/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const expect = require('chai').expect;
const nock = require('nock');
import { AdvancedSearchParser } from '../../src/parsers';
import inner_hits from '../responses/inner_hits';
//const serverless = require("@n7-frontend/serverless");
import config from '../config';

describe('XML search parse results', function murucaHomeCtrlTest() {
  const parser = new AdvancedSearchParser();

  context('Parse xml Paragraph Highlights', function () {
    it('should return highlights for each paragraph', async function () {
      const xpaths = new Set();
      let result = parser.parseHighlightNode(inner_hits[0]);
      expect(result).with.lengthOf(1);
      result = parser.parseHighlightNode(inner_hits[2]);
      expect(result).with.lengthOf(3);
    });
  });

  context('Parse all document Highlights', function () {
    it('should return highlights for each document', async function () {
      const xpaths = new Set();
      let result = parser.buildHighlightObj(inner_hits);
      expect(result).to.have.property('totCount').to.eq(5);
      expect(result)
        .to.have.property('highlights_obj')
        .to.have.property('text.body_0.div_8');
      expect(result)
        .to.have.property('highlights_obj')
        .to.have.property('text.body_0.div_18');

      let ho = result.highlights_obj['text.body_0.div_18'];

      expect(ho.texts).with.lengthOf(4);
    });
  });

  context('Format snippet', function () {
    it('should return highlight snippets', async function () {
      const element = {
        texts: [
          'Mauris sollicitudin fermentum libero.',
          'Phasellus magna.',
          'In turpis.',
        ],
        breadcrumb: "<span class='mrc__text-breadcrumbs'>Liber secundus</span>",
      };
      const text_divider = '<span class="mrc__text-divider"></span>';
      let text = parser.buildFinalHighlightSnippet(element);
      let dividers = text.match(/mrc__text-divider/g);
      expect(dividers).with.lengthOf(2);

      expect(text).eq(
        element.breadcrumb +
          element.texts[0] +
          text_divider +
          element.texts[1] +
          text_divider +
          element.texts[2],
      );
    });
  });

  context('Format attributes snippets', function () {
    it('should return attributes highlight snippets', async function () {
      const element = {
        _source: {
          xml_text:
            "Uno <name type='person' key='Ludwig van Kempen'>Socrati</name> Uno due tre quattro cinque sei sette otto nove dieci Undici dodici tredici quattordici quindici sedici diciassette diciotto diciannove venti Ventuno ventidue ventitré ventiquattro venticinque ventisei ventisette ventotto ventinove trenta Trentuno trentadue trentatré trentaquattro trentacinque trentasei trentasette trentotto trentanove quaranta Quarantuno quarantadue quarantatré quarantaquattro quarantacinque quarantasei quarantasette quarantotto quarantanove cinquanta",
        },
        highlight: {
          'xml_transcription_texts_json.name._attr.key': [
            'Ludwig van Kempen',
            'Ludwig van Kempen',
          ],
        },
      };

      let snippets: string[] = parser.parseAttributeHighlight(
        element,
        'xml_transcription_texts_json.name._attr.key',
      );
      expect(snippets).with.lengthOf(1);
      let prefix =
        "<span class='mrc__text-attr_value'>Voci di autorità: Ludwig van Kempen</span>";
      let snippet =
        "Uno <name type=\"person\" key=\"Ludwig van Kempen\"><em class='mrc__text-emph'>Socrati</em></name> Uno due tre quattro cinque sei sette otto nove dieci Undici dodici tredici quattordici quindici sedici diciassette diciotto diciannove venti Ventuno ventidue ventitré ventiquattro venticinque ventisei ventisette ventotto ventinove trenta";
      expect(snippets[0].trim()).eq(prefix + snippet);
    });
  });

  context('Format references', function () {
    it('should return formatted references', async function () {
      const elements = [
        {
          author: 'Livio',
          title: 'Ab urbe cond.',
        },
        {
          author: 'ps. Aurelio Vittore (Plinio per Petrarca)',
          title: 'De viris illustribus',
        },
        {
          author: 'Eutropio',
        },
      ];

      let ref = parser.parseReferences(elements);

      let snippet =
        'Livio, Ab urbe cond.; ps. Aurelio Vittore (Plinio per Petrarca), De viris illustribus; Eutropio';
      expect(ref).eq(snippet);
    });
  });
});
