##How to compile 
 Dopo ogni modifica ai file .ts della libreria questa va compilata con il comando
  
 `npm run build`
 
##Node version

`v18.19.1` 
 
 Vanno committati sia i file .ts che i file generati dentro la dist
## [2.8.1] - 16-05-2024
- added default sort field

## [2.8.0] - 27-07-2023
- added locale to resource parser

## [2.7.1] - 27-07-2023
- fix html entities in XML snippet
- fix empty query in advanced search

## [2.7.0] - 03-07-2023
- advanced search proximity search
- added test
- change sort configuration

## [2.6.0] - 21-11-2022
- added teipublisher call API to get node root
- added link to highlight text
- get result not async
- added advanced search occurrences
## [2.5.0] - 21-11-2022
- advanced search in XML text
- tag replacement with highlight
## [2.4.0] - 19-10-2022
- refactor of advanced search controller
- new directory organization
- added XML-Json based advanced search
## [2.3.0] - 04-08-2022
- Advanced search add 'highlightField' options 
- Advanced search **BREAKING CHANGE**  modified `term_value` search query. See new options or convert to `fulltext` query

## [2.2.0] - 26-07-2022
- Added dynamic options
- Added search config for manual sorting of facets
- Added interfaces for search and andvanced search configurations files.

## [2.1.0] - 01-03-2022
- Minor upgrade: set timeline time format to YYYY-MM-DDThh:mm:ss

## [1.0.0] - 18-12-2020
- First stable version of serverless core framework