const express = require('express')
const {google} = require('googleapis')
const {PubSub} = require('@google-cloud/pubsub')

require('dotenv').config();

const server = express();

const psClient = new PubSub();
const time = 300;
const subscriptionName = 'sheets'

const sub = psClient.subscription(subscriptionName)
const sheetsClient = new google.auth.JWT(
    process.env.SHEETS_CLIENT_EMAIL,
    null,
    process.env.SHEETS_PRIVATE_KEY.replace(/\\n/gm, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  const callbackOnPull = (msg) => {
    console.log(`Message [${msg.id}] received: `);
    message = JSON.parse(msg.data);
    messageData = message._fieldsProto
  
    const formattedResponse = [[messageData.name.stringValue,messageData.userName.stringValue,message.age.stringValue,message.phoneNumber.stringValue,message.salary.stringValue,message.savings.stringValue]];
    console.log(formattedResponse)
  
    sheetsClient.authorize((err, tokens) => {
      if (err) {
        console.error(err);
        return;
      } else {
        addResponseToSheet(sheetsClient, formattedResponse);
      }
    });
  
    msg.ack();
  };
  

  sub.on('message', callbackOnPull);
  
  setTimeout(() => {
    sub.removeListener('message', callbackOnPull);
  }, time * 1000);
  
  const addResponseToSheet = async (sheetsClient, response) => {
    const gsapi = google.sheets({
      version: 'v4',
      auth: sheetsClient,
    });
  
    const options = {
      spreadsheetId: process.env.SHEET_ID,
      range: 'Sheet1!A1:B1',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: response,
      },
    };
  
    await gsapi.spreadsheets.values.append(options).then(()=>{
        console.log("added successfully")
    })
  };
  
  server.listen(process.env.SHEETS_PORT, () =>
    console.log(
      `Sheets server started running on port ${process.env.SHEETS_PORT}.`
    )
  );