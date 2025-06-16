const { facebook } = require("@xaviabot/fb-chat-api");
const fs = require("fs");

// JSON ফাইলটি লোড করা হচ্ছে
let replies = {};
try {
  const data = fs.readFileSync("./replies.json", "utf8");
  replies = JSON.parse(data);
} catch (err) {
  console.error("❌ replies.json লোড করতে সমস্যা:", err.message);
  process.exit(1);
}

facebook({ appStatePath: "./fbstate.json" }).then(api => {
  console.log("✅ বট চালু হয়েছে...");

  api.listenMqtt((err, event) => {
    if (err || event.type !== "message") return;

    const message = event.body?.trim();
    if (!message) return;

    if (replies[message]) {
      api.sendMessage(replies[message], event.threadID, event.messageID);
    }
  });
});
