const {DateTime} = require('luxon');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    post: {
        type: String,
        required: true,
        maxLength: 100,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    posted_to: {
        id: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        model: {
            type: String,
            required: true,
            enum: ['User', 'Event'],
        }
    },
    comments: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        }],
        required: true,
    },
    date_created: {
        type: Date,
        default: () => DateTime.now().toJSDate(),
        required: true,
    },
    likes: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],
        required: true,
    }
})

function arrayLimit(val) {
    return val.length > 0;
}

module.exports = mongoose.model('Post', PostSchema);