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
const getUserInfo = require("../utils/getUserInfo");

exports.user_register_post = asyncHandler(async (req, res, next) => {
    try {
        const user = await decodeToken(req.headers.authorization);

        console.log(user);
        return res.status(200).json({
            success: true,
            message: 'User registered successfully',
        })
    } catch (error) {
        console.log('Error:', error.message);
        return res.status(500).json({success: false, message: 'Error registering user'});
    }
    // try {
    //     const auth = req.headers.authorization;
    //     if(!user) {
    //         return res.status(401).json({
    //             success: false,
    //             message: 'User not authenticated',
    //         })
    //     }

    //     const user = await decodeToken(auth);

    //     console.log("Creating user");

    //     const newUser = new User({
    //         auth0id: user.sub,
    //         username: req.body.username,
    //         email: user.email,
    //         worksAt: req.body.worksAt,
    //         livesIn: req.body.livesIn,
    //         from: req.body.from,
    //         friends: [],
    //         friendRequests: [],
    //         sentRequests: [],
    //         notifications: [],
    //     })

    //     await newUser.save();

    //     return res.status(201).json({
    //         success: true,
    //         message: 'User created successfully',
    //     })
    // } catch (error) {
    //     console.log('Error:', error.message);
    //     return res.status(500).json({success: false, message: 'Error registering user'});
    // }
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

exports.user_update = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User update");
});

exports.user_delete = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User delete");
});