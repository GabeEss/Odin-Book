const User = require('../models/user');
const Message = require('../models/message');
const Post = require('../models/post');
const Event = require('../models/event');
const Notification = require('../models/notification');

// NOTE: THIS CLASS DOES NOT CHECK FOR USER TYPE SAFETY
class BotService {
    // Stores bots, can be initialized collectively
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

    // Stores events, must be initialized individually
    // NOTE: can't fill in owner or members fields without an initialized bot
    static EVENTS = {
        WELCOME: {
            event: "Welcome to Name Book!",
            date: new Date(3000, 0, 1, 0, 1),
            time: "00:01",
            location: "Digital Space",
            description: "Join our welcoming community and connect with other members!",
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

    static async initializeWelcomeEvent() {
        // Check mongo for owner
        const welcomeBot = await User.findOne({ userId: this.BOTS.WELCOME.userId });

        if(!welcomeBot) {
            console.error("Welcome Bot not found. Cannot create welcome event.");
            return;
        }

        // Check if welcome event exists
        const existingEvent = await Event.findOne({
            event: this.EVENTS.WELCOME.event,
            owner: welcomeBot._id,
        });

        if(existingEvent) {
            console.log(`Event exists: ${existingEvent.event}`);
            return;
        }

        try {
            const welcomeEvent = new Event({
                event: this.EVENTS.WELCOME.event,
                owner: welcomeBot._id,
                date: this.EVENTS.WELCOME.date,
                time: this.EVENTS.WELCOME.time,
                location: this.EVENTS.WELCOME.location,
                description: this.EVENTS.WELCOME.description,
                members: [{
                    user: welcomeBot._id,
                    status: 'going',
                }]
            });

            await welcomeEvent.save();
        } catch (error) {
            console.error("Error creating welcome event: ", error);
        }
    }

    static async firstPostWelcomeEvent() {
        // Check mongo for owner
        const welcomeBot = await User.findOne({ userId: this.BOTS.WELCOME.userId });

        if(!welcomeBot) {
            console.error("Welcome Bot not found. Cannot create welcome event.");
            return;
        }

        // Check if welcome event exists
        const existingEvent = await Event.findOne({
            event: this.EVENTS.WELCOME.event,
            owner: welcomeBot._id,
        });

        if(!existingEvent) {
            console.log(`Event does not exist.`);
            return;
        }

        const firstPost = "Enjoy your stay at Name Book!";

        const post = new Post({
            post: firstPost,
            owner: welcomeBot._id,
            posted_to: { id: existingEvent._id, model: 'Event' },
            comments: [],
            date_created: new Date(),
            likes: [],
        })

        try {
            await post.save();
            console.log("Welcome event post inserted.");
        } catch (error) {
            console.error("Error posting on the Welcome Event.", error);
        }
    }

    // Send a message and a post when the user registers. This method should only be invoked once for any given user.
    // Not set up to catch duplicates.
    static async handleSignUp(newUser) {
        const welcomeBot = await User.findOne({ userId: this.BOTS.WELCOME.userId });

        if(!welcomeBot || !newUser) {
            console.log("Failed to get Welcome Bot or invalid user.");
            return;
        }

        const welcomeEvent = await Event.findOne({ 
            event: this.EVENTS.WELCOME.event,
            owner: welcomeBot._id,
         })

        if(!welcomeEvent) {
            console.log('Welcome event not found.')
            return;
        }

        const welcomeMessage = 'Welcome to Name Book! Feel free to shoot me a message.';
        const welcomePost = 'Thanks for using Name Book!';

        const message = new Message({
            sender: welcomeBot._id,
            receiver: newUser._id,
            message: welcomeMessage,
            timestamp: new Date()
        });

        const post = new Post({
            post: welcomePost,
            owner: welcomeBot._id,
            posted_to: { id: newUser._id, model: 'User' },
            comments: [],
            date_created: new Date(),
            likes: [],
        })

        const messageNotification = new Notification({
            notification: `${welcomeBot.username} sent you a message.`,
            timestamp: new Date(),
            user: newUser._id,
            read: false,
            type: 'newMessage',
            triggeredBy: welcomeBot._id
        });

        const postNotification = new Notification({
            notification: `${welcomeBot.username} posted on your page.`,
            timestamp: new Date(),
            user: newUser._id,
            read: false,
            type: 'newPost',
            triggeredBy: welcomeBot._id
        });

        const isAlreadyMember = welcomeEvent.members.some(member => {
            return member.user.equals(newUser._id);
        });

        if(!isAlreadyMember) {
            welcomeEvent.members.push({user: newUser._id, status: 'pending'});
        }
            
        try {
            await Promise.all([
                message.save(),
                messageNotification.save(),
                post.save(),
                postNotification.save(),
                welcomeEvent.save(),
            ])
            
            console.log("Welcome message and post created successfully.");
        } catch(error) {
            console.error("Error inserting message:", error);
        }
    }


    // If you want to add a delay, do it on the user end.
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