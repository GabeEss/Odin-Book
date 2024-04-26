const User = require('../models/user');

async function searchUserCollection(search) {
    const users = await User.find({ username: { $regex: search, $options: 'i' } }).exec();
    if(users.length === 0) {
        console.log('No users found');
        return [];
    }
    return users;
}

module.exports = searchUserCollection;