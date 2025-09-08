const User = require('../models/user');

// Function to get user info from MongoDB using the userId
const getUserInfo = async (userId) => {
    if(!userId) {
        return null;
    }

    let mongoUser = await User.findOne({ userId: userId }).exec();

    return mongoUser;
}

// Function to get user info from MongoDB using the username
const getUserInfoUsername = async (username) => {
    if(!username) {
        return;
    }

    let mongoUser = await User.findOne({username: username}).exec();

    return mongoUser;
}

module.exports = { 
    getUserInfo,
    getUserInfoUsername,
};