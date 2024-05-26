const {DateTime} = require('luxon');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    comment: {
        type: String,
        required: true,
        maxLength: 200
    }, 
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
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

CommentSchema.virtual("timestamp_formatted").get(function () {
    return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("Comment", CommentSchema);