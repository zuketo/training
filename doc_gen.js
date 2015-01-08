/* 
  Generate sample MongoDB documents based on a schemaTemplate.

  To run: "mongo doc_gen.js"
*/

/* -- EDIT BELOW --  configuration settings */

database = "test";
collection = "cms";
numDocsToInsert = 1000;

schemaTemplate = {
  "headline" : {
    "#RANDOM_LOREM" : 100
  },
  "date" : {
    "#RANDOM_DATE_DAYS_BACK" : [0,365] 
  },
  "url" : {
    "#RANDOM_STRING" : 100
  },
  "author" : {
    "#SUBDOCUMENT" : {
      "name" : {
        "#RANDOM_STRING" : 25
      },
      "title" : {
        "#RANDOM_STRING" : 25
      },
      "authorid" : {
        "#OBJECTID" : 1  
      }
    }
  },
  "section" : {
    "#RAND" : [ "Technology", "Business", "Finance", "Lifestyle" ]
  },
  "tags" : {
    "#ARRAY_VALUES" : ["AAPL", "CUPERTINO", "GOOG", "MOUNTAINVIEW"],
    "#ARRAY_LENGTH" : [1,5]  
  },
  "story_views" : {
    "#RAND_INT" : [0, 1000000]
  },
  "comments" : {
    "#ARRAY_VALUES" : [
        { "#SUBDOCUMENT" : {
              "name" : {
                  "#RANDOM_STRING" : 50 
              },
              "comment" : {
                  "#RANDOM_LOREM" : 200 
              },
              "date" : {
                  "#RANDOM_DATE_DAYS_BACK" : [0,365] 
              }
          }
        }
     ],
     "#ARRAY_LENGTH" : [1,5],
     "#INSERT_PERCENT" : 50   
  }
}


/* -- DO NOT EDIT BELOW -- */

/* 
  
  -- The schemaTemplate above creates documents with the following form --

  {
    "_id" : ObjectId("53459778c979defcb5db7cca"),
    "headline" : "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore",
    "date" : ISODate("2014-03-08T19:54:48.505Z"),
    "url" : "nODRzDCp9FNOHmwyi2DkN0xzoxoSRObLTMJZa9nxv2hQZlyrg1OgfNBVGDwyY3IpR05TNeqpy1rvn4TlakwmdXEKRa9WMVySOXFu",
    "author" : {
      "name" : "KptEeaxJ8GEGfXLZzyro7UyER",
      "title" : "cGZk2CpesND3tL6AI96FGJYx0",
      "authorid" : ObjectId("53459778c979defcb5db7cc9")
    },
    "section" : "Lifestyle",
    "tags" : [
      "AAPL",
      "MOUNTAINVIEW",
      "CUPERTINO",
      "AAPL"
    ],
    "story_views" : 485155,
    "comments" : [
      {
        "name" : "iN9OrDZpqsCxtmC9sPVjqcUO8PMnWWsusqK3umwbOIVIuieIPQ",
        "comment" : "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut ",
        "date" : ISODate("2013-08-03T18:54:48.506Z")
      },
      {
        "name" : "YBxrLoeJpPsbwZrbw4vOYD2PjedyoN2Myx4htw2FkpCwMrCjZZ",
        "comment" : "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut ",
        "date" : ISODate("2013-07-13T18:54:48.506Z")
      }
    ]
  }

  -- Key/value schema example --

  schemaTemplate = {
    "gameId" : "Motocross",
    "account_id" : {
        "#OBJECTID" : 1
    },
    "tags" : {
      "#ARRAY_VALUES" : [
          { "#SUBDOCUMENT" : {
                "key" : {
                    "#RAND_INT" : [0,15] 
                },
                "value" : {
                    "#RAND_INT" : [0,1000000] 
                },
            }
          }
       ],
       "#ARRAY_LENGTH" : [2,10],
       "#INSERT_PERCENT" : 100 
    }
  }

  output:

  {
    "_id" : ObjectId("53446786235c5a35fa03faf7"),
    "gameId" : "Motocross",
    "account_id" : ObjectId("53446786235c5a35fa03faf6"),
    "tags" : [
      {
        "key" : 10,
        "value" : 470185
      },
      {
        "key" : 0,
        "value" : 718475
      },
      {
        "key" : 11,
        "value" : 829532
      }
    ]
  }


  Operators:

  #OBJECTID - generate an objectid for the field, ignores value passed in 
    { "account_id" : { "#OBJECTID" : 1 } }
  
  #INSERT_PERCENT - percent of documents containing this field, percentage 0-100 is passed in
    { "address_line_2" : { "#VALUE" : "Suite 200", "#INSERT_PERCENT" : 25 }}

  #RAND_INT - random integer between two values
    { "age" : { "#RAND_INT" : [0, 105] } }

  #RAND - random value from an array
    { "position_title" : { "#RAND" : [0, "Editor", "NA", 34, true] } }
  
  #SUBDOCUMENT - subdocument operator needed for nested subdocuments within other operators
    -- see example below

  #ARRAY_LENGTH, #ARRAY_VALUES - create a randomly generated array based on array of possible values
    {
      "tags" : {
      "#ARRAY_VALUES" : [
          { "#SUBDOCUMENT" : {
                "key" : {
                    "#RAND_INT" : [0,15] 
                },
                "value" : {
                    "#RAND_INT" : [0,1000000] 
                },
            }
          }
       ],
       "#ARRAY_LENGTH" : [5,10]  // random number of array elements between 5 and 10
    }  

  #RANDOM_STRING - create a random string of N characters

  #RANDOM_LOREM - create a random string of N characters, using repeating Lorem ipsum ...

  #RANDOM_DATE_DAYS_BACK - set the field to a random date within [N,M] days back

*/

function generateDocument(schemaSpec) {
  var generatedDoc = {};

  for (var key in schemaSpec) {
    if (schemaSpec.hasOwnProperty(key)) {
      
      // embedded JSON object?
      if (typeof schemaSpec[key] == 'object') {
        generatedVal = getFieldValue(schemaSpec[key]);

        if (generatedVal != null) {
          generatedDoc[key] = generatedVal;  
        }
        
      }
      else {
        generatedDoc[key] = schemaSpec[key];
      }
    }
  }

  return generatedDoc;
}

// Add new opeartors here
function getFieldValue(subdoc) {
  
  // "#INSERT_PRECENT" : 50
  if (subdoc.hasOwnProperty('#INSERT_PERCENT')) {
    val = subdoc['#INSERT_PERCENT'];
    randomNum = Math.floor(Math.random()*100);
    if (randomNum >= val) {
      return null;
    }
  }

  // "#VALUE" : "Test value" 
  if (subdoc.hasOwnProperty('#VALUE')) {
    return subdoc['#VALUE'];
  }

  // "#RAND_INT" : [0, 100] 
  if (subdoc.hasOwnProperty('#RAND_INT')) {
    val = subdoc['#RAND_INT'];
    if (val instanceof Array) {
      return Math.floor((Math.random()*val[1])+val[0]);
    }
  }

  // "#RAND" : ["M", "F", "NA", 15] 
  if (subdoc.hasOwnProperty('#RAND')) {
    val = subdoc['#RAND'];
    if (val instanceof Array) {
      return val[Math.floor(Math.random()*val.length)];
    }
  }

  // "#OBJECTID" : 1 
  if (subdoc.hasOwnProperty('#OBJECTID')) {
    return new ObjectId();
  }

  // "#SUBDOCUMENT" : { "title" : "editor", "name" : "jason" } 
  if (subdoc.hasOwnProperty('#SUBDOCUMENT')) {
    return generateDocument(subdoc['#SUBDOCUMENT']);
  }

  // "#SUBDOCUMENT" : { "title" : "editor", "name" : "jason" } 
  if (subdoc.hasOwnProperty('#ARRAY_LENGTH')) {
    arrayLength = subdoc['#ARRAY_LENGTH'];
    if (arrayLength instanceof Array) {
      arrayLength = Math.floor((Math.random()*arrayLength[1])+arrayLength[0])
    }

    arrayValues = subdoc['#ARRAY_VALUES'];
    return constructArray(arrayValues, arrayLength);
  }

  // "#RANDOM_STRING" : 50
  if (subdoc.hasOwnProperty('#RANDOM_STRING')) {
    val = subdoc['#RANDOM_STRING'];
    return getRandomString(val);
  }

  // "#RANDOM_LOREM" : 100
  if (subdoc.hasOwnProperty('#RANDOM_LOREM')) {
    val = subdoc['#RANDOM_LOREM'];
    return getRandomLorem(val);
  }

  // "#RANDOM_DATE_DAYS_BACK" : [0,100]
  if (subdoc.hasOwnProperty('#RANDOM_DATE_DAYS_BACK')) {
    val = subdoc['#RANDOM_DATE_DAYS_BACK'];
    if (val instanceof Array) {
      daysBack = Math.floor((Math.random()*val[1])+val[0]);
      var d = new Date();
      d.setDate(d.getDate()-daysBack);
      return d;
    }
  }

  return subdoc;
}

function constructArray(possibleArrayValuesArr, numItems) {
  var returnValue = new Array();

  for (var i = 0; i<numItems; i++) {
    newValue = possibleArrayValuesArr[Math.floor(Math.random()*possibleArrayValuesArr.length)];

    if ((typeof newValue == 'object') && newValue.hasOwnProperty('#SUBDOCUMENT')){
      newValue = getFieldValue(newValue);
    }

    returnValue.push(newValue);
  }

  return returnValue;
}

function getRandomString(len){
    AB = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    returnValue = "";

    for(i = 0; i < len; i++ )
        returnValue += ( AB.charAt( Math.floor(Math.random()*AB.length) ) );
    
    return returnValue;
}

function getRandomLorem(len){
    lorem = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";
    loremCounter = 0;
    var returnValue = "";

    for(i = 0; i < len; i++ ) {
      if (loremCounter == (lorem.length - 1)){
          loremCounter = 0;
      }

      returnValue += ( lorem.charAt( loremCounter++ ) );
    }
    
    return returnValue;
}

// Generate and insert documents
var dbRef = db.getSiblingDB(database);
for (var num_docs =0; num_docs < numDocsToInsert; num_docs++) {
  dbRef.getCollection(collection).insert(generateDocument(schemaTemplate));
  if (num_docs % 1000 == 0 && num_docs > 0) {
    print("Inserted: " + num_docs + " documents into " + database + "." + collection);  
  }
}
print("Inserted: " + num_docs + " documents into " + database + "." + collection);


