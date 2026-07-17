module.exports.config = {
    name: "top",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "RASHED",
    description: "Top 10 richest users",
    commandCategory: "economy",
    usages: "",
    cooldowns: 0
};

module.exports.run = async function({ api, event, Currencies }) {
    const { threadID, messageID } = event;

    const all = await Currencies.getAll(["money"]);

    const list = all.map(u => ({
        userID: u.userID,
        money: u.money || u.data?.money || 0
    }));

    list.sort((a, b) => b.money - a.money);

    const topTen = list.slice(0, 10);

    let msg = "🏆 TOP 10 RICHEST USERS 🏆\n\n";
    let index = 1;

    for (const user of topTen) {
        let name = global.data.userName.get(user.userID);

        if (!name) {
            try {
                const info = await api.getUserInfo(parseInt(user.userID));
                name = info[user.userID]?.name || null;
                if (name) global.data.userName.set(user.userID, name);
            } catch {
                name = null;
            }
        }

        if (!name) {
            try {
                const threadInfo = await api.getThreadInfo(threadID);
                const match = threadInfo.userInfo.find(u => u.id == user.userID);
                if (match) name = match.name;
            } catch {}
        }

        if (!name) name = `User (${user.userID})`;

        let number = index < 10 ? `0${index}` : `${index}`;
        msg += `${number}. ${name} — ${user.money}$\n`;

        index++;
    }

    return api.sendMessage(msg, threadID, messageID);
};
