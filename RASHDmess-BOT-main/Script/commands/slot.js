module.exports.config = {
    name: "slot",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "RASHED",
    description: "slot machine game",
    commandCategory: "game",
    usages: "[bet amount]",
    cooldowns: 0,
    usePrefix: true
};

module.exports.languages = {
    "en": {
        "noBalance": "[SLOT] You have no balance!",
        "invalidAmount": "[SLOT] Please enter a valid bet amount.",
        "balanceLow": "[SLOT] Your balance is too low to place this bet!",
        "limitBet": "[SLOT] The minimum bet is $50.",

        "returnWin":
`        🎰 SLOT RESULT 🎰
━━━━━━━━━━━━━━━━━━━━
          | %1 | %2 | %3 |
━━━━━━━━━━━━━━━━━━━━
✨ You Won: $%4 🎉
💰 Congratulations!
━━━━━━━━━━━━━━━━━━━━`,

        "returnLose":
`        🎰 SLOT RESULT 🎰
━━━━━━━━━━━━━━━━━━━━
          | %1 | %2 | %3 |
━━━━━━━━━━━━━━━━━━━━
⚠️ You Lost: $%4 💸
Better luck next time!
━━━━━━━━━━━━━━━━━━━━`,

        "jackpot":
`        🎰 SLOT JACKPOT 🎰
━━━━━━━━━━━━━━━━━━━━
       🔥 | %1 | %2 | %3 | 🔥
━━━━━━━━━━━━━━━━━━━━
💥 JACKPOT WINNER!!! 💥
🏆 You Won: $%4 🤑🎉
━━━━━━━━━━━━━━━━━━━━`
    }
};

module.exports.run = async function({ api, event, args, Currencies, getText }) {
    const { threadID, messageID, senderID } = event;
    const { getData, increaseMoney, decreaseMoney } = Currencies;

    const slotItems = ["🍇","🍉","🍊","🍏","7⃣","🍓","🍒","🍌","🥝","🥑","🌽"];
    const moneyUser = (await getData(senderID)).money;

    if (moneyUser <= 0) 
        return api.sendMessage(getText("noBalance"), threadID, messageID);

    let moneyBet = parseInt(args[0]);
    if (isNaN(moneyBet) || moneyBet <= 0) 
        return api.sendMessage(getText("invalidAmount"), threadID, messageID);
    if (moneyBet < 50) 
        return api.sendMessage(getText("limitBet"), threadID, messageID);
    if (moneyBet > moneyUser) 
        return api.sendMessage(getText("balanceLow"), threadID, messageID);

    let numbers = [];
    for (let i = 0; i < 3; i++) 
        numbers[i] = Math.floor(Math.random() * slotItems.length);

    let win = false;
    let multiplier = 0;

    const jackpotChance = Math.floor(Math.random() * 1000);
    if (jackpotChance === 1) {
        multiplier = 50;
        win = "jackpot";
    } else if (numbers[0] === numbers[1] && numbers[1] === numbers[2]) {
        multiplier = slotItems[numbers[0]] === "7⃣" ? 20 : 10;
        win = true;
    } else if (numbers[0] === numbers[1] || numbers[0] === numbers[2] || numbers[1] === numbers[2]) {
        multiplier = 2;
        win = true;
    } else if (numbers.includes(slotItems.indexOf("7⃣"))) {
        multiplier = 1;
        win = true;
    }

    let finalMoney = moneyBet * multiplier;

    switch (win) {
        case "jackpot":
            await increaseMoney(senderID, finalMoney);
            return api.sendMessage(
                getText("jackpot", slotItems[numbers[0]], slotItems[numbers[1]], slotItems[numbers[2]], finalMoney),
                threadID,
                messageID
            );

        case true:
            await increaseMoney(senderID, finalMoney);
            return api.sendMessage(
                getText("returnWin", slotItems[numbers[0]], slotItems[numbers[1]], slotItems[numbers[2]], finalMoney),
                threadID,
                messageID
            );

        default:
            await decreaseMoney(senderID, moneyBet);
            return api.sendMessage(
                getText("returnLose", slotItems[numbers[0]], slotItems[numbers[1]], slotItems[numbers[2]], moneyBet),
                threadID,
                messageID
            );
    }
};
