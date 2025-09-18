// Socket connection handler

const socketIo = require('socket.io');
const mongoose = require("mongoose");

// Models
const Message = require('../models/message');
const User = require('../models/user');
const Event = require('../models/event');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Notification = require('../models/notification');

const BotService = require('../bot/bot-logic');

// Helpers
const getUserFromCache = require('../utils/socket-helpers/getUserFromCache');

// Cache for users, don't need to check db for every request
const userCache = new Map();
// Cache for users and sockets, keep for debugging
const socketCache = new Map();

/**
 * Initialize Socket.IO server instance
 * @param {Object} server - HTTP server instance
 * @returns {Object} Socket.IO instance
 */
function initializeSocket(server) {
  // const corsDeploy = "https://my-name-book.netlify.app";
  // Different addresses work for different browsers while testing
  const corsTest = [ "http://127.0.0.1:5173", "http://localhost:5173" ];
  const io = socketIo(server, {
    cors: {
      origin: corsTest,
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Find the user associated with the disconnected socket and remove them from the caches
  // Return the number of users disconnected
  function cleanupDisconnectedSocket(disconnectedSocketId) {
    let cleanedUpUsers = 0;

    for(let [userId, socketId] of socketCache.entries()) {
      if(socketId === disconnectedSocketId) {
        userCache.delete(userId);
        socketCache.delete(userId);
        cleanedUpUsers++;
      }
    }

    return cleanedUpUsers;
  }

/// NEW CONNECTION ///
io.on('connection', (socket) => {
  console.log('New client connected: ', socket.id);

  socket.on('userJoined', async (userId) => {
    const user = await getUserFromCache(userId, userCache);
    if(!user) { 
      console.error("Connecting user not found in database:", userId); 
      return;
    }
    socketCache.set(userId, socket.id);
    console.log("Socket cached.");
    console.log(`User joined: ${userId}`);
  });

  /// USE THE MONGO _ID FOR ALL CHATROOMS ///
  /// USER JOINS MESSAGE CHATROOM ///
  socket.on("userJoinsMessageChat", async (recipientId, userId) => {
    console.log("User joins message chat.")
    const user = await getUserFromCache(userId, userCache);
    if (!user) {
      console.error("User not found in database:", userId);
      return;
    }
    // recipientId is MongoDB _id from URL params, user._id is MongoDB _id from database
    const chatroomId = [recipientId, user._id].sort().join('-');
    // console.log(chatroomId);
    socket.join(`message-${chatroomId}`);
  })

  /// USE THE MONGO _ID FOR ALL CHATROOMS ///
  /// USER LEAVES MESSAGE CHATROOM ///
  socket.on("userLeavesMessageChat", async(recipientId, userId) => {
    console.log("User leaves message chat.");
    const user = await getUserFromCache(userId, userCache);
    if (!user) {
      console.error("User not found in database:", userId);
      return;
    }
    // recipientId is MongoDB _id from URL params, user._id is MongoDB _id from database
    const chatroomId = [recipientId, user._id].sort().join('-');
    socket.leave(`message-${chatroomId}`);
  })

  /// USE THE MONGO _ID FOR ALL CHATROOMS ///
  /// USER JOINS POSTED-TO CHATROOM ///
  socket.on('userJoinsPostedTo', async (postedToId) => {
    console.log("User joins posted to: " + postedToId);
    socket.join(`postedTo-${postedToId}`);
  });

  /// USE THE MONGO _ID FOR ALL CHATROOMS ///
  /// USER LEAVES POSTED-TO CHATROOM ///
  socket.on('userLeavesPostedTo', async (postedToId) => {
    console.log("User leaves posted to: " + postedToId);
    socket.leave(`postedTo-${postedToId}`);
  });

  /// USE THE MONGO _ID FOR ALL CHATROOMS ///
  /// USER JOINS A SPECIFIC POST CHATROOM ///
  socket.on('userJoinsPost', async (postId) => {
    socket.join(`post-${postId}`);
  });

  /// USE THE MONGO _ID FOR ALL CHATROOMS ///
  /// USER LEAVES A SPECIFIC POST CHATROOM ///
  socket.on('userLeavesPost', async (postId) => {
    socket.leave(`post-${postId}`);
  });

  /// USE THE MONGO _ID FOR ALL CHATROOMS ///
  /// USER JOINS HAS NOTIFICATION CHATROOM ///
  socket.on('userJoinsHasNotification', async (userId) => {
    socket.join(`has-notification-${userId}`);
  })

  /// USE THE MONGO _ID FOR ALL CHATROOMS ///
  /// USER LEAVES HAS NOTIFICATION CHATROOM ///
  socket.on('userLeavesHasNotification', async (userId) => {
    socket.leave(`has-notification-${userId}`);
  })

  /// SEND MESSAGE ///
  socket.on('sendMessage', async (data) => {
    try {
      const sender = await getUserFromCache(data.from, userCache);
      if(!sender) { 
        console.error("Sender user not found in database:", data.from);
        return;
      }

      let receiver = await User.findOne({ _id: data.to });
      if (!receiver) {
        console.error("Receiver user not found in database:", data.to);
        return;
      }

      if(!data.message) {
        console.error("Invalid message data.");
        return;
      }

      // Store message in database
      const message = new Message({
        sender: sender,
        receiver: receiver,
        message: data.message,
        timestamp: new Date(),
      });

      const notification = new Notification({
        notification: `${sender.username} sent you a message.`,
        timestamp: new Date(),
        user: receiver,
        read: false,
        type: 'newMessage',
        triggeredBy: sender
      });

      try {
          // Don't want the message to depend on the notification, so no transaction.
          await message.save();
          console.log("Message inserted");
          await notification.save();
          console.log("Notification sent.");

          const chatroomId = [receiver._id, sender._id].sort().join('-');
          // Send to all users
          io.to('message-' + chatroomId).emit('message', message);
        
          // Notification to receiver of message
          io.to('has-notification-' + receiver._id).emit('notification', message);

          if(BotService.isBot(receiver.userId)) {
              await BotService.handleMessage(sender, io, chatroomId);
          }
      } catch (err) {
          console.error("Error inserting message:", err);
      }
    } catch (error) {
      console.error("Error handling 'sendMessage' event:", error);
    }
  });

  // SEND POST ///
  socket.on('sendPost', async (data) => {
    try {
      const sender = await getUserFromCache(data.from, userCache);
      if(!sender) { 
        console.error("Sender user not found in database:", data.from);
        return;
      }

      // Get the recipient user/event
      let receivingModel = 'User';
      let receiver = await User.findOne({ _id: data.to });
      if (!receiver) {
        receivingModel = 'Event';
        receiver = await Event.findOne({ _id: data.to });
        if(!receiver) {
          console.error("Receiver user/event not found in database:", data.to);
          return;
        }
      }

      if(!data.post) {
        console.error("Invalid post data.");
        return;
      }

      const post = new Post({
        post: data.post,
        owner: sender,
        posted_to: { id: data.to, model: receivingModel },
        comments: [],
        date_created: new Date(),
        likes: [],
      });

      const notification = new Notification({
        notification: `${sender.username} posted on your page.`,
        timestamp: new Date(),
        user: receiver,
        read: false,
        type: 'newPost',
        triggeredBy: sender
      });

      try {
          await post.save();
          console.log("Post inserted");

          // Send to all users
          io.to('postedTo-' + data.to).emit('post', post);
          // // Send as a notification to the user
          if(post.posted_to.model === 'User' && receiver._id.toString() !== sender._id.toString()) {
            await notification.save();
            io.to('has-notification-' + post.posted_to.id).emit('notification', post);
            console.log("Notification sent.");
          }
      } catch (err) {
          console.error("Error inserting post:", err);
      }
    } catch (error) {
      console.error("Error handling 'sendPost' event:", error);
    }
  });

  // SEND COMMENT ///
  socket.on('sendComment', async (data) => {
    try {
      const sender = await getUserFromCache(data.from, userCache);
      if(!sender) { 
        console.error("Sender user not found in database:", data.from);
        return;
      }

      let post = await Post.findOne({ _id: data.to });

      if(!post) {
        console.error("Post not found in database:", data.to);
        return;
      }

      if(!data.comment) {
        console.error("Invalid comment data.");
        return;
      }

      const comment = new Comment({
        comment: data.comment,
        owner: sender,
        post: post,
        date_created: new Date(),
        likes: [],
      });

      try {
        await Post.updateOne(
          { _id: post },
          { $push: { comments: comment._id }}
        );
        await comment.save();
        console.log("Comment inserted");

        // Send to all users
        io.to('post-' + data.to).emit('comment', comment);
      } catch (err) {
        console.error("Error inserting comment:", err);
      }
    } catch (error) {
      console.error("Error handling 'sendComment' event:", error);
    }
  })

  /// SEND A NOTIFICATION AFTER A FRIEND REQUEST ///
  socket.on('sendFriendRequestNotification', async (data) => {
    try {
      const sender = await getUserFromCache(data.from, userCache);
      if(!sender) { 
        console.error("Sender user not found in database:", data.from);
        return;
      }

      if(!data.to) { 
        console.error("Receiving user _id not specified."); 
        return; 
      }

      const notification = new Notification({
        notification: `${sender.username} sent you a friend request.`,
        timestamp: new Date(),
        user: data.to,
        read: false,
        type: 'friendRequest',
        triggeredBy: sender
      });

      if(sender && data.to) {
        await notification.save();
        io.to('has-notification-' + data.to).emit('notification', sender);
        console.log("Friend request notification sent.");
      }
    } catch (error) {
      console.error('Error sending a notification after a friend request.');
    }
  })

  /// EDIT POST ///
  socket.on('editPost', async(data) => {
    try {
      const post = await Post.findById(data.post).populate('owner').populate('likes');
      if(!post) {
        console.error("Post not found:", data.post); 
        return;
      }

      post.post = data.content;
      await post.save();

      io.to('postedTo-' + data.to).emit('editPost', post);
    } catch(error) {
      console.error("Error handling 'editPost' event:", error);
    }
  })

  /// DELETE POST ///
  /// NOTE TRANSACTIONS DON'T WORK WITH LOCAL MONGO ///
  socket.on('deletePost', async (data) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const post = await Post.findById(data.post);
      if(!post) {
        console.error('Post not found:', data.post);
        return;
      }
      await Comment.deleteMany({ post: data.post}, {session:session});
      await post.deleteOne({ _id: data.post }, {session:session});
      await session.commitTransaction();
      console.log("Deletion complete. Emit to socket.");
      io.to('postedTo-' + data.to).emit('deletePost', data.post);
    } catch (error) {
      console.error('Error deleting post:', error);
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  })

  /// DELETE COMMNET ///
  /// NOTE TRANSACTIONS DON'T WORK WITH LOCAL MONGO ///
  socket.on('deleteComment', async (data) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const comment = await Comment.findById(data.comment);
      if(!comment) {
        console.error('Comment not found:', data.comment);
        return;
      }

      // Find the post
      const post = await Post.findOne({ _id: data.to });
      if (!post) {
          console.error('Post not found for comment:', data.to);
          return;
      }
      
      // Remove comment from comments array in the post
      post.comments = post.comments.filter(id => id.toString() !== data.comment);

      await post.save({session});
      await comment.deleteOne({ _id: data.comment }, {session});
      await session.commitTransaction();
      console.log("Comment deleted.");
      io.to('post-' + post._id).emit('deleteComment', comment);
    } catch (error) {
      await session.abortTransaction();
      console.error('Error deleting comment:', error);
    } finally {
      session.endSession();
    }
  })

  /// DELETE MESSAGE ///

  socket.on('deleteMessage', async(data) => {
    try {
      const sender = await getUserFromCache(data.from, userCache);
      if(!sender) { 
        console.error("Sender user not found in database:", data.from);
        return;
      }

      // Get the recipient user
      let receiver = await User.findOne({ _id: data.to });
      if (!receiver) {
        console.error("Receiver user not found in database:", data.to);
        return;
      }

      const message = await Message.findById(data.messageId);

      if(!message) {
        console.error("No message found.");
        return;
      }

      // Delete the message
      await Message.findByIdAndDelete(data.messageId);
      
      const chatroomId = [receiver._id, sender._id].sort().join('-');

      // Send to all users
      io.to('message-' + chatroomId).emit('deleteMessage', message);
    } catch (error) {
      console.error("Unable to delete message:", error);
      return;
    }
  })

  /// LIKE POST ///

  socket.on('likePost', async(data) => {
    try {
      const user = await User.findOne({ userId: data.from });
      if(!user) {
        console.error("User not found:", data.from);
        return;
      }

      const post = await Post.findById(data.post).populate('owner').populate('likes');
      if(!post) {
        console.error("Post not found:", data.post); 
        return;
      }
      
      if(data.likeUnlike === 'like')
        post.likes.push(user);
      else if(data.likeUnlike === 'unlike') 
        post.likes.pull(user);
      else {
        console.error("Like status not formatted correctly.");
        return;
      }
      await post.save();
      io.to('postedTo-' + data.to).emit('editPost', post);
      console.log("Like registered.");
    } catch(error) {
      console.error("Error handling 'editPost' event:", error);
    }
  })

  /// LIKE COMMENT ///
  /// NOTE TRANSACTIONS DON'T WORK WITH LOCAL MONGO ///
  socket.on('likeComment', async(data) => {
    try {
      const user = await User.findOne({ userId: data.from });
      if(!user) {
        console.error("User not found:", data.from);
        return;
      }

      const post = await Post.findById(data.to);
      if(!post) {
        console.error("Post not found:", data.to);
        return;
      }

      const comment = await Comment.findById(data.comment).populate('owner').populate('likes');
      if(!comment) {
        console.error("Comment not found:", data.comment); 
        return;
      }

      // Check if the comment is in the post
      if(!post.comments.some(c => c._id.equals(comment._id))) {
        console.error("Comment not found in post:", data.comment);
        return;
      }

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        if(data.likeUnlike === 'like')
          comment.likes.push(user);
        else if(data.likeUnlike === 'unlike') 
          comment.likes.pull(user);
        else {
          console.error("Like status not formatted correctly.");
          return;
        }

        await Post.updateOne(
          { _id: post._id, "comments._id": comment._id },
          { $set: { "comments.$": comment }},
          { session }
        );
        await comment.save({session});
        await session.commitTransaction();

        io.to('post-' + data.to).emit('editComment', comment);
        console.log("Comment like registered.");
      } catch (err) {
        console.error("Error inserting comment:", err);
        await session.abortTransaction();
      } finally {
        session.endSession();
      }
    } catch(error) {
      console.error("Error handling 'editComment' event:", error);
    }
  })

  /// USER LEAVES OR DISCONNECTS ///

  socket.on('userLeft', (userId) => {
    userCache.delete(userId);
    socketCache.delete(userId);
    console.log('User left:', userId);
    // console.log('User left.');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnecting:', socket.id);

    // BEFORE
    console.log('Before disconnect socketCache:', Array.from(socketCache.entries()));
    console.log('Before disconnect userCache:', Array.from(userCache.entries()));

    const disconnectedUsers = cleanupDisconnectedSocket(socket.id);

    // AFTER
    console.log('After disconnect socketCache:', Array.from(socketCache.entries()));
    console.log('After disconnect userCache:', Array.from(userCache.entries()));

    if(disconnectedUsers === 1) console.log(`Cleaned up ${disconnectedUsers} user.`)
    else if(disconnectedUsers > 1) console.log(`Cleaned up ${disconnectedUsers} users. Warning: multiples users in socket with the same id.`)
    else console.log(`Warning: No users found in socket cache.`)
  });

  socket.on('error', (error) => {
    console.error('An error occurred with the socket:', error);
  });
});

  return io;
}

module.exports = initializeSocket;