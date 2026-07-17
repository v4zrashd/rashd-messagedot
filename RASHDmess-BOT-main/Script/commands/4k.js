const axios = require("axios");

const baseApiUrl = async () => {
  const { data } = await axios.get(
    "https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json"
  );
  return data.mostakim;
};

module.exports = {
  config: {
    name: "4k",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "RASHED",
    description: "Enhance image with Remini AI",
    commandCategory: "image",
    usages: "[reply image]",
    cooldowns: 5
  },

  handleEvent: async function ({ api, event }) {
    if (!event.body) return;

    if (event.body.toLowerCase().trim() === "4k") {
      return processImage(api, event);
    }
  },

  run: async function ({ api, event }) {
    return processImage(api, event);
  }
};

async function processImage(api, event) {
  try {
    const imageUrl = event.messageReply?.attachments?.[0]?.url;

    if (!imageUrl) {
      return api.sendMessage(
        "📸 Please reply to an image.",
        event.threadID,
        event.messageID
      );
    }

    const waitMsg = await api.sendMessage(
      "𝐏𝐥𝐞𝐚𝐬𝐞 𝐖𝐚𝐢𝐭...😘",
      event.threadID
    );

    const apiUrl = `${await baseApiUrl()}/remini?input=${encodeURIComponent(imageUrl)}`;

    const image = await axios.get(apiUrl, {
      responseType: "stream"
    });

    api.sendMessage(
      {
        body: "✅ 𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐞𝐧𝐡𝐚𝐧𝐜𝐞𝐝 𝐩𝐡𝐨𝐭𝐨!",
        attachment: image.data
      },
      event.threadID,
      () => {
        api.unsendMessage(waitMsg.messageID);
      },
      event.messageID
    );

  } catch (err) {
    api.sendMessage(
      `❌ Error: ${err.message}`,
      event.threadID,
      event.messageID
    );
  }
}
