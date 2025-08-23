const jwt = require("jsonwebtoken");
const secret = process.env.secret;
const User = require("../models/user");

function createtokenforuser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    role: user.role,
  };
  const token = jwt.sign(payload, secret,{expiresIn:"30d"});
  return token;
}

function validatetoken(token) {
  if (!token || typeof token !== "string") {
    throw new Error("Token must be a string");
  }
  const payload = jwt.verify(token, secret);
  return payload;
}
const checkAuth = (req, res) => {
  const token = req.header|| 
                 req.headers.authorization?.replace('Bearer ', '') || 
                 req.cookies.Token; // Retrieve token from cookies

  // If there is no token, the user is not authenticated
  if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  try {
      // Verify the token using the JWT secret
      const decoded = jwt.verify(token, process.env.secret); // Replace with your secret

      // If valid, send the decoded token or user data
      return res.status(200).json({ success: true, token: decoded });
  } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
module.exports = {
  createtokenforuser,
  validatetoken,
  checkAuth,
};
