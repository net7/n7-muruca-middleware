const expect = require('chai').expect;
import { ResourceParser } from '../../src/parsers/resource';
import { data, dataEmpty } from '../mocks/resourceParserMockData';


import editionConfig from '../config/edition_config';
import { ConfBlock, OutputBibliography } from '../../src/interfaces';


describe('Parsing the resource data', function murucaResourceParser() {
    
    const parser = new ResourceParser();

    context('Parse empty data', function () {
      it('should return the parsed result in the case of empty data', async function () {
        let result: OutputBibliography = parser.parseBibliography(editionConfig["collection-bibliography"] as ConfBlock, dataEmpty);
        console.log(result);
        expect(result).to.have.property("items");
        result.items.forEach((item)=>{
          expect(item).to.have.property("payload");
        })
      });
    });

  
    context('Bibliography section', function () {
      it('should return the correctly parsed bibliography collection', async function () {
        let result: OutputBibliography = parser.parseBibliography(editionConfig["collection-bibliography"] as ConfBlock, data);
        console.log(result);
        expect(result).to.have.property("items");
        result.items.forEach((item)=>{
          expect(item).to.have.property("payload");
        })
      });
    });
});


