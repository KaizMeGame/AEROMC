const jwt = require("jsonwebtoken");

exports.genAccess = (user) =>
  jwt.sign(user, process.env.SECRET, { expiresIn: "15m" });

exports.genRefresh = (user) =>
  jwt.sign(user, process.env.REFRESH_SECRET, { expiresIn: "7d" });