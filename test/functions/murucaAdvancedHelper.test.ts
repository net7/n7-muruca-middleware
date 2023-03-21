
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const expect = require('chai').expect;
const nock = require('nock');
import * as ASHelper from '../../src/helpers/advanced-helper';



describe('Advanced search helpers', function commonHelpersTest() {
  /*beforeEach(() => {
    nock('http://net7mock.com')
      .post('/advanced_search')
      .reply(200, response);
  })*/

  context('Get Sort params for ES query', function () {

    const config_new = {      
        "section": ["record-type-label.keyword", "slug.keyword"],
        "slug": ["slug.keyword"]   
    }
    
    const config_old = 
     [
        "slug.keyword",
        "record-type-label.keyword slug.keyword"
      ]
    
    
    const sort_old_param = "slug.keyword_ASC";
    const sort_old_param_desc = "slug.keyword_DESC";
    const sort_new_param = "section_ASC";
    const sort_new_param_desc = "section_DESC";
    
    it('should return a sort object on slug.keyword ASC', async function () {
      let sortObj = ASHelper.buildSortParam(sort_old_param, config_old);
      expect(sortObj).to.have.property("slug.keyword").eq("ASC");
    }); 
    
    it('should return a sort object on _score', async function () {
      let sortObj = ASHelper.buildSortParam("_score", config_old);
      expect(sortObj[0]).eq("_score");
    }); 
    
    it('should return a sort object on _score', async function () {
      let sortObj = ASHelper.buildSortParam("sort_ASC", config_old);
      expect(sortObj[0]).eq("_score");
    }); 
    
    it('should return a sort object on slug.keyword ASC', async function () {
      let sortObj = ASHelper.buildSortParam(sort_old_param, config_old);
      expect(sortObj).to.have.property("slug.keyword").eq("ASC");
    }); 
    
    it('should return a sort object on slug.keyword DESC', async function () {
      let sortObj = ASHelper.buildSortParam(sort_old_param_desc, config_old);
      expect(sortObj).to.have.property("slug.keyword").eq("DESC");
    }); 
    
    it('should return a sort object on record-type-label.keyword And slug.keyword ASC', async function () {
      let sortObj = ASHelper.buildSortParam(sort_new_param, config_new);
      expect(sortObj).to.have.property("record-type-label.keyword").eq("ASC");
      expect(sortObj).to.have.property("slug.keyword").eq("ASC");
    }); 
    it('should return a sort object on record-type-label.keyword And slug.keyword DESC', async function () {
      let sortObj = ASHelper.buildSortParam(sort_new_param_desc, config_new);
      expect(sortObj).to.have.property("record-type-label.keyword").eq("DESC");
      expect(sortObj).to.have.property("slug.keyword").eq("DESC");
    }); 
    
    
  })
  
  context('Get span near ES query', function () {

    const config_new = {      
        "section": ["record-type-label.keyword", "slug.keyword"],
        "slug": ["slug.keyword"]   
    }
    
    const config_old = 
     [
        "slug.keyword",
        "record-type-label.keyword slug.keyword"
      ]
    
    
    it('should return a span near query', async function () {
      let spanNear = ASHelper.spanNear({
        fields: "text",
        value: "amor",
        distance: +"3",
    });
      expect(spanNear.span_near).to.have.property("clauses").with.lengthOf(1);
      expect(spanNear.span_near).to.have.property("slop").eq(3);
      expect(spanNear.span_near).to.have.property("in_order").eq(true);
    });    

    it('should return a span near with two terms query', async function () {
      let spanNear = ASHelper.spanNear({
        fields: "text",
        value: "lorem* impsum",
        distance: +"3",
    });
      expect(spanNear.span_near).to.have.property("clauses").with.lengthOf(2);
      const clause0 = spanNear.span_near.clauses[0];
      expect(clause0).to.have.property("span_multi").to.have.property("match").to.have.property("wildcard");
      const wildcard0 = clause0.span_multi.match.wildcard;      
      expect(wildcard0).to.have.property("text").eq("lorem*");
      
      const clause1 = spanNear.span_near.clauses[1];
      expect(clause1).to.have.property("span_multi").to.have.property("match").to.have.property("wildcard");
      const wildcard1 = clause1.span_multi.match.wildcard;      
      expect(wildcard1).to.have.property("text").eq("impsum");    
      
    });    
    
    it('should return a span near with in_order false', async function () {
      let spanNear = ASHelper.spanNear({
        fields: "text",
        value: "lorem* impsum",
        distance: +"3",
        in_order: false
    });
      expect(spanNear.span_near).to.have.property("in_order").eq(false)
      
    });    
    

    
  })


})
