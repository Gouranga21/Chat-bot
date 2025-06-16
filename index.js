import login from '@xaviabot/fca-unofficial';
import fs from 'fs';

const appState = JSON.parse(fs.readFileSync('./appstate.json', 'utf-8'));

login({ appState }, (err, api) => {
  if (err) return console.error(err);

  api.setOptions({ listenEvents: true });

  const stopListening = api.listenMqtt((err, event) => {
    if (err) return console.error(err);

    if (event.type === 'message') {
      const msg = event.body.toLowerCase();

      if (msg === 'hi') {
        api.sendMessage('Hello! 😊', event.threadID);
      }

      if (msg === '/song') {
        api.sendMessage('🎵 আপনার গান আসছে... (এই অংশে গান সংযুক্ত করতে হবে)', event.threadID);
      }
    }
  });
});
