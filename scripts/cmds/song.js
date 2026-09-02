const axios = require("axios");

const config = {
  name: "song",
  version: "2.0",
  author: "Farhan",
  role: 0,
  countDown: 5,
  shortDescription: "Get song lyrics",
  longDescription: "Fetch lyrics for a given song using sus-apis lyrics API.",
  category: "music",
  guide: {
    en: "{p}song <song name>"
  }
};

async function onCall({ message, args }) {
  if (!args[0]) {
    return message.reply("⚠️ Please provide a song name.\nExample: song never gonna give you up");
  }

  const query = args.join(" ");
  const wait = await message.reply(`🎵 Searching lyrics for: **${query}** ...`);

  try {
    const url = `https://sus-apis.onrender.com/api/lyrics?query=${encodeURIComponent(query)}`;
    const res = await axios.get(url);
    const data = res.data;

    if (!data || !data.result) {
      return message.reply("❌ Lyrics not found!");
    }

    const lyrics = data.result.lyrics || "No lyrics available.";
    const title = data.result.title || query;
    const artist = data.result.artist || "Unknown Artist";

    let replyText = `🎶 **${title}**\n👤 Artist: ${artist}\n\n`;
    replyText += lyrics.length > 4000
      ? lyrics.substring(0, 4000) + "\n\n...(lyrics truncated)"
      : lyrics;

    await message.reply(replyText);

  } catch (e) {
    console.error(e);
    message.reply("⚠️ Error fetching lyrics. The API might be down.");
  } finally {
    if (wait?.messageID) message.unsend(wait.messageID);
  }
}

module.exports = {
  config,
  onCall
};
      
