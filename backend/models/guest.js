const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GuestSchema = new Schema({
    guestId: {
        type: String,
        required: true,
        unique: true,
        maxLength: 64
    },
    username: {
        type: String,
        required: true,
        maxLength: 64
    },
    worksAt: {
        type: String,
        maxLength: 64
    },
    livesIn: {
        type: String,
        maxLength: 64
    },
    from: {
        type: String,
        maxLength: 64
    },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friendRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
    sentRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
    notifications: [{ type: Schema.Types.ObjectId, ref: "Notification" }],
})

module.exports = mongoose.model("Guest", GuestSchema);