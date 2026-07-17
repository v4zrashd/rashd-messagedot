const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "unsend",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "SA HU", //please don't change credit
  description: "Unsend bot's sent message",
  commandCategory: "system",
  usages: "uns / del / delete / remove / u",
  cooldowns: 0
};

const lang = {
  returnCant: "কি unsent করমু? reply করে বলো সুনা 🫰",
  missingReply: "কি unsent করমু? reply করে বলো সুনা 🫰"
};

module.exports.run = async function ({ api, event }) {
  if (event.type !== "message_reply")
    return api.sendMessage(lang.missingReply, event.threadID, event.messageID);

  if (event.messageReply.senderID !== api.getCurrentUserID())
    return api.sendMessage(lang.returnCant, event.threadID, event.messageID);

  return api.unsendMessage(event.messageReply.messageID);
};

module.exports.handleEvent = async function ({ api, event }) {
  try {
    const body = (event.body || "").trim().toLowerCase();

    const triggers = ["uns", "unsend", "del", "delete", "remove", "u"];

    let prefixes = [""];
    try {
      const prefixFile = path.join(__dirname, "prefix.js");
      if (fs.existsSync(prefixFile)) {
        const getPrefix = require(prefixFile);
        if (Array.isArray(getPrefix)) prefixes = ["", ...getPrefix];
        else if (typeof getPrefix === "string") prefixes = ["", getPrefix];
      }
    } catch (e) {}

    const isTriggered = prefixes.some(p =>
      triggers.some(t => body === p + t)
    );

    if (isTriggered) {
      if (event.type !== "message_reply")
        return api.sendMessage(lang.missingReply, event.threadID, event.messageID);

      if (event.messageReply.senderID !== api.getCurrentUserID())
        return api.sendMessage(lang.returnCant, event.threadID, event.messageID);

      return api.unsendMessage(event.messageReply.messageID);
    }
  } catch (err) {
    console.error("tor kotha suntam na 🤣", err);
  }
};
