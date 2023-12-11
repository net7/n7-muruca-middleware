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
