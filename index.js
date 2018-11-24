const Bot = require('node-telegram-bot-api');
const request = require('request');
const token = '628871493:AAHHoD3EpiY-T15gpStdY0XqyuHRbHRHhUQ';
const bot = new Bot(token, {polling: true});
const parseString = require('xml2js').parseString;
const VIDEO_MEDIATYPE = 'video_episode';
const AUDIO_MEDIATYPE = 'audio_podcast';
let response = '';

// Listen for any kind of message
bot.on('message', (msg) => {
  const parts = msg.text.toString().split('/');
  const lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
  const gatlingLink = 'https://gatling.nelonenmedia.fi/media-xml-cache?id=' + lastSegment;

  return request(gatlingLink, (err, resp, body) => {
    parseString(body, function (err, result) {
      const json = JSON.stringify(result);
      const obj = JSON.parse(json);

      if (obj) {
        switch(obj.Playerdata.Clip[0].MediaType) {
          case VIDEO_MEDIATYPE:
            response = obj.Playerdata.Clip[0].AndroidMediaFiles[0].AndroidMediaFile[0];
            break;

          case AUDIO_MEDIATYPE:
            response = obj.Playerdata.Clip[0].AudioMediaFiles[0].AudioMediaFile[0];
            break;

          default:
            response = 'Ei toiminu saatana!';
            break;
        }
 
        bot.sendMessage(msg.chat.id, response);
      }
    });
   });
});
