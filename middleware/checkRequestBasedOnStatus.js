const FriendRequest = require("../models/requestModel");
const mongoose = require("mongoose");
const checkRequestBasedOnStatus = async (req, status) => {
  try {
    const request = await FriendRequest.findOne({
      $and: [
        { _id: req.params.id },
        {
          requestStatus: {
            $eq: status,
          },
        },
      ],
    });
    if (request) {
      return request;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports = checkRequestBasedOnStatus;