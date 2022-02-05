const User = require("../models/userModel");
const FriendRequest = require("../models/requestModel");
const actions = require("../actions.json");
const limitRequests = require("../middleware/limitRequests");
const checkExistingFriendRequest = require("../middleware/checkExistingFriendRequest");
const checkRequestBasedOnStatus = require("../middleware/checkRequestBasedOnStatus");
const checkAuth = require("../middleware/checkAuth.js");

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
exports.cancelDeclineFriendRequest = async (req, res) => {
  const userData = checkAuth(req);

  try {
    const choosePath = req.path.split("/")[3];
    // check if req doc exists
    const request = await checkRequestBasedOnStatus(req, "pending");
    if (!request) {
      return res.status(404).json({ message: "request does not exist" });
    }
    if (
      choosePath === actions.cancel &&
      request.senderID.toString() === userData.data.id.toString()
    ) {
      // cancel the request
      request.requestStatus = "cancelled";
      // we need to wait for the request to be saved in the db
      await request.save();
      return res.status(200).json({ message: "request has been cancelled" });
    } else if (
      choosePath === actions.decline &&
      request.receiverID.toString() === req.body.currentUserID.toString()
    ) {
      // decline the request
      request.requestStatus = "declined";
      // we need to wait for the request to be saved in the db
      await request.save();
      return res.status(200).json({ message: "request has been declined" });
    } else {
      return res
        .status(409)
        .json({ message: "you cannot perform this action" });
    }
  } catch (err) {
    console.log(err);
  }
};
// get friends request of the sender
exports.getSenderAllFriendRequests=async(req,res)=>{
  try{
    const sender=await User.findById(req.body.senderID);
    if(!sender){
      return res.status(404).json({message:"sender does not exist"});
    }
    const friendRequests=await FriendRequest.find({senderID:req.body.senderID});
    const countSenderFriendsRequest=friendRequests.length;
    return res.status(200).json({friendRequests,countSenderFriendsRequest});

  }catch(err){
    console.log(err)
  }
}





// get friend request of the receiver
exports.getReceiverAllFriendRequests=async(req,res)=>{
  try{
    const receiver=await User.findById(req.body.receiverID);
    if(!receiver){
      return res.status(404).json({message:"receiver does not exist"});
    }
    const friendRequests=await FriendRequest.find({receiverID:req.body.receiverID});
    const countReceiverFriendsRequest=friendRequests.length;
    return res.status(200).json({friendRequests,countReceiverFriendsRequest});

  }catch(err){
    console.log(err)
  }
}