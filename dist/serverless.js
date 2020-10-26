module.exports = ({ name, schema }) => ({
provider: {
  name: "aws",
  runtime: "nodejs10.x",
  stage: "${opt:stage, 'stage'}",
  environment:{
    PROJECT_ID: "${file(${opt:stage, 'stage'}.yml):PROJECT_ID}",
    PORT: "${file(${opt:stage, 'stage'}.yml):PORT}",
    BASE_URL: "${file(${opt:stage, 'stage'}.yml):BASE_URL}",
    PAGES: "${file(${opt:stage, 'stage'}.yml):PAGES}",
    SEARCH_INDEX: "${file(${opt:stage, 'stage'}.yml):SEARCH_INDEX}",
    ELASTIC_URI: "${file(${opt:stage, 'stage'}.yml):ELASTIC_URI}"
  }
},
functions: { 
  getNavigation:{
    handler: "${file(${opt:stage, 'stage'}.yml):CONTROLLER_PATH}.getNavigation",
    events: {
      http: {
          path: "get_menu",
          method: "get"   
      }
    }
  },
  getFooter: {
    handler: "${file(${opt:stage, 'stage'}.yml):CONTROLLER_PATH}.getFooter",
    events: {
      http: {
          path: "get_footer",
          method: "get" 
      }
    }    
  },
  getHomeLayout: {
    handler: "${file(${opt:stage, 'stage'}.yml):CONTROLLER_PATH}.getHomeLayout",
    events:{
      http:{
          path: "get_home",
          method: "post"
      }
    }
  },
  getResource: {
    handler: "${file(${opt:stage, 'stage'}.yml):CONTROLLER_PATH}.getResource",
    events:{
      http:{
          path: "get_resource",
          method: "post"
      }
    }
  },
  getStaticPage:{
    handler: "${file(${opt:stage, 'stage'}.yml):CONTROLLER_PATH}.getStaticPage",
    events:{
      http:{
          path: "get_static/{slug}",
          method: "get"
      }
    }
  },
  getTranslation:{
    handler: "${file(${opt:stage, 'stage'}.yml):CONTROLLER_PATH}.getTranslation",
    events:{
      http:{
          path: "get_translation/{lang}",
          method: "get"
      }
    }
  },
  search:{
    handler: "${file(${opt:stage, 'stage'}.yml):CONTROLLER_PATH}.search",
    events:{
      http:{
          path: "search/{type}",
          method: "post"
      }
    }
  }
}
})

        