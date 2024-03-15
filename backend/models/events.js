const {DateTime} = require('luxon');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EventSchema = new Schema({
    event: {
        type: String,
        required: true,
        maxLength: 100,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        maxLength: 200,
    },
    date_created: {
        type: Date,
        default: () => DateTime.now().toJSDate(),
        required: true,
    },
})

module.exports = mongoose.model('Event', EventSchema);