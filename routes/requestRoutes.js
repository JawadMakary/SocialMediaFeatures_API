const express = require("express");
const router = express.Router();
const frinedRequestsController = require("../controllers/requestSystemController");

router.post("/requestFriendship", frinedRequestsController.sendRequest);


module.exports = router;