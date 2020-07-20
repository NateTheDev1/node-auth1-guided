const router = require("express").Router();
const authenticate = require("../auth/auth-middleware");

const Users = require("./users-model.js");

router.get("/", authenticate, (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => res.send(err));
});

module.exports = router;
