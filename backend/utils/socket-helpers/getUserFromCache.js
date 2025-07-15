const User = require('../../models/user');

// Get user by guest ID or Auth ID, NOT Mongo ID
async function getUserFromCache(userId, userCache) {
    if(userCache.has(userId)) {
        return userCache.get(userId);
    }

    // Search by userId - these are active users
    let user = await User.findOne({ userId: userId });
    
    if(!user) {
        console.error("Invalid user. Only pass userId, do not pass _id.");
        return null;
    }
    
    userCache.set(userId, user);
    return user;
}

module.exports = getUserFromCache;