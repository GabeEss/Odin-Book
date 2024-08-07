const User = require('../models/user');

// Function to get user info from MongoDB
const getUserInfo = async (userId) => {
    if(!userId) {
        return null;
    }

    let mongoUser = await User.findOne({ userId: userId }).exec();

    return mongoUser;
}

module.exports = getUserInfo;