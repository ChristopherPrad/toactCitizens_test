const mongoose = require("mongoose");

const Step = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  numberstep: {
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

module.exports = mongoose.model("step", Step);
