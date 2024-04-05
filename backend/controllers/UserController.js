const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");
const Guest = require("../models/guest");
const Notification = require("../models/notification");
const Event = require("../models/event");

const { DateTime } = require("luxon");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
const decodeToken = require("../utils/decodeToken");
const decodeTokenApiCall = require("../utils/decodeTokenApiCall");
const getUserInfo = require("../utils/getUserInfo");

exports.user_register_post = asyncHandler(async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        const tokenResponse = await decodeTokenApiCall(auth);

        const mongoUser = await getUserInfo(tokenResponse.sub);

        if(mongoUser) {
            return res.status(200).json({
                success: true,
                firstTimeLogin: false,
                message: 'User exists in database. Regular login.',
            })
        }

        console.log("Creating user");

        const newUser = new User({
            auth0id: tokenResponse.sub,
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
    } catch (error) {
        console.log('Error:', error.message);
        return res.status(500).json({success: false, message: 'Error registering user'});
    }
});

exports.user_detail = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User detail");
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
    const auth = req.headers.authorization;
    const tokenResponse = await decodeToken(auth);
    const mongoUser = await getUserInfo(tokenResponse.sub);

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
    const auth = req.headers.authorization;
    const tokenResponse = await decodeToken(auth);

    const mongoUser = await getUserInfo(tokenResponse.sub);

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
        await User.findOneAndUpdate({auth0id: tokenResponse.sub}, {username, worksAt, livesIn, from}).exec();

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