const User = require("../models/user");
const Notification = require("../models/notification");
const Event = require("../models/event");

const { DateTime } = require("luxon");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
const determineUserType = require("../utils/determineUserType");
const searchEventCollection = require("../utils/searchEventCollection");

exports.event_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Event create POST");
});

exports.event_detail = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Event detail");
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

exports.event_detail = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Event detail");
});

exports.event_update = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Event update");
});

exports.event_delete = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Event delete");
});