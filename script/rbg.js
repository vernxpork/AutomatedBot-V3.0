const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "rbg",
  version: "1.1.0",
  role: 0,
  credits: "Ry, Manuelson,  Vern",
  aliases: [],
  usages: "<reply to image>",
  cooldown: 5,
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID, messageReply } = event;
  const tempPath = path.join(__dirname, "cache", `removebg_${Date.now()}.png`);

  // Validate reply
  if (!messageReply || !messageReply.attachments?.length) {
    return api.sendMessage(
      "❌ Please reply to an image to remove its background.",
      threadID,
      messageID
    );
  }

  const attachment = messageReply.attachments[0];
  if (attachment.type !== "photo") {
    return api.sendMessage(
      "❌ The replied message must be a photo.",
      threadID,
      messageID
    );
  }

  const imageUrl = attachment.url;
  const apiUrl = `https://api-library-kohi.onrender.com/api/removebg?url=${encodeURIComponent(imageUrl)}`;

  try {
    api.sendMessage("⌛ Removing background, please wait...", threadID, messageID);

    // Call API
    const res = await axios.get(apiUrl);
    const resultUrl = res.data?.data?.url;

    if (!res.data?.status || !resultUrl) {
      return api.sendMessage(
        "❌ Failed to remove background. Invalid API response.",
        threadID,
        messageID
      );
    }

    // Download result image
    const img = await axios.get(resultUrl, { responseType: "arraybuffer" });
    await fs.ensureDir(path.dirname(tempPath));
    await fs.writeFile(tempPath, img.data);

    // Send image
    api.sendMessage(
      {
        body: "✅ Background removed successfully!",
        attachment: fs.createReadStream(tempPath),
      },
      threadID,
      () => fs.unlinkSync(tempPath),
      messageID
    );

  } catch (error) {
    console.error("❌ RemoveBG Error:", error);
    api.sendMessage(
      "❌ An error occurred while removing the background. Please try again later.",
      threadID,
      messageID
    );
  }
};