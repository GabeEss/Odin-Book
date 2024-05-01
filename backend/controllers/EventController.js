const User = require("../models/user");
const Notification = require("../models/notification");
const Event = require("../models/event");

const { DateTime } = require("luxon");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
const determineUserType = require("../utils/determineUserType");
const searchEventCollection = require("../utils/searchEventCollection");

exports.event_create_post = asyncHandler(async (req, res, next) => {
    const mongoUser = await determineUserType(req);

    if(!mongoUser) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        })
    }

    const { event, date, time, location, description } = req.body;

    const newEvent = new Event({
        event,
        owner: mongoUser._id,
        date,
        time,
        location,
        description,
        members: [mongoUser._id],
    });

    const savedEvent = await newEvent.save();

    return res.status(201).json({
        success: true,
        event: savedEvent,
    })
});

exports.event_detail = asyncHandler(async (req, res, next) => {
    const mongoUser = await determineUserType(req);

    if(!mongoUser) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        })
    }

    const event = await Event.findById(req.params.id).populate('members', 'username displayColor').exec();

    if(!event) {
        return res.status(404).json({
            success: false,
            message: 'Event not found',
        })
    }

    const owner = await User.findById(event.owner).exec();

    if(!owner) {
        return res.status(404).json({
            success: false,
            message: 'Owner not found',
        })
    }

    let isOwner = false;

    if(owner._id.toString() === mongoUser._id.toString()) {
        isOwner = true;
    }

    let isMember = false;

    isMember = await Event.findOne({
        _id: event._id,
        'members': mongoUser._id
    });

    if(isMember) {
        isMember = true;
    };

    return res.status(200).json({
        success: true,
        event,
        isOwner,
        isMember
    })
});

exports.event_list = asyncHandler(async (req, res, next) => {
    const mongoUser = await determineUserType(req);

    if(!mongoUser) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        })
    }

    const events = await searchEventCollection(req.query.search);

    return res.status(200).json({
        success: true,
        events,
    })
});

exports.event_list_all = asyncHandler(async (req, res, next) => {
    const mongoUser = await determineUserType(req);

    if(!mongoUser) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        })
    }

    const events = await Event.find({}).populate('members', 'username displayColor').exec();

    return res.status(200).json({
        success: true,
        events,
    })
});

exports.event_update = asyncHandler(async (req, res, next) => {
    const mongoUser = await determineUserType(req);

    if(!mongoUser) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        })
    }

    const currentEvent = await Event.findById(req.params.id).exec();

    if(!currentEvent) {
        return res.status(404).json({
            success: false,
            message: 'Event not found',
        })
    }

    if(currentEvent.owner.toString() !== mongoUser._id.toString()) {
        return res.status(403).json({
            success: false,
            message: 'User does not have permission to update this event',
        })
    }

    let { event, date, time, location, description, members } = req.body;

    // Remove the owner from the members to be removed
    const filteredMembers = members.filter(member => member !== mongoUser._id.toString());

    // Create an array with the members that are not in the filteredMembers array
    const newMembers = currentEvent.members.filter(member => !filteredMembers.includes(member.toString()));

    // Don't allow empty strings to replace existing values
    if(event === "") {
        event = currentEvent.event;
    }

    if(location === "") {
        location = currentEvent.location;
    }

    if(description === "") {
        description = currentEvent.description;
    }

    if(newMembers.length === 0) {
        newMembers = currentEvent.members;
    }

    try {
        await Event.findByIdAndUpdate(req.params.id, {
            event,
            owner: currentEvent.owner,
            date,
            time,
            location,
            description,
            date_created: currentEvent.date_created,
            members: newMembers,
        }).exec();

        return res.status(200).json({
            success: true,
            message: 'Event updated',
        })
    } catch(error) {
        console.log('Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error updating event',
        })
    }
});

exports.event_delete = asyncHandler(async (req, res, next) => {
    const mongoUser = await determineUserType(req);

    if(!mongoUser) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        })
    }

    const currentEvent = await Event.findById(req.params.id).exec();

    if(!currentEvent) {
        return res.status(404).json({
            success: false,
            message: 'Event not found',
        })
    }

    if(currentEvent.owner.toString() !== mongoUser._id.toString()) {
        return res.status(403).json({
            success: false,
            message: 'User does not have permission to delete this event',
        })
    }

    try {
        await Event.findByIdAndDelete(req.params.id).exec();

        return res.status(200).json({
            success: true,
            message: 'Event deleted',
        })
    } catch(error) {
        console.log('Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error deleting event',
        })
    }
});

exports.event_join = asyncHandler(async (req, res, next) => {
    const mongoUser = await determineUserType(req);

    if(!mongoUser) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        })
    }

    const event = await Event.findById(req.params.id).exec();

    if(!event) {
        return res.status(404).json({
            success: false,
            message: 'Event not found',
        })
    }

    if(event.members.includes(mongoUser._id)) {
        return res.status(400).json({
            success: false,
            message: 'User is already a member of this event',
        })
    }

    event.members.push(mongoUser._id);

    await event.save();

    return res.status(200).json({
        success: true,
        message: 'User joined event',
    })
});

exports.event_leave = asyncHandler(async (req, res, next) => {
    const mongoUser = await determineUserType(req);

    if(!mongoUser) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        })
    }

    const event = await Event.findById(req.params.id).exec();

    if(!event) {
        return res.status(404).json({
            success: false,
            message: 'Event not found',
        })
    }

    if(!event.members.includes(mongoUser._id)) {
        return res.status(400).json({
            success: false,
            message: 'User is not a member of this event',
        })
    }

    event.members = event.members.filter(member => member.toString() !== mongoUser._id.toString());

    await event.save();

    return res.status(200).json({
        success: true,
        message: 'User left event',
    })
});