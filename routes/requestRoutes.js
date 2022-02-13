const express = require("express");
const router = express.Router();
const friendRequestsController = require("../controllers/requestSystemController");

router.post("/requestFriendship", friendRequestsController.sendRequest);
router.patch(
  "/friendRequests/:requestID/cancel",
  friendRequestsController.cancelDeclineFriendRequest
);
router.patch(
  "/friendRequests/:requestID/decline",
  friendRequestsController.cancelDeclineFriendRequest
);
router.get(
  "/friendRequest/:senderID/senderReq",
  friendRequestsController.getSenderRequest
);
router.get(
  "/friendRequest/:receiverID/receiverReq",
  friendRequestsController.getReceiverRequest
);
router.get(
  "/friendRequests/:senderID/getAllSenderFriendsRequests",
  friendRequestsController.getSenderAllFriendRequests
);
router.get(
  "/friendRequests/:receiverID/getAllReceiverFriendsRequests",
  friendRequestsController.getReceiverAllFriendRequests
);
// acceptFriendRequest
router.patch(
  "/friendRequests/:requestID/accept",
  friendRequestsController.acceptFriendRequest
);
module.exports = router;
