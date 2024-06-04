const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");
const Event = require("../models/event");
const Notification = require("../models/notification");

const { DateTime } = require("luxon");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
const findPageModel = require("../utils/findPageModel");
const determineUserType = require("../utils/determineUserType");
const getUserInfo = require("../utils/getUserInfo");
const decodeTokenApi = require("../utils/decodeTokenApiCall");

exports.post_list = asyncHandler(async (req, res, next) => {
    const currentUser = await determineUserType(req);

    if(!currentUser) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        })
    }

    const { id } = req.query;

    if(!id ) {
        return res.status(400).json({
            success: false,
            message: 'Missing query parameters',
        })
    }


    // Determine the type of page where the posts are being fetched
    const page = await findPageModel(id);

    const posts = await Post.find({
        'posted_to.id': id,
        'posted_to.model': page.model,
    }).
    populate('owner').
    populate('likes').exec();

    if(!posts) {
        return res.status(404).json({
            success: false,
            message: 'No posts found',
        })
    }

    res.status(200).json({
        success: true,
        posts: posts,
    });
});

exports.post_like = asyncHandler(async (req, res, next) => {
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
                message: "Post ID not provided"
            })
        }

        const post = await Post.findById(id).populate('likes');

        if(!post.likes) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            })
        }
        let findUserInArray = false;
        // Find out if user is in likes array
        for(let i = 0; i < post.likes.length; i++ ) {
            if(post.likes[i].toString() === currentUser._id.toString())
                findUserInArray = true;
        }

        if(findUserInArray) {
            return res.status(404).json({
                success: false,
                message: "User already liked this post."
            })
        }

        post.likes.push(currentUser);
        await post.save();

        return res.status(200).json({
            success: true,
            post: post
        })
    } catch(error) {
        console.log('Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error liking the post',
        })
    }
});

exports.post_unlike = asyncHandler(async (req, res, next) => {
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
                message: "Post ID not provided"
            })
        }

        const post = await Post.findById(id).populate('likes');

        if(!post.likes) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            })
        }

        let findUserInArray = false;
        // Find out if user is in likes array
        for(let i = 0; i < post.likes.length; i++ ) {
            if(post.likes[i]._id.toString() === currentUser._id.toString())
            {
                findUserInArray = true;
            }
        }

        if(!findUserInArray) {
            return res.status(404).json({
                success: false,
                message: "User cannot unlike a post if they have not liked it."
            })
        }

        post.likes.pull(currentUser);
        await post.save();

        return res.status(200).json({
            success: true,
            post: post
        })
    } catch(error) {
        console.log('Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error unliking the post',
        })
    }
});