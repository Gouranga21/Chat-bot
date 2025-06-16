const login = require('@xaviabot/fb-chat-api');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { log } = require('./utils/log');

const appState = require('./appstate.json');
const config = require('./config.json');

login({ appState }, (err, api) => {
  if (err) return console.error(err);

  api.setOptions({ listenEvents: true });

  log('🤖 Bot is ready and listening...');

  api.listenMqtt(async (err, event) => {
    if (err) return console.error(err);
    if (event.type !== 'message' || !event.body) return;

    const body = event.body.toLowerCase();
    const senderID = event.senderID;

    // /song command
    if (body.startsWith("/song ")) {
      const query = body.slice(6).trim();
      const results = [];

      for (let i = 1; i <= 5; i++) {
        results.push({
          title: `${query} - গান ${i}`,
          duration: `${3 + i} মিনিট`,
          url: `https://example.com/${query}-song${i}.mp3`
        });
      }

      let message = `🎵 "${query}" এর জন্য ৫টি গান পাওয়া গেছে:\n\n`;
      results.forEach((song, i) => {
        message += `${i + 1}. ${song.title} (${song.duration})\n`;
      });
      message += `\nকোন গানটি শুনতে চাও? গান নাম্বার রিপ্লাই করো।`;

      api.sendMessage(message, event.threadID, (err, msgInfo) => {
        if (err) return console.error(err);
        api.once('message', response => {
          const index = parseInt(response.body);
          if (!isNaN(index) && results[index - 1]) {
            api.sendMessage({
              body: `🎧 নিচে তোমার গানটি: ${results[index - 1].title}`,
              attachment: axios({
                url: results[index - 1].url,
                method: 'GET',
                responseType: 'stream'
              }).then(res => res.data)
            }, response.threadID);
          }
        });
      });

      return;
    }

    // Regular command response
    for (const key in config) {
      if (body.includes(key.toLowerCase())) {
        api.sendMessage(config[key], event.threadID);
        return;
      }
    }
  });
});
