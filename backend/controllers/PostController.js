const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");
const Event = require("../models/event");
const Notification = require("../models/notification");

const asyncHandler = require("express-async-handler");
const findPageModel = require("../utils/findPageModel");
const determineUserType = require("../utils/determineUserType");

exports.post_list = asyncHandler(async (req, res, next) => {
    const currentUser = await determineUserType(req);

    if(!currentUser) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        })
    }

    const { id } = req.query;

    if(!id) {
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
    populate('likes').
    exec();

    if(!posts) {
        return res.status(404).json({
            success: false,
            message: 'Posts undefined',
        })
    }

    res.status(200).json({
        success: true,
        posts: posts,
    });
});
