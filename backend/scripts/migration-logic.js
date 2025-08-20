const mongoose = require('mongoose');
const User = require('../models/user');

// This class exists to handle applying a unique constraint to the User collection
class UsernameMigration {
    static collectionName = 'users';

    static async checkIfMigrationNeeded() {
        try {
            const indexes = await mongoose.connection.db.collection(this.collectionName).indexes();

            // does the unique constraint exist in the collection
            const hasUniqueUsername = indexes.some(index => {
                return index.key && index.key.username && index.unique === true;
            });

            if(hasUniqueUsername) {
                return false;
            }

            return true;

        } catch (error) {
            console.error('Error checking migration status: ', error);
            return false;
        }
    }

    static async runMigration() {
        try {
            const needsMigration = await this.checkIfMigrationNeeded();
            if(!needsMigration) {
                console.log("Unique username constraint already exists. No need for migration.");
                return;
            }

            console.log("Starting username migration...");

            const duplicates = await User.aggregate([
                {
                    $group: {
                        _id: '$username', // group usernames as unique ids
                        count: { $sum: 1 }, // add 1 to the count for each username with the same name
                        users: { $push: "$$ROOT" } // push entire original doc
                    }
                },
                {
                    $match: {
                        count: { $gt: 1 } // filter group by count bigger than one (multiple people with same username)
                    }
                }
            ]);

            console.log(`Found ${duplicates.length} duplicate username groups.`);

            if(duplicates.length === 0) {
                console.log('No duplicate usernames found. Safe to add unique constraint.');
                await this.addUniqueConstraint();
                return;
            }

            console.log('Resolving duplicates...');

            for(const duplicateGroup of duplicates) {
                console.log(`Processing ${duplicateGroup.count} users with username "${duplicateGroup._id}"`);

                const sortedUsers = duplicateGroup.users.sort((a, b) => {
                    return a._id.getTimestamp() - b._id.getTimestamp();
                });

                // Generate needed usernames once per group
                const availableUsernames = await this.generateUniqueUsernames(duplicateGroup);
                let usernameIndex = 0;

                for(let i = 1; i < sortedUsers.length; i++) {
                    const user = sortedUsers[i];
                    const newUsername = availableUsernames[usernameIndex];

                    await User.findByIdAndUpdate(user._id, {
                        username: newUsername
                    });

                    console.log(`Updated user: ${newUsername}`);
                    usernameIndex++;
                }
            }

            console.log("All duplicates resolved.");
            await this.addUniqueConstraint();
        } catch (error) {
            console.error('Migration failed: ', error);
            throw error;
        }
    }

    // Batch username check to prevent multiple db calls
    // Find unique username by testing the numbers that follow the username
    // Make sure the candidate username + number combo hasn't already been taken (edge cases)
    static async generateUniqueUsernames(duplicateGroup) {
        const baseUsername = duplicateGroup._id;

        // Get the total number of conflicting users in a group except the first
        const numNeeded = duplicateGroup.count - 1;

        // Get all existing users that start with the base username in one call
        const existingUsernames = await User.find({
            username: {
                $regex: `^${baseUsername}\\d*$`
            }
        }).distinct('username');

        // Store which numbers have been used before
        const usedNumbers = new Set();

        existingUsernames.forEach(username => {
            const match = username.match(new RegExp(`^${baseUsername}(\\d+)$`));

            if(match) {
                const number = parseInt(match[1]);
                usedNumbers.add(number);
            }
        });

        console.log(`Used numbers: ${Array.from(usedNumbers)}`);

        const availableUsernames = [];
        let attempt = 1;

        // Get a list of available usernames
        while(availableUsernames.length < numNeeded) {
            if(!usedNumbers.has(attempt)) {
                availableUsernames.push(`${baseUsername}${attempt}`);
            }
            attempt++;
        }

        return availableUsernames;
    }

    static async addUniqueConstraint() {
        console.log("Adding unique constraint to username...");

        try {
            await mongoose.connection.db.collection(this.collectionName).createIndex(
                { username: 1 },
                { unique: true }
            );

            console.log("Successfully added unique constraint to username field.");
        } catch (error) {
            console.error('Failed to add unique constraint to username.', error);
            throw error;
        }
    }
}

module.exports = UsernameMigration;