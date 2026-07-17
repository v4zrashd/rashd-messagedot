module.exports.config = {
  name: "newbox",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "RASHED",
  description: "Create a new chat group with mentioned users",
  commandCategory: "Group",
  usages: "newbox @tag | Group Name",
  cooldowns: 0,
  usePrefix: true
};

module.exports.run = async function ({ api, event }) {
  const sender = event.senderID;
  const mentions = Object.keys(event.mentions);
  const body = event.body;

  if (!body.includes("|")) {
    return api.sendMessage(
      "Usage: newbox @tag1 @tag2 & Group Name",
      event.threadID,
      event.messageID
    );
  }

  const groupName = body.split("|")[1].trim();

  let members = [sender];

  for (let id of mentions) {
    if (!members.includes(id)) members.push(id);
  }

  api.createNewGroup(members, groupName, () => {
    api.sendMessage(
      `Group created successfully: ${groupName}`,
      event.threadID
    );
  });
};
