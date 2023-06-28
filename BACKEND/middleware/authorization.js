const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //Get token from header
      token = req.headers.authorization.split(" ")[1];

      //Verify the token
      const user = jwt.verify(token, process.env.JWT_SECRET, (err, res) => {
        if (err) {
          return "Token expired";
        }
        return res;
      });

      if (user == "Token expired") {
        return res.send({ status: "Error", data: "Token expired" });
      }

      //Get user from the token
      req.user = await User.findById(user.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      res.json("Not authorized");
    }
  }

  if (!token) {
    res.status(401);
    res.json("No token!");
  }
};

module.exports = { protect };
