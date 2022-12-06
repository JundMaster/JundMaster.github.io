const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: "secret_G6y1oOHPhQT1yBz6njJkjeziExKcPoHCXZvcqZ0C0vN",
});
var pageId;

const randomVar = "random name";

(async () => {
  const databaseId = '374afc0e7ad44137856fd4875113e817';

  // const page = await notion.pages.retrieve({ page_id: "7c5b63ffb9444e4880842d4582f1b1d9", property_id: "title" });
  // const dataBase = await notion.databases.retrieve({ database_id: databaseId });
  
  const {results} = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "Parent Location",
      select: {
        equals: "Silverymoon"
      }
    }
  });
  
//   const collectionPagesIDs = results.map(page => page.id);
//   var silverymoonPoints;
//   var test = [];
//   for (var i = 0; i < collectionPagesIDs.length;i++){
//     const tempID = collectionPagesIDs[i];
//     const tempPage = (await notion.blocks.children.list({
//       block_id: tempID,
//       })).results;
    
//     if (i == 0){
//       test.push(tempPage.map((page) => page.paragraph.rich_text[0].plain_text)) 
//     }
//     else{
//       test.push(tempPage.map((page) => page.paragraph.rich_text[0].plain_text))  
//     }
    
//   }
  
//   console.log(test);
  
  
  
  
  const highPalacePage = (await notion.blocks.children.list({
    block_id: "7c5b63ffb9444e4880842d4582f1b1d9",
  })).results;

  const test = highPalacePage.map((page) => page.paragraph.rich_text[0].text.content);
  
  console.log(test);
})();