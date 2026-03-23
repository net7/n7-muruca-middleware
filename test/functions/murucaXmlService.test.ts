/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const expect = require('chai').expect;
const nock = require('nock');
import { XmlService } from '../../src/services/xml';
const xmlService = new XmlService();

const html_enity_text =
  'Neque vero aliter esse posse persuadeo michi tali hospite, <name type="person" key="Acciaiuoli Niccol&#xF2; (Mecenate)">Mecenate</name> illo nostrum omnium, tali hoc animo tuo, tali denique et tam fido tuarum virtutum tamque individuo comitatu.';

context('decode html entity', function () {
  it('should return a html string without encoded entities', async function () {
    let decoded_text: String = xmlService.decodeEntity(html_enity_text);
    expect(decoded_text).eq(
      'Neque vero aliter esse posse persuadeo michi tali hospite, <name type="person" key="Acciaiuoli Niccolò (Mecenate)">Mecenate</name> illo nostrum omnium, tali hoc animo tuo, tali denique et tam fido tuarum virtutum tamque individuo comitatu.',
    );
  });
});

const baseXml = `<TEI><text><body><p>В подвигъ иже о тексте и <w type="lexicon">слово</w> конец</p><p>second <cit type="authority" ana="#ref1"><quote>content</quote></cit></p></body></text></TEI>`;

context('replaceHlNodes', function () {
  it('should apply em to matched text in text nodes only (case 1: text match)', function () {
    const nodes = [
      {
        node: 'p',
        xml_text: 'В подвигъ иже о тексте',
        textSnippet: "В <em class='mrc__text-emph'>подвигъ</em> иже",
        _path: [{ node: 'text' }, { node: 'body', position: 0 }, { node: 'p', position: 0 }],
      },
    ];
    const result = xmlService.replaceHlNodes(baseXml, nodes);
    expect(result).to.include('<em class="mrc__text-emph">подвигъ</em>');
    // XML child tags inside the node must be preserved
    expect(result).to.include('<w type="lexicon">слово</w>');
  });

  it('should not apply em inside XML tag attributes (case 1: text match)', function () {
    const nodes = [
      {
        node: 'p',
        xml_text: 'В подвигъ иже о тексте',
        textSnippet: "В <em class='mrc__text-emph'>подвигъ</em> иже",
        _path: [{ node: 'text' }, { node: 'body', position: 0 }, { node: 'p', position: 0 }],
      },
    ];
    const result = xmlService.replaceHlNodes(baseXml, nodes);
    // the type="lexicon" attribute must remain untouched
    expect(result).to.include('type="lexicon"');
  });

  it('should add class mrc__text-emph to node when no highlight (case 2: refs match)', function () {
    const nodes = [
      {
        node: 'cit',
        xml_text: '<quote>content</quote>',
        _attr: { type: 'authority', ana: '#ref1' },
        _path: [
          { node: 'text' },
          { node: 'body', position: 0 },
          { node: 'p', position: 1 },
          { node: 'cit', position: 0 },
        ],
      },
    ];
    const result = xmlService.replaceHlNodes(baseXml, nodes);
    expect(result).to.include('class="mrc__text-emph"');
    // original attributes and children must be preserved
    expect(result).to.include('type="authority"');
    expect(result).to.include('<quote>content</quote>');
  });

  it('should replace innerHTML when highlight is set (case 3: attr match)', function () {
    const attrHighlight = 'content with <em class="mrc__text-emph"><w>term</w></em>';
    const nodes = [
      {
        node: 'p',
        xml_text: 'В подвигъ иже о тексте',
        highlight: attrHighlight,
        _path: [{ node: 'text' }, { node: 'body', position: 0 }, { node: 'p', position: 0 }],
      },
    ];
    const result = xmlService.replaceHlNodes(baseXml, nodes);
    expect(result).to.include(attrHighlight);
  });

  it('should process child before parent, preserving child class in parent innerHTML (mixed)', function () {
    const nodes = [
      {
        // parent: text match on first <p>
        node: 'p',
        xml_text: 'В подвигъ иже о тексте',
        textSnippet: "В <em class='mrc__text-emph'>подвигъ</em> иже",
        _path: [{ node: 'text' }, { node: 'body', position: 0 }, { node: 'p', position: 0 }],
      },
      {
        // child of second <p>: refs match on <cit>
        node: 'cit',
        xml_text: '<quote>content</quote>',
        _attr: { type: 'authority', ana: '#ref1' },
        _path: [
          { node: 'text' },
          { node: 'body', position: 0 },
          { node: 'p', position: 1 },
          { node: 'cit', position: 0 },
        ],
      },
    ];
    const result = xmlService.replaceHlNodes(baseXml, nodes);
    expect(result).to.include('<em class="mrc__text-emph">подвигъ</em>');
    expect(result).to.include('class="mrc__text-emph"');
    expect(result).to.include('<quote>content</quote>');
  });

  it('should skip node gracefully when path does not resolve', function () {
    const nodes = [
      {
        node: 'div',
        xml_text: 'missing',
        textSnippet: "<em class='mrc__text-emph'>missing</em>",
        _path: [{ node: 'text' }, { node: 'body', position: 0 }, { node: 'div', position: 99 }],
      },
    ];
    // should not throw, document returned unchanged
    const result = xmlService.replaceHlNodes(baseXml, nodes);
    expect(result).to.include('В подвигъ иже о тексте');
  });
});
