const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: "secret_G6y1oOHPhQT1yBz6njJkjeziExKcPoHCXZvcqZ0C0vN"
})

const getLocations = async () => {
  const databaseId = '374afc0e7ad44137856fd4875113e817';
  
  // Filtered database that only contains Silverymoon locations
  const {results} = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "Parent Location",
      select: {
        equals: "Silverymoon"
      }
    }
  });
  
  // Collection that contains the ID for each of the pages on the data base
  const collectionPagesIDs = results.map(page => page.id);

  // Collection of the Location names
  const collectionLocationNames = results.map(page => page.properties.Name.title[0].text.content);
  
  var silverymoonPoints;

  var silverymoonPoints = [];
  for (var i = 0; i < collectionPagesIDs.length;i++){
    const tempID = collectionPagesIDs[i];
    const tempBlock = (await notion.blocks.children.list({
      block_id: tempID,
      })).results;  
    const tempName = collectionLocationNames[i];
    
    var tempoLocationInfo = [];
    for (var j = 0; j < tempBlock.length; j++){
      var auxVar;
      try {
        auxVar = tempBlock[j][tempBlock[j].type].rich_text[0].plain_text;
      } catch (error) {
        auxVar = "empty";
      }
      tempoLocationInfo.push(
        {
          info_type: tempBlock[j].type,
          info_content: auxVar
        }
      )
    }

    silverymoonPoints.push({
      location_name: collectionLocationNames[i],
      location_info: tempoLocationInfo,
      iteration: i
    })
  }

  return silverymoonPoints;
};

(async () => {
  const nLocations = await getLocations()
})()

const express = require('express');
const APP_PORT = 8000;
const PORT = process.env.PORT || 8080;
const app = express();
const debug = require('debug')('node-js-sample:server');
const http = require('http');

app.set('port', PORT);
app.use(express.static("public"));

// app.listen(APP_PORT, console.log("Server started at port " + APP_PORT));

app.get("/silverymoonPoints", async (req,res) => {
  const silverymoonPoints = await getLocations();
  res.json(silverymoonPoints);
})

app.get("/", async (req, res) => {
  res.send("Hello World");
})

var server = http.createServer(app);
server.listen(PORT)
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof PORT === 'string'
    ? 'Pipe ' + PORT
    : 'Port ' + PORT;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.PORT;
  debug('Listening on ' + bind);
}