import { Client } from '@elastic/elasticsearch';
import { advancedSearchController } from '../../src/controllers/advancedSearch.controller';
import { testIndexMapping } from '../config/test-index-mapping';
import { testDocument } from '../config/test-document';
import { testSearchBodies } from '../config/test-search-bodies';
import config from '../config/';

const expect = require('chai').expect;

describe('advancedSearchController - Functional Tests', () => {
  let controller: advancedSearchController;
  let elasticClient: Client;
  const testIndex = 'test_search_index';

  before(async () => {
    // Configurazione del client Elasticsearch
    elasticClient = new Client({ node: 'http://localhost:9200' });
    
    // Creazione dell'indice di test con il mapping e inserimento dei dati
    await setupTestIndex(elasticClient, testIndex);

    controller = new advancedSearchController();
  });

  after(async () => {
    // Pulizia: eliminazione dell'indice di test
    await elasticClient.indices.delete({ index: testIndex });
    await elasticClient.close();
  });

  it('Search result: text simple', async () => {
    const testConfig = {
      searchIndex: testIndex,
      elasticUri: 'http://localhost:9200',
      teiPublisherUri: 'http://localhost:8080',
      configurations: config, // Aggiungi le configurazioni necessarie
      defaultLang: 'en'
    };
    
    const result = await controller.search(testSearchBodies.textSimple.body, testConfig);
    expect(result).to.be.an('object');
    if ('error' in result) {
      throw new Error(`Unexpected error: ${result.error}`);
    }
    // Aggiungi qui le asserzioni specifiche per result1
    expect(result.results).to.be.an('array');
    expect(result.results.length).to.equal(1); // Modifica il valore atteso se necessario
    
    const firstResult = result.results[0];
    expect(firstResult.highlights).to.be.an('array');
    expect(firstResult.highlights.length).to.equal(1); // Modifica il valore atteso se necessario
    
    const highlight = firstResult.highlights[0];

    expect(highlight).to.have.property('xpath');
    expect(highlight.xpath).to.equal("tei:text/tei:body[1]/tei:div[1]"); // Modifica il valore atteso se necessario

    expect(highlight).to.have.property('text');
  
    expect(highlight.text).to.equal(testSearchBodies.textSimple.expectedResponse.results[0].highlights[0].text); // Modifica il valore atteso se necessario

    expect(firstResult.highlightsTitle).to.equal(testSearchBodies.textSimple.expectedResponse.results[0].highlightsTitle); // Modifica il valore atteso se necessario
    expect(firstResult.title).to.equal(testSearchBodies.textSimple.expectedResponse.results[0].title); // Modifica il valore atteso se necessario  
    expect(firstResult.routeId).to.equal(testSearchBodies.textSimple.expectedResponse.results[0].routeId); // Modifica il valore atteso se necessario
    expect(firstResult.slug).to.equal(testSearchBodies.textSimple.expectedResponse.results[0].slug); // Modifica il valore atteso se necessario
    expect(firstResult.id).to.equal(testSearchBodies.textSimple.expectedResponse.results[0].id); // Modifica il valore atteso se necessario
    
  });
  
  it('Search result: simple quote', async () => {
    const testConfig = {
      searchIndex: testIndex,
      elasticUri: 'http://localhost:9200',
      teiPublisherUri: 'http://localhost:8080',
      configurations: config, // Aggiungi le configurazioni necessarie
      defaultLang: 'en'
    };
    
    const result = await controller.search(testSearchBodies.quoteSimple.body, testConfig);
    expect(result).to.be.an('object');
    if ('error' in result) {
      throw new Error(`Unexpected error: ${result.error}`);
    }
    // Aggiungi qui le asserzioni specifiche per result1
    expect(result.results).to.be.an('array');
    expect(result.results.length).to.equal(1); // Modifica il valore atteso se necessario

    const firstResult = result.results[0];
    expect(firstResult.highlights).to.be.an('array');
    expect(firstResult.highlights.length).to.equal(1); // Modifica il valore atteso se necessario
    
    const highlight = firstResult.highlights[0];

    expect(highlight).to.have.property('xpath');
    expect(highlight.xpath).to.equal("tei:text/tei:body[1]/tei:div[1]"); // Modifica il valore atteso se necessario

    expect(highlight).to.have.property('text');
    expect(highlight.text).to.equal(testSearchBodies.quoteSimple.expectedResponse.results[0].highlights[0].text); // Modifica il valore atteso se necessario

    expect(firstResult.highlightsTitle).to.equal(testSearchBodies.quoteSimple.expectedResponse.results[0].highlightsTitle); // Modifica il valore atteso se necessario
    expect(firstResult.tei_doc).to.equal(testSearchBodies.quoteSimple.expectedResponse.results[0].tei_doc); // Modifica il valore atteso se necessario
    expect(firstResult.title).to.equal(testSearchBodies.quoteSimple.expectedResponse.results[0].title); // Modifica il valore atteso se necessario  
    expect(firstResult.routeId).to.equal(testSearchBodies.quoteSimple.expectedResponse.results[0].routeId); // Modifica il valore atteso se necessario
    expect(firstResult.slug).to.equal(testSearchBodies.quoteSimple.expectedResponse.results[0].slug); // Modifica il valore atteso se necessario
    expect(firstResult.id).to.equal(testSearchBodies.quoteSimple.expectedResponse.results[0].id); // Modifica il valore atteso se necessario
    
  });
  
  it('Search result: quote in quote', async () => {
    const testConfig = {
      searchIndex: testIndex,
      elasticUri: 'http://localhost:9200',
      teiPublisherUri: 'http://localhost:8080',
      configurations: config, // Aggiungi le configurazioni necessarie
      defaultLang: 'en'
    };
    
    const result = await controller.search(testSearchBodies.quoteInQuote.body, testConfig);
    expect(result).to.be.an('object');
    if ('error' in result) {
      throw new Error(`Unexpected error: ${result.error}`);
    }
    // Aggiungi qui le asserzioni specifiche per result1
    expect(result.results).to.be.an('array');
    expect(result.results.length).to.equal(1); // Modifica il valore atteso se necessario
    
    const firstResult = result.results[0];
    expect(firstResult.highlights).to.be.an('array');
    expect(firstResult.highlights.length).to.equal(1); // Modifica il valore atteso se necessario
    
    const highlight = firstResult.highlights[0];

    expect(highlight).to.have.property('xpath');
    expect(highlight.xpath).to.equal("tei:text/tei:body[1]/tei:div[1]"); // Modifica il valore atteso se necessario

    expect(highlight).to.have.property('text');
    expect(highlight.text).to.equal(testSearchBodies.quoteInQuote.expectedResponse.results[0].highlights[0].text); // Modifica il valore atteso se necessario

    expect(firstResult.highlightsTitle).to.equal(testSearchBodies.quoteInQuote.expectedResponse.results[0].highlightsTitle); // Modifica il valore atteso se necessario
    expect(firstResult.tei_doc).to.equal(testSearchBodies.quoteSimple.expectedResponse.results[0].tei_doc); // Modifica il valore atteso se necessario
    expect(firstResult.title).to.equal(testSearchBodies.quoteInQuote.expectedResponse.results[0].title); // Modifica il valore atteso se necessario  
    expect(firstResult.routeId).to.equal(testSearchBodies.quoteInQuote.expectedResponse.results[0].routeId); // Modifica il valore atteso se necessario
    expect(firstResult.slug).to.equal(testSearchBodies.quoteInQuote.expectedResponse.results[0].slug); // Modifica il valore atteso se necessario
    expect(firstResult.id).to.equal(testSearchBodies.quoteInQuote.expectedResponse.results[0].id); // Modifica il valore atteso se necessario
    
  });
  
  it('Search result: quote in between quote', async () => {
    const testConfig = {
      searchIndex: testIndex,
      elasticUri: 'http://localhost:9200',
      teiPublisherUri: 'http://localhost:8080',
      configurations: config, // Aggiungi le configurazioni necessarie
      defaultLang: 'en'
    };
    
    const result = await controller.search(testSearchBodies.quoteInBetweenQuote.body, testConfig);
    expect(result).to.be.an('object');
    if ('error' in result) {
      throw new Error(`Unexpected error: ${result.error}`);
    }
    // Aggiungi qui le asserzioni specifiche per result1
    expect(result.results).to.be.an('array');
    expect(result.results.length).to.equal(1); // Modifica il valore atteso se necessario
    
    const firstResult = result.results[0];
    expect(firstResult.highlights).to.be.an('array');
    expect(firstResult.highlights.length).to.equal(1); // Modifica il valore atteso se necessario
    
    const highlight = firstResult.highlights[0];

    expect(highlight).to.have.property('xpath');
    expect(highlight.xpath).to.equal("tei:text/tei:body[1]/tei:div[1]"); // Modifica il valore atteso se necessario

    expect(highlight).to.have.property('text');
    expect(highlight.text).to.equal(testSearchBodies.quoteInBetweenQuote.expectedResponse.results[0].highlights[0].text); // Modifica il valore atteso se necessario

    expect(firstResult.highlightsTitle).to.equal(testSearchBodies.quoteInBetweenQuote.expectedResponse.results[0].highlightsTitle); // Modifica il valore atteso se necessario
    expect(firstResult.tei_doc).to.equal(testSearchBodies.quoteInBetweenQuote.expectedResponse.results[0].tei_doc); // Modifica il valore atteso se necessario
    expect(firstResult.title).to.equal(testSearchBodies.quoteInBetweenQuote.expectedResponse.results[0].title); // Modifica il valore atteso se necessario  
    expect(firstResult.routeId).to.equal(testSearchBodies.quoteInBetweenQuote.expectedResponse.results[0].routeId); // Modifica il valore atteso se necessario
    expect(firstResult.slug).to.equal(testSearchBodies.quoteInBetweenQuote.expectedResponse.results[0].slug); // Modifica il valore atteso se necessario
    expect(firstResult.id).to.equal(testSearchBodies.quoteInBetweenQuote.expectedResponse.results[0].id); // Modifica il valore atteso se necessario
    
  });
  
  it('Search result: quote multiple', async () => {
    const testConfig = {
      searchIndex: testIndex,
      elasticUri: 'http://localhost:9200',
      teiPublisherUri: 'http://localhost:8080',
      configurations: config, // Aggiungi le configurazioni necessarie
      defaultLang: 'en'
    };
    
    const result = await controller.search(testSearchBodies.multipleQuotes.body, testConfig);
    expect(result).to.be.an('object');
    if ('error' in result) {
      throw new Error(`Unexpected error: ${result.error}`);
    }
    // Aggiungi qui le asserzioni specifiche per result1
    expect(result.results).to.be.an('array');
    expect(result.results.length).to.equal(1); // Modifica il valore atteso se necessario
    
    const firstResult = result.results[0];
    expect(firstResult.highlights).to.be.an('array');
    expect(firstResult.highlights.length).to.equal(1); // Modifica il valore atteso se necessario
    
    const highlight = firstResult.highlights[0];

    expect(highlight).to.have.property('xpath');
    expect(highlight.xpath).to.equal("tei:text/tei:body[1]/tei:div[1]"); // Modifica il valore atteso se necessario

    expect(highlight).to.have.property('text');
    expect(highlight.text).to.equal(testSearchBodies.multipleQuotes.expectedResponse.results[0].highlights[0].text); // Modifica il valore atteso se necessario

    expect(firstResult.highlightsTitle).to.equal(testSearchBodies.multipleQuotes.expectedResponse.results[0].highlightsTitle); // Modifica il valore atteso se necessario
    expect(firstResult.tei_doc).to.equal(testSearchBodies.multipleQuotes.expectedResponse.results[0].tei_doc); // Modifica il valore atteso se necessario
    expect(firstResult.title).to.equal(testSearchBodies.multipleQuotes.expectedResponse.results[0].title); // Modifica il valore atteso se necessario  
    expect(firstResult.routeId).to.equal(testSearchBodies.multipleQuotes.expectedResponse.results[0].routeId); // Modifica il valore atteso se necessario
    expect(firstResult.slug).to.equal(testSearchBodies.multipleQuotes.expectedResponse.results[0].slug); // Modifica il valore atteso se necessario
    expect(firstResult.id).to.equal(testSearchBodies.multipleQuotes.expectedResponse.results[0].id); // Modifica il valore atteso se necessario
    
  });
  
  
  it('Search result: quote in source', async () => {
    const testConfig = {
      searchIndex: testIndex,
      elasticUri: 'http://localhost:9200',
      teiPublisherUri: 'http://localhost:8080',
      configurations: config, // Aggiungi le configurazioni necessarie
      defaultLang: 'en'
    };

   
    const result = await controller.search(testSearchBodies.quoteInSource.body, testConfig);

    expect(result).to.be.an('object');
    if ('error' in result) {
      throw new Error(`Unexpected error: ${result.error}`);
    }
    expect(result.limit).to.equal(12);
    expect(result.offset).to.equal(0);
    expect(result.sort).to.equal("sort_ASC");
    expect(result.total_count).to.equal(1);
    expect(result.results).to.be.an('array');
    expect(result.results.length).to.equal(1);
    
    const firstResult = result.results[0];
    expect(firstResult.highlights).to.be.an('array');
    expect(firstResult.highlights.length).to.equal(1);
    
    const highlight = firstResult.highlights[0];
    expect(highlight).to.have.property('link');
    expect(highlight.link).to.be.an('object');
    expect(highlight.link.query_string).to.be.false;

    expect(highlight).to.have.property('xpath');
    expect(highlight.xpath).to.equal(testSearchBodies.quoteInSource.expectedResponse.results[0].highlights[0].xpath);

    expect(highlight).to.have.property('text');
    expect(highlight.text).to.equal(testSearchBodies.quoteInSource.expectedResponse.results[0].highlights[0].text);

    expect(firstResult.highlightsTitle).to.equal(testSearchBodies.quoteInSource.expectedResponse.results[0].highlightsTitle);
    expect(firstResult.tei_doc).to.equal(testSearchBodies.quoteInSource.expectedResponse.results[0].tei_doc);
    expect(firstResult.title).to.equal(testSearchBodies.quoteInSource.expectedResponse.results[0].title);  
    expect(firstResult.routeId).to.equal(testSearchBodies.quoteInSource.expectedResponse.results[0].routeId);
    expect(firstResult.slug).to.equal(testSearchBodies.quoteInSource.expectedResponse.results[0].slug);
    expect(firstResult.id).to.equal(testSearchBodies.quoteInSource.expectedResponse.results[0].id);
  });
  
  it('Search result: quotes in source', async () => {
    const testConfig = {
      searchIndex: testIndex,
      elasticUri: 'http://localhost:9200',
      teiPublisherUri: 'http://localhost:8080',
      configurations: config, // Aggiungi le configurazioni necessarie
      defaultLang: 'en'
    };

   
    const result = await controller.search(testSearchBodies.quotesInSource.body, testConfig);

    expect(result).to.be.an('object');
    if ('error' in result) {
      throw new Error(`Unexpected error: ${result.error}`);
    }
    expect(result.limit).to.equal(12);
    expect(result.offset).to.equal(0);
    expect(result.sort).to.equal("sort_ASC");
    expect(result.total_count).to.equal(1);
    expect(result.results).to.be.an('array');
    expect(result.results.length).to.equal(1);
    
    const firstResult = result.results[0];
    expect(firstResult.highlights).to.be.an('array');
    expect(firstResult.highlights.length).to.equal(1);
    
    const highlight = firstResult.highlights[0];
    expect(highlight).to.have.property('link');
    expect(highlight.link).to.be.an('object');
    expect(highlight.link.query_string).to.be.false;

    expect(highlight).to.have.property('xpath');
    expect(highlight.xpath).to.equal(testSearchBodies.quotesInSource.expectedResponse.results[0].highlights[0].xpath);

    expect(highlight).to.have.property('text');
    const expectedText = normalizeString(testSearchBodies.quotesInSource.expectedResponse.results[0].highlights[0].text || ""); // Ensure it's a string
    const actualText = normalizeString(highlight.text || ""); // Ensure it's a string
    expect(actualText).to.equal(expectedText);

    expect(firstResult.highlightsTitle).to.equal(testSearchBodies.quotesInSource.expectedResponse.results[0].highlightsTitle);
    expect(firstResult.tei_doc).to.equal(testSearchBodies.quoteInSource.expectedResponse.results[0].tei_doc);
    expect(firstResult.title).to.equal(testSearchBodies.quotesInSource.expectedResponse.results[0].title);  
    expect(firstResult.routeId).to.equal(testSearchBodies.quotesInSource.expectedResponse.results[0].routeId);
    expect(firstResult.slug).to.equal(testSearchBodies.quotesInSource.expectedResponse.results[0].slug);
    expect(firstResult.id).to.equal(testSearchBodies.quotesInSource.expectedResponse.results[0].id);
  });

/*
  it('should return error for invalid search', async () => {
    const testConfig = {
      searchIndex: 'non_existent_index',
      elasticUri: 'http://localhost:9200',
      teiPublisherUri: 'http://localhost:8080',
      configurations: {},
      defaultLang: 'en'
    };

    const result = await controller.search(testSearchBodies.invalidSearch, testConfig);

    expect(result).to.deep.equal({error: "error"});
  });
  */
});

async function setupTestIndex(client: Client, index: string) {
  try {
    // Controlla se l'indice esiste prima di tentare di eliminarlo
    

    // Crea l'indice con il mapping specificato
    await client.indices.create({
      index,
      body: testIndexMapping
    });

    // Inserisci il documento di test nell'indice
    await client.index({
      index,
      id: 'test_document_id',
      body: testDocument
    });

    // Inserisci i dati aggiuntivi nell'indice, se necessario
    if (Array.isArray(testDocument)) {
      for (const document of testDocument) {
        await client.index({
          index,
          body: document
        });
      }
    }

    await client.indices.refresh({ index });
  } catch (error) {
    console.error('Error setting up test index:', error);
  }
}

function normalizeString(str: string): string {
    return str
        .replace(/\n/g, ' ') // Sostituisce i ritorni a capo con uno spazio
        .replace(/\t/g, ' ') // Sostituisce i tab con uno spazio
        .replace(/ +/g, ' ') // Riduce gli spazi multipli a uno solo
        .trim(); // Rimuove gli spazi all'inizio e alla fine
}

