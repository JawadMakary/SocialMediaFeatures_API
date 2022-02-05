const FriendRequest = require("../models/requestModel");
const mongoose = require("mongoose");
const checkExistingFriendRequest = async (req, status) => {
  try {
    // if friendReq has a status req and specific senderID and receiverID
    const checkExistence = await FriendRequest.find({
      $and: [
        {
          $and: [
            { senderID: req.body.senderID },
            { receiverID: req.body.receiverID },
          ],
        },
        {
          requestStatus: { $eq: status },
        },
      ],
    });
    // find fct return an array
    if (checkExistence.length > 0) {
        return true;
        }
    else {
        return false;
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports = checkExistingFriendRequest;
