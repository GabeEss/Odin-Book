const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");
const Notification = require("../models/notification");

const { DateTime } = require("luxon");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
const getUserInfo = require("../utils/getUserInfo");
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

exports.comment_like = asyncHandler(async (req, res, next) => {
    try {
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
                message: "Comment ID not provided"
            })
        }

        const comment = await Comment.findById(id).populate('likes');

        if(!comment.likes) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            })
        }

        let findUserInArray = false;
        // Find out if user is in likes array
        for(let i = 0; i < comment.likes.length; i++ ) {
            if(comment.likes[i].toString() === currentUser._id.toString())
                findUserInArray = true;
        }

        if(findUserInArray) {
            return res.status(404).json({
                success: false,
                message: "User already liked this comment."
            })
        }

        comment.likes.push(currentUser);
        await comment.save();

        return res.status(200).json({
            success: true,
            comment: comment
        })
    } catch(error) {
        console.log('Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error liking the comment',
        })
    }
});

exports.comment_unlike = asyncHandler(async (req, res, next) => {
    try {
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
                message: "Comment ID not provided"
            })
        }

        const comment = await Comment.findById(id).populate('likes');

        if(!comment.likes) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            })
        }

        let findUserInArray = false;
        // Find out if user is in likes array
        for(let i = 0; i < comment.likes.length; i++ ) {
            if(comment.likes[i]._id.toString() === currentUser._id.toString())
            {
                findUserInArray = true;
            }
        }

        if(!findUserInArray) {
            return res.status(404).json({
                success: false,
                message: "User cannot unlike a comment if they have not liked it."
            })
        }

        comment.likes.pull(currentUser);
        await comment.save();

        return res.status(200).json({
            success: true,
            comment: comment
        })
    } catch(error) {
        console.log('Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error unliking the comment',
        })
    }
});