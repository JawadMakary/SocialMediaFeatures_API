const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// create jwt token by signing it with sign fct and encoding it with the jwt secret

const signToken = (data) => {
  return jwt.sign({ data }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// helper fct
// we can use it in other fcts
const createSendToken = (User, statusCode, res) => {
  //mongoose create ._id automatically
  const token = signToken(User);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      User,
    },
  });
};

exports.login = async (req, res) => {
  try {
    //No need for other information in the req.body (Will make username unique)
    //Or we will be needing a password
    const { FirstName } = req.body;
    const User = await User.findOne({ 'FirstName': FirstName});

    if (!User) {

      return res
        .status(404)
        .json({User, message: "no User is found with these credentials" });
        
    }

    createSendToken(User,200,res)

  } catch (err) {
    console.log(err.message);
  }
};
