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

module.exports = router;