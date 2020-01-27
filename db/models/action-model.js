const mongoose = require("mongoose");

const Action = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  numberaction: {
    type: Number,
    required: true,
    default: 0
  },
  money: {
    type: Number,
    required: true,
    default: 0
  }
});

module.exports = mongoose.model("action", Action);
