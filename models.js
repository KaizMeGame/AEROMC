const mongoose = require("mongoose");

exports.User = mongoose.model("User", {
  username: String,
  password: String,
  role: { type: String, default: "user" }
});

exports.Post = mongoose.model("Post", {
  title: String,
  content: String,
  image: String,
  author: String,
  createdAt: { type: Date, default: Date.now }
});