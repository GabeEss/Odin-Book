const User = require('../../models/user');

async function getUserFromCache(userId, userCache) {
    if(userCache.has(userId)) {
        return userCache.get(userId);
    }

    // lean query returns a plain JS object instead of the full Mongoose doc
    const user = await User.findOne({ userId: userId }).lean();
    
    if(!user) return null;

    userCache.set(userId, user);
    return user;
}

module.exports = getUserFromCache;