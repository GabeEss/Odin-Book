const User = require('../../models/user');

async function getUserFromCache(userId, userCache) {
    if(userCache.has(userId)) {
        return userCache.get(userId);
    }

    const user = await User.findOne({ userId: userId }).lean();
    
    if(!user) return null;

    userCache.set(userId, user);
    return user;
}

module.exports = getUserFromCache;