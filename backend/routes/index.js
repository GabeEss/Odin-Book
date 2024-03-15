require('dotenv').config();
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/// HEALTH ROUTE ///

router.get("/health", (req, res) => {
  res.status(200).send("OK");
});

/// POST ROUTES ///

router.get("/posts", post_controller.post_list);
router.post("/post", post_controller.post_create_post);
router.delete("/post/:id", post_controller.post_delete);
router.get("/post/:id", post_controller.post_detail);
router.put("/post/:id/edit", post_controller.post_update);
router.put("/post/:id/add", post_controller.post_add_friend);
router.put("/post/:id/remove", post_controller.post_remove_friend);
router.put("/post/:id/like", post_controller.post_like);
router.put("/post/:id/unlike", post_controller.post_unlike);

/// COMMENT ROUTES ///

router.post("/post/:id", comment_controller.comment_create_post);
router.delete("/post/:id/comment", comment_controller.comment_delete);
router.put("/post/:id/comment", comment_controller.comment_update);
router.put("/post/:id/comment/:id/like", comment_controller.comment_like);
router.put("/post/:id/comment/:id/unlike", comment_controller.comment_unlike);

/// NOTIFICATION ROUTES ///

router.get("/notifications", notification_controller.notification_list);
router.post("/notification", notification_controller.notification_create_post);
router.delete("/notification/:id", notification_controller.notification_delete);
router.put("/notification/:id", notification_controller.notification_update);

/// USER ROUTES ///

router.post("/user/register", user_controller.user_create_post);
router.get("/user", user_controller.user_detail);
router.get("/user/friends", user_controller.user_friends_get);
router.put("/user/friends/add", user_controller.user_friend_add);
router.put("/user/friends/remove", user_controller.user_friend_remove);
router.get("/user/notifications", user_controller.user_notifications_get);
router.put("/user/notifications/read", user_controller.user_notifications_read);
router.put("/user/notifications/unread", user_controller.user_notifications_unread);
router.put("/user/update", user_controller.user_update);
router.delete("/user", user_controller.user_delete);

/// EVENT ROUTES ///

router.post("/event", event_controller.event_create_post);
router.get("/event", event_controller.event_list);
router.get("/event/:id", event_controller.event_detail);
router.put("/event/:id", event_controller.event_update);
router.delete("/event/:id", event_controller.event_delete);

module.exports = router;