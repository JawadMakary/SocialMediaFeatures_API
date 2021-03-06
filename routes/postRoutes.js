const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.post("/newPost", postController.createPost);
router.patch("/:postID/like", postController.like);
router.get("/timelineposts", postController.fetchTimelinePosts);
module.exports = router;
