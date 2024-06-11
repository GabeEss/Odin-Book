const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");
const Notification = require("../models/notification");
const asyncHandler = require("express-async-handler");
const determineUserType = require("../utils/determineUserType");

exports.notification_list = asyncHandler(async (req, res, next) => {
    const currentUser = await determineUserType(req);

    if(!currentUser) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        })
    }

    const notifications = await Notification.find({user: currentUser._id}).populate('triggeredBy').exec();

    if(!notifications) {
        return res.status(404).json({
            success: false,
            message: 'Notifications not found'
        })
    }

    return res.status(200).json({
        success: true,
        notifications: notifications
    })
});

exports.notification_update = asyncHandler(async (req, res, next) => {
    const currentUser = await determineUserType(req);

    if(!currentUser) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        })
    }

    const notifications = await Notification.find({user: currentUser._id}).populate('triggeredBy').exec();

    if(!notifications) {
        return res.status(404).json({
            success: false,
            message: 'Notifications not found'
        })
    }

    const result = await Notification.updateMany(
        { user: currentUser._id, read: false }, // find all unread notifications for this user
        { read: true } // update read to true
    );

    if(result.nModified == 0) {
        return res.status(404).json({
            success: false,
            message: 'No unread notifications found'
        })
    }

    return res.status(200).json({
        success: true,
        notifications: notifications,
        message: `${result.nModified} notifications marked as read`
    })
});