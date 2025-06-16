const login = require('facebook-chat-api');
const fs = require('fs');
const axios = require('axios');

// fbstate.json থেকে লগইন ইনফো লোড
const appState = require('./fbstate.json');

// replies.json থেকে টার্গেট মেসেজ ও রিপ্লাই লোড
const replies = require('./replies.json');

// গান খুঁজে রাখা জন্য অস্থায়ী স্টোর
let songSearchResults = {};

login({ appState }, (err, api) => {
    if (err) return console.error("❌ Login failed:", err);

    console.log("✅ Bot is now running...");

    api.listenMqtt((err, message) => {
        if (err || !message || !message.body) return;

        const body = message.body.toLowerCase();
        const threadID = message.threadID;

        // 🔁 সাধারণ টার্গেট রেসপন্স
        for (const target in replies) {
            if (body.startsWith(target.toLowerCase())) {
                api.sendMessage(replies[target], threadID);
                return;
            }
        }

        // 🎵 /song গান অনুসন্ধান
        if (body.startsWith("/song ")) {
            const query = encodeURIComponent(body.replace("/song ", ""));
            const apiUrl = `https://saavn.dev/api/search/songs?query=${query}`;

            axios.get(apiUrl).then(res => {
                const results = res.data.data.results.slice(0, 5);
                if (results.length === 0) {
                    api.sendMessage("❌ কোনো গান খুঁজে পাওয়া যায়নি।", threadID);
                    return;
                }

                // স্টোর করে রাখা
                songSearchResults[threadID] = results;

                let response = "🎵 গান পাওয়া গেছে:\n\n";
                results.forEach((song, index) => {
                    response += `${index + 1}. ${song.name} - ${song.primaryArtists}\n🕒 ${song.duration} seconds\n\n`;
                });
                response += "যে গানটি চাও তার নাম্বার reply করো। (যেমন: 1)";

                api.sendMessage(response, threadID);
            }).catch(() => {
                api.sendMessage("❌ গান খোঁজার সময় সমস্যা হয়েছে।", threadID);
            });

        } else if (/^[1-5]$/.test(body) && songSearchResults[threadID]) {
            // 🎧 ইউজার গান নির্বাচন করলে
            const index = parseInt(body) - 1;
            const song = songSearchResults[threadID][index];
            if (!song) {
                api.sendMessage("❌ এই নাম্বারে কোনো গান খুঁজে পাওয়া যায়নি।", threadID);
                return;
            }

            api.sendMessage({
                body: `🎧 ${song.name}\nBy: ${song.primaryArtists}`,
                attachment: axios.get(song.downloadUrl[4].link, { responseType: 'stream' }).then(res => res.data)
            }, threadID);

            delete songSearchResults[threadID]; // একবার পাঠানো হলে মুছে দাও
        }
    });
});
