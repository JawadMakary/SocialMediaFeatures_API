const User = require("../models/userModel");
const FriendRequest = require("../models/requestModel");
const actions = require("../actions.json");
const limitRequests = require("../middleware/limitRequests");
const checkExistingFriendRequest = require("../middleware/checkExistingFriendRequest");

exports.sendRequest = async (req, res) => {
  try {
    // check if sender or receiver is != ""
    const sender = await User.findById(req.body.senderID);
    const receiver = await User.findById(req.body.receiverID);

    if (!sender || !receiver) {
      return res
        .status(404)
        .json({ message: "sender or receiver or both of them does not exist" });
    }
    // check if the sender is already following the receiver
    const friendsList = sender.friends.includes(req.body.receiverID);
    if (friendsList) {
      return res
        .status(409)
        .json({ message: "You are already friends with this user" });
    }
    // limit the number of requests sent by a single user when declined
    var test = await limitRequests(req, "declined");
    if (test) {
      return res
        .status(429) //too many requests
        .json({
          message:
            " you cannot send anymore req because you exceeded the limit (4) ",
        });
    }
    // step 2
    // if the request status is pending
    const friendRequest = await checkExistingFriendRequest(req, "pending");
    if (!friendRequest) {
      return res.status(409).json({ message: "request is already sent" });
    } else {
      // third step
      // create a new friend request
      const newFriendRequest = await FriendRequest.create({
        senderID: req.body.senderID,
        receiverID: req.body.receiverID,
        requestStatus: "pending",
      });
      return res.status(201).json(newFriendRequest);
    }
  } catch (error) {
    console.log(error);
  }
};
