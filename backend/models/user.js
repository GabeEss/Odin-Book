const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userId: {
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
    email: {
        type: String,
        required: true,
        unique: true,
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
    displayColor: {
        type: String,
        enum: ['blue', 'red', 'green', 'yellow', 'purple',],
        default: "blue"
    },
    coverColor: {
        type: String,
        enum: ['blue', 'red', 'green', 'yellow', 'purple',],
        default: "yellow"
    },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friendRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
    sentRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
    notifications: [{ type: Schema.Types.ObjectId, ref: "Notification" }],
})

module.exports = mongoose.model("User", UserSchema);