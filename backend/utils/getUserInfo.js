const User = require('../models/user');

// Function to get user info from Mongo using the 'X-User' header
const getUserInfo = async (userId) => {
    const mongoUser = await User.findOne({ auth0id: userId }).exec(); // MongoDB user
    return mongoUser;
}

module.exports = getUserInfo;