import { Client } from '@elastic/elasticsearch';
import * as fs from 'fs';
import * as path from 'path';

const sourceIndex = 'petrarca'; // Nome dell'indice da cui recuperare il documento
const documentId = '140'; // ID del documento da recuperare
const outputFile = path.join(__dirname, '..', 'test/config', 'test-document.ts');

async function getAndSaveDocument() {
  const client = new Client({ node: 'http://localhost:9200' });

  try {
    console.log(`Tentativo di connessione a Elasticsearch...`);
    await client.ping();
    console.log('Connessione a Elasticsearch riuscita');

    console.log(`Recupero del documento con ID "${documentId}" dall'indice "${sourceIndex}"...`);
    const { body: document } = await client.get({
      index: sourceIndex,
      id: documentId
    });

    if (!document) {
      throw new Error(`Il documento con ID "${documentId}" non esiste nell'indice "${sourceIndex}"`);
    }

    const fileContent = `
export const testDocument = ${JSON.stringify(document._source, null, 2)};
`;

    fs.writeFileSync(outputFile, fileContent);
    console.log(`Documento salvato con successo in ${outputFile}`);
  } catch (error) {
    console.error('Errore nel recupero o salvataggio del documento:', error);
  } finally {
    await client.close();
  }
}

getAndSaveDocument();
