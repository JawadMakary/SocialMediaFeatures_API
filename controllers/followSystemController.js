const user = require("../models/userModel");
const checkAuth = require("../middleware/checkAuth.js");

exports.followUnfollow = async (req, res) => {
  // a btn if flw is clicked-> show unfollow--> like on-off functionality
  // user cant follow/unfollow himself
  // ex: implement token and check if user is logged in via it
  const userData=checkAuth(req);

  if (req.params.id !== userData.data.id) {
    try {
      // current user
      // current user not needed if we have JWT token

      const currentUser = await user.findById(userData.data.id);

      if (!currentUser)
        return res.status(400).json("Please login to perform this action");

      // user to be followed
      const userToBeFollowed = await user.findById(req.params.id);
      if (!userToBeFollowed)
        return res.status(404).json("The user does not exist");

      // check if the user is already following the current user
      if (!userToBeFollowed.followers.includes(userData.data.id)) {
        // update the user to be followed
        await userToBeFollowed.updateOne({
          // push : mongodb operator to push to array
          $push: { followers: userData.data.id },
        });

        // update the current user
        await currentUser.updateOne({ $push: { following: req.params.id } });
        res.status(200).json("You are now following this user");
      } else {
        await userToBeFollowed.updateOne({
          // pull: mongodb operator to pull from array
          $pull: { followers: userData.data.id },
        });

        await currentUser.updateOne({ $pull: { following: req.params.id } });

        return res.status(200).json("user has been unfollowed");
      }
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  } else {
    return res
      .status(409)
      .json({ message: "You cannot follow/unfollow yourself" });
  }
};

exports.getfollowers_followingList = async (req, res) => {
  try {
    const choosenPath = req.path.split("/")[2];
    console.log(req.path.split("/"));
    const currentUser = await user.findById(req.params.userId);

    if (!currentUser)
      return res
        .status(400)
        .json({ message: `Please log in to access the ${choosenPath} list` });

    // populate: mongoose (odm for mongodb) that generate docs based on ref in schema
    const result = await currentUser.populate({
      path: choosenPath,
      select: { fullname: 1, username: 1, email: 1, profilePicture: 1 },
    });

    switch (true) {
      case choosenPath === "followers":
        return res.status(200).json({
          message: "Your followers are:",
          followers: result._doc.followers,
        });
      case choosenPath === "following":
        return res.status(200).json({
          message: "Your are following:",
          following: result._doc.following,
        });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
