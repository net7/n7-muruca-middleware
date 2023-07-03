export default [
  {
     "_index":"petrarca",
     "_type":"_doc",
     "_id":"1661",
     "_nested":{
        "field":"xml_transcription_texts_json",
        "offset":27
     },
     "_score":null,
     "_source":{
        "node":"p",        
        "xml_text":"In turpis. Morbi nec metus. Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus.",
        "_path":[
           {
              "node":"text"
           },
           {
              "node":"body",
              "position":0
           },
           {
              "node":"div",
              "label":"VIII. De Marco Furio Camillo.",
              "position":8
           },
           {
              "node":"p",
              "position":2
           }
        ]
     },
     "highlight":{
        "xml_transcription_texts_json.xml_text":[
           "Lorem Ipsum <em class='mrc__text-emph'>Magister</em> intra urbem erat nobilium puerorum"
        ]
     },
     "matched_queries":[
        "xml_transcription_texts_json.xml_text"
     ]
  },
  {     
     "_source":{
        "node":"p", 
        "xml_text":"Maecenas egestas arcu quis ligula mattis placerat. Donec mollis hendrerit risus. Sed mollis, eros et ultrices tempus, mauris ipsum aliquam libero, non adipiscing dolor urna a orci. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Nulla porta dolor.",
        "_path":[
           {
              "node":"text"
           },
           {
              "node":"body",
              "position":0
           },
           {
              "node":"div",
              "label":"XVIII. De Quinto Fabio Maximo Cuntatore.",
              "position":18
           },
           {
              "node":"p",
              "position":3
           }
        ]
     },
     "highlight":{
        "xml_transcription_texts_json.xml_text":[
           "Maecenas egestas arcu quis ligula mattis placerat. Donec mollis hendrerit risus. Sed mollis, eros et ultrices tempus, mauris ipsum aliquam libero, non adipiscing dolor urna a orci. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Nulla porta dolor. <em class='mrc__text-emph'>magister</em> equitum"
        ]
     },
     "matched_queries":[
        "xml_transcription_texts_json.xml_text"
     ]
  },
  {
     "_source":{
        "node":"p",
       
        "xml_text":"Donec id justo. Nulla facilisi. Maecenas ullamcorper, dui et placerat feugiat, eros pede varius nisi, condimentum viverra felis nunc et lorem. Nam adipiscing.",
        "_path":[
           {
              "node":"text"
           },
           {
              "node":"body",
              "position":0
           },
           {
              "node":"div",
              "label":"XVIII. De Quinto Fabio Maximo Cuntatore.",
              "position":18
           },
           {
              "node":"p",
              "position":4
           }
        ]
     },
     "highlight":{
        "xml_transcription_texts_json.xml_text":[
           "se furoris ducem <em class='mrc__text-emph'>magister</em> equitum exhibebat,",
           "dictatore, <em class='mrc__text-emph'>magister</em> equitum, ",
           "fallor unquam accidit, <em class='mrc__text-emph'>magister</em> equitum dictatoris imperio e"
        ]
     },
     "sort":[
        3719
     ],
     "matched_queries":[
        "xml_transcription_texts_json.xml_text"
     ]
  }
]