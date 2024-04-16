const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");
const Notification = require("../models/notification");

const { DateTime } = require("luxon");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
const getUserInfo = require("../utils/getUserInfo");
const decodeTokenApi = require("../utils/decodeTokenApiCall");

exports.post_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Post list");
});

exports.post_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Post create POST");
});

exports.post_delete = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Post delete");
});

exports.post_detail = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Post detail");
});

exports.post_update = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Post update");
});

exports.post_add_friend = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Post add friend");
});

exports.post_remove_friend = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Post remove friend");
});

exports.post_like = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Post like");
});

exports.post_unlike = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Post unlike");
});