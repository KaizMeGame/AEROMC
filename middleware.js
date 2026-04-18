const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.sendStatus(401);

  try {
    req.user = jwt.verify(token, process.env.SECRET);
    next();
  } catch {
    res.sendStatus(403);
  }
};

exports.admin = (req, res, next) => {
  if (req.user.role !== "admin") return res.sendStatus(403);
  next();
};