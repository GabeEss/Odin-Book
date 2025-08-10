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
    members: {
        type: [{
            user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            },
            status: {
                type: String,
                enum: ['going', 'notGoing', 'maybe', 'pending'],
                default: 'pending',
            },
        }],
        required: true,
        validate: {
            validator: function(members) {
                if(!Array.isArray(members)) return false;
                const userIds = members.filter(m => m.user).map(m => m.user.toString());
                const userSet = new Set(userIds);
                if(userIds.length === userSet.size) return true;
                return false;
            },
            message: 'Duplicate users not allowed in event members'
        }
    },
});

// Events are unique if they have a specific name and owner
EventSchema.index({ event: 1, owner: 1}, { unique: true });

module.exports = mongoose.model('Event', EventSchema);