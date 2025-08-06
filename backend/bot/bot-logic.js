const User = require('../models/user');
const Message = require('../models/message');
const Notification = require('../models/notification');

// NOTE: THIS CLASS DOES NOT CHECK FOR USER TYPE SAFETY
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

    static async handleSignUp(newUser) {
        const welcomeBot = await User.findOne({ userId: this.BOTS.WELCOME.userId })
        if(!welcomeBot) {
            console.log("Failed to get Welcome Bot for user sign up.");
            return;
        }

        // Does not catch bad types
        if(!newUser) {
            console.log("New user is not properly defined for bot logic.");
            return;
        }

        const welcomeMessage = 'Welcome to Name Book! Feel free to shoot me a message.';

        // Check for welcome message
        const existing = await Message.findOne({
            sender: welcomeBot._id,
            receiver: newUser._id,
            message: welcomeMessage
        });

        if(existing) {
            console.log("Welcome message already sent.")
            return;
        }

        const message = new Message({
            sender: welcomeBot._id,
            receiver: newUser._id,
            message: welcomeMessage,
            timestamp: new Date()
        });

        const notification = new Notification({
            notification: `${welcomeBot.username} sent you a message.`,
            timestamp: new Date(),
            user: newUser._id,
            read: false,
            type: 'newMessage',
            triggeredBy: welcomeBot._id
        });

        try {
            await message.save();
            console.log("Bot message inserted.");
            await notification.save();
            console.log("Bot notification sent.");
        } catch(error) {
            console.error("Error inserting message:", error);
        }
    }

    static async handleMessage(user, io, chatroomId) {
        const welcomeBot = await User.findOne({ userId: this.BOTS.WELCOME.userId});

        if(!welcomeBot) {
            console.log("Failed to get Welcome Bot for user message.");
            return;
        }
        
        // Does not catch bad types
        if(!user) {
            console.log("User is not defined properly for bot messaging.");
            return;
        }

        const responses = [
            "Thanks for checking out Name Book.",
            "Thanks for the message! I'm a rudimentary bot! Don't expect much from me!",
            "I'm sending this message to you via socket!",
            "Neato!",
            "Isn't this cool. Wow!",
            "Maybe one day I'll be a real chat bot."
        ]

        const response = responses[Math.floor(Math.random() * responses.length)];

        const message = new Message({
            sender: welcomeBot._id,
            receiver: user._id,
            message: response,
            timestamp: new Date(),
        });

        const notification = new Notification({
            notification: `${welcomeBot.username} sent you a message.`,
            timestamp: new Date(),
            user: user._id,
            read: false,
            type: 'newMessage',
            triggeredBy: welcomeBot._id
        });

        try {
            await message.save();
            console.log("Bot message inserted.");
            await notification.save();
            console.log("Bot notification sent.");

            if(io) {
                io.to('message-' + chatroomId).emit('message', message);
                io.to('has-notification-' + user._id).emit('notification', message);
            }
        } catch (error) {
            console.error("Error inserting message:", error);
        }
    }

    // Doesn't check mongo for existence of bot, only checks userId
    static isBot(userId) {
        return userId.startsWith('bot_');
    }
}

module.exports = BotService;