const axios = require("axios");

module.exports = {
  config: {
    name: "ai",
    version: "1.0.1",
    credits: "RASHED",
    cooldowns: 0,
    hasPermssion: 0,
    usePrefix: true
  },

  run: async ({ api, args, event }) => {
    const { threadID, messageID } = event;
    const input = args.join(" ").trim();

    let AI_API;

    try {
      const res = await axios.get(
        "https://raw.githubusercontent.com/shahadat-sahu/RASHED-API/main/RASHED-API.json"
      );
      AI_API = res.data?.ai;
      if (!AI_API) throw new Error();
    } catch (e) {
      return api.sendMessage("❌ API load failed!", threadID, messageID);
    }

    const askAI = async (text) => {
      try {
        const res = await axios.get(`${AI_API}?q=${encodeURIComponent(text)}`);
        return (
          res.data?.answer ||
          res.data?.response ||
          res.data?.reply ||
          "⚠️ No response"
        );
      } catch (e) {
        return "❌ AI error!";
      }
    };

    const react = (emoji) =>
      api.setMessageReaction(emoji, messageID, () => {}, true);

    if (event.type === "message_reply" && event.messageReply.body && !input) {
      react("⏳");
      const reply = await askAI(event.messageReply.body);
      await api.sendMessage(reply, threadID, messageID);
      return react("✅");
    }

    if (!input) {
      return api.sendMessage(
        "🤖 Usage:\n• /ai your question\n• Reply any message with /ai",
        threadID,
        messageID
      );
    }

    react("⏳");
    const reply = await askAI(input);
    await api.sendMessage(reply, threadID, messageID);
    return react("✅");
  }
};
