const User = require('../models/user');
const Event = require('../models/event');

// Get the page id and determine the model of the page in order to fetch posts
async function findPageModel(id) {
    const user = await User.findOne({ _id: id });
    if (user) return { model: 'User', data: user };

    const event = await Event.findOne({ _id: id });
    if (event) return { model: 'Event', data: event };

    return null;
}

module.exports = findPageModel;