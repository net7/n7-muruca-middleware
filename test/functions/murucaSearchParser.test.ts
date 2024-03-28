const expect = require('chai').expect;
import { SearchParser } from '../../src/parsers/search';
import { data } from '../mocks/search/searchParserMockData';
import searchConfig from '../config/search_config';
import { parsedSearch } from '../mocks/search/searchParseMockResults';

describe('Search parser', function murucaResourceParser() {
    
  const parser = new SearchParser();

  const queryParams = {
    results: {
      limit: 12,
      offset: 0,
      sort: "title_ASC",
    },
    searchId: "edition",
  }
  const searchOptions = 
    {
      type: "results",
      offset: 0,
      sort: "title_ASC",
      limit: 12,
      total_count: 3,
      searchId: "edition",
      facets: undefined,
  }
  const options = {
    ...searchOptions,
    conf: searchConfig
  }
/* 
    context('Parse correct data', function () {
      it('should return the correctly parsed result', async function () {
        const expectedResult = parsedSearch
        let result = parser.parse( {data: data, options: options}, queryParams as any);
        expect(result).to.be.deep.equal(expectedResult)
      });
    }); */

    context('Parse single element default', function () {
      it('should return the correctly parsed result', async function () {
        const expectedResultTitle = parsedSearch.results[0].title;
        let resultTitle = parser.parseResultsDefault( data[0]._source, "title");
        expect(resultTitle).to.be.eq(expectedResultTitle);
        const expectedResultSlug = parsedSearch.results[0].slug;
        let resultSlug = parser.parseResultsDefault( data[0]._source, "slug");
        expect(resultSlug).to.be.eq(expectedResultSlug);
        const expectedResultImage = parsedSearch.results[0].image;
        let resultImage = parser.parseResultsDefault( data[0]._source, "thumbnail");
        expect(resultImage).to.be.eq(expectedResultImage);
      });
    });

    context('Parse with function resultsMetadata ', function () {
      it('should return the correctly parsed metadata', async function () {
        const expectedResult = parsedSearch.results[0].metadata[0].items;
        let result = parser.searchResultsMetadata( data[0]._source, ["creator", "spatialCoverage", "temporalCoverage"]);
        expect(result).to.be.deep.equal(expectedResult);
      });
    });

    context('Parse result items with correct data', function () {
      it('should return the correctly parsed result', async function () {
        const expectedResult = parsedSearch;
        let result = parser.parseResults( {data: data, options: options}, queryParams as any, "edition");
        expect(result).to.be.deep.equal(expectedResult)
      });
    });

  
  });
