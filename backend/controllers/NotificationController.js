const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");
const Notification = require("../models/notification");
const Event = require("../models/event");

const { DateTime } = require("luxon");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
const getUserInfo = require("../utils/getUserInfo");
const decodeTokenApi = require("../utils/decodeTokenApiCall");

exports.notification_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Notification list");
});

exports.notification_update = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Notification update");
});