
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const expect = require('chai').expect;
const nock = require('nock');
import {HomeParser} from '../../src/parsers';
import response from "../responses/home";
import { Controller } from '../../src';
//const serverless = require("@n7-frontend/serverless");
import config from '../config/';

const controller = new Controller({
  parsers: {home: HomeParser},
    configurations: config,
    baseUrl: "http://net7mock.com/"
})

describe('home rest controller', function murucaHomeCtrlTest() {
    beforeEach(() => {
        nock('http://net7mock.com')
          .get('/layout/home')
          .reply(200, response);
    })
      
    context('input missing - ', function() {
        it('should return a 404', async function() {
            let result = await controller
                .getHomeLayout(null, null, null)
            // Assert
            expect(result.statusCode).to.eq(400);
        });
    });
    
    context('response correct', function() {
        it('should return correct data', async function() {
            let result = await controller
                .getHomeLayout({body:JSON.stringify(["slider-main","content-main","collection-sections","collection-news"])}, null, null)
            const data = JSON.parse(result.body);
            // Assert
            expect(data).to.have.property("slider-main").to.have.property("slides").with.lengthOf(0);
            expect(data).to.have.property("content-main");
            expect(data).to.have.property("collection-news");  
        });
    });
    
})