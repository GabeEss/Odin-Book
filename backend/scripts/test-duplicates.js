const mongoose = require('mongoose');
const User = require('../models/user');
const generateGuestID = require('../utils/generateGuestID');
require('dotenv').config();

// WARNING: ONLY USE THIS WITH A LOCAL MONGO ENVIRONMENT
// Test to see if migration logic successfully moves duplicates and doesn't create a new duplicate
async function createTestDuplicates() {
    try {
        await mongoose.connect("mongodb://localhost:27017/odin-book");
        
        try {
            await User.collection.dropIndex("username_1");
            console.log("Dropped unique index on username.")
        } catch (err) {
            console.log("No existing index to drop.");
        }

        const deletedUsers = await User.deleteMany({
            username: { $in: ["person", "person1", "person2"] }
        });

        console.log(`Deleted ${deletedUsers.deletedCount} existing test users`);

        const testUserNum = await generateGuestID();
        const testUserID = "guest" + testUserNum;

        const testUser2Num = await generateGuestID();
        const testUser2ID = "guest" + testUser2Num;

        const testUser3Num = await generateGuestID();
        const testUser3ID = "guest" + testUser3Num;

        const testUser1 = new User({
            userId: testUserID,
            username: "person",
            email: `FakeMail${testUserID}@guestaddress.com`,
            worksAt: "Guest Factory",
            livesIn: "Guestro City, Guestland",
            from: "Guestville, Guestland",
            displayColor: "green",
            coverColor: "purple",
            friends: [],
            friendRequests: [],
            sentRequests: [],
            notifications: [],
        });

        const testUser2 = new User({
            userId: testUser2ID,
            username: "person",
            email: `FakeMail${testUser2ID}@guestaddress.com`,
            worksAt: "Guest Factory",
            livesIn: "Guestro City, Guestland",
            from: "Guestville, Guestland",
            displayColor: "green",
            coverColor: "purple",
            friends: [],
            friendRequests: [],
            sentRequests: [],
            notifications: [],
        });

        const testUser3 = new User({
            userId: testUser3ID,
            username: "person1",
            email: `FakeMail${testUser3ID}@guestaddress.com`,
            worksAt: "Guest Factory",
            livesIn: "Guestro City, Guestland",
            from: "Guestville, Guestland",
            displayColor: "green",
            coverColor: "purple",
            friends: [],
            friendRequests: [],
            sentRequests: [],
            notifications: [],
        });

        await testUser1.save();
        console.log("Created test user 1 with username: person");
        await testUser2.save();
        console.log("Created test user 2 with username: person");
        await testUser3.save();
        console.log("Created test user 3 with username: person1");

        console.log("Finished creating test data. Check local mongo.")

    } catch (error) {
        console.error('Error creating test data: ', error);
    } finally {
        mongoose.disconnect();
    }
}

createTestDuplicates();