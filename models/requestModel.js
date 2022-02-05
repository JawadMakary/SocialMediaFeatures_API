const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const friendRequestSchema = new mongoose.Schema(
  {
    senderID: {
      type: Schema.Types.ObjectId,
      ref: "User", // User document
      required: [true, "Please enter a sender ID"],
    },
    receiverID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please enter a receiver ID"],
    },
    requestStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled"], // array of allowed values
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("FriendRequest", friendRequestSchema);
