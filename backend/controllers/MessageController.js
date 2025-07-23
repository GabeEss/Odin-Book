const User = require("../models/user");
const Message = require("../models/message");

const { DateTime } = require("luxon");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
const determineUserType = require("../utils/determineUserType");

exports.message_get = asyncHandler(async (req, res, next) => {
    const currentUser = await determineUserType(req);

    if(!currentUser) {
        return res.status(404).json({
            success: false,
            message: 'Current user not found',
        })
    }

    // Check request query for receiving user ID
    if(!req.query.id) {
        return res.status(400).json({
            success: false,
            message: 'No receiving user ID provided'
        })
    }

    const receivingUser = await User.findOne({_id: req.query.id}).exec();

    if(!receivingUser) {
        return res.status(404).json({
            success: false,
            message: 'Receiving user not found'
        })
    }

    try {
        const messages = await Message.find({
            $or: [
                { sender: currentUser._id, receiver: receivingUser._id },
                { sender: receivingUser._id, receiver: currentUser._id },
            ]
        })
        .populate('sender')
        .populate('receiver')
        .sort('timestamp')
        .exec();

        res.status(200).json({
            success: true,
            message: 'Messages fetched',
            userMessages: messages
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching messages',
            error: err.message
        });
    }
});

exports.message_conversations_get = asyncHandler(async (req, res, next) => {
    const currentUser = await determineUserType(req);

    if(!currentUser) {
        return res.status(404).json({
            success: false,
            message: 'User not found.'
        })
    }

    try{
        const messages = await Message.find({
            $or: [
                { sender: currentUser._id },
                { receiver: currentUser._id },
            ]
        }).select('sender receiver');

        const userIds = new Set();

        // Users not populated, so don't add ._id for sender and receiver
        messages.forEach((msg) => {
            if(msg.sender.toString() !== currentUser._id.toString()) {
                userIds.add(msg.sender);
            }
            if(msg.receiver.toString() !== currentUser._id.toString()) {
                userIds.add(msg.receiver);
            }
        })

        return res.status(200).json({
            success: true,
            message: 'Conversations fetched',
            userIds: Array.from(userIds)
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching conversations.'
        })
    }
});
