const express = require("express");
const router = express.Router();
const Action = require("../db/models/action-model");
const cors = require("cors");
const auth = require("../middleware/auth");

router.use(cors());

router.get("/moi", auth, (req, res) => {
  Action.findOne({ user: req.user.id })
    .populate("users", ["username", "email"])
    .then(action => res.json(action))
    .catch(err => {
      console.error(err.message);
      res.status(500).send("Server Error");
    });
});

router.post("/infoaction", auth, (req, res) => {
  const { numberaction, money } = req.body;

  let actionFields = {
    numberaction,
    money
  };

  Action.findOneAndUpdate(
    { user: req.user.id },
    { $set: actionFields },
    { new: true }
  )
    .then(action => {
      res.json(action);
    })
    .catch(err => {
      console.error(err.message);
      res.status(500).send("Server Error");
    });
});

module.exports = router;
