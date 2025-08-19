const mongoose = require('mongoose');
const User = require('../models/user');

class UsernameMigration {
    static collectionName = 'users';
    static batchSize = 100;

    static async checkIfMigrationNeeded() {
        try {
            const indexes = await mongoose.connection.db.collection('users').indexes();

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
            // filter this group by count bigger than one (multiple people with same username)
            {
                $match: {
                    count: { $gt: 1 }
                }
            }
            
        ]);
    }
}

module.exports = UsernameMigration;