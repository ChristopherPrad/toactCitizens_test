const express = require("express");
const router = express.Router();
const Step = require("../db/models/step-model");
const cors = require("cors");
const auth = require("../middleware/auth");

router.use(cors());

router.get("/me", auth, (req, res) => {
  Step.findOne({ user: req.user.id })
    .populate("users", ["username", "email"])
    .then(step => res.json(step))
    .catch(err => {
      console.error(err.message);
      res.status(500).send("Server Error");
    });
});

router.post("/info", auth, (req, res) => {
  const { numberstep, money } = req.body;

  let stepFields = {
    numberstep,
    money
  };

  Step.findOneAndUpdate(
    { user: req.user.id },
    { $set: stepFields },
    { new: true }
  )
    .then(step => {
      res.json(step);
    })
    .catch(err => {
      console.error(err.message);
      res.status(500).send("Server Error");
    });
});

module.exports = router;
