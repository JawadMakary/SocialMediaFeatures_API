const Post = require("../models/postModel");
const User = require("../models/userModel");
// const checkAuth = require("../middleware/checkAuth.js");

exports.createPost = async (req, res) => {
  try {
    const postOwner = await User.findById(req.body.postOwner);
    if (!postOwner) {
      return res.status(404).json("post owner does not exist");
    }
    const newPost = await Post.create({
      postOwner: req.body["postOwner"],
      content: req.body["content"],
      img: req.body["img"],
    });
    return res.status(201).json(newPost);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
exports.like = async (req, res) => {
  try {
    const post = await Post.findById(req.params["postID"]);
    if (!post) {
      return res.status(404).json("post does not exist");
    }
    if (!post.likes.includes(req.body["userID"])) {
      await post.updateOne({
        $push: {
          likes: req.body["userID"],
        },
      });
      return res.status(200).json("liked");
      // post.likes.push(req.body["userID"]);
      //  post.save();
    } else {
      await post.updateOne({
        $pull: {
          likes: req.body["userID"],
        },
      });
      return res.status(200).json("unliked");
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
// add option that work dynamically check if friend or follower
exports.fetchTimelinePosts = async (req, res) => {
  try {
    const currentUser = await User.findById(req.params["userID"]);
    if (!currentUser) {
      return res.status(404).json("user does not exist");
    }
    const currentUserPosts = await Post.find({
      postOwner: currentUser._id,
    });

    const friendsPosts = await Promise.all(
      currentUser.friends.map(async (friendID) => {
        return Post.find({
          postOwner: friendID,
        });
      })
    );
    const followersPosts = await Promise.all(
      currentUser.followers.map(async (followerID) => {
        return Post.find({
          postOwner: followerID,
        });
      })
    );
    const timelinePosts = currentUserPosts.concat(
      ...friendsPosts,
      ...followersPosts
    );
    return timelinePosts.length <= 0
      ? res.status(404).json("no posts")
      : res.status(200).json(timelinePosts);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
