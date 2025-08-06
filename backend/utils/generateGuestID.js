const { ObjectId } = require('mongodb');

async function generateGuestID() {
    // No DB queries, guaranteed unique
    return new ObjectId().toString();
}

module.exports = generateGuestID;