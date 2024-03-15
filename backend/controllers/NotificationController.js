const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");
const Notification = require("../models/notification");
const Event = require("../models/event");

const { DateTime } = require("luxon");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
const getUserInfo = require("../utils/getUserInfo");
const decodeToken = require("../utils/decodeToken");

exports.notification_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Notification list");
});

exports.notification_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Notification create POST");
});

exports.notification_delete = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Notification delete");
});

exports.notification_update = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Notification update");
});