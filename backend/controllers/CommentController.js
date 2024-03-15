const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");
const Notification = require("../models/notification");

const { DateTime } = require("luxon");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
const getUserInfo = require("../utils/getUserInfo");
const decodeToken = require("../utils/decodeToken");

exports.comment_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Comment create POST");
});

exports.comment_delete = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Comment delete");
});

exports.comment_update = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Comment update");
});

exports.comment_like = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Comment like");
});

exports.comment_unlike = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Comment unlike");
});