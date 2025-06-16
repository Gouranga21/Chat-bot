import login from "@xaviabot/fca-unofficial";
import fs from "fs";

const appState = JSON.parse(fs.readFileSync("appstate.json", "utf8"));

login({ appState }, (err, api) => {
  if (err) return console.error("Login error:", err);

  api.setOptions({
    listenEvents: true,
    selfListen: false
  });

  api.listenMqtt((err, message) => {
    if (err) return console.error(err);

    if (message.type === "message" && message.body) {
      if (message.body.toLowerCase() === "/ping") {
        api.sendMessage("🏓 Pong!", message.threadID);
      }

      if (message.body.toLowerCase().startsWith("/song")) {
        api.sendMessage("🎵 গান ফিচার এখনো তৈরি হয়নি।", message.threadID);
      }
    }
  });
});
