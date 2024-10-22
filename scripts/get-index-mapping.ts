import { Client } from '@elastic/elasticsearch';
import * as fs from 'fs';
import * as path from 'path';

const sourceIndex = 'petrarca'; // Nome dell'indice da cui recuperare il mapping
const outputFile = path.join(__dirname, '..', 'test/config', 'test-index-mapping.ts');

async function getAndSaveMapping() {
  const client = new Client({ node: 'http://localhost:9200' });

  try {
    const { body: sourceMapping } = await client.indices.getMapping({ index: sourceIndex });
    const mapping = sourceMapping[sourceIndex].mappings;

    const fileContent = `
export const testIndexMapping = {
  mappings: ${JSON.stringify(mapping, null, 2)}
};
`;

    fs.writeFileSync(outputFile, fileContent);
    console.log(`Mapping salvato in ${outputFile}`);
  } catch (error) {
    console.error('Errore nel recupero o salvataggio del mapping:', error);
  } finally {
    await client.close();
  }
}

getAndSaveMapping();
