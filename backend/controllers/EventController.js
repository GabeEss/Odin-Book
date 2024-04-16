const User = require("../models/user");
const Notification = require("../models/notification");
const Event = require("../models/event");

const { DateTime } = require("luxon");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
const getUserInfo = require("../utils/getUserInfo");
const decodeToken = require("../utils/decodeTokenApiCall");

exports.event_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Event create POST");
});

exports.event_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Event list");
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