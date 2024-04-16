const crypto = require('crypto');
const User = require("../models/user");

async function generateGuestID() {
    while(true) {
        const userId = crypto.randomBytes(16).toString('hex');
        try {
            const guest = await User.findOne({ userId: userId }).exec();
            if(!guest) {
                return userId;
            }
        } catch (error) {
            console.log('Error:', error.message);
            throw new Error('Error generating guest ID');
        }   
    }
}

module.exports = generateGuestID;