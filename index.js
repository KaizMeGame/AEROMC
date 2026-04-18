require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const { User, Post } = require("./models");
const { auth, admin } = require("./middleware");
const { genAccess, genRefresh } = require("./auth");
const { upload } = require("./upload");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json({ limit: "5mb" }));

mongoose.connect(process.env.MONGO_URI);

// AUTH
app.post("/api/register", async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  const user = await new User({
    username: req.body.username,
    password: hash
  }).save();
  res.json(user);
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.sendStatus(400);

  const ok = await bcrypt.compare(req.body.password, user.password);
  if (!ok) return res.sendStatus(400);

  const payload = { id: user._id, role: user.role };

  res.json({
    access: genAccess(payload),
    refresh: genRefresh(payload)
  });
});

// REFRESH TOKEN
app.post("/api/refresh", (req, res) => {
  try {
    const user = require("jsonwebtoken").verify(
      req.body.token,
      process.env.REFRESH_SECRET
    );
    res.json({ access: genAccess(user) });
  } catch {
    res.sendStatus(403);
  }
});

// POSTS + IMAGE
app.post("/api/post", auth, async (req, res) => {
  let img = "";
  if (req.body.image) img = await upload(req.body.image);

  const post = await new Post({
    title: req.body.title,
    content: req.body.content,
    image: img,
    author: req.user.id
  }).save();

  io.emit("new_post", post); // realtime
  res.json(post);
});

app.get("/api/posts", async (_, res) => {
  res.json(await Post.find().sort({ createdAt: -1 }));
});

app.delete("/api/post/:id", auth, admin, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// REALTIME CHAT
io.on("connection", (socket) => {
  socket.on("chat", (msg) => {
    io.emit("chat", msg);
  });
});

server.listen(3000, () => console.log("ULTIMATE RUNNING"));