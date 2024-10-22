
export const testIndexMapping = {
  "settings": {
    "index": {
      "max_ngram_diff": "20",      
      "mapping": {
        "nested_fields": {
          "limit": "100"
        },
        "nested_objects": {
          "limit": "20000"
        }
      },
      "max_inner_result_window": "1000",
      "analysis": {
        "filter": {
          "my_ascii_folding": {
            "type": "asciifolding",
            "preserve_original": "true"
          },
          "synonym_filter": {
            "type": "synonym",
            "synonyms": [
              ""
            ]
          }
        },
        "normalizer": {
          "lowercase_ascii": {
            "filter": [
              "lowercase",
              "asciifolding"
            ]
          },
          "case_insensitive": {
            "filter": "lowercase"
          }
        },
        "analyzer": {
          "html_analyzer": {
            "filter": [
              "lowercase",
              "my_ascii_folding"
            ],
            "char_filter": [
              "html_strip"
            ],
            "type": "custom",
            "tokenizer": "standard"
          },
          "mrc_analyzer": {
            "filter": [
              "lowercase",
              "my_ascii_folding"
            ],
            "char_filter": [
              "html_strip"
            ],
            "type": "custom",
            "tokenizer": "mrc_tokenizer"
          },
          "xml_transcription_analyzer": {
            "filter": [
              "lowercase",
              "asciifolding"
            ],
            "char_filter": [
              "html_strip"
            ],
            "tokenizer": "standard"
          },
          "partial_words": {
            "filter": [
              "lowercase"
            ],
            "char_filter": [
              "html_strip"
            ],
            "type": "custom",
            "tokenizer": "ngrams"
          },
          "synonym_analyzer": {
            "filter": [
              "lowercase",
              "synonym_filter"
            ],
            "char_filter": [
              "html_strip"
            ],
            "tokenizer": "standard"
          },
          "full_words": {
            "filter": [
              "lowercase"
            ],
            "char_filter": [
              "html_strip"
            ],
            "type": "custom",
            "tokenizer": "whitespace"
          },
          "slop_search": {
            "filter": [
              "lowercase"
            ],
            "char_filter": [
              "html_strip"
            ],
            "type": "custom",
            "tokenizer": "standard"
          }
        },
        "tokenizer": {
          "mrc_tokenizer": {
            "token_chars": [
              "letter",
              "digit"
            ],
            "min_gram": "1",
            "type": "ngram",
            "max_gram": "15"
          },
          "ngrams": {
            "token_chars": [
              "letter",
              "digit"
            ],
            "min_gram": "1",
            "type": "ngram",
            "max_gram": "6"
          }
        }
      }
    }
  },
"mappings": {
  "dynamic_templates": [
    {
      "xml_json_child": {
        "path_match": "xml_transcription_to_json.*",
        "match_mapping_type": "object",
        "mapping": {
          "type": "object"
        }
      }
    },
    {
      "xml_texts_json_child": {
        "match": "_*",
        "path_match": "xml_transcription_texts_json.*",
        "match_mapping_type": "object",
        "mapping": {
          "type": "object"
        }
      }
    },
    {
      "xml_fields": {
        "match": "xml_text",
        "path_match": "xml_transcription_texts_json.*",
        "mapping": {
          "analyzer": "xml_transcription_analyzer",
          "type": "text"
        }
      }
    },
    {
      "attrs": {
        "match": "_attrs",
        "match_mapping_type": "object",
        "mapping": {
          "type": "object"
        }
      }
    },
    {
      "path": {
        "match": "_path",
        "match_mapping_type": "object",
        "mapping": {
          "type": "object"
        }
      }
    },
    {
      "references": {
        "match": "_refs",
        "match_mapping_type": "object",
        "mapping": {
          "type": "nested"
        }
      }
    },
    {
      "path_child": {
        "match": "_path.*",
        "match_mapping_type": "object",
        "mapping": {
          "type": "object"
        }
      }
    },
    {
      "objects": {
        "match_mapping_type": "object",
        "mapping": {
          "include_in_parent": true,
          "type": "nested"
        }
      }
    },
    {
      "taxonomy-key": {
        "match": "key",
        "path_unmatch": "xml_transcription_texts_json.*",
        "match_mapping_type": "string",
        "mapping": {
          "fields": {
            "keyword_lc": {
              "normalizer": "lowercase_ascii",
              "ignore_above": 256,
              "type": "keyword"
            },
            "keyword": {
              "ignore_above": 256,
              "type": "keyword"
            }
          },
          "type": "text"
        }
      }
    }
  ],
    "properties": {
    "biblioteca": {
      "type": "text",
        "fields": {
        "keyword": {
          "type": "keyword",
            "ignore_above": 256
        },
        "keyword_lc": {
          "type": "keyword",
            "ignore_above": 256,
              "normalizer": "lowercase_ascii"
        }
      }
    },
    "breadcrumbs": {
      "type": "nested",
        "include_in_parent": true,
          "properties": {
        "id": {
          "type": "long"
        },
        "slug": {
          "type": "text",
            "fields": {
            "keyword": {
              "type": "keyword",
                "ignore_above": 256
            }
          }
        },
        "title": {
          "type": "text",
            "fields": {
            "keyword": {
              "type": "keyword",
                "ignore_above": 256
            }
          }
        },
        "type": {
          "type": "text",
            "fields": {
            "keyword": {
              "type": "keyword",
                "ignore_above": 256
            }
          }
        }
      }
    },
    "città": {
      "type": "text",
        "fields": {
        "keyword": {
          "type": "keyword",
            "ignore_above": 256
        },
        "keyword_lc": {
          "type": "keyword",
            "ignore_above": 256,
              "normalizer": "lowercase_ascii"
        }
      }
    },
    "contenuti": {
      "type": "nested",
        "include_in_parent": true,
          "properties": {
        "contenuto": {
          "type": "text",
            "fields": {
            "keyword": {
              "type": "keyword",
                "ignore_above": 256
            }
          },
          "analyzer": "synonym_analyzer"
        }
      }
    },
    "description": {
      "type": "text",
        "analyzer": "html_analyzer"
    },
    "editor": {
      "type": "text",
        "fields": {
        "keyword": {
          "type": "keyword",
            "ignore_above": 256
        }
      }
    },
    "html_transcription": {
      "type": "text",
        "term_vector": "with_positions_offsets",
          "analyzer": "partial_words"
    },
    "id": {
      "type": "long"
    },
    "record-type": {
      "type": "text",
        "fields": {
        "keyword": {
          "type": "keyword",
            "ignore_above": 256
        }
      }
    },
    "record-type-label": {
      "type": "text",
        "fields": {
        "keyword": {
          "type": "keyword",
            "ignore_above": 256
        }
      }
    },
    "slug": {
      "type": "text",
        "fields": {
        "keyword": {
          "type": "keyword",
            "ignore_above": 256
        }
      }
    },
    "sort_title": {
      "type": "text",
        "fields": {
        "keyword": {
          "type": "keyword",
            "normalizer": "case_insensitive"
        }
      }
    },
    "taxonomies": {
      "type": "nested",
        "include_in_parent": true,
          "properties": {
        "tei_bibliography": {
          "type": "nested",
            "include_in_parent": true,
              "properties": {
            "id": {
              "type": "long"
            },
            "key": {
              "type": "text",
                "fields": {
                "keyword": {
                  "type": "keyword",
                    "ignore_above": 256
                },
                "keyword_lc": {
                  "type": "keyword",
                    "ignore_above": 256,
                      "normalizer": "lowercase_ascii"
                }
              }
            },
            "name": {
              "type": "text",
                "fields": {
                "keyword": {
                  "type": "keyword",
                    "ignore_above": 256
                }
              }
            },
            "taxonomy": {
              "type": "text",
                "fields": {
                "keyword": {
                  "type": "keyword",
                    "ignore_above": 256
                }
              }
            }
          }
        },
        "tei_name": {
          "type": "nested",
            "include_in_parent": true,
              "properties": {
            "id": {
              "type": "long"
            },
            "key": {
              "type": "text",
                "fields": {
                "keyword": {
                  "type": "keyword",
                    "ignore_above": 256
                },
                "keyword_lc": {
                  "type": "keyword",
                    "ignore_above": 256,
                      "normalizer": "lowercase_ascii"
                }
              }
            },
            "name": {
              "type": "text",
                "fields": {
                "keyword": {
                  "type": "keyword",
                    "ignore_above": 256
                }
              }
            },
            "taxonomy": {
              "type": "text",
                "fields": {
                "keyword": {
                  "type": "keyword",
                    "ignore_above": 256
                }
              }
            }
          }
        },
        "tei_place": {
          "type": "nested",
            "include_in_parent": true,
              "properties": {
            "id": {
              "type": "long"
            },
            "key": {
              "type": "text",
                "fields": {
                "keyword": {
                  "type": "keyword",
                    "ignore_above": 256
                },
                "keyword_lc": {
                  "type": "keyword",
                    "ignore_above": 256,
                      "normalizer": "lowercase_ascii"
                }
              }
            },
            "name": {
              "type": "text",
                "fields": {
                "keyword": {
                  "type": "keyword",
                    "ignore_above": 256
                }
              }
            },
            "taxonomy": {
              "type": "text",
                "fields": {
                "keyword": {
                  "type": "keyword",
                    "ignore_above": 256
                }
              }
            }
          }
        }
      }
    },
    "title": {
      "type": "text",
        "fields": {
        "sort": {
          "type": "icu_collation_keyword",
            "index": false,
              "numeric": true
        },
        "text": {
          "type": "text"
        }
      },
      "analyzer": "mrc_analyzer"
    },
    "witnesses": {
      "type": "nested"
    },
    "xml_filename": {
      "type": "text",
        "fields": {
        "keyword": {
          "type": "keyword",
            "ignore_above": 256
        }
      }
    },
    "xml_transcription_texts_json": {
      "type": "nested",
        "properties": {
        "_attr": {
          "properties": {
            "source": {
              "type": "text",
                "fields": {
                "keyword": {
                  "type": "keyword",
                    "ignore_above": 256
                }
              }
            },
            "type": {
              "type": "text",
                "fields": {
                "keyword": {
                  "type": "keyword",
                    "ignore_above": 256
                }
              }
            }
          }
        },
        "_path": {
          "properties": {
            "label": {
              "type": "text",
                "fields": {
                "keyword": {
                  "type": "keyword",
                    "ignore_above": 256
                }
              }
            },
            "node": {
              "type": "text",
                "fields": {
                "keyword": {
                  "type": "keyword",
                    "ignore_above": 256
                }
              }
            },
            "position": {
              "type": "long"
            }
          }
        },
        "_refs": {
          "properties": {
            "author": {
              "type": "text",
                "fields": {
                "keyword": {
                  "type": "keyword",
                    "ignore_above": 256
                }
              }
            },
            "id": {
              "type": "text",
                "fields": {
                "keyword": {
                  "type": "keyword",
                    "ignore_above": 256
                }
              }
            },
            "label": {
              "type": "text",
                "fields": {
                "keyword": {
                  "type": "keyword",
                    "ignore_above": 256
                }
              }
            },
            "title": {
              "type": "text",
                "fields": {
                "keyword": {
                  "type": "keyword",
                    "ignore_above": 256
                }
              }
            }
          }
        },
        "name": {
          "type": "nested",
            "include_in_parent": true,
              "properties": {
            "_attr": {
              "properties": {
                "key": {
                  "type": "text",
                    "fields": {
                    "keyword": {
                      "type": "keyword",
                        "ignore_above": 256
                    }
                  }
                },
                "type": {
                  "type": "text",
                    "fields": {
                    "keyword": {
                      "type": "keyword",
                        "ignore_above": 256
                    }
                  }
                }
              }
            },
            "_path": {
              "properties": {
                "label": {
                  "type": "text",
                    "fields": {
                    "keyword": {
                      "type": "keyword",
                        "ignore_above": 256
                    }
                  }
                },
                "node": {
                  "type": "text",
                    "fields": {
                    "keyword": {
                      "type": "keyword",
                        "ignore_above": 256
                    }
                  }
                },
                "position": {
                  "type": "long"
                }
              }
            },
            "node": {
              "type": "text",
                "fields": {
                "keyword": {
                  "type": "keyword",
                    "ignore_above": 256
                }
              }
            },
            "xml_text": {
              "type": "text",
                "analyzer": "xml_transcription_analyzer"
            }
          }
        },
        "node": {
          "type": "text",
            "fields": {
            "keyword": {
              "type": "keyword",
                "ignore_above": 256
            }
          }
        },
        "quote": {
          "type": "nested",
            "include_in_parent": true,
              "properties": {
            "_attr": {
              "properties": {
                "source": {
                  "type": "text",
                    "fields": {
                    "keyword": {
                      "type": "keyword",
                        "ignore_above": 256
                    }
                  }
                }
              }
            },
            "_path": {
              "properties": {
                "label": {
                  "type": "text",
                    "fields": {
                    "keyword": {
                      "type": "keyword",
                        "ignore_above": 256
                    }
                  }
                },
                "node": {
                  "type": "text",
                    "fields": {
                    "keyword": {
                      "type": "keyword",
                        "ignore_above": 256
                    }
                  }
                },
                "position": {
                  "type": "long"
                }
              }
            },
            "_refs": {
              "properties": {
                "author": {
                  "type": "text",
                    "fields": {
                    "keyword": {
                      "type": "keyword",
                        "ignore_above": 256
                    }
                  }
                },
                "id": {
                  "type": "text",
                    "fields": {
                    "keyword": {
                      "type": "keyword",
                        "ignore_above": 256
                    }
                  }
                },
                "label": {
                  "type": "text",
                    "fields": {
                    "keyword": {
                      "type": "keyword",
                        "ignore_above": 256
                    }
                  }
                },
                "title": {
                  "type": "text",
                    "fields": {
                    "keyword": {
                      "type": "keyword",
                        "ignore_above": 256
                    }
                  }
                }
              }
            },
            "name": {
              "type": "nested",
                "include_in_parent": true,
                  "properties": {
                "_attr": {
                  "properties": {
                    "key": {
                      "type": "text",
                        "fields": {
                        "keyword": {
                          "type": "keyword",
                            "ignore_above": 256
                        }
                      }
                    },
                    "type": {
                      "type": "text",
                        "fields": {
                        "keyword": {
                          "type": "keyword",
                            "ignore_above": 256
                        }
                      }
                    }
                  }
                },
                "_path": {
                  "properties": {
                    "label": {
                      "type": "text",
                        "fields": {
                        "keyword": {
                          "type": "keyword",
                            "ignore_above": 256
                        }
                      }
                    },
                    "node": {
                      "type": "text",
                        "fields": {
                        "keyword": {
                          "type": "keyword",
                            "ignore_above": 256
                        }
                      }
                    },
                    "position": {
                      "type": "long"
                    }
                  }
                },
                "name": {
                  "type": "nested",
                    "include_in_parent": true,
                      "properties": {
                    "_attr": {
                      "properties": {
                        "key": {
                          "type": "text",
                            "fields": {
                            "keyword": {
                              "type": "keyword",
                                "ignore_above": 256
                            }
                          }
                        },
                        "type": {
                          "type": "text",
                            "fields": {
                            "keyword": {
                              "type": "keyword",
                                "ignore_above": 256
                            }
                          }
                        }
                      }
                    },
                    "_path": {
                      "properties": {
                        "label": {
                          "type": "text",
                            "fields": {
                            "keyword": {
                              "type": "keyword",
                                "ignore_above": 256
                            }
                          }
                        },
                        "node": {
                          "type": "text",
                            "fields": {
                            "keyword": {
                              "type": "keyword",
                                "ignore_above": 256
                            }
                          }
                        },
                        "position": {
                          "type": "long"
                        }
                      }
                    },
                    "node": {
                      "type": "text",
                        "fields": {
                        "keyword": {
                          "type": "keyword",
                            "ignore_above": 256
                        }
                      }
                    },
                    "xml_text": {
                      "type": "text",
                        "analyzer": "xml_transcription_analyzer"
                    }
                  }
                },
                "node": {
                  "type": "text",
                    "fields": {
                    "keyword": {
                      "type": "keyword",
                        "ignore_above": 256
                    }
                  }
                },
                "xml_text": {
                  "type": "text",
                    "analyzer": "xml_transcription_analyzer"
                }
              }
            },
            "node": {
              "type": "text",
                "fields": {
                "keyword": {
                  "type": "keyword",
                    "ignore_above": 256
                }
              }
            },
            "quote": {
              "type": "nested",
                "include_in_parent": true,
                  "properties": {
                "_attr": {
                  "properties": {
                    "source": {
                      "type": "text",
                        "fields": {
                        "keyword": {
                          "type": "keyword",
                            "ignore_above": 256
                        }
                      }
                    }
                  }
                },
                "_path": {
                  "properties": {
                    "label": {
                      "type": "text",
                        "fields": {
                        "keyword": {
                          "type": "keyword",
                            "ignore_above": 256
                        }
                      }
                    },
                    "node": {
                      "type": "text",
                        "fields": {
                        "keyword": {
                          "type": "keyword",
                            "ignore_above": 256
                        }
                      }
                    },
                    "position": {
                      "type": "long"
                    }
                  }
                },
                "_refs": {
                  "properties": {
                    "author": {
                      "type": "text",
                        "fields": {
                        "keyword": {
                          "type": "keyword",
                            "ignore_above": 256
                        }
                      }
                    },
                    "id": {
                      "type": "text",
                        "fields": {
                        "keyword": {
                          "type": "keyword",
                            "ignore_above": 256
                        }
                      }
                    },
                    "label": {
                      "type": "text",
                        "fields": {
                        "keyword": {
                          "type": "keyword",
                            "ignore_above": 256
                        }
                      }
                    },
                    "title": {
                      "type": "text",
                        "fields": {
                        "keyword": {
                          "type": "keyword",
                            "ignore_above": 256
                        }
                      }
                    }
                  }
                },
                "name": {
                  "type": "nested",
                    "include_in_parent": true,
                      "properties": {
                    "_attr": {
                      "properties": {
                        "key": {
                          "type": "text",
                            "fields": {
                            "keyword": {
                              "type": "keyword",
                                "ignore_above": 256
                            }
                          }
                        },
                        "type": {
                          "type": "text",
                            "fields": {
                            "keyword": {
                              "type": "keyword",
                                "ignore_above": 256
                            }
                          }
                        }
                      }
                    },
                    "_path": {
                      "properties": {
                        "label": {
                          "type": "text",
                            "fields": {
                            "keyword": {
                              "type": "keyword",
                                "ignore_above": 256
                            }
                          }
                        },
                        "node": {
                          "type": "text",
                            "fields": {
                            "keyword": {
                              "type": "keyword",
                                "ignore_above": 256
                            }
                          }
                        },
                        "position": {
                          "type": "long"
                        }
                      }
                    },
                    "node": {
                      "type": "text",
                        "fields": {
                        "keyword": {
                          "type": "keyword",
                            "ignore_above": 256
                        }
                      }
                    },
                    "xml_text": {
                      "type": "text",
                        "analyzer": "xml_transcription_analyzer"
                    }
                  }
                },
                "node": {
                  "type": "text",
                    "fields": {
                    "keyword": {
                      "type": "keyword",
                        "ignore_above": 256
                    }
                  }
                },
                "xml_text": {
                  "type": "text",
                    "analyzer": "xml_transcription_analyzer"
                }
              }
            },
            "xml_text": {
              "type": "text",
                "analyzer": "xml_transcription_analyzer"
            }
          }
        },
        "xml_text": {
          "type": "text",
            "analyzer": "xml_transcription_analyzer"
        }
      }
    },
    "xml_transcription_to_json": {
      "type": "flattened"
    }
  }
}
};
