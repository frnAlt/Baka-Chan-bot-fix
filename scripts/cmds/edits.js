const axios = require("axios");
const fs = require("fs");
const path = require("path");

const config = {
  name: "editis",
  aliases: ["edit", "aiimage"],
  version: "2.0",
  author: "Farhan & KHAN RAHUL RK",
  role: 0,
  countDown: 5,
  shortDescription: "AI image editing using prompt + image or attachment",
  longDescription: "Transform an image with AI based on your prompt. You can reply to an image or provide a direct URL.",
  category: "ai",
  guide: "{p}editimg <prompt> + reply to image or provide URL\nExample: {p}editimg make it cyberpunk | reply to image"
};

async function onCall({ message, args, event, api }) {
  let imageUrl = event.messageReply?.attachments?.[0]?.url || null;
  const prompt = args.join(" ").split("|")[0]?.trim();

  // If image URL is provided after pipe
  if (!imageUrl && args.length > 1) {
    imageUrl = args.join(" ").split("|")[1]?.trim();
  }

  if (!prompt || !imageUrl) {
    return message.reply(
      `📸 𝗘𝗗𝗜𝗧•𝗜𝗠𝗚\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `⛔️ You must provide both a prompt and an image!\n\n` +
      `✨ Example:\n` +
      `▶️ editimg add cyberpunk vibe |\n\n` +
      `🖼️ Or reply to an image with:\n` +
      `▶️ editimg add cyberpunk vibe`
    );
  }

  imageUrl = imageUrl.replace(/\s/g, "");
  if (!/^https?:\/\//.test(imageUrl)) {
    return message.reply(
      `⚠️ Invalid image URL!\n` +
      `🔗 Must start with http:// or https://`
    );
  }

  const apiUrl = `https://masterapi.fun/api/editimg?prompt=${encodeURIComponent(prompt)}&image=${encodeURIComponent(imageUrl)}`;

  const waitMsg = await message.reply("⏳ Generating your AI edited image, please wait...");

  try {
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const tempPath = path.join(cacheDir, `edited_${event.senderID}_${Date.now()}.jpg`);
    const response = await axios({
      method: "GET",
      url: apiUrl,
      responseType: "stream"
    });

    const writer = fs.createWriteStream(tempPath);
    response.data.pipe(writer);

    writer.on("finish", async () => {
      await message.reply({
        body: `🔍 Prompt: "${prompt}"\n🖼️ Your AI image is ready! ✨\n\n👨‍💻 Edited by Farhan & KHAN RAHUL RK`,
        attachment: fs.createReadStream(tempPath)
      });

      fs.unlinkSync(tempPath); // cleanup
      if (waitMsg?.messageID) api.unsendMessage(waitMsg.messageID);
    });

    writer.on("error", (err) => {
      console.error(err);
      message.reply("❌ Failed to save the AI image.");
      if (waitMsg?.messageID) api.unsendMessage(waitMsg.messageID);
    });

  } catch (error) {
    console.error(error);
    message.reply("❌ Failed to generate AI image. Please try again later.");
    if (waitMsg?.messageID) api.unsendMessage(waitMsg.messageID);
  }
}

module.exports = {
  config,
  onCall
};
      
