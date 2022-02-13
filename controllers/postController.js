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
