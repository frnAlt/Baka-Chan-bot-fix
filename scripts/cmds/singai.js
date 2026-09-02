const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const meta = {
  name: "singai",
  aliases: ["ai-music", "udio", "ai-sing", "musicai"],
  version: "1.2.0",
  author: "Farhan",
  description: "Generate AI music using Udio (by Anon) API.",
  category: "ai",
  cooldown: 10,
  prefix: true,
  guide: {
    en: "{pn} <prompt> [--lyricsType=<type>] [--tags=<tags>] [--negativeTags=<tags>] [--title=<title>]",
  },
};

async function onStart({ message, args }) {
  if (args.length === 0)
    return message.reply(
      "🎵 | Please provide a prompt!\n\nExample:\n" +
      "singai Love song about stars --lyricsType=melodic --tags=pop,romantic --title=Galactic Heart"
    );

  // Parse all arguments nicely
  const input = args.join(" ");
  const extract = (key) => {
    const match = input.match(new RegExp(`--${key}=([^\\s]+)`));
    return match ? decodeURIComponent(match[1]) : "";
  };

  const prompt = input.split("--")[0].trim();
  const lyricsType = extract("lyricsType");
  const tags = extract("tags");
  const negativeTags = extract("negativeTags");
  const title = extract("title");

  const waitMsg = await message.reply("🎧 Generating your AI track... please wait a moment.");

  try {
    const apiURL = `https://dev.oculux.xyz/api/udio?prompt=${encodeURIComponent(prompt)}&lyricsType=${encodeURIComponent(
      lyricsType
    )}&tags=${encodeURIComponent(tags)}&negativeTags=${encodeURIComponent(negativeTags)}&title=${encodeURIComponent(title)}`;

    const { data } = await axios.get(apiURL, { timeout: 60000 });

    if (!data) throw new Error("No response from Udio API.");
    const audioURL = data.audio || data.result || data.url;

    if (!audioURL || !audioURL.endsWith(".mp3")) {
      await message.unsend(waitMsg.messageID);
      return message.reply("❌ | No valid audio found in response. Try again later.");
    }

    const tempDir = "temp";
    await fs.ensureDir(tempDir);

    const filePath = path.join(tempDir, `udio_${Date.now()}.mp3`);
    const response = await axios.get(audioURL, { responseType: "arraybuffer" });
    await fs.writeFile(filePath, response.data);

    const info =
      `🎵 **Udio AI Music Generated**\n\n` +
      `🪄 Prompt: ${prompt}\n` +
      (title ? `🎙️ Title: ${title}\n` : "") +
      (lyricsType ? `🎼 Lyrics Type: ${lyricsType}\n` : "") +
      (tags ? `🏷️ Tags: ${tags}\n` : "") +
      (negativeTags ? `🚫 Negative Tags: ${negativeTags}\n` : "") +
      `\n🔊 Enjoy your AI-generated track!`;

    await message.reply({
      body: info,
      attachment: fs.createReadStream(filePath),
    });

    await fs.remove(filePath);
    await message.unsend(waitMsg.messageID);
  } catch (err) {
    console.error("[Udio API Error]", err);
    await message.reply("🚨 | Failed to generate AI music. The API may be slow or unavail able.");
  }
      }

module.exports = {
  config: meta,
  onStart,
};
