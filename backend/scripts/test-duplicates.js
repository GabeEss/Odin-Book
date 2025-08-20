const mongoose = require('mongoose');
const User = require('../models/user');
require('dotenv').config();

async function createTestDuplicates() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
        console.error('Error creating test data: ', error);
    } finally {
        mongoose.disconnect();
    }
}