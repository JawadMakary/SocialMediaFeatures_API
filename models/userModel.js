const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Please enter your fullname"],
    },
    username: {
      type: String,
      unique: true,
      required: [true, "Please enter a username"],
      minLength: 5,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please enter an email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    followers: [
      {
        // random unique id provided by mongodb
        type: Schema.Types.ObjectId,
        // instead of relation in sql , we have reference in mongodb(refer to which model for example user) 
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friends:[
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
