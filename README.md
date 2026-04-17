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

## Advanced Search — `search_groups` types

Each key in `search_groups` corresponds to the request body parameter name. The `type` field controls how the value is translated into an Elasticsearch query clause. All clauses are added to the bool `must` array unless noted.

| type | request value | ES query produced |
|---|---|---|
| `fulltext` | string | `query_string` across configured `field[]` |
| `term_value` | string (or comma-separated with `separator`) | `terms` on a single field |
| `term_field_value` | string | `query_string` on a runtime-selected field |
| `term_exists` | `"true"` / `"false"` | `exists` in `must` / `must_not` |
| `term_range` | single scalar (e.g. `"1850-01-01"`) | `range` with one operator (`gte`, `lte`, `gt`, `lt`) per entry in `field[]` — all in `must` |
| `term_range_or` | `[{ from, to }, …]` | `bool.should[ bool.must[gte, lte], … ]` with `minimum_should_match: 1` — use for OR logic across multiple intervals |

### `term_range` — single bound

Applies the same scalar value to every `{ field, operator }` entry. Use one group per bound:

```ts
// advanced_search_config.ts
search_groups: {
  'query-date-from': {
    type: 'term_range',
    field: [{ field: 'publication_date', operator: 'gte' }],
    noHighlight: true,
  },
  'query-date-to': {
    type: 'term_range',
    field: [{ field: 'publication_date', operator: 'lte' }],
    noHighlight: true,
  },
}
```

Request body: `{ "query-date-from": "1850-01-01", "query-date-to": "1900-12-31" }`

### `term_range_or` — multiple intervals with OR

Accepts an array of `{ from, to }` objects. Results must fall within **at least one** interval.

```ts
// advanced_search_config.ts
search_groups: {
  'query-date-ranges': {
    type: 'term_range_or',
    field: 'publication_date',
    noHighlight: true,
  },
}
```

Request body:
```json
{
  "query-date-ranges": [
    { "from": "1850-01-01", "to": "1880-12-31" },
    { "from": "1900-01-01", "to": "1924-12-31" }
  ]
}
```

Elasticsearch query produced:
```json
{
  "bool": {
    "should": [
      { "bool": { "must": [
        { "range": { "publication_date": { "gte": "1850-01-01" } } },
        { "range": { "publication_date": { "lte": "1880-12-31" } } }
      ]}},
      { "bool": { "must": [
        { "range": { "publication_date": { "gte": "1900-01-01" } } },
        { "range": { "publication_date": { "lte": "1924-12-31" } } }
      ]}}
    ],
    "minimum_should_match": 1
  }
}
```
