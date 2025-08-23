const { validatetoken } = require("../services/auth");
const path = require("path");
const frontendPath = path.resolve(__dirname, "..", "..", "frontend", "Admin");
function checkforauthentication() {
  return (req, res, next) => {
    console.log(req.headers);
    const authHeader = req.headers.token || req.headers.authorization?.split(' ')[1]  || req.cookies.Token;
    console.log("Token cookie value:", authHeader);
    if (!authHeader) {
      console.log("No token found, redirecting to login");
      if (req.originalUrl.startsWith("/doctor")) {
        return res.json({ success: false, message: "Please login" });
      }
      return res.json({ success: false, message: "Please login" });
    }
    const token = authHeader;
    console.log("Token value from header:", token);

    try {
      const userpayload = validatetoken(token);
      req.user = userpayload;
      console.log("Token validated, user payload:", userpayload);
      next();
    } catch (error) {
      console.error("Token validation Error:", error);
      return res.status(401).json({ success: false, message: "Invalid token" });
      // return res.redirect("/admin/login");
    }
  };
}

function restrictTo(roles = []) {
  return function (req, res, next) {
    console.log("User info: ", req.user);

    if (!req.user) {
      if (req.originalUrl.startsWith("/admin")) {
        return res.redirect("/admin/login");
      } else if (req.originalUrl.startsWith("/doctor")) {
        return res.redirect("/doctorlogin");
      } else {
        return res.redirect("/admin/login");
      }
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    next();
  };
}

module.exports = {
  checkforauthentication,
  restrictTo,
};
