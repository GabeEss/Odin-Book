const {DateTime} = require('luxon');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    notification: {
        type: String,
        required: true,
        maxLength: 200
    },
    timestamp: {
        type: Date,
        default: () => DateTime.now().toJSDate(),
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    triggeredBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
})

NotificationSchema.virtual("timestamp_formatted").get(function () {
    return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATETIME_MED);
});

module.exports = mongoose.model("Notification", NotificationSchema);