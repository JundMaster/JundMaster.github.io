
var randomVar = {name: "random name"};
var Pudim = {
  name : "ABC",
  age : 18,
  dept : "CSE",
  score : 90
};

var test;

var places = [];



const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: "secret_G6y1oOHPhQT1yBz6njJkjeziExKcPoHCXZvcqZ0C0vN"
})
var pageId;


const getLocations = async () => {
  const databaseId = '374afc0e7ad44137856fd4875113e817';

  // const page = await notion.pages.retrieve({ page_id: "7c5b63ffb9444e4880842d4582f1b1d9", property_id: "title" });
  // const dataBase = await notion.databases.retrieve({ database_id: databaseId });
  
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
  
  // console.log(collectionLocationNames);
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
      tempoLocationInfo.push(
        {
          info_type: tempBlock[j].type,
          info_content: tempBlock[j][tempBlock[j].type].rich_text[0].plain_text
        }
      )
    }

    silverymoonPoints.push({
      location_name: collectionLocationNames[i],
      location_info: tempoLocationInfo,
      iteration: i
    })
      // silverymoonPoints.push({location_name: collectionLocationNames[i]});
      // silverymoonPoints.push(tempBlock.map((block) => {
      //   // console.log(block)
      //   var tempoLocationInfo;
      //   var currentIteration = i;
      //   if (block.type == "paragraph")
      //     tempoLocationInfo = block.paragraph.rich_text[0].plain_text
      //   else
      //     tempoLocationInfo = "not_paragraph";
      
        
      //   return{
      //     location_name: collectionLocationNames[i],
      //     location_info: tempoLocationInfo,
      //     iteration: i
      //     // location_info: block,
      //     // location_info: block.paragraph.rich_text[0].plain_text,
      //   }
      // }))  
      // test.push(tempPage.map((page) => page.paragraph.rich_text[0].plain_text))  
  }

  // console.log(silverymoonPoints[0].location_info[0].info_type);
  return silverymoonPoints;
  
  
  
  
  // const highPalacePage = (await notion.blocks.children.list({
  //   block_id: "7c5b63ffb9444e4880842d4582f1b1d9",
  // })).results;

  // test = highPalacePage.map((page) => page);
  // console.log(test);  

};

// getLocations();
(async () => {
  const nLocations = await getLocations()
  // console.log(nLocations)
})()

const express = require('express');
const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.static("public"));

app.listen(PORT, console.log("Server started at port " + PORT));
app.get("/silverymoonPoints", async (req,res) => {
  const silverymoonPoints = await getLocations();
  res.json(silverymoonPoints);
})

app.get("/", async (req, res) => {
  res.send("Hello World");
})
module.exports = {randomVar, Pudim, test};