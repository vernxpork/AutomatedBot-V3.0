module.exports.config = {
    name: "autoreact",
    version: "3.6.0",
    description: "Auto reacts to messages based on mood emojis or keywords"
};

module.exports.handleEvent = async function ({ api, event }) {
    if (!event.body) return;
    const text = event.body.toLowerCase();

    const pick = arr => arr[Math.floor(Math.random() * arr.length)];

    // Define moods and their corresponding emojis
    const reactions = [
        {
            keywords: ["lol", "😂", "🤣", "haha", "hehe", "hihi", "yay", "hooray", "😊", "😁", "😁"],
            emojis: ["😆","🤣","😂","😁","😄"]
        },
        {
            keywords: ["sad", "😭", "😢", "hurt", "☹️", "😔", "upset", "unhappy", "😞", "😟"],
            emojis: ["😢","😭","🥀","😔"]
        },
        {
            keywords: ["angry", "mad", "😡", "😠", "frustrated", "grr"],
            emojis: ["😡","😠","🤬"]
        },
        {
            keywords: ["love", "😍", "😘", "💋", "💖", "❤️"],
            emojis: ["😍","😘","💖","❤️"]
        }
    ];

    // Loop through moods and react if a keyword matches
    for (let r of reactions) {
        if (r.keywords.some(word => text.includes(word))) {
            return api.setMessageReaction(pick(r.emojis), event.messageID, () => {}, true);
        }
    }
};