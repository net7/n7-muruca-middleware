/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const expect = require('chai').expect;
const nock = require('nock');
import { config } from 'process';
import { ESHelper } from '../../src/helpers/es-helper';

describe('Common Helpers', function commonHelpersTest() {
  /*beforeEach(() => {
    nock('http://net7mock.com')
      .post('/advanced_search')
      .reply(200, response);
  })*/

  context('Get Elasticsearch filter Aggregation', function () {
    const config = {
      nested: false,
      search: 'slug.keyword',
      title: 'slug.keyword',
      innerFilterField: ['title'],
      global: true,
      sort: 'term',
      generalFilter: {
        fields: ['record_type'],
        value: 'work',
      },
    };

    it('should return a filter with one must condition', async function () {
      let filter = ESHelper.buildAggsFilter('', config);
      expect(filter)
        .to.have.property('bool')
        .to.have.property('must')
        .with.lengthOf(1);
    });

    it('should return a filter with two must condition', async function () {
      let filter = ESHelper.buildAggsFilter('term', config);
      expect(filter)
        .to.have.property('bool')
        .to.have.property('must')
        .with.lengthOf(2);
    });
  });

  context('Get Elasticsearch term query', function () {
    const config = {
      nested: false,
      search: 'slug.keyword',
      title: 'slug.keyword',
      innerFilterField: ['title'],
      global: true,
      sort: 'term',
      generalFilter: {
        fields: ['record_type'],
        value: 'work',
      },
    };

    const filter_query = {
      bool: {
        must: [],
      },
    };

    const extra = {
      lat: 'cadastral_unit.geolocation.markers.lat',
      lon: 'cadastral_unit.geolocation.markers.lng',
    };
    it('should return a term aggregation', async function () {
      let query = ESHelper.buildTerm(config, 50, null, '', false, null);
      expect(query).to.have.property('terms');
      expect(query).to.have.property('terms').to.have.property('size').eq(50);
      expect(query).to.have.property('terms').to.have.property('script');
    });

    it('should return a global term aggregation', async function () {
      let query = ESHelper.buildTerm(config, 50, null, '', true, null);
      expect(query).to.have.property('global');
      expect(query).to.have.property('aggs').to.have.property('term');
      expect(query).to.have.property('aggs').to.have.property('distinctTerms');
      const term_aggr = query['aggs']['term'];
      expect(term_aggr).to.have.property('terms').to.have.property('script');
    });

    it('should return a term aggregation with filter', async function () {
      let query = ESHelper.buildTerm(config, 50, null, '', false, filter_query);
      expect(query).to.have.property('filter');
      expect(query).to.have.property('aggs').to.have.property('distinctTerms');
      const term_aggr = query['aggs']['term'];
      expect(term_aggr).to.have.property('terms').to.have.property('script');
    });

    it('should return a global term aggregation with filter term', async function () {
      let query = ESHelper.buildTerm(config, 50, null, '', true, filter_query);
      expect(query).to.have.property('global');
      expect(query).to.have.property('aggs').to.have.property('term');
      expect(query).to.have.property('aggs').to.have.property('distinctTerms');
      expect(query)
        .to.have.property('aggs')
        .to.have.property('term')
        .to.have.property('filter');
      const filter = query['aggs']['term']['filter'];
      expect(filter).to.have.property('bool');
      const term_aggr = query['aggs']['term']['aggs']['term'];
      expect(term_aggr).to.have.property('terms').to.have.property('script');
    });
  });
});
