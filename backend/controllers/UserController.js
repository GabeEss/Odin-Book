const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");
const Notification = require("../models/notification");
const Event = require("../models/event");

const { DateTime } = require("luxon");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
const decodeTokenApiCall = require("../utils/decodeTokenApiCall");
const getUserInfo = require("../utils/getUserInfo");
const determineUserType = require("../utils/determineUserType");
const searchUserCollection = require("../utils/searchUserCollection");

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
                friends: [],
                friendRequests: [],
                sentRequests: [],
                notifications: [],
            })

            await newUser.save();

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

exports.guest_register_post = asyncHandler(async (req, res, next) => {
    try {
        // const guest = req.headers['x-guest'];
        // if(!guest) {
            // return res.status(400).json({
                // success: false,
                // message: 'No guest header',
            // })
        // }
        // console.log(guest);
        return res.status(200).json({
            success: true,
            message: 'Guest exists in database. Regular login.',
            firstTimeLogin: true,
        })
    } catch (error) {
        console.log('Error:', error.message);
        return res.status(500).json({success: false, message: 'Error registering guest'});
    }
    //     const mongoGuest = await getUserInfo(guest, null);

    //     if(mongoGuest) {
    //         return res.status(200).json({
    //             success: true,
    //             message: 'Guest exists in database. Regular login.',
    //         })
    //     }

    //     console.log("Creating guest");

    //     const guestId = await generateGuestID();
    //     const guestName = "guest" + guestId;

    //     const newGuest = new User({
    //         userId: guestId,
    //         username: guestName,
    //         worksAt: "Guest Factory",
    //         livesIn: "Guestro City, Guestland",
    //         from: "Guestville, Guestland",
    //         friends: [],
    //         friendRequests: [],
    //         sentRequests: [],
    //         notifications: [],
    //     })

    //     await newGuest.save();

    //     return res.status(201).json({
    //         success: true,
    //         message: 'Guest created successfully',
    //         guestId: guestId,
    //     })

    // } catch (error) {
    //     console.log('Error:', error.message);
    //     return res.status(500).json({success: false, message: 'Error registering guest'});
    // }
});

exports.user_detail = asyncHandler(async (req, res, next) => {
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

    if(!worksAt || !livesIn || !from) {
        return res.status(200).json({
            success: true,
            username,
            worksAt,
            livesIn,
            from,
            signupPrompt: true,
        })
    }
    return res.status(200).json({
        success: true,
        username,
        worksAt,
        livesIn,
        from,
        signupPrompt: false,
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

exports.user_friends_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User friends get");
});

exports.user_friend_add = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User friend add");
});

exports.user_friend_remove = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User friend remove");
});

exports.user_notifications_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User notifications get");
});

exports.user_notifications_read = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User notifications read");
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

    return res.status(200).json({
        success: true,
        username,
        worksAt,
        livesIn,
        from,
    })
})

exports.user_update = asyncHandler(async (req, res, next) => {
    const mongoUser = await determineUserType(req);

    if(!mongoUser) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        })
    }

    let { username, worksAt, livesIn, from } = req.body;

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

    try {
        await User.findOneAndUpdate({userId: mongoUser.userId}, {username, worksAt, livesIn, from}).exec();

        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
        })
    } catch (error) {
        console.log('Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error updating user',
        })
    }
});

exports.user_delete = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User delete");
});