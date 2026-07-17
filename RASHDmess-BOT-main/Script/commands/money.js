module.exports.config = {
    name: "money",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "RASHED",
    description: "Lightweight economy system",
    commandCategory: "economy",
    usages: "",
    cooldowns: 0
};

module.exports.run = async function({ api, event, args, Currencies }) {
    const { threadID, senderID, messageID, mentions } = event;

    if (!args[0]) {
        return api.sendMessage(
            "⚡ Available Commands:\n» money ck @tag\n» money me <amount>\n» money send @tag <amount>\n» money gift @tag <amount>\n» money restart\n» money board",
            threadID,
            messageID
        );
    }

    const type = args[0].toLowerCase();

    if (type === "ck") {
        if (Object.keys(mentions).length !== 1)
            return api.sendMessage("⚠️ Please tag 1 user!", threadID, messageID);

        const uid = Object.keys(mentions)[0];
        const money = (await Currencies.getData(uid)).money || 0;

        return api.sendMessage(
            {
                body: `💰 ${mentions[uid]}'s balance: ${money}$`,
                mentions: [{ tag: mentions[uid], id: uid }]
            },
            threadID,
            messageID
        );
    }

    if (type === "me") {
        if (!args[1] || isNaN(args[1]))
            return api.sendMessage("⚠️ Usage: money me <amount>", threadID, messageID);

        const amount = parseInt(args[1]);
        await Currencies.increaseMoney(senderID, amount);

        return api.sendMessage(`💵 Added ${amount}$ to your balance!`, threadID, messageID);
    }

    if (type === "send") {
        if (Object.keys(mentions).length !== 1)
            return api.sendMessage("⚠️ Usage: money send @tag <amount>", threadID, messageID);

        const uid = Object.keys(mentions)[0];
        const amount = parseInt(args[args.length - 1]);

        if (isNaN(amount))
            return api.sendMessage("⚠️ Usage: money send @tag <amount>", threadID, messageID);

        const senderData = await Currencies.getData(senderID);
        if (senderData.money < amount)
            return api.sendMessage("❌ You don't have enough money!", threadID, messageID);

        await Currencies.decreaseMoney(senderID, amount);
        await Currencies.increaseMoney(uid, amount);

        return api.sendMessage(
            {
                body: `✅ Sent ${amount}$ to ${mentions[uid]}`,
                mentions: [{ tag: mentions[uid], id: uid }]
            },
            threadID,
            messageID
        );
    }

    if (type === "gift") {
        if (Object.keys(mentions).length !== 1)
            return api.sendMessage("⚠️ Usage: money gift @tag <amount>", threadID, messageID);

        const uid = Object.keys(mentions)[0];
        const amount = parseInt(args[args.length - 1]);

        if (isNaN(amount))
            return api.sendMessage("⚠️ Usage: money gift @tag <amount>", threadID, messageID);

        await Currencies.increaseMoney(uid, amount);

        return api.sendMessage(
            {
                body: `🎁 Gifted ${amount}$ to ${mentions[uid]}`,
                mentions: [{ tag: mentions[uid], id: uid }]
            },
            threadID,
            messageID
        );
    }

    if (type === "restart") {
        await Currencies.setData(senderID, { money: 0 });
        return api.sendMessage("♻️ Your money has been reset.", threadID, messageID);
    }

    if (type === "board") {
        const allUsers = await Currencies.getAll(["money"]);

        const filtered = allUsers.map(u => ({
            userID: u.userID,
            money: u.money || u.data?.money || 0
        }));

        filtered.sort((a, b) => b.money - a.money);
        const top = filtered.slice(0, 5);

        let msg = "🏆 Top Richest Users:\n\n";
        let index = 1;

        for (const user of top) {
            let name = global.data.userName.get(user.userID);

            if (!name) {
                try {
                    const info = await api.getUserInfo(user.userID);
                    name = info[user.userID]?.name || "Unknown User";
                    global.data.userName.set(user.userID, name);
                } catch {
                    name = "Unknown User";
                }
            }

            msg += `${index++}. ${name} — ${user.money}$\n`;
        }

        return api.sendMessage(msg, threadID, messageID);
    }

    return api.sendMessage("⚠️ Invalid command.", threadID, messageID);
};
