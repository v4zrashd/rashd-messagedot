module.exports.config = {
  name: "spam",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "RASHED",
  description: "",
  commandCategory: "spam",
  usages: "[msg] [amount]",
  cooldowns: 5,
  dependencies: "",
};

module.exports.run = function ({ api, event, args }) {
  if (args.length !== 2) {
    return api.sendMessage(
      `Invalid number of arguments. Usage: ${global.config.PREFIX}spam [msg] [amount]`,
      event.threadID,
      event.messageID
    );
  }

  const { threadID } = event;
  const msg = args[0];
  const count = parseInt(args[1]);

  for (let i = 0; i < count; i++) {
    api.sendMessage(msg, threadID);
  }
};
