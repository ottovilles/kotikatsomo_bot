const Bot = require('node-telegram-bot-api');
const request = require('request');
const token = 'your_api_token';
const bot = new Bot(token, {polling: true});
const parseString = require('xml2js').parseString;

// Listen for any kind of message
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const parts = msg.text.toString().split('/');
  const lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
  const gatlingLink = 'https://gatling.nelonenmedia.fi/media-xml-cache?id=' + lastSegment;

  return request(gatlingLink, (err, resp, body) => {
    parseString(body, function (err, result) {
      const json = JSON.stringify(result);
      const obj = JSON.parse(json);

      if (obj) {
        const responseLink = obj.Playerdata.Clip[0].AndroidMediaFiles[0].AndroidMediaFile[0];
        bot.sendMessage(msg.chat.id, responseLink);
      }
    });
   });
});
