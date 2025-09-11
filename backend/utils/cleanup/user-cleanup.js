const User = require('../../models/user');
const Message = require('../../models/message');
const Post = require('../../models/post');
const Comment = require('../../models/comment');
const Event = require('../../models/event');

class UserCleanUp {
    static async cleanUpStaleUsers() {
        try {
            console.log("Starting guest user cleanup...");

            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

            const staleGuestUsers = await User.find({
                userId: { $regex: /^guest/ },
                _id: {
                    $lt: this.createObjectIdFromDate(sixMonthsAgo)
                }
            })

            console.log(`Found ${staleGuestUsers.length} stale users...`);

            for(const guest of staleGuestUsers) {
                console.log(`Cleaning up guest user: ${guest.username} ${guest._id}` );
                await this.cleanUpSingleUser(guest._id);
            }

            console.log("Guest user(s) cleanup finished...");
        } catch (error) {
            console.error('Guest user(s) cleanup failed: ', error);
        }
    }

    // Use mongoose object id constructor to create a new object from the specified date
    // Divide by 1000 to account for mongo timestamp measured by seconds not milliseconds
    static createObjectIdFromDate(date) {
        const mongoose = require('mongoose');
        return mongoose.Types.ObjectId.createFromTime(date.getTime() / 1000);
    }

    static async cleanUpSingleUser(mongoId) {
        try {
            console.log(`Cleaning up user: ${mongoId}`);

            const [deletedMessages, deletedPosts, deletedComments, deletedEvents] = await Promise.all([
                Message.deleteMany({ $or: [{sender: mongoId}, {receiver: mongoId}] }),
                Post.deleteMany({owner: mongoId}),
                Comment.deleteMany({owner: mongoId}),
                Event.deleteMany({owner: mongoId}),
            ]);

        console.log(`Deleted ${deletedMessages.deletedCount} messages`);
        console.log(`Deleted ${deletedPosts.deletedCount} posts`);
        console.log(`Deleted ${deletedComments.deletedCount} comments`);
        console.log(`Deleted ${deletedEvents.deletedCount} events`);

        await User.findByIdAndDelete(mongoId);
        console.log(`Deleted user: ${mongoId}`);

        } catch (error) {
            console.error(`Failed to cleanup user: ${mongoId}`);
            throw error;
        }
    }
}

module.exports = UserCleanUp;