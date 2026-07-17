module.exports.config = {
  name: "toilet",
  version: "1.0.0",
  credits: "RASHED",
  description: "Generate a couple banner image using sender and target Facebook UID via Avatar Canvas API",
  commandCategory: "banner",
  usePrefix: true,
  usages: "[@mention | reply]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args, Currencies }) {
  const axios = require("axios");
  const fs = require("fs-extra");
  const path = require("path");

  try {
    const apiList = await axios.get(
      "https://raw.githubusercontent.com/shahadat-sahu/RASHED-API/refs/heads/main/RASHED-API.json"
    );

    const AVATAR_CANVAS_API = apiList.data.AvatarCanvas;

    const mentions = event.mentions;
    const messageReply = event.messageReply;

    let targetID = null;

    if (mentions && Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } else if (messageReply && messageReply.senderID) {
      targetID = messageReply.senderID;
    }

    if (!targetID) {
      return api.sendMessage("Please reply or mention someone......", event.threadID, event.messageID);
    }

    const senderID = event.senderID;

    const randomPercent = Math.floor(Math.random() * 101);
    const randomAmount = Math.floor(Math.random() * 100000) + 100000;
    await Currencies.increaseMoney(senderID, parseInt(randomPercent * randomAmount));

    const res = await axios.post(
      `${AVATAR_CANVAS_API}/api`,
      {
        cmd: "toilet",
        uid: targetID
      },
      {
        responseType: "arraybuffer",
        timeout: 30000
      }
    );

    const imgPath = path.join(__dirname, "cache", `toilet_${targetID}.png`);
    fs.writeFileSync(imgPath, res.data);

    return api.sendMessage(
      {
        body: "বেশি বাল পাকলামির জন্য তোরে টয়লেটে ফেলে দিলাম🤣🤮",
        attachment: fs.createReadStream(imgPath)
      },
      event.threadID,
      () => fs.unlinkSync(imgPath),
      event.messageID
    );

  } catch (e) {
    return api.sendMessage("API Error Call Boss RASHED", event.threadID, event.messageID);
  }
};
