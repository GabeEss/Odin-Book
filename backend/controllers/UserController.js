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

exports.user_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User create POST");
});

exports.user_detail = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User detail");
});

exports.user_friends_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User friends get");
});

exports.user_friend_add = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User friend add");
});

exports.user_friend_remove = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User friend remove");
});

exports.user_notifications_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User notifications get");
});

exports.user_notifications_read = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User notifications read");
});

exports.user_update = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User update");
});

exports.user_delete = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User delete");
});