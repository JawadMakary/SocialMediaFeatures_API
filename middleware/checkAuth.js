var jwt = require("jsonwebtoken");

// check if staff has jwt token
const checkAuth = (req) => {

    try {

      const token = req.headers["authorization"].split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
      return decoded;
      // next();
    } catch (err) {
      return undefined;
    }
};


module.exports = checkAuth;