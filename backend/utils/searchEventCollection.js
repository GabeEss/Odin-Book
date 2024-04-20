const Event = require('../models/event');

async function searchEventCollection(search) {
    const events = await Event.find({ event: { $regex: search, $options: 'i' } }).exec();
    if(events.length === 0) {
        console.log('No events found');
        return [];
    }
    return events;
}

module.exports = searchEventCollection;