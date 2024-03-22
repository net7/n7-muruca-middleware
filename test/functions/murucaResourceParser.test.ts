const expect = require('chai').expect;
import { ResourceParser } from '../../src/parsers/resource';
import { data, dataEmpty, dataParseMetadata } from '../mocks/resource/resourceParserMockData';
import editionConfig from '../config/edition_config';
import { ConfBlock, ConfBlockTextViewer, OutputBibliography, OutputBreadcrumbs, OutputCollection, OutputHeader, OutputImageViewer, OutputMetadata, OutputMetadataItem, OutputTextViewer } from '../../src/interfaces';
import { parsed } from '../mocks/resource/resourceParserMockResults';
import editionConfigParseMetadata, { expectedResults } from '../config/edition_config_parseMetaData';

describe('Resource parser', function murucaResourceParser() {
    
    const parser = new ResourceParser();

    context('Parse empty data', function () {
      it('should return the expected empty result in the case of empty data', async function () {
        let result = parser.parse( {data: dataEmpty, options: {...editionConfig, type: "edition" }}, "en");
        expect(result).to.have.property("title");
        expect(result.title).eq("");
        expect(result).to.have.property("sections")
        expect(result.sections).to.deep.equal({});
      });
    });
  
    context('parseTitle function', function () {
      it('should return the correctly parsed title', async function () {
        let result: string = parser.parseTitle(editionConfig["title"] as ConfBlock, data);
        expect(result).to.be.a("string");
        expect(result).to.be.eq(parsed.title);
      });
    });
    
    context('parseMetadata function', function () {
      it('should return the correctly parsed metadata section', async function () {
        let result: OutputMetadata = parser.parseMetadata(editionConfig["metadata"] as ConfBlock, data, "edition");
        expect(result).to.be.deep.equal(parsed.sections["metadata"])
      });
    });

    context('parseHeader function', function () {
      it('should return the correctly parsed header section', async function () {
        let result: OutputHeader = parser.parseHeader(editionConfig["header"] as ConfBlock, data);
        expect(result).to.be.deep.equal(parsed.sections["header"])
      });
    });

    context('parseImageViewer function', function () {
      it('should return the correctly parsed ImageViewer section', async function () {
        let result: OutputImageViewer = parser.parseImageViewer(editionConfig["image-viewer"] as ConfBlock, data);
        expect(result).to.be.deep.equal(parsed.sections["image-viewer"])
      });
    });

    context('parseBreadcrumbs function', function () {
      it('should return the correctly parsed breadcrumbs section', async function () {
        let result: OutputBreadcrumbs = parser.parseBreadcrumbs(editionConfig["breadcrumb"] as ConfBlock, data, "edition");
        expect(result).to.be.deep.equal(parsed.sections["breadcrumb"])
      });
    });

    context('parseCollection function', function () {
      it('should return the correctly parsed collections sections', async function () {
        let resultReferencedBy: OutputCollection = parser.parseCollection(editionConfig["collection-referencedBy"] as ConfBlock, data);
        let resultIsPartOf: OutputCollection = parser.parseCollection(editionConfig["collection-isPartOf"] as ConfBlock, data);
        let resultReferences: OutputCollection = parser.parseCollection(editionConfig["collection-references"] as ConfBlock, data);
        expect(resultReferencedBy).to.be.deep.equal(parsed.sections["collection-referencedBy"]);
        expect(resultIsPartOf).to.be.deep.equal(parsed.sections["collection-isPartOf"]);
        expect(resultReferences).to.be.deep.equal(parsed.sections["collection-references"]);
      });
    });
    
    context('parseBibliography function', function () {
      it('should return the correctly parsed bibliography collection', async function () {
        let result: OutputBibliography = parser.parseBibliography(editionConfig["collection-bibliography"] as ConfBlock, data);
        expect(result).to.have.property("items");
        result.items.forEach((item)=>{
          expect(item).to.have.property("payload");
        })
        expect(result).to.be.deep.equal(parsed.sections["collection-bibliography"]);
      });
    });
    
    context('parseTextViewer function', function () {
      it('should return the correctly parsed TextViewer section', async function () {
        let result: OutputTextViewer = parser.parseTextViewer(editionConfig["text-viewer"] as ConfBlockTextViewer, data);
        expect(result).to.be.deep.equal(parsed.sections["text-viewer"]);
      });
    });
    
  
    context('Parse full data', function () {
      it('should return the expected result in the case of a correct data input', async function () {
        let result = parser.parse( {data: data, options: {conf: editionConfig, type: "edition" }}, "en");
        expect(result).to.deep.equal(parsed);
      });
    });

    context('Metadata value parser', function () {
      it('should parse all the value correctly', async function () {
        let result = parser.parseMetadata(editionConfigParseMetadata["metadata"] as ConfBlock, dataParseMetadata, "edition");
        expect(result).to.deep.equal(expectedResults);
      });
    });
  });
