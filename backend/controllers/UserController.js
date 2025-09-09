const Post = require("../models/post");
const User = require("../models/user");
const Event = require("../models/event");
const BotService = require('../bot/bot-logic');

const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
const decodeTokenApiCall = require("../utils/decodeTokenApiCall");
const {getUserInfo} = require("../utils/getUserInfo");
const determineUserType = require("../utils/determineUserType");
const searchUserCollection = require("../utils/searchUserCollection");
const generateGuestID = require("../utils/generateGuestID");

// Handles sign up and sign in
exports.user_register_post = asyncHandler(async (req, res, next) => {
    try {
        if(!req.headers.authorization) {
            return res.status(400).json({
                success: false,
                message: 'No authorization header',
            })
        }

        const auth = req.headers.authorization;
        const tokenResponse = await decodeTokenApiCall(auth);

        const mongoUser = await getUserInfo(tokenResponse.sub);

        if(mongoUser) {
            console.log("User exists");
            return res.status(200).json({
                success: true,
                firstTimeLogin: false,
                message: 'User exists in database. Regular login.',
            })
        } else {
            console.log("Creating user");

            const newUser = new User({
                userId: tokenResponse.sub,
                username: tokenResponse.nickname,
                email: tokenResponse.email,
                worksAt: "",
                livesIn: "",
                from: "",
                displayColor: "blue",
                coverColor: "yellow",
                friends: [],
                friendRequests: [],
                sentRequests: [],
                notifications: [],
            })

            await newUser.save();

            // Bot sends a message
            await BotService.handleSignUp(newUser);

            return res.status(201).json({
                success: true,
                firstTimeLogin: true,
                message: 'User created successfully',
            })
        }
    } catch (error) {
        console.log('Error:', error.message);
        return res.status(500).json({success: false, message: 'Error registering user'});
    }
});

// Handles sign up and sign in
exports.guest_register_post = asyncHandler(async (req, res, next) => {
    try {
        const guest = req.headers['x-guest'];
        const mongoUser = await getUserInfo(guest);
        
        if(mongoUser) {
            console.log("Guest user exists.");

            return res.status(200).json({
                success: true,
                message: 'Guest exists in database. Regular login.',
                firstTimeLogin: false,
                guestId: mongoUser.userId,
            })
        } else {
            console.log("Creating guest");

            const guestNum = await generateGuestID();
            const guestId = "guest" + guestNum;

            const newGuest = new User({
                userId: guestId,
                username: guestName,
                email: `FakeMail${guestId}@guestaddress.com`,
                worksAt: "Guest Factory",
                livesIn: "Guestro City, Guestland",
                from: "Guestville, Guestland",
                displayColor: "green",
                coverColor: "purple",
                friends: [],
                friendRequests: [],
                sentRequests: [],
                notifications: [],
            })

            await newGuest.save();

            // Bot sends a message
            await BotService.handleSignUp(newGuest);

            // Set the guestId cookie
            res.cookie('guestId', guestId, { 
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: 'lax'
             });

            return res.status(201).json({
                success: true,
                message: 'Guest created successfully',
                firstTimeLogin: true,
                guestId: guestId,
            })
        }
        
    } catch (error) {
        console.log('Error:', error.message);
        return res.status(500).json({success: false, message: 'Error registering guest'});
    }
});

exports.user_detail = asyncHandler(async (req, res, next) => {
    // Check current user first
    let mongoUser = await determineUserType(req);

    // Make sure the request is coming from a user
    if(!mongoUser) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        })
    }

    const username = mongoUser.username;
    const worksAt = mongoUser.worksAt;
    const livesIn = mongoUser.livesIn;
    const from = mongoUser.from;
    const displayColor = mongoUser.displayColor;
    const coverColor = mongoUser.coverColor;
    const friends = mongoUser.friends;

    return res.status(200).json({
        success: true,
        self: true,
        username,
        worksAt,
        livesIn,
        from,
        displayColor,
        coverColor,
        friends,
    })
});

exports.user_find_by_id = asyncHandler(async (req, res, next) => {
    const currentUser = await determineUserType(req);

    if(!currentUser) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        })
    }

    // If no user ID is provided in the url
    if(!req.params.id) {
        return res.status(400).json({
            success: false,
            message: 'No user ID provided',
        })
    }

    // User being viewed
    const mongoUser = await User.findOne({_id: req.params.id}).exec();

    let self = false;

    let isFriend = false;
    let sentRequest = false;
    let receivedRequest = false;

    // Check if the user being viewed is the current user
    if(mongoUser._id.toString() === currentUser._id.toString()) {
        self = true;
    } else {
        // Determine if the user being viewed is a friend, has sent a request, or has received a request
        isFriend = currentUser.friends.includes(mongoUser._id);
        sentRequest = currentUser.sentRequests.includes(mongoUser._id);
        receivedRequest = currentUser.friendRequests.includes(mongoUser._id);
    }

    const username = mongoUser.username;
    const worksAt = mongoUser.worksAt;
    const livesIn = mongoUser.livesIn;
    const from = mongoUser.from;
    const displayColor = mongoUser.displayColor;
    const coverColor = mongoUser.coverColor;

    return res.status(200).json({
        success: true,
        self,
        username,
        worksAt,
        livesIn,
        from,
        displayColor,
        coverColor,
        isFriend,
        sentRequest,
        receivedRequest,
    })
});

exports.user_list = asyncHandler(async (req, res, next) => {
    const mongoUser = await determineUserType(req);

    if(!mongoUser) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        })
    }

    const users = await searchUserCollection(req.query.search);

    return res.status(200).json({
        success: true,
        users,
    })
});

exports.user_current = asyncHandler(async(req, res, next) => {
    const currentUser = await determineUserType(req);

    if(!currentUser) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    }

    return res.status(200).json({
        success: true,
        currentUser: currentUser
    })
})

exports.user_friends_get = asyncHandler(async (req, res, next) => {
    let mongoUser = await determineUserType(req);

    if(!mongoUser) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        })
    }

    mongoUser = await User.findById(mongoUser._id)
                           .populate('friends', 'username displayColor')
                           .populate('friendRequests', 'username displayColor')
                           .exec();

    const friends = mongoUser.friends;
    const friendRequests = mongoUser.friendRequests;
    const sentRequests = mongoUser.sentRequests;

    return res.status(200).json({
        success: true,
        friends,
        friendRequests,
        sentRequests,
    })
});

exports.user_friend_request = asyncHandler(async (req, res, next) => {
    const currentUser = await determineUserType(req);

    if(!currentUser) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        })
    }

    // If no user ID is provided in the url
    if(!req.body.id) {
        return res.status(400).json({
            success: false,
            message: 'No user ID provided',
        })
    }

    // User being requested
    const requestedUser = await User.findOne({_id: req.body.id}).exec();

    // Check if the user is already friends
    if(currentUser.friends.includes(requestedUser._id)) {
        return res.status(400).json({
            success: false,
            message: 'Already friends',
        })
    }

    // Check if the current user has already sent a request
    if(currentUser.sentRequests.includes(requestedUser._id)) {
        return res.status(400).json({
            success: false,
            message: 'Request already sent',
        })
    }

    // Check if the current user has already received a request from the other user
    if(currentUser.friendRequests.includes(requestedUser._id)) {
        return res.status(400).json({
            success: false,
            message: 'Request already received by the other user. Need to reject or accept request.',
        })
    }

    requestedUser.friendRequests.push(currentUser._id);
    currentUser.sentRequests.push(requestedUser._id);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const options = { session, new: true }; // return modified document instead of original
        await User.findOneAndUpdate({_id: currentUser._id}, {sentRequests: currentUser.sentRequests}, options).exec();
        await User.findOneAndUpdate({_id: requestedUser._id}, {friendRequests: requestedUser.friendRequests}, options).exec();

        await session.commitTransaction();
        session.endSession();

        // Note that the userId and _id are not the same.
        return res.status(200).json({
            success: true,
            message: 'Friend request sent successfully',
            from: currentUser.userId,
            to: requestedUser._id
        })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log('Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error sending friend request',
        })
    }
});

exports.user_friend_accept = asyncHandler(async (req, res, next) => {
    const currentUser = await determineUserType(req);

    if(!currentUser) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        })
    }

    if(!req.body.id) {
        return res.status(400).json({
            success: false,
            message: 'No user ID provided',
        })
    }

    const requestingUser = await User.findOne({_id: req.body.id}).exec();

    // Check if the user is already friends
    if(currentUser.friends.includes(requestingUser._id)) {
        return res.status(400).json({
            success: false,
            message: 'Already friends',
        })
    }

    // Check if the current user was the one who sent the request
    if(currentUser.sentRequests.includes(requestingUser._id)) {
        return res.status(400).json({
            success: false,
            message: 'Request sent by the user. Request cannot be accepted.',
        })
    }

    requestingUser.sentRequests.pull(currentUser._id);
    currentUser.friendRequests.pull(requestingUser._id);
    requestingUser.friends.push(currentUser._id);
    currentUser.friends.push(requestingUser._id);

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const options = { session, new: true }; // return modified document instead of original
        await User.findOneAndUpdate({_id: requestingUser._id}, {sentRequests: requestingUser.sentRequests, friends: requestingUser.friends}, options).exec();
        await User.findOneAndUpdate({_id: currentUser._id}, {friendRequests: currentUser.friendRequests, friends: currentUser.friends}, options).exec();

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            message: 'Friend request accepted successfully',
        })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log('Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error accepting friend request',
        })
    }
});

exports.user_friend_reject = asyncHandler(async (req, res, next) => {
    const currentUser = await determineUserType(req);

    if(!currentUser) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        })
    }

    // If no user ID is provided in the url
    if(!req.body.id) {
        return res.status(400).json({
            success: false,
            message: 'No user ID provided',
        })
    }

    // User requesting to become friends with the current user
    const requestingUser = await User.findOne({_id: req.body.id}).exec();

    // Check if the user is already friends
    if(currentUser.friends.includes(requestingUser._id)) {
        return res.status(400).json({
            success: false,
            message: 'Already friends, choose remove friend option instead.',
        })
    }

    // Check if the current user has already sent a request
    if(currentUser.sentRequests.includes(requestingUser._id)) {
        return res.status(400).json({
            success: false,
            message: 'Request was sent by current user. Request cannot be rejected.',
        })
    }

    requestingUser.sentRequests.pull(currentUser._id);
    currentUser.friendRequests.pull(requestingUser._id);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const options = { session, new: true }; // return modified document instead of original
        await User.findOneAndUpdate({_id: requestingUser._id}, {sentRequests: requestingUser.sentRequests}, options).exec();
        await User.findOneAndUpdate({_id: currentUser._id}, {friendRequests: currentUser.friendRequests}, options).exec();

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            message: 'Friend request rejected successfully',
        })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log('Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error rejecting friend request',
        })
    }
});

// Remove a user as a friend
exports.user_remove = asyncHandler(async (req, res, next) => {
    const currentUser = await determineUserType(req);

    if(!currentUser) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        })
    }

    // If no user ID is provided in the url
    if(!req.body.id) {
        return res.status(400).json({
            success: false,
            message: 'No user ID provided',
        })
    }

    const userToRemove = await User.findOne({_id: req.body.id}).exec();

    // Check if the user is already friends
    if(!currentUser.friends.includes(userToRemove._id)) {
        return res.status(400).json({
            success: false,
            message: 'Users are not friends',
        })
    }

    userToRemove.friends.pull(currentUser._id);
    currentUser.friends.pull(userToRemove._id);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const options = { session, new: true }; // return modified document instead of original
        await User.findOneAndUpdate({_id: userToRemove._id}, {friends: userToRemove.friends}, options).exec();
        await User.findOneAndUpdate({_id: currentUser._id}, {friends: currentUser.friends}, options).exec();

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            message: 'Friend removed successfully',
        })
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log('Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error removing friend',
        })
    }
});


exports.user_newsfeed = asyncHandler(async (req, res, next) => {
    const currentUser = await determineUserType(req);

    if(!currentUser) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        })
    }

    const friends = currentUser?.friends || [];

    const [userPosts, postsOnUserPage, userEvents, friendPosts] = await Promise.all([
        // userPosts
        Post.find({
            owner: currentUser._id
        }).populate('owner')
            .populate('likes')
            .populate('posted_to.id')
            .exec()
            .then(result => result || []),
        // postsOnUserPage
        Post.find({
            'posted_to.id': currentUser._id,
            'posted_to.model': 'User',
        }).populate('owner')
            .populate('likes')
            .populate('posted_to.id')
            .exec()
            .then(result => result || []),
        // userEvents
        Event.find({'members.user': currentUser._id})
            .then(result => result || []),
        // friendPosts
        friends.length > 0 ?
            Post.find({
            owner: { $in: friends }
        }).populate('owner')
        .populate('likes')
        .populate('posted_to.id')
        .exec()
        .then(result => result || [])
        : Promise.resolve([])
    ])

    const eventIds = userEvents.map(e => e._id);

    // Get the posts from event pages that the user has joined
    const eventPosts = (await Post.find({
        'posted_to.id': { $in: eventIds },
        'posted_to.model': 'Event',
    }).populate('owner').
    populate('likes').
    populate('posted_to.id').exec()) || [];

    const combinedPosts = [...userPosts, ...postsOnUserPage, ...friendPosts, ...eventPosts];

    // Remove duplicates
    const postsMap = new Map(combinedPosts.map(post => [post._id.toString(), post]));

    const uniquePosts = Array.from(postsMap.values());

    // console.log(uniquePosts);

    return res.status(200).json({
        success: true,
        posts: uniquePosts
    })
});

exports.user_update_get = asyncHandler(async (req, res, next) => {
    const mongoUser = await determineUserType(req);
    if(!mongoUser) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        })
    }

    const username = mongoUser.username;
    const worksAt = mongoUser.worksAt;
    const livesIn = mongoUser.livesIn;
    const from = mongoUser.from;
    const displayColor = mongoUser.displayColor;
    const coverColor = mongoUser.coverColor;

    return res.status(200).json({
        success: true,
        username,
        worksAt,
        livesIn,
        from,
        displayColor,
        coverColor,
    })
});

exports.user_update = asyncHandler(async (req, res, next) => {
    const mongoUser = await determineUserType(req);

    if(!mongoUser) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        })
    }

    let { username, worksAt, livesIn, from, displayColor, coverColor } = req.body;

    // Don't allow empty strings to replace existing values
    if(username === "") {
        username = mongoUser.username;
    }

    if(worksAt === "") {
        worksAt = mongoUser.worksAt;
    }

    if(livesIn === "") {
        livesIn = mongoUser.livesIn;
    }

    if(from === "") {
        from = mongoUser.from;
    }

    const colorOptions = ["blue", "green", "red", "yellow", "purple"];

    // Make sure the color is a valid option
    if(!colorOptions.includes(displayColor)) {
        displayColor = mongoUser.displayColor;
    }

    if(!colorOptions.includes(coverColor)) {
        coverColor = mongoUser.coverColor;
    }

    try {
        await User.findOneAndUpdate({userId: mongoUser.userId}, {
            username,
            worksAt,
            livesIn,
            from,
            displayColor,
            coverColor}).exec();

        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
        })
    } catch (error) {
        console.log('Error:', error.message);
        // If duplicate error
        if(error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Error updating user'
            });
        }
        // For server errors
        return res.status(500).json({
            success: false,
            message: 'Error updating user',
        })
    }
});

exports.user_delete = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User delete");
});