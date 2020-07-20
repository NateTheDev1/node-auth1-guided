const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const bcrypt = require("bcryptjs");

const usersRouter = require("../users/users-router.js");
const authRouter = require("../auth/router");

const server = express();

const dbConnection = require("../database/connection");

const sessionConfiguration = {
  name: "monster", // default value is sid
  secret: process.env.SESSION_SECRET || "keep it secret, keep it safe", //key for encryption
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: process.env.USE_SECURE_COOKIES || false,
    httpOnly: true, //prevent JS code on client from accessing this cookie
  },
  resave: false,
  saveUnitialized: true, // read docs, it's related to GDPR compliance
  store: new KnexSessionStore({
    knex: dbConnection,
    tablename: "sessions",
    sidfieldname: "sid",
    createTable: true,
    clearInterval: 1000 * 60 * 30, // time to check and remove expired sessions from database
  }),
};

server.use(session(sessionConfiguration)); // enables session support

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
