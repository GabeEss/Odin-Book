const User = require('../models/user');
const Message = require('../models/user');
const Event = require('../models/event');
const Notification = require('../models/notification');

class BotService {
    static BOTS = {
        // WELCOME BOT SENDS A MESSAGE ON SIGN UP AND RESPONDS TO MESSAGES
        WELCOME: {
            userId: "bot_welcome_001",
            username: 'WelcomeBot',
            email: 'bot.welcome@namebook.com',
            worksAt: "Name Book",
            livesIn: "Digital Space",
            from: "The Cloud",
            displayColor: "blue",
            coverColor: "yellow",
            friends: [],
            friendRequests: [],
            sentRequests: [],
            notifications: [],
        },
    }

    static async initializeBots() {
        // Get all bot configs
        for(const botConfig of Object.values(this.BOTS)) {
            let bot = await User.findOne({ userId: botConfig.userId });
            if(!bot) {
                try {
                    bot = new User(botConfig);
                    await bot.save();
                    console.log(`Create bot: ${botConfig.username}`);
                } catch {
                    console.error("Failed to create bot.");
                }
            } else console.log(`Bot exists: ${botConfig.username}`);
        }
    }

    static async isBotUserId(userId) {
        return userId.startsWith('bot_');
    }

    static async handleSignUp(newUser, io) {
        const welcomeBot = await User.findOne({ userId: this.BOTS.WELCOME.userId })
        if(!welcomeBot) {
            console.log("Failed to get Welcome Bot for user sign up.");
            return;
        }

        const welcomeMessage = 'Welcome to Name Book! Feel free to shoot me a message.';

        const message = new Message({
            sender: welcomeBot._id,
            receiver: newUser._id,
            message: welcomeMessage,
            timestamp: new Date()
        });

        const notification = new Notification({
            notification: ``,
            timestamp: new Date(),
            user: newUser._id,
            read: false,
            type: 'newMessage',
            triggeredBy: welcomeBot._id
        });

        try {
            await message.save();
            console.log("Message inserted");
            await notification.save();
            console.log("Notification sent.");

            const chatroomId = [newUser._id, welcomeBot._id].sort().join('-');

            if(io) {
                io.to('message-' + chatroomId).emit('message', message);
                io.to('has-notification-' + newUser._id).emit('notification', message);
            }
        } catch(error) {
            console.error("Error inserting message:", error);
        }
    }
}

module.exports = BotService;