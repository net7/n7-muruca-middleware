/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const expect = require('chai').expect;
const nock = require('nock');
import { CommonHelper } from '../../src/helpers/common-helper';

describe('Common Helpers', function commonHelpersTest() {
  /*beforeEach(() => {
    nock('http://net7mock.com')
      .post('/advanced_search')
      .reply(200, response);
  })*/

  context('Get Snippet around tags', function () {
    it('should return a snippet of text One word left 30 right', async function () {
      let node_attr = 'key';
      let snippet = 'Ludwig van Kempen (Socrate)';
      let xml_text =
        "Uno <name type=''person' key='Ludwig van Kempen (Socrate)'>Socrati</name> Uno due tre quattro cinque sei sette otto nove dieci Undici dodici tredici quattordici quindici sedici diciassette diciotto diciannove venti Ventuno ventidue ventitré ventiquattro venticinque ventisei ventisette ventotto ventinove trenta Trentuno trentadue trentatré trentaquattro trentacinque trentasei trentasette trentotto trentanove quaranta Quarantuno quarantadue quarantatré quarantaquattro quarantacinque quarantasei quarantasette quarantotto quarantanove cinquanta";
      let hl: string[] = CommonHelper.getSnippetAroundTag(
        node_attr,
        snippet,
        xml_text,
      );
      expect(hl[0].trim()).eq(
        "Uno <name type=''person' key='Ludwig van Kempen (Socrate)'><em class='mrc__text-emph'>Socrati</em></name> Uno due tre quattro cinque sei sette otto nove dieci Undici dodici tredici quattordici quindici sedici diciassette diciotto diciannove venti Ventuno ventidue ventitré ventiquattro venticinque ventisei ventisette ventotto ventinove trenta",
      );
    });

    it('should return a snippet of text 30 word left 30 right', async function () {
      let node_name = 'name';
      let node_attr = 'key';
      let snippet = 'Ludwig van Kempen (Socrate)';
      let xml_text =
        "Uno <name type=''person' key='Ludwig van Kempen (Socrate)'>Socrati</name> Uno due tre quattro cinque sei sette otto nove dieci Undici dodici tredici quattordici quindici sedici diciassette diciotto diciannove venti Ventuno ventidue ventitré ventiquattro venticinque ventisei ventisette ventotto ventinove trenta Trentuno trentadue trentatré trentaquattro trentacinque trentasei trentasette trentotto trentanove quaranta Quarantuno quarantadue quarantatré quarantaquattro quarantacinque quarantasei quarantasette quarantotto quarantanove cinquanta";
      let hl: string[] = CommonHelper.getSnippetAroundTag(
        node_attr,
        snippet,
        xml_text,
      );
      expect(hl[0].trim()).eq(
        "Uno <name type=''person' key='Ludwig van Kempen (Socrate)'><em class='mrc__text-emph'>Socrati</em></name> Uno due tre quattro cinque sei sette otto nove dieci Undici dodici tredici quattordici quindici sedici diciassette diciotto diciannove venti Ventuno ventidue ventitré ventiquattro venticinque ventisei ventisette ventotto ventinove trenta",
      );
    });
    it('should return a snippet of text One word left 30 right', async function () {
      let node_name = 'name';
      let node_attr = 'key';
      let snippet = 'Ludwig van Kempen (Socrate)';
      let xml_text =
        "Uno due tre quattro cinque sei sette otto nove dieci Undici dodici tredici quattordici quindici sedici diciassette diciotto diciannove venti Ventuno ventidue ventitré ventiquattro venticinque ventisei ventisette ventotto ventinove trenta Trentuno trentadue trentatré trentaquattro trentacinque trentasei trentasette trentotto trentanove quaranta Quarantuno quarantadue quarantatré quarantaquattro quarantacinque quarantasei quarantasette quarantotto quarantanove cinquanta <name type=''person' key='Ludwig van Kempen (Socrate)'>Socrati</name> Uno due tre quattro cinque sei sette otto nove dieci Undici dodici tredici quattordici quindici sedici diciassette diciotto diciannove venti Ventuno ventidue ventitré ventiquattro venticinque ventisei ventisette ventotto ventinove trenta Trentuno trentadue trentatré trentaquattro trentacinque trentasei trentasette trentotto trentanove quaranta Quarantuno quarantadue quarantatré quarantaquattro quarantacinque quarantasei quarantasette quarantotto quarantanove cinquanta";
      let hl: string[] = CommonHelper.getSnippetAroundTag(
        node_attr,
        snippet,
        xml_text,
      );
      expect(hl[0].trim()).eq(
        "Ventuno ventidue ventitré ventiquattro venticinque ventisei ventisette ventotto ventinove trenta Trentuno trentadue trentatré trentaquattro trentacinque trentasei trentasette trentotto trentanove quaranta Quarantuno quarantadue quarantatré quarantaquattro quarantacinque quarantasei quarantasette quarantotto quarantanove cinquanta <name type=''person' key='Ludwig van Kempen (Socrate)'><em class='mrc__text-emph'>Socrati</em></name> Uno due tre quattro cinque sei sette otto nove dieci Undici dodici tredici quattordici quindici sedici diciassette diciotto diciannove venti Ventuno ventidue ventitré ventiquattro venticinque ventisei ventisette ventotto ventinove trenta",
      );
    });

    it('should return a snippet with wrong node name', async function () {
      let node_name = 'quote';
      let node_attr = 'key';
      let snippet = 'Ludwig van Kempen (Socrate)';
      let xml_text =
        "Uno due tre quattro cinque sei sette otto nove dieci Undici dodici tredici quattordici quindici sedici diciassette diciotto diciannove venti Ventuno ventidue ventitré ventiquattro venticinque ventisei ventisette ventotto ventinove trenta Trentuno trentadue trentatré trentaquattro trentacinque trentasei trentasette trentotto trentanove quaranta Quarantuno quarantadue quarantatré quarantaquattro quarantacinque quarantasei quarantasette quarantotto quarantanove cinquanta <name type=''person' key='Ludwig van Kempen (Socrate)'>Socrati</name> Uno due tre quattro cinque sei sette otto nove dieci Undici dodici tredici quattordici quindici sedici diciassette diciotto diciannove venti Ventuno ventidue ventitré ventiquattro venticinque ventisei ventisette ventotto ventinove trenta Trentuno trentadue trentatré trentaquattro trentacinque trentasei trentasette trentotto trentanove quaranta Quarantuno quarantadue quarantatré quarantaquattro quarantacinque quarantasei quarantasette quarantotto quarantanove cinquanta";
      let hl: string[] = CommonHelper.getSnippetAroundTag(
        node_attr,
        snippet,
        xml_text,
      );
      expect(hl[0].trim()).eq(
        "Ventuno ventidue ventitré ventiquattro venticinque ventisei ventisette ventotto ventinove trenta Trentuno trentadue trentatré trentaquattro trentacinque trentasei trentasette trentotto trentanove quaranta Quarantuno quarantadue quarantatré quarantaquattro quarantacinque quarantasei quarantasette quarantotto quarantanove cinquanta <name type=''person' key='Ludwig van Kempen (Socrate)'><em class='mrc__text-emph'>Socrati</em></name> Uno due tre quattro cinque sei sette otto nove dieci Undici dodici tredici quattordici quindici sedici diciassette diciotto diciannove venti Ventuno ventidue ventitré ventiquattro venticinque ventisei ventisette ventotto ventinove trenta",
      );
    });
  });

  context('Get xml tag stripped', function () {
    it('should return a text without tags', async function () {
      let node_name = 'name';
      let node_attr = 'key';
      let snippet = 'Ludwig van Kempen (Socrate)';
      let xml_text =
        'La vita è <name>imprevedibile.</name> Accetta gli errori e le sfide, sii coraggioso e non dimenticare di apprezzare le cose belle. La vita è imprevedibile. Accetta gli errori e le sfide, sii coraggioso e non dimenticare di apprezzare le cose belle.';
      let test = CommonHelper.stripTags(xml_text);
      expect(test).eq(
        'La vita è imprevedibile. Accetta gli errori e le sfide, sii coraggioso e non dimenticare di apprezzare le cose belle. La vita è imprevedibile. Accetta gli errori e le sfide, sii coraggioso e non dimenticare di apprezzare le cose belle.',
      );
    });
  });

  context('Get xml snippet', function () {
    it('should return a snippet of text of at least 100 chars and no broken words', async function () {
      let xml_text =
        'La vita è <name>imprevedibile.</name> Accetta gli errori e le sfide, sii coraggioso e non dimenticare di apprezzare le cose belle. La vita è imprevedibile. Accetta gli errori e le sfide, sii coraggioso e non dimenticare di apprezzare le cose belle.';
      let hl = CommonHelper.makeXmlTextSnippet(xml_text);
      expect(hl).eq(
        'La vita è imprevedibile. Accetta gli errori e le sfide, sii coraggioso e non dimenticare di apprezzare',
      );
    });
  });
});
