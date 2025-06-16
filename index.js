const login = require("facebook-chat-api");
const fs = require("fs");
const yts = require("yt-search");

const appState = JSON.parse(fs.readFileSync("fbstate.json", "utf8"));
const replies = JSON.parse(fs.readFileSync("replies.json", "utf8"));
let songs = JSON.parse(fs.readFileSync("songs.json", "utf8"));

login({ appState }, (err, api) => {
  if (err) return console.error("Login failed:", err);

  console.log("✅ Bot logged in!");
  api.setOptions({ listenEvents: true });

  api.listenMqtt(async (err, event) => {
    if (err) return console.error(err);
    if (event.type !== "message" || !event.body) return;

    const msg = event.body.trim().toLowerCase();
    const threadID = event.threadID;

    // Song search trigger
    if (msg.startsWith("/song ")) {
      const query = msg.replace("/song ", "");
      const result = await yts(query);
      const videos = result.videos.slice(0, 5);

      if (videos.length === 0) {
        return api.sendMessage("😢 No results found.", threadID);
      }

      songs[threadID] = videos;
      fs.writeFileSync("songs.json", JSON.stringify(songs, null, 2));

      let message = "🎵 Songs found:\n\n";
      videos.forEach((v, i) => {
        message += `${i + 1}. ${v.title} (${v.timestamp})\n`;
      });
      message += "\n📥 Reply with number (1-5) to receive the audio.";

      return api.sendMessage(message, threadID);
    }

    // Song selection
    if (songs[threadID] && /^[1-5]$/.test(msg)) {
      const index = parseInt(msg) - 1;
      const song = songs[threadID][index];
      if (!song) return;

      api.sendMessage(`🎧 You selected: ${song.title} (${song.timestamp})\nDownload manually:\nhttps://www.youtube.com/watch?v=${song.videoId}`, threadID);
    }

    // Simple replies from replies.json
    if (replies[msg]) {
      return api.sendMessage(replies[msg], threadID);
    }
  });
});
