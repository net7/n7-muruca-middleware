# Example Usage

```ts
// app.ts

import {
  neffRouter,
  initController,
  setCustomHandler,
} from '@n7-frontend/express';
import parsers from './src/parsers';
import configurations from './src/configurations';
require('dotenv').config();
import * as cors from 'cors';
import * as express from 'express';

const app = express();

// Initialize the controller using config files
initController({
  parsers,
  configurations,
  baseUrl: process.env.BASE_URL,
  staticUrl: process.env.STATIC_URL,
  searchIndex: process.env.SEARCH_INDEX,
  elasticUri: process.env.ELASTIC_URI,
  defaultLang: process.env.DEFAULT_LANG,
});

// For parsing application/json
app.use(express.json(), cors());
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// Load default routes and handlers from NEFF framework
app.use(neffRouter);

// Override default handlers if necessary
setCustomHandler('getTest', async (req, res) => {
  res.send('this is the custom get test handler');
});

// Start the express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

```yml
# dev.yml

ELASTIC_URI: 'http://<ElasticSearch-URI>/'
SEARCH_INDEX: '<search-index-string>'
STATIC_URL: 'http://<WordPress-URL>/wp/v2/'
BASE_URL: 'http://<WordPress-URL>/muruca-core-v2/v1/'
PORT: 3126
CONTROLLER_PATH: './src/controller'
```
