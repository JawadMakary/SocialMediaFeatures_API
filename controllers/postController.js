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
