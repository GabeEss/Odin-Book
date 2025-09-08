const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");
const Notification = require("../models/notification");

const { DateTime } = require("luxon");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
const { getUserInfo } = require("../utils/getUserInfo");
const decodeToken = require("../utils/decodeTokenApiCall");
const determineUserType = require('../utils/determineUserType');

exports.comment_list = asyncHandler(async (req, res, next) => {
    const currentUser = await determineUserType(req);

    if(!currentUser) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        })
    }

    const id = req.params.id;

    if(!id) {
        return res.status(404).json({
            success: false,
            message: "Header parameters not defined."
        })
    }

    const post = await Post.findById(id).populate({
        path: 'comments',
        populate: [{
            path: 'owner',
            model: User
        },
        {
            path: 'likes',
            model: User
        }
        ],
    }).exec();

    if(!post) {
        return res.status(404).json({
            success: false,
            message: "Post not found."
        })
    }

    return res.status(200).json({
        success: true,
        post: post
    })
})
