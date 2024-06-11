require('dotenv').config();
const express = require('express');
const router = express.Router();
const post_controller = require("../controllers/PostController");
const comment_controller = require("../controllers/CommentController");
const notification_controller = require("../controllers/NotificationController");
const user_controller = require("../controllers/UserController");
const event_controller = require("../controllers/EventController");
const message_controller = require("../controllers/MessageController");

/// HEALTH ROUTE ///

router.get("/health", (req, res) => {
  res.status(200).send("OK");
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
router.put("/user/block", user_controller.user_block);
router.get("/user/notifications", user_controller.user_notifications_get);
router.put("/user/notifications/read", user_controller.user_notifications_read);
router.put("/user/update", user_controller.user_update);
router.get("/user/update", user_controller.user_update_get);
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

module.exports = router;