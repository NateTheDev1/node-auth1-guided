const router = require("express").Router();
const Users = require("../users/users-model");
const bcrypt = require("bcryptjs");

router.post("/register", (req, res) => {
  console.log(req.body);
  if (req.body.username === undefined || req.body.password === undefined) {
    res.status(500).json({ error: "No credentials" });
  }
  let creds = req.body;
  const rounds = process.env.HASH_ROUNDS || 4;
  const hash = bcrypt.hashSync(creds.password, rounds);
  creds.password = hash;
  Users.add(creds)
    .then((saved) => {
      res.status(201).json({ data: saved });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    .then((users) => {
      if (users[0] && bcrypt.compareSync(password, users[0].password)) {
        // store the session to the database
        // produce a cookie
        // send back the cookie with the session id to the client

        res.status(200).json({ message: "welcome!" });
      } else {
        res.status(401).json({ error: "INVALID CREDENTIALS" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
