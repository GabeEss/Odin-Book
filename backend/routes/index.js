require('dotenv').config();
const express = require('express');
const router = express.Router();
const post_controller = require("../controllers/PostController");
const comment_controller = require("../controllers/CommentController");
const notification_controller = require("../controllers/NotificationController");
const user_controller = require("../controllers/UserController");
const event_controller = require("../controllers/EventController");
const message_controller = require("../controllers/MessageController");
const mongoose = require('mongoose');

/// HEALTH ROUTE ///

router.get("/health", (req, res) => {
  res.status(200).send("OK");
});

router.get("/health/db", (req, res) => {
  const state = mongoose.connection.readyState;

  if(state === 0) {
    res.status(500).send("MongoDB disconnected.");
  } else if (state === 1) {
    res.status(200).send("MongoDB connected");
  } else if (state === 2) {
    res.status(500).send("MongoDB connecting");
  } else if (state === 3) {
    res.status(500).send("MongoDB disconnecting");
  }
});

/// POST ROUTES ///
/// POSTS CREATED, UPDATED, AND DELETED VIA SOCKET ///

router.get("/posts", post_controller.post_list);

/// COMMENT ROUTES ///
/// COMMENTS CREATED AND DELETED VIA SOCKET ///

router.get("/post/:id/comments", comment_controller.comment_list);

/// NOTIFICATION ROUTES ///
/// NOTIFICATIONS CREATED VIA SOCKET ///

router.get("/notifications", notification_controller.notification_list);
router.put("/notifications", notification_controller.notification_update);

/// USER ROUTES ///

router.post("/user/register", user_controller.user_register_post);
router.post("/user/guest/register", user_controller.guest_register_post);
router.get("/user", user_controller.user_detail);
router.get("/users", user_controller.user_list);
router.get("/current-user", user_controller.user_current);
router.get("/users/:id", user_controller.user_find_by_id);
router.get("/user/friends", user_controller.user_friends_get);
router.put("/user/friends/request", user_controller.user_friend_request);
router.put("/user/friends/accept", user_controller.user_friend_accept);
router.put("/user/friends/reject", user_controller.user_friend_reject);
router.put("/user/remove", user_controller.user_remove);
router.put("/user/update", user_controller.user_update);
router.get("/user/update", user_controller.user_update_get);
router.get("/user/newsfeed", user_controller.user_newsfeed);
router.delete("/user", user_controller.user_delete);

/// EVENT ROUTES ///

router.post("/event", event_controller.event_create_post);
router.get("/events", event_controller.event_list);
router.get("/events/all", event_controller.event_list_all);
router.get("/event/:id", event_controller.event_detail);
router.put("/event/:id", event_controller.event_update);
router.delete("/event/:id", event_controller.event_delete);
router.put("/event/:id/join", event_controller.event_join);
router.put("/event/:id/leave", event_controller.event_leave);
router.put("/event/:id/respond", event_controller.event_respond);

/// MESSAGE ROUTES ///
/// MESSAGES CREATED VIA SOCKET ///

router.get("/messages", message_controller.message_get);
router.get("/conversations", message_controller.message_conversations_get);

module.exports = router;