const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const bcrypt = require("bcryptjs");

const usersRouter = require("../users/users-router.js");
const authRouter = require("../auth/router");

const server = express();

const sessionConfiguration = {};

server.use(session(sessionConfiguration));

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/users", usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.get("/hash", (req, res) => {
  const password = req.headers.authorization;
  const secret = req.headers.secret;

  const hash = hashString(secret);

  if (password === "mellon") {
    res.json({ welcome: "friend", secret, hash });
  } else {
    res.status(401).json({ you: "cannot pass!" });
  }
});

function hashString(str) {
  // const salt = bcrypt.genSaltSync(10);
  // return bcrypt.hashSync(str, salt);
  const rounds = process.env.HASH_ROUNDS || 8;
  const hash = bcrypt.hashSync(str, rounds);
  return hash;
}

module.exports = server;
