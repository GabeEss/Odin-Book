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
        // const messages = await Message.find({
        //     $or: [
        //         { sender: currentUser._id },
        //         { receiver: currentUser._id },
        //     ]
        // }).populate('sender', 'username')
        // .populate('receiver', 'username')
        // .select('sender receiver');

        // const usersMap = new Map();

        // messages.forEach((msg) => {
        //     if(msg.sender._id.toString() !== currentUser._id.toString()) {
        //         usersMap.set(msg.sender._id.toString(), msg.sender.username);
        //     }
        //     if(msg.receiver._id.toString() !== currentUser._id.toString()) {
        //         usersMap.set(msg.receiver._id.toString(), msg.receiver.username);
        //     }
        // })

        // const users = Array.from(usersMap, ([id, username]) => ({id, username}));

        // Using mongo aggregation pipeline: 
        // Step one, get messages with currentUser
        // Step two, create a new field for the conversation partners of the current user
        // Step three, get a list of each unique user from that new field
        // Step four, compare _ids from the pipeline with the Users collection then join to add more data about the user to the current pipeline
        // Step five, flatten the array created from lookup for easier access to username field
        // Step six, reshape each document to only include the _id and username
        const users = await Message.aggregate([
            {
                // Step one
                $match: {
                    $or: [
                        { sender: currentUser._id },
                        { receiver: currentUser._id }
                    ]
                }
            },
            {
                // Step two
                $project: {
                    user: {
                        $cond: [
                            {
                                $eq: ["$sender", currentUser._id]
                            },
                            "$receiver",
                            "$sender"
                        ]
                    }
                }
            },
            {
                // Step three
                $group: {
                    _id: "$user"
                }
            },
            {
                // Step four
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            {
                // Step five
                $unwind: "$userInfo"
            },
            {
                // Step six
                $project: {
                    id: "$userInfo._id",
                    username: "$userInfo.username"
                }
            }
        ])

        return res.status(200).json({
            success: true,
            message: 'Conversations fetched',
            users: users
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching conversations.'
        })
    }
});
