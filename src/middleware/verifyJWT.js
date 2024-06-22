const jwt = require("jsonwebtoken");
const config = require("../utils/config");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, config.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) return res.status(403).json({ message: "Forbidden" });

    req.email = decoded.UserInfo.email;
    req.role = decoded.UserInfo.role;

    next();
  });
};

module.exports = verifyJWT;
