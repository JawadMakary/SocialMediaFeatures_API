const FriendRequest = require("../models/requestModel");
const mongoose = require("mongoose");
const limitRequests = async (req, status) => {
  try {
    const requests = await FriendRequest.countDocuments({
      $and: [
        { senderID: req.body.senderID },
        { requestStatus: { $eq: status } },
        // $eq--> equal to
      ],
    });
    if (requests >= 4) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports = limitRequests;
