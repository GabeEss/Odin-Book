const User = require('../models/user');

class Bot {
    // Friendly bot responds to messages
    static async initializeFriendlyBot(botUserId) {
        const bot = await User.findOne({ userId: botUserId });
        if(!bot) {
            try {
                console.log("No friendly bot found. Creating new bot.");
                const newBot = new User({
                    userId: "Friendly_Bot_01",
                    username: "Friendly Bot",
                    email: "friendly_bot@namebook.app",
                    worksAt: "Name Book",
                    livesIn: "Name Book",
                    from: "Cyberspace",
                    displayColor: "blue",
                    coverColor: "yellow",
                    friends: [],
                    friendRequests: [],
                    sentRequests: [],
                    notifications: [],
                })
                await newBot.save();
                return newBot;
            } catch {
                console.error("Failed to create bot.")
                return;
            }            
        }
        console.log("Bot exists.");
        return bot;
    }
}

module.exports = Bot;